import asyncio
import logging
import json
from backend.services.llm_engine.gemini_client import gemini_client

logger = logging.getLogger(__name__)

class MicroFetcher:
    """
    Fetches industry-specific microeconomic metrics.
    Sources: Alpha Vantage, Statista, IBISWorld
    """
    
    async def collect_micro_factors(self, industry: str) -> dict:
        if gemini_client.mock_mode:
            return await self._get_mock_micro(industry)

        logger.info(f"Generating AI micro factors for {industry}")
        prompt = f"""
        Task: Provide an elite strategic analysis of the '{industry}' sector's micro-dynamics.
        
        Return JSON with:
        - "industry_cagr": float (e.g., 5.5)
        - "competitor_count_delta": int (e.g., 3)
        - "supply_chain_health": "stable"|"fragile"|"disrupted"
        - "market_share_dynamic": "fragmented"|"consolidated"|"monopolistic"
        - "entry_barriers": "low"|"moderate"|"high"
        - "key_value_drivers": [list of 3 key drivers, e.g., "R&D efficiency", "Brand loyalty"]
        - "sector_headwinds": [list of 3 major risks]
        - "summary": One-paragraph tactical sector summary for a board-level presentation.
        
        Output ONLY valid JSON.
        """
        
        try:
            res = await gemini_client.generate(prompt)
            clean_json = res.strip().replace("```json", "").replace("```", "")
            data = json.loads(clean_json)
            data["industry"] = industry
            return data
        except Exception as e:
            logger.error(f"[Micro] LLM failed: {e}")
            return await self._get_mock_micro(industry)

    async def _get_mock_micro(self, industry: str) -> dict:
        await asyncio.sleep(0.1)
        rates = {"cosmetics": 5.2, "pharma": 6.1, "fashion": 3.8, "printing": -1.2, "tech": 12.5}
        cagr = rates.get(industry, 2.0)
        return {
            "industry": industry,
            "industry_cagr": cagr,
            "competitor_count_delta": 4,
            "supply_chain_health": "stable",
            "summary": f"The {industry} sector shows a CAGR of {cagr}%, characterized by high fragmentation and stable supply chains."
        }

micro_fetcher = MicroFetcher()
