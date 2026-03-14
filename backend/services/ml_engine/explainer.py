import asyncio
import logging
import random
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class SHAPExplainer:
    """
    Mock SHAP explainer for XGBoost and TabNet tabular predictions.
    In production, this would call `shap.TreeExplainer(xgb_model).shap_values(X)`.
    The output describes WHICH features drove the prediction.
    """

    async def explain(self, features: dict, ml_result: dict) -> Dict[str, Any]:
        logger.info("[SHAP] Generating feature attribution for tabular models...")
        await asyncio.sleep(0.4)

        # Simulate SHAP feature importance values using industry as seed for variation
        import hashlib
        seed = int(hashlib.md5(ml_result.get("industry", "general").encode()).hexdigest(), 16) % 10**8
        random.seed(seed)

        shap_values = {}
        total = 0.0
        for k in feature_keys[:8]:
            v = round(random.uniform(-0.3, 0.5), 4)
            shap_values[k] = v
            total += abs(v)

        # Normalize to percentages for display
        shap_pct = {k: round(abs(v) / total * 100, 1) for k, v in shap_values.items()}
        top_factors = sorted(shap_pct.items(), key=lambda x: x[1], reverse=True)[:5]

        return {
            "method": "SHAP (TreeExplainer)",
            "base_value": round(random.uniform(0.3, 0.5), 3),
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
        logger.info("[LIME] Generating local explanations for time-series models...")
        await asyncio.sleep(0.35)

        segments = [
            {"segment": "Q4 Revenue Spike", "impact": "positive", "weight": round(random.uniform(0.2, 0.5), 3)},
            {"segment": "Q2 Inventory Drawdown", "impact": "negative", "weight": round(random.uniform(0.05, 0.2), 3)},
            {"segment": "Year-on-Year Growth Trend", "impact": "positive", "weight": round(random.uniform(0.1, 0.4), 3)},
            {"segment": "Macroeconomic Headwinds", "impact": "negative", "weight": round(random.uniform(0.05, 0.15), 3)},
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
