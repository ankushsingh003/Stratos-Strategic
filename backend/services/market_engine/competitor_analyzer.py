import asyncio
import logging
import random
import hashlib
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class CompetitorAnalyzer:
    """
    Analyzes market leaders and success factors for specific industries.
    Uses deterministic seeding for realistic, reproducible results.
    """

    def _get_seed(self, industry: str) -> int:
        return int(hashlib.md5(industry.lower().encode()).hexdigest(), 16) % 10**8

    async def get_industry_competitors(self, industry: str) -> List[Dict[str, Any]]:
        logger.info(f"[CompetitorAnalyzer] Fetching leaders for {industry}")
        await asyncio.sleep(0.4)
        
        random.seed(self._get_seed(industry))
        
        # Industry-specific base competitors
        industry_leaders = {
            "printing": ["Heidelberg", "HP Indigo", "Konica Minolta", "Ricoh", "Canon"],
            "pharma": ["Pfizer", "Roche", "Novartis", "Merck", "AbbVie"],
            "cosmetics": ["L'Oréal", "Estée Lauder", "Shiseido", "Coty", "Beiersdorf"],
            "tech": ["Apple", "Microsoft", "Alphabet", "Amazon", "NVIDIA"]
        }
        
        base_list = industry_leaders.get(industry.lower(), ["Global Leader A", "Market Peer B", "Challenger C", "Niche Player D", "Emerging E"])
        
        competitors = []
        for i, name in enumerate(base_list):
            share = round(float(random.uniform(5, 25) - (i * 2)), 1)
            growth = round(float(random.uniform(-2, 12)), 1)
            strength = random.choice(["R&D Pipeline", "Distribution Network", "Brand Equity", "Operational Scale", "Digital Innovation"])
            
            competitors.append({
                "name": name,
                "market_share": max(1.0, share),
                "growth_yoy": growth,
                "core_strength": strength,
                "status": "Dominant" if share > 15 else "Strong" if share > 8 else "Challenger"
            })
            
        return sorted(competitors, key=lambda x: x["market_share"], reverse=True)

    async def get_success_factors(self, industry: str) -> List[Dict[str, Any]]:
        logger.info(f"[CompetitorAnalyzer] Mapping success factors for {industry}")
        await asyncio.sleep(0.3)
        
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
            w = float(random.uniform(0.6, 0.95))
            factor["weight"] = round(w, 2)
            factor["industry_impact"] = "High" if w > 0.8 else "Medium"
            
        return selected

competitor_analyzer = CompetitorAnalyzer()
