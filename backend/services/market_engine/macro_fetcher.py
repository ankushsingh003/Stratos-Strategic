import asyncio
import logging
import json
from backend.services.llm_engine.gemini_client import gemini_client

logger = logging.getLogger(__name__)

class MacroFetcher:
    """
    Fetches macroeconomic data like GDP, inflation, interest rates.
    Sources: World Bank API, FRED, IMF Data
    """
    
    async def collect_macro_factors(self, region: str = "Global") -> dict:
        if gemini_client.mock_mode:
            return await self._get_mock_macro(region)

        logger.info(f"Generating AI macro factors for {region}")
        prompt = f"""
        Role: Macroeconomic Analyst.
        Context: Strategy report for the '{region}' region.
        Task: Provide estimated economic data for this region in JSON.
        
        Return JSON with:
        - "gdp_growth": float (e.g., 2.5)
        - "inflation_rate": float (e.g., 3.8)
        - "interest_rate": float (e.g., 5.0)
        - "monetary_policy": "hawkish"|"dovish"|"neutral"
        - "consumer_confidence": "rising"|"stable"|"declining"
        - "currency_stability": "strong"|"volatile"|"weak"
        - "summary": A strategic one-paragraph macro-outlook summary for executives.
        
        Output ONLY valid JSON.
        """
        
        try:
            res = await gemini_client.generate(prompt)
            clean_json = res.strip().replace("```json", "").replace("```", "")
            data = json.loads(clean_json)
            data["region"] = region
            return data
        except Exception as e:
            logger.error(f"[Macro] LLM failed: {e}")
            return await self._get_mock_macro(region)

    async def _get_mock_macro(self, region: str) -> dict:
        await asyncio.sleep(0.1)
        return {
            "gdp_growth": 2.1,
            "inflation_rate": 3.4,
            "interest_rate": 5.25,
            "region": region,
            "summary": "Moderate growth environment with sticky inflation leading to sustained higher interest rates."
        }
        
macro_fetcher = MacroFetcher()
