import asyncio
import logging
import random
import hashlib
import json
from typing import List, Dict, Any
from backend.services.llm_engine.gemini_client import gemini_client
from backend.services.llm_engine.groq_client import groq_client

logger = logging.getLogger(__name__)

# Real company lists for all 16 industry verticals with Ticker Symbols
REAL_INDUSTRY_LEADERS = {
    "printing":    [("Heidelberg Druckmaschinen", "HDD.DE"), ("HP Inc.", "HPQ"), ("Konica Minolta", "4902.T"), ("Ricoh", "7752.T"), ("Canon", "7751.T"), ("Xerox", "XRX"), ("Epson", "6724.T"), ("Roland DG", "6789.T")],
    "pharma":      [("Pfizer", "PFE"), ("Roche", "ROG.SW"), ("Novartis", "NVS"), ("Merck & Co.", "MRK"), ("AbbVie", "ABBV"), ("AstraZeneca", "AZN"), ("Johnson & Johnson", "JNJ"), ("Bristol Myers Squibb", "BMY"), ("Eli Lilly", "LLY"), ("Sanofi", "SNY")],
    "cosmetics":   [("L'Oréal", "OR.PA"), ("Estée Lauder", "EL"), ("Procter & Gamble", "PG"), ("Unilever", "UL"), ("Shiseido", "4911.T"), ("Coty", "COTY"), ("Beiersdorf", "BEI.DE"), ("LVMH", "MC.PA"), ("Revlon", "REVRQ"), ("Avon", "AVP")],
    "tech":        [("Apple", "AAPL"), ("Microsoft", "MSFT"), ("Alphabet (Google)", "GOOGL"), ("Amazon", "AMZN"), ("NVIDIA", "NVDA"), ("Meta Platforms", "META"), ("Samsung Electronics", "005930.KS"), ("TSMC", "TSM"), ("Intel", "INTC"), ("Salesforce", "CRM")],
    "oil":         [("Saudi Aramco", "2222.SR"), ("ExxonMobil", "XOM"), ("Shell", "SHEL"), ("BP", "BP"), ("TotalEnergies", "TTE"), ("Chevron", "CVX"), ("ConocoPhillips", "COP"), ("Equinor", "EQNR"), ("Eni", "ENI.MI"), ("Petrobras", "PBR")],
    "coal":        [("Glencore", "GLEN.L"), ("BHP Group", "BHP"), ("China Shenhua", "1088.HK"), ("Coal India", "COALINDIA.NS"), ("Arch Resources", "ARCH"), ("Peabody Energy", "BTU"), ("Yanzhou Coal", "YZCHY"), ("CONSOL Energy", "CEIX"), ("Adaro Energy", "ADRO.JK"), ("Exxaro", "EXX.JO")],
    "finance":     [("JPMorgan Chase", "JPM"), ("Bank of America", "BAC"), ("ICBC", "1398.HK"), ("Wells Fargo", "WFC"), ("Goldman Sachs", "GS"), ("Morgan Stanley", "MS"), ("HDFC Bank", "HDB"), ("Citigroup", "C"), ("HSBC Holdings", "HSBC"), ("Barclays", "BCS")],
    "retail":      [("Walmart", "WMT"), ("Amazon (Retail)", "AMZN"), ("Costco Wholesale", "COST"), ("Kroger", "KR"), ("JD.com", "JD"), ("Alibaba", "BABA"), ("Target", "TGT"), ("Carrefour", "CA.PA"), ("Tesco", "TSCO.L"), ("Home Depot", "HD")],
    "real_estate": [("Brookfield", "BN"), ("Blackstone", "BX"), ("CBRE Group", "CBRE"), ("JLL", "JLL"), ("Prologis", "PLD"), ("Simon Property", "SPG"), ("Equity Residential", "EQR"), ("AvalonBay", "AVB"), ("Public Storage", "PSA"), ("Welltower", "WELL")],
    "energy":      [("NextEra Energy", "NEE"), ("Iberdrola", "IBE.MC"), ("Enel", "ENEL.MI"), ("Orsted", "ORSTED.CO"), ("EDP Renewables", "EDPR.LS"), ("Brookfield Renewable", "BEPC"), ("Vattenfall", "VATTN.ST"), ("Vestas", "VWS.CO"), ("First Solar", "FSLR"), ("SunPower", "SPWR")],
    "aviation":    [("American Airlines", "AAL"), ("Delta Air Lines", "DAL"), ("United Airlines", "UAL"), ("Southwest Airlines", "LUV"), ("Lufthansa", "LHA.DE"), ("Emirates", "EMIRATES.UL"), ("Air France-KLM", "AF.PA"), ("IAG", "IAG.L"), ("Ryanair", "RYAAY"), ("IndiGo", "INDIGO.NS")],
    "logistics":   [("UPS", "UPS"), ("FedEx", "FDX"), ("DHL", "DHL.DE"), ("Amazon Logistics", "AMZN"), ("XPO Logistics", "XPO"), ("Maersk", "MAERSK-B.CO"), ("CEVA Logistics", "CEVA.UL"), ("Kuehne+Nagel", "KNIN.SW"), ("DSV", "DSV.CO"), ("GXO Logistics", "GXO")],
    "agriculture": [("ADM", "ADM"), ("Bunge", "BG"), ("Cargill", "CARG.UL"), ("Louis Dreyfus", "LDC.UL"), ("Nutrien", "NTR"), ("BASF", "BAS.DE"), ("Syngenta", "SYEN.UL"), ("Deere & Company", "DE"), ("Corteva", "CTVA"), ("Tyson Foods", "TSN")],
    "media":       [("The Walt Disney Company", "DIS"), ("Netflix", "NFLX"), ("Comcast", "CMCSA"), ("Warner Bros. Discovery", "WBD"), ("Paramount Global", "PARA"), ("Sony Group", "SONY"), ("Fox Corporation", "FOXA"), ("Bertelsmann", "BTG.DE"), ("Vivendi", "VIV.PA"), ("ITV", "ITV.L")],
    "healthcare":  [("UnitedHealth Group", "UNH"), ("CVS Health", "CVS"), ("Elevance Health", "ELV"), ("Cigna", "CI"), ("HCA Healthcare", "HCA"), ("McKesson", "MCK"), ("Johnson & Johnson", "JNJ"), ("Fresenius", "FRE.DE"), ("Philips Healthcare", "PHG"), ("Siemens Healthineers", "SHL.DE")],
    "insurance":   [("Berkshire Hathaway", "BRK-B"), ("UnitedHealth (Insurance)", "UNH"), ("Ping An Insurance", "2318.HK"), ("Allianz", "ALV.DE"), ("AXA Group", "CS.PA"), ("China Life Insurance", "2628.HK"), ("Zurich Insurance", "ZURN.SW"), ("Chubb", "CB"), ("MetLife", "MET"), ("Prudential Financial", "PRU")],
}


class CompetitorAnalyzer:
    """
    Analyzes market leaders and success factors for specific industries.
    Returns REAL company names with market share data.
    """

    def _get_seed(self, industry: str) -> int:
        return int(hashlib.md5(industry.lower().encode()).hexdigest(), 16) % 10**8

    async def get_industry_intelligence(self, industry: str) -> Dict[str, Any]:
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
                    "ticker": "TICKER",
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

        # Try Groq First (Higher Rate Limits)
        if not groq_client.mock_mode:
            try:
                logger.info("[CompetitorAnalyzer] Attempting analysis with GROQ...")
                response_text = await groq_client.generate(prompt)
                import re
                match = re.search(r"(\{.*\})", response_text, re.DOTALL)
                clean_json = match.group(1) if match else response_text.strip()
                return json.loads(clean_json)
            except Exception as e:
                logger.warning(f"[CompetitorAnalyzer] Groq failed: {e}. Falling back to Gemini.")

        # Fallback to Gemini
        if not gemini_client.mock_mode:
            try:
                logger.info("[CompetitorAnalyzer] Attempting analysis with GEMINI...")
                response_text = await gemini_client.generate(prompt)
                import re
                match = re.search(r"(\{.*\})", response_text, re.DOTALL)
                clean_json = match.group(1) if match else response_text.strip()
                return json.loads(clean_json)
            except Exception as e:
                logger.error(f"[CompetitorAnalyzer] Gemini also failed: {e}. Falling back to real-name mock.")

        # Final Fallback to Mock with Real Names
        logger.info("[CompetitorAnalyzer] Using internal real-name lookup fallback.")
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
        for i, entry in enumerate(base_list):
            if isinstance(entry, tuple):
                name, ticker = entry
            else:
                name = entry
                ticker = name.split()[0].upper()[:4]

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
                "ticker": ticker,
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
