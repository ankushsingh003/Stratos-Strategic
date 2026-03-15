import logging
import time
from typing import Dict, Any

logger = logging.getLogger(__name__)

class MLflowTracker:
    """
    Mock MLflow tracker that logs model runs, metrics, and parameters.
    In production: import mlflow; mlflow.set_tracking_uri("http://localhost:5000")
    """

    def __init__(self):
        self.run_id = None
        self.experiment_name = "strategy-engine"
        logger.info(f"[MLflow] Tracker initialized for experiment: {self.experiment_name}")

    def start_run(self, run_name: str):
        import uuid
        self.run_id = str(uuid.uuid4())[:8]
        logger.info(f"[MLflow] Started Run '{run_name}' (ID: {self.run_id})")

    def log_params(self, params: Dict[str, Any]):
        for k, v in params.items():
            logger.info(f"[MLflow] Param: {k} = {v}")

    def log_metrics(self, metrics: Dict[str, float], step: int = 0):
        for k, v in metrics.items():
            logger.info(f"[MLflow] Metric[{step}]: {k} = {v:.4f}")

    def log_model_output(self, ml_result: dict):
        self.log_params({
            "industry": ml_result.get("industry", "general"),
            "prediction_label": ml_result.get("label"),
            "prediction_score": ml_result.get("score"),
            "engine_confidence": ml_result.get("confidence"),
        })
        
        # Log generic metrics if present
        metrics_dict = ml_result.get("metrics", {})
        if metrics_dict:
            self.log_metrics(metrics_dict)
            
        # Log legacy detail scores if they exist (for backward compatibility during transition)
        details = ml_result.get("details", {})
        if details:
            summary_metrics = {}
            for model_name, model_data in details.items():
                if isinstance(model_data, dict):
                    val = model_data.get("score") or model_data.get("growth_rate")
                    if val is not None:
                        summary_metrics[f"{model_name}_metric"] = float(val)
            if summary_metrics:
                self.log_metrics(summary_metrics)

    def end_run(self):
        logger.info(f"[MLflow] Run {self.run_id} ended.")
        self.run_id = None


class LangfuseTracer:
    """
    Mock Langfuse tracer that logs LLM token usage and latency (Gemini/Claude).
    In production: from langfuse import Langfuse; client = Langfuse(...)
    """

    def __init__(self):
        logger.info("[Langfuse] LLM Observability Tracer initialized")

    def trace_llm_call(self, prompt_tokens: int, completion_tokens: int, latency_ms: float, model: str = "claude-3-5-sonnet"):
        total_tokens = prompt_tokens + completion_tokens
        cost_usd = (total_tokens / 1_000_000) * 3.0  # ~$3 per 1M tokens

        logger.info(
            f"[Langfuse] LLM Trace | Model: {model} | "
            f"Prompt: {prompt_tokens}tok | Completion: {completion_tokens}tok | "
            f"Total: {total_tokens}tok | Latency: {latency_ms:.0f}ms | "
            f"Est. Cost: ${cost_usd:.4f}"
        )
        return {
            "trace_id": f"lf-{int(time.time())}",
            "model": model,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": total_tokens,
            "latency_ms": latency_ms,
            "estimated_cost_usd": round(cost_usd, 6)
        }

# Singletons
mlflow_tracker = MLflowTracker()
langfuse_tracer = LangfuseTracer()
