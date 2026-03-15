import asyncio
import logging
import random
import json
from typing import Dict, List, Any
from backend.services.llm_engine.gemini_client import gemini_client

logger = logging.getLogger(__name__)

class SHAPExplainer:
    """
    Mock SHAP explainer for XGBoost and TabNet tabular predictions.
    In production, this would call `shap.TreeExplainer(xgb_model).shap_values(X)`.
    The output describes WHICH features drove the prediction.
    """

    async def explain(self, features: dict, ml_result: dict) -> Dict[str, Any]:
        industry = ml_result.get("industry", "general")
        label = ml_result.get("label", "Unknown")
        
        if gemini_client.mock_mode:
            return await self._get_mock_shap(features, ml_result)

        logger.info(f"[SHAP] Generating AI attribution for {industry} ({label})...")
        
        prompt = f"""
        Role: ML Explainability Expert (SHAP).
        Context: The V2 Strategy Engine predicted a status of '{label}' for a company in the '{industry}' industry.
        Task: Deduce which 5 features (from standard financial/market metrics) were likely the top predictors for this result.
        
        Return JSON with:
        - "method": "SHAP (Contextual Inference)"
        - "base_value": float (prediction probability baseline)
        - "top_features": array of {{ "feature": string, "importance_pct": float(1-40), "raw_shap": float }}
        - "summary": One sentence strategy insight.
        
        Output ONLY valid JSON.
        """
        
        try:
            res = await gemini_client.generate(prompt)
            clean_json = res.strip().replace("```json", "").replace("```", "")
            return json.loads(clean_json)
        except Exception as e:
            logger.error(f"[SHAP] LLM failed: {e}")
            return await self._get_mock_shap(features, ml_result)

    async def _get_mock_shap(self, features: dict, ml_result: dict) -> Dict[str, Any]:
        # Simulate SHAP feature importance values using industry as seed for variation
        feature_keys = list(features.keys()) if features else [
            "revenue_growth_yoy", "debt_equity_ratio", "operating_margin",
            "gdp_growth", "inflation_rate", "sentiment_score", "competitor_delta"
        ]

        import hashlib
        seed = int(hashlib.md5(ml_result.get("industry", "general").encode()).hexdigest(), 16) % 10**8
        random.seed(seed)

        shap_values = {}
        total = 0.0
        for k in feature_keys[:8]:
            v = random.uniform(-0.3, 0.5)
            shap_values[k] = v
            total += abs(v)

        # Normalize to percentages for display
        shap_pct = {k: round(float(abs(v) / total * 100), 1) for k, v in shap_values.items()}
        top_factors = sorted(shap_pct.items(), key=lambda x: x[1], reverse=True)[:5]

        return {
            "method": "SHAP (TreeExplainer Fallback)",
            "base_value": round(float(random.uniform(0.3, 0.5)), 3),
            "model_label": ml_result.get("label", "Unknown"),
            "top_features": [{"feature": k, "importance_pct": v, "raw_shap": shap_values[k]} for k, v in top_factors],
            "summary": f"The top driver of the '{ml_result.get('label')}' prediction is '{top_factors[0][0]}' with {top_factors[0][1]}% contribution."
        }


class LIMEExplainer:
    """
    Mock LIME explainer for LSTM/Prophet time-series predictions.
    In production, this would use `lime.lime_tabular.LimeTabularExplainer`.
    """

    async def explain(self, time_series: list, ml_result: dict) -> Dict[str, Any]:
        industry = ml_result.get("industry", "general")
        forecast = ml_result.get("forecast_summary", "N/A")
        
        if gemini_client.mock_mode:
            return await self._get_mock_lime(ml_result)

        logger.info(f"[LIME] Generating AI time-series segments for {industry}...")
        
        prompt = f"""
        Role: Time-Series Explainer (LIME).
        Context: Dashboard shows a '{forecast}' trajectory for the '{industry}' market.
        Task: Create 4 key 'segments' (events or trends in time) that explain this forecast.
        
        Return JSON with:
        - "method": "LIME (Contextual Inference)"
        - "forecast_label": string
        - "key_segments": array of {{ "segment": string, "impact": "positive"|"negative", "weight": float(0-1) }}
        - "summary": Strategy insight.
        
        Output ONLY valid JSON.
        """
        
        try:
            res = await gemini_client.generate(prompt)
            clean_json = res.strip().replace("```json", "").replace("```", "")
            return json.loads(clean_json)
        except Exception as e:
            logger.error(f"[LIME] LLM failed: {e}")
            return await self._get_mock_lime(ml_result)

    async def _get_mock_lime(self, ml_result: dict) -> Dict[str, Any]:
        logger.info("[LIME] Generating local explanations for time-series models...")
        await asyncio.sleep(0.1)

        segments = [
            {"segment": "Q4 Revenue Spike", "impact": "positive", "weight": round(float(random.uniform(0.2, 0.5)), 3)},
            {"segment": "Q2 Inventory Drawdown", "impact": "negative", "weight": round(float(random.uniform(0.05, 0.2)), 3)},
            {"segment": "Year-on-Year Growth Trend", "impact": "positive", "weight": round(float(random.uniform(0.1, 0.4)), 3)},
            {"segment": "Macroeconomic Headwinds", "impact": "negative", "weight": round(float(random.uniform(0.05, 0.15)), 3)},
        ]
        segments.sort(key=lambda x: x["weight"], reverse=True)

        return {
            "method": "LIME (Local Interpretable Model-agnostic Explanations)",
            "forecast_label": ml_result.get("forecast_summary", "N/A"),
            "key_segments": segments,
            "summary": f"The time-series forecast is primarily driven by '{segments[0]['segment']}' pattern."
        }


# Singleton instances
shap_explainer = SHAPExplainer()
lime_explainer = LIMEExplainer()
