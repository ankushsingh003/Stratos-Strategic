import asyncio
import logging
import random
import hashlib
import json
from typing import List, Dict, Any
from backend.services.llm_engine.gemini_client import gemini_client

logger = logging.getLogger(__name__)

# Real company lists for all 16 industry verticals
REAL_INDUSTRY_LEADERS = {
    "printing":    ["Heidelberg Druckmaschinen", "HP Inc.", "Konica Minolta", "Ricoh", "Canon", "Xerox", "Epson", "Roland DG"],
    "pharma":      ["Pfizer", "Roche", "Novartis", "Merck & Co.", "AbbVie", "AstraZeneca", "Johnson & Johnson", "Bristol Myers Squibb", "Eli Lilly", "Sanofi"],
    "cosmetics":   ["L'Oréal", "Estée Lauder", "Procter & Gamble (Beauty)", "Unilever (Beauty)", "Shiseido", "Coty", "Beiersdorf", "LVMH Parfums", "Revlon", "Avon"],
    "tech":        ["Apple", "Microsoft", "Alphabet (Google)", "Amazon", "NVIDIA", "Meta Platforms", "Samsung Electronics", "TSMC", "Intel", "Salesforce"],
    "oil":         ["Saudi Aramco", "ExxonMobil", "Shell", "BP", "TotalEnergies", "Chevron", "ConocoPhillips", "Equinor", "Eni", "Petrobras"],
    "coal":        ["Glencore", "BHP Group", "China Shenhua Energy", "Coal India Ltd.", "Arch Resources", "Peabody Energy", "Yanzhou Coal Mining", "CONSOL Energy", "Adaro Energy", "Exxaro Resources"],
    "finance":     ["JPMorgan Chase", "Bank of America", "Industrial & Commercial Bank of China", "Wells Fargo", "Goldman Sachs", "Morgan Stanley", "HDFC Bank", "Citigroup", "HSBC Holdings", "Barclays"],
    "retail":      ["Walmart", "Amazon (Retail)", "Costco Wholesale", "Kroger", "JD.com", "Alibaba (Retail)", "Target", "Carrefour", "Tesco", "Home Depot"],
    "real_estate": ["Brookfield Asset Management", "Blackstone Real Estate", "CBRE Group", "Jones Lang LaSalle (JLL)", "Prologis", "Simon Property Group", "Equity Residential", "AvalonBay Communities", "Public Storage", "Welltower"],
    "energy":      ["NextEra Energy", "Iberdrola", "Enel", "Orsted", "EDP Renewables", "Brookfield Renewable", "Vattenfall", "Vestas Wind Systems", "First Solar", "SunPower"],
    "aviation":    ["American Airlines", "Delta Air Lines", "United Airlines", "Southwest Airlines", "Lufthansa Group", "Emirates", "Air France-KLM", "International Airlines Group", "Ryanair", "IndiGo"],
    "logistics":   ["UPS", "FedEx", "DHL (Deutsche Post)", "Amazon Logistics", "XPO Logistics", "Maersk", "CEVA Logistics", "Kuehne+Nagel", "DSV Panalpina", "GXO Logistics"],
    "agriculture": ["Archer-Daniels-Midland (ADM)", "Bunge Limited", "Cargill", "Louis Dreyfus", "Nutrien", "BASF (Agri)", "Syngenta", "Deere & Company", "Corteva Agriscience", "Tyson Foods"],
    "media":       ["The Walt Disney Company", "Netflix", "Comcast (NBCUniversal)", "Warner Bros. Discovery", "Paramount Global", "Sony Group (Entertainment)", "Fox Corporation", "Bertelsmann", "Vivendi", "ITV"],
    "healthcare":  ["UnitedHealth Group", "CVS Health", "Elevance Health", "Cigna", "HCA Healthcare", "McKesson", "Johnson & Johnson (MedTech)", "Fresenius", "Philips Healthcare", "Siemens Healthineers"],
    "insurance":   ["Berkshire Hathaway", "UnitedHealth (Insurance)", "Ping An Insurance", "Allianz", "AXA Group", "China Life Insurance", "Zurich Insurance", "Chubb", "MetLife", "Prudential Financial"],
}


class CompetitorAnalyzer:
    """
    Analyzes market leaders and success factors for specific industries.
    Returns REAL company names with market share data.
    """

    def _get_seed(self, industry: str) -> int:
        return int(hashlib.md5(industry.lower().encode()).hexdigest(), 16) % 10**8

    async def get_industry_intelligence(self, industry: str) -> Dict[str, Any]:
        if gemini_client.mock_mode:
            logger.info("[CompetitorAnalyzer] MOCK mode — using real name lookup tables.")
            competitors = await self._get_mock_competitors(industry)
            signals = await self._get_mock_signals(industry)
            return {"competitors": competitors, **signals}

        prompt = f"""
        You are a Senior Market Intelligence Analyst at McKinsey. Analyze the '{industry}' industry.

        CRITICAL RULES:
        - Use ONLY REAL company names (e.g., "ExxonMobil", "Pfizer", "Heidelberg Materials").
        - DO NOT use placeholder names like "Global Leader A", "Niche Player D", "Challenger C", etc.
        - Provide 8 to 12 real companies with realistic market share figures.

        Return ONLY valid JSON (no markdown) in this exact format:
        {{
            "competitors": [
                {{
                    "name": "Real Company Name",
                    "market_share": 18.5,
                    "growth_yoy": 6.2,
                    "core_strength": "Brief 3-5 word strength",
                    "status": "Dominant"
                }}
            ],
            "success_factors": [
                {{
                    "name": "Factor Name",
                    "desc": "One-sentence explanation.",
                    "weight": 0.85,
                    "industry_impact": "High"
                }}
            ],
            "live_signals": [
                {{ "type": "regulatory", "msg": "Specific industry news headline." }},
                {{ "type": "merger", "msg": "Specific M&A news." }},
                {{ "type": "tech", "msg": "Specific technology adoption news." }}
            ]
        }}

        Status must be one of: "Dominant", "Strong", "Challenger"
        """

        try:
            response_text = await gemini_client.generate(prompt)
            import re
            match = re.search(r"(\{.*\})", response_text, re.DOTALL)
            clean_json = match.group(1) if match else response_text.strip()
            return json.loads(clean_json)
        except Exception as e:
            logger.error(f"[CompetitorAnalyzer] LLM error: {e}. Falling back to real name lookup.")
            competitors = await self._get_mock_competitors(industry)
            signals = await self._get_mock_signals(industry)
            return {"competitors": competitors, **signals}

    async def _get_mock_competitors(self, industry: str) -> List[Dict[str, Any]]:
        logger.info(f"[CompetitorAnalyzer] Building real-name competitor list for {industry}")
        await asyncio.sleep(0.05)
        random.seed(self._get_seed(industry))

        # Fetch real names from lookup, fallback only to well-known generic segments
        base_list = REAL_INDUSTRY_LEADERS.get(
            industry.lower(),
            # For unknown industries, use a plausibly named generic set
            [f"{industry.replace('_',' ').title()} Corp", f"{industry.replace('_',' ').title()} Holdings",
             f"{industry.replace('_',' ').title()} International", f"Global {industry.replace('_',' ').title()} Group",
             f"{industry.replace('_',' ').title()} Enterprises"]
        )

        strengths = [
            "Technology Leadership", "Distribution Scale", "Brand Equity",
            "R&D Efficiency", "Cost Optimization", "Regulatory Expertise",
            "Supply Chain Depth", "Digital Transformation", "Customer Retention",
            "ESG Compliance", "Operational Scale", "Pricing Power"
        ]

        competitors = []
        total_share = 0.0
        for i, name in enumerate(base_list):
            # Decreasing market share from leader to niche
            max_share = max(25.0 - i * 2.5, 3.0)
            share = round(random.uniform(max_share * 0.7, max_share), 1)
            # Cap so total doesn't explode
            if total_share + share > 95:
                share = round(max(95 - total_share, 1.5), 1)
            total_share += share
            growth = round(random.uniform(-1.5, 12.0), 1)
            competitors.append({
                "name": name,
                "market_share": share,
                "growth_yoy": growth,
                "core_strength": random.choice(strengths),
                "status": "Dominant" if share > 15 else "Strong" if share > 7 else "Challenger"
            })
            if total_share >= 95:
                break

        return sorted(competitors, key=lambda x: x["market_share"], reverse=True)

    async def _get_mock_signals(self, industry: str) -> Dict[str, Any]:
        await asyncio.sleep(0.05)
        random.seed(self._get_seed(industry) + 1)

        all_factors = [
            {"name": "Supply Chain Resilience", "desc": "Ability to navigate global logistics disruptions."},
            {"name": "R&D Efficiency", "desc": "Speed of turning investment into patentable products."},
            {"name": "Digital Transformation", "desc": "Integration of AI and cloud in core operations."},
            {"name": "Customer Loyalty", "desc": "Retention rates and brand sentiment scores."},
            {"name": "ESG Compliance", "desc": "Sustainability metrics and regulatory alignment."},
            {"name": "Cost Optimization", "desc": "Lean manufacturing and operational efficiency."},
        ]

        selected = random.sample(all_factors, 4)
        for factor in selected:
            w = round(random.uniform(0.60, 0.95), 2)
            factor["weight"] = w
            factor["industry_impact"] = "High" if w > 0.78 else "Medium"

        label = industry.replace("_", " ").title()
        return {
            "success_factors": selected,
            "live_signals": [
                {"type": "regulatory", "msg": f"New sustainability & compliance framework proposed for {label} sector."},
                {"type": "merger",     "msg": f"Consolidation activity accelerating in {label} mid-market."},
                {"type": "tech",       "msg": f"AI-driven automation adoption exceeding 40% among {label} leaders."},
            ]
        }


competitor_analyzer = CompetitorAnalyzer()
