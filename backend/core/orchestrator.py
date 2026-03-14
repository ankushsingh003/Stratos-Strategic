import asyncio
import logging
import time
from datetime import datetime

from backend.services.ml_engine.model import ml_engine
from backend.services.ml_engine.features import feature_engineer
from backend.services.ml_engine.explainer import shap_explainer, lime_explainer
from backend.services.market_engine.macro_fetcher import macro_fetcher
from backend.services.market_engine.micro_fetcher import micro_fetcher
from backend.services.market_engine.sentiment import sentiment_analyzer
from backend.services.llm_engine.report_generator import report_generator
from backend.services.llm_engine.rag_agent import rag_agent
from backend.services.observability.mlflow_tracker import mlflow_tracker, langfuse_tracer

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
            rag_agent.run_industry_research(industry, company_name)
        )

        market_data = {
            "macro": macro_res,
            "micro": micro_res,
            "sentiment": sentiment_res,
            "rag_context": rag_context
        }

        # 2. Run 4-Model Ensemble
        logger.info("[Step 2] Running 4-Model Ensemble (XGBoost, TabNet, LSTM, Prophet)...")
        industry_config = {"weights": {"revenue_growth_yoy": 1.2}}
        features = feature_engineer.build_feature_vector(company_input, market_data, industry_config)
        time_series = feature_engineer.build_time_series(company_input.get("historical_financials", []))
        ml_result = await ml_engine.run_ensemble(features, time_series)

        # Log ML metrics to MLflow
        mlflow_tracker.log_model_output(ml_result)

        # 3. Run SHAP + LIME Explainability in parallel
        logger.info("[Step 3] Generating SHAP and LIME Explanations...")
        # Inject industry into ml_result for the explainer to see
        ml_result_plus = {**ml_result, "industry": industry}
        shap_result, lime_result = await asyncio.gather(
            shap_explainer.explain(features, ml_result_plus),
            lime_explainer.explain(time_series, ml_result_plus)
        )

        # 4. Generate LLM Report
        logger.info("[Step 4] Generating Consultancy Report via Claude...")
        llm_start = time.time()
        report_markdown = await report_generator.generate_consultancy_report(
            ml_output=ml_result,
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

        # 5. PDF URL (hook)
        pdf_url = f"/reports/generated/{company_name.lower().replace(' ', '_')}_{int(datetime.now().timestamp())}.pdf"

        # End MLflow run
        mlflow_tracker.log_metrics({"total_latency_s": time.time() - start_time})
        mlflow_tracker.end_run()

        logger.info("=== Analysis Complete ===")
        return {
            "status": "success",
            "company_name": company_name,
            "industry": industry,
            "ml_verdict": ml_result,
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
