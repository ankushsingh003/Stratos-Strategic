import asyncio
import logging
import time
from datetime import datetime

from backend.services.ml_engine.common.factory import ml_factory
from backend.services.ml_engine.features import feature_engineer
from backend.services.ml_engine.explainer import shap_explainer, lime_explainer
from backend.services.market_engine.macro_fetcher import macro_fetcher
from backend.services.market_engine.micro_fetcher import micro_fetcher
from backend.services.market_engine.sentiment import sentiment_analyzer
from backend.services.llm_engine.report_generator import report_generator
from backend.services.llm_engine.gemini_client import gemini_client
from backend.services.observability.mlflow_tracker import mlflow_tracker, langfuse_tracer
# from backend.services.market_engine.rag_agent import rag_agent

logger = logging.getLogger(__name__)

class Orchestrator:
    """
    Full V2 pipeline:
    RAG Context → Market Data → 4-Model ML Ensemble → SHAP/LIME Explainability
    → Claude Report (LLM) + Langfuse Trace → MLflow Log → PDF URL
    """

    async def run_full_analysis(self, company_input: dict) -> dict:
        company_name = company_input.get("company_name", "Unknown Corp")
        industry = company_input.get("industry", "general")
        start_time = time.time()

        logger.info(f"=== Phase 2 Orchestrator: {company_name} | {industry} ===")

        # Start MLflow run
        mlflow_tracker.start_run(run_name=f"{company_name}_{industry}")
        mlflow_tracker.log_params({"company": company_name, "industry": industry})

        # 1. Gather Market Data + RAG in parallel
        logger.info("[Step 1] Fetching Market Signals + RAG Context...")
        macro_res, micro_res, sentiment_res, rag_context = await asyncio.gather(
            macro_fetcher.collect_macro_factors(company_input.get("region", "Global")),
            micro_fetcher.collect_micro_factors(industry),
            sentiment_analyzer.analyze_sentiment(company_name, industry),
            gemini_client.generate(f"Industry Research: {industry} {company_name}")
        )

        market_data = {
            "macro": macro_res,
            "micro": micro_res,
            "sentiment": sentiment_res,
            "rag_context": rag_context
        }

        # 2. Get Industry-Specific ML Engine and Run Prediction
        logger.info(f"[Step 2] Running ML Engine for industry: {industry} ({company_input.get('quarter', 'Q4')})...")
        engine = await ml_factory.get_engine(industry, quarter=company_input.get("quarter", "Q4"))
        ml_prediction = await engine.predict_status()

        # Log ML metrics to MLflow
        mlflow_tracker.log_model_output(ml_prediction)

        # 3. Explain Results (using dynamic features from the engine)
        logger.info("[Step 3] Generating SHAP and LIME Explanations...")
        # Get extraction features and time series for explainers
        features = engine.data_snapshot.get("industry_features", {})
        time_series = [p.get("income_statement", {}).get("revenue", 0) for p in engine.data_snapshot.get("players", [])]
        
        # Inject industry into ml_prediction for the explainer to see
        ml_prediction_plus = {**ml_prediction, "industry": industry}
        shap_result, lime_result = await asyncio.gather(
            shap_explainer.explain(features, ml_prediction_plus),
            lime_explainer.explain(time_series, ml_prediction_plus)
        )

        # 4. Generate LLM Report
        logger.info("[Step 4] Generating Consultancy Report via Claude...")
        llm_start = time.time()
        report_markdown = await report_generator.generate_consultancy_report(
            ml_output=ml_prediction,
            market_data=market_data,
            company_input=company_input
        )
        llm_latency_ms = (time.time() - llm_start) * 1000

        # Trace LLM call in Langfuse
        lf_trace = langfuse_tracer.trace_llm_call(
            prompt_tokens=1800,         # Approximate
            completion_tokens=1200,
            latency_ms=llm_latency_ms
        )

        # 5. Generate Dynamic Strategic Verdict for Dashboard
        logger.info("[Step 5] Generating Strategic Verdict via AI...")
        verdict_prompt = f"""
        Context: Strategy Engine predicted '{ml_prediction.get('label')}' with {ml_prediction.get('score')} intensity for {company_name} in {industry}.
        Industry CAGR: {market_data['micro'].get('industry_cagr')}%
        Sentiment: {market_data['sentiment'].get('social_sentiment_score')}
        
        Task: Provide a 2-sentence hard-hitting strategic verdict.
        Output ONLY the text.
        """
        strategic_verdict = await gemini_client.generate(verdict_prompt, max_tokens=100)

        # 6. PDF URL (hook)
        pdf_url = f"/reports/generated/{company_name.lower().replace(' ', '_')}_{int(datetime.now().timestamp())}.pdf"

        # End MLflow run
        mlflow_tracker.log_metrics({"total_latency_s": time.time() - start_time})
        mlflow_tracker.end_run()

        logger.info("=== Analysis Complete ===")
        return {
            "status": "success",
            "company_name": company_name,
            "industry": industry,
            "ml_verdict": {**ml_prediction, "strategic_insight": strategic_verdict},
            "explainability": {
                "shap": shap_result,
                "lime": lime_result
            },
            "report_markdown": report_markdown,
            "pdf_url": pdf_url,
            "observability": {
                "langfuse_trace": lf_trace
            }
        }


orchestrator = Orchestrator()
