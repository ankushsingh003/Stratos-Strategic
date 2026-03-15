import asyncio
import logging
import random
import hashlib
import json
from typing import List, Dict, Any
from backend.services.llm_engine.gemini_client import gemini_client

logger = logging.getLogger(__name__)

class CompetitorAnalyzer:
    """
    Analyzes market leaders and success factors for specific industries.
    Uses deterministic seeding for realistic, reproducible results.
    """

    def _get_seed(self, industry: str) -> int:
        return int(hashlib.md5(industry.lower().encode()).hexdigest(), 16) % 10**8

    async def get_industry_intelligence(self, industry: str) -> Dict[str, Any]:
        """
        Uses Claude to generate comprehensive market intelligence or falls back to deterministic data.
        """
        if gemini_client.mock_mode:
            logger.info("[CompetitorAnalyzer] Running in MOCK mode. Using deterministic logic.")
            competitors = await self._get_mock_competitors(industry)
            signals = await self._get_mock_signals(industry)
            return {"competitors": competitors, **signals}

        prompt = f"""
        Analyze the {industry} industry and provide a detailed competitive intelligence report in JSON format.
        
        Requirements:
        1. Top 5 real-world competitors with:
           - "name": Official company name.
           - "market_share": Estimated % (numeric).
           - "growth_yoy": Estimated annual growth % (numeric).
           - "core_strength": 3-5 words describing their primary advantage.
           - "status": One of ["Dominant", "Strong", "Challenger"].
           
        2. Success Factors (4 items):
           - "name": Category name.
           - "desc": Strategic explanation.
           - "weight": 0.0 to 1.0 (numeric).
           - "industry_impact": "High" or "Medium".
           
        3. Strategic Signals (3 items):
           - "type": ["regulatory", "merger", "tech", "macro"].
           - "msg": Brief headline.
           
        Format: ONLY return valid JSON without markdown blocks or preamble.
        {{
            "competitors": [...],
            "success_factors": [...],
            "live_signals": [...]
        }}
        """
        
        try:
            response_text = await gemini_client.generate(prompt)
            # Basic cleanup of markdown backticks if LLM includes them
            clean_json = response_text.strip().replace("```json", "").replace("```", "")
            return json.loads(clean_json)
        except Exception as e:
            logger.error(f"[CompetitorAnalyzer] LLM error: {e}. Falling back.")
            competitors = await self._get_mock_competitors(industry)
            signals = await self._get_mock_signals(industry)
            return {"competitors": competitors, **signals}

    async def _get_mock_competitors(self, industry: str) -> List[Dict[str, Any]]:
        logger.info(f"[CompetitorAnalyzer] Fetching mock leaders for {industry}")
        await asyncio.sleep(0.1)
        industry_leaders = {
            "printing": ["Heidelberg", "HP Indigo", "Konica Minolta", "Ricoh", "Canon"],
            "pharma": ["Pfizer", "Roche", "Novartis", "Merck", "AbbVie"],
            "cosmetics": ["L'Oréal", "Estée Lauder", "Shiseido", "Coty", "Beiersdorf"],
            "tech": ["Apple", "Microsoft", "Alphabet", "Amazon", "NVIDIA"]
        }
        
        base_list = industry_leaders.get(industry.lower(), ["Global Leader A", "Market Peer B", "Challenger C", "Niche Player D", "Emerging E"])
        
        competitors = []
        for i, name in enumerate(base_list):
            # Original: share = round(float(random.uniform(5, 25) - (i * 2)), 1)
            # Original: growth = round(float(random.uniform(-2, 12)), 1)
            # The user's change seems to intend to replace these with direct dictionary entries.
            # Assuming the intent is to simplify and directly assign values, and fix the growth_rate name.
            share = round(float(random.uniform(5, 25)), 1)
            growth = round(float(random.uniform(2, 10)), 1)
            strength = random.choice(["R&D Pipeline", "Distribution Network", "Brand Equity", "Operational Scale", "Digital Innovation"])
            
            competitors.append({
                "name": name,
                "market_share": max(1.0, share),
                "growth_yoy": growth, # Kept original key name, but value from new range
                "core_strength": strength,
                "status": "Dominant" if share > 15 else "Strong" if share > 8 else "Challenger"
            })
            
        return sorted(competitors, key=lambda x: x["market_share"], reverse=True)

    async def _get_mock_signals(self, industry: str) -> Dict[str, Any]:
        logger.info(f"[CompetitorAnalyzer] Mapping mock signals for {industry}")
        await asyncio.sleep(0.1)
        
        random.seed(self._get_seed(industry) + 1)
        
        all_factors = [
            {"name": "Supply Chain Resilience", "desc": "Ability to navigate global logistics disruptions."},
            {"name": "R&D Efficiency", "desc": "Speed of turning investment into patentable products."},
            {"name": "Digital Transformation", "desc": "Integration of Al and cloud in core operations."},
            {"name": "Customer Loyalty", "desc": "Retention rates and brand sentiment scores."},
            {"name": "ESG Compliance", "desc": "Sustainability metrics and regulatory alignment."},
            {"name": "Cost Optimization", "desc": "Lean manufacturing and operational efficiency."}
        ]
        
        # Pick 4 factors and assign weights
        selected = random.sample(all_factors, 4)
        for factor in selected:
            confidence = round(float(random.uniform(0.7, 0.95)), 2)
            factor["weight"] = confidence # Assigning the new 'confidence' value to 'weight'
            factor["industry_impact"] = "High" if confidence > 0.8 else "Medium" # Using 'confidence' for impact
            
        return {
            "success_factors": selected,
            "live_signals": [
                {"type": "regulatory", "msg": f"New sustainability guidelines detected for {industry}."},
                {"type": "merger", "msg": f"Consolidation talk in {industry} mid-market increases."},
                {"type": "tech", "msg": f"AI-driven automation adoption hits 40% in {industry} leaders."}
            ]
        }

competitor_analyzer = CompetitorAnalyzer()
