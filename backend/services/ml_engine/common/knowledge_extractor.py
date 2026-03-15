import json
import logging
from typing import Dict, Any, List
from backend.services.llm_engine.gemini_client import gemini_client

logger = logging.getLogger(__name__)

# Industry-specific extraction hints for the LLM prompt
INDUSTRY_HINTS = {
    "printing":    "Focus on ink costs, paper shortage, digital print transition, commercial contract volumes.",
    "pharma":      "Focus on R&D spend, FDA/EMA pipeline success rates, patent cliffs, generic competition.",
    "tech":        "Focus on chip supply chain, AI/cloud capex, SaaS ARR growth, developer headcount.",
    "cosmetics":   "Focus on consumer sentiment, brand equity, raw material (palm oil, titanium dioxide) costs, DTC vs retail split.",
    "oil":         "Focus on Brent crude price, upstream production costs, refining margins, OPEC+ quotas, CapEx cycle.",
    "coal":        "Focus on thermal coal demand, ESG divestment pressure, energy security policy, seaborne trade flows.",
    "finance":     "Focus on net interest margin, credit quality (NPL ratios), capital adequacy (CET1), loan growth, central bank rates.",
    "retail":      "Focus on same-store sales growth, inventory turnover, e-commerce penetration, consumer discretionary spending.",
    "real_estate": "Focus on cap rates, occupancy rates, interest rate sensitivity, REIT FFO, residential vs commercial split.",
    "energy":      "Focus on levelized cost of energy (LCOE), capacity factor, grid parity milestones, PPA contract signings, ITC/PTC policy.",
    "aviation":    "Focus on load factor, revenue per available seat mile (RASM), fuel hedging, MRO costs, fleet utilization.",
    "logistics":   "Focus on freight rate index (Baltic Dry), last-mile delivery cost, warehousing utilization, port congestion.",
    "agriculture": "Focus on commodity price (wheat, corn, soy), crop yield indices, fertilizer costs, weather/climate risk.",
    "media":       "Focus on streaming subscriber churn, advertising CPM, content production cost per hour, theatrical vs streaming window.",
    "healthcare":  "Focus on hospital bed utilization, payer mix (public vs private insurance), drug reimbursement rates, telehealth adoption.",
    "insurance":   "Focus on combined ratio, loss ratio, premium growth, investment income yield, catastrophe (CAT) reserve adequacy.",
}

# Industry-specific fallback features if LLM fails
INDUSTRY_FALLBACK_FEATURES = {
    "printing":    {"ink_cost_index": 0.80, "paper_supply_resilience": 0.40},
    "pharma":      {"fda_pipeline_health": 0.70, "rd_efficiency": 0.60},
    "tech":        {"chip_supply_stability": 0.50, "ai_adoption_rate": 0.90},
    "cosmetics":   {"brand_loyalty_index": 0.80, "raw_material_availability": 0.50},
    "oil":         {"brent_crude_sensitivity": 0.85, "upstream_margin_index": 0.55},
    "coal":        {"thermal_demand_index": 0.60, "esg_pressure_score": 0.80},
    "finance":     {"net_interest_margin": 0.72, "credit_quality_index": 0.65},
    "retail":      {"same_store_sales_growth": 0.58, "inventory_turnover_health": 0.70},
    "real_estate": {"occupancy_rate_index": 0.75, "cap_rate_sensitivity": 0.60},
    "energy":      {"lcoe_competitiveness": 0.82, "grid_parity_proximity": 0.70},
    "aviation":    {"load_factor_index": 0.78, "fuel_hedge_efficiency": 0.55},
    "logistics":   {"freight_rate_index": 0.65, "last_mile_cost_efficiency": 0.60},
    "agriculture": {"crop_yield_stability": 0.68, "commodity_price_volatility": 0.75},
    "media":       {"subscriber_retention_rate": 0.72, "ad_revenue_resilience": 0.58},
    "healthcare":  {"bed_utilization_rate": 0.80, "payer_mix_quality": 0.65},
    "insurance":   {"combined_ratio_efficiency": 0.78, "investment_income_yield": 0.60},
}


class KnowledgeExtractor:
    """
    Uses Gemini to extract real-world financial data and market conditions
    for training/simulating industry-specific ML models.
    Supports all 16 industry verticals with sector-specific data signals.
    """

    async def extract_industry_data(self, industry: str, quarter: str = "Q4", year: str = "2023") -> Dict[str, Any]:
        logger.info(f"[KnowledgeExtractor] Extracting deep financial data for {industry} ({quarter} {year})")

        # Get the industry-specific focus hint, default to generic
        industry_hint = INDUSTRY_HINTS.get(
            industry.lower(),
            f"Focus on the major value drivers, key cost structures, and competitive dynamics specific to the {industry} industry."
        )

        prompt = f"""
        Role: Senior Financial Analyst & Market Intelligence Expert (Partner-level, Big Three consulting).
        Task: Extract/Synthesize a detailed, realistic dataset for the '{industry}' industry specifically for '{quarter} {year}'.

        CRITICAL INSTRUCTIONS:
        - The data MUST reflect the specific seasonality and macro-economic conditions of {quarter}.
        - For Q4: consider holiday spending, year-end budget cycles, and fiscal close effects.
        - For Q1: consider new fiscal year allocations, inventory restocking.
        - Ensure "quarterly_growth_yoy" values are realistic and differ between quarters.
        - Industry Lens: {industry_hint}

        Return a JSON object with:
        1. "market_conditions": {{ "demand_index": float(0-1), "supply_index": float(0-1), "inflation_impact": float }}
        2. "players": array of 4-5 real or representative companies with:
            {{
                "name": string (use real company names if applicable),
                "balance_sheet": {{ "total_assets": float(USD millions), "total_liabilities": float, "equity": float }},
                "income_statement": {{ "revenue": float(USD millions), "net_income": float, "operating_margin": float }},
                "quarterly_growth_yoy": float (e.g., 0.08 for 8% growth)
            }}
        3. "industry_features": {{
            "descriptive_kpi_1": float,
            "descriptive_kpi_2": float,
            "descriptive_kpi_3": float
           }}
           Use specific, human-readable KPI names relevant to the '{industry}' sector (e.g., "brent_crude_sensitivity" for oil).

        Output ONLY valid JSON, no markdown fences.
        """

        try:
            res = await gemini_client.generate(prompt)
            logger.debug(f"[KnowledgeExtractor] RAW for {industry}: {res[:300]}...")

            import re
            match = re.search(r"(\{.*\})", res, re.DOTALL)
            clean_json = match.group(1) if match else res.strip()

            data = json.loads(clean_json)
            logger.info(f"[KnowledgeExtractor] SUCCESS for {industry} ({quarter})")
            return data
        except Exception as e:
            logger.error(f"[KnowledgeExtractor] Failed for {industry}: {e} — using fallback data.")
            return self._get_fallback_data(industry, quarter)

    def _get_fallback_data(self, industry: str, quarter: str) -> Dict[str, Any]:
        """Provides realistic static data with quarterly variance if LLM fails."""
        q_map = {"Q1": 0.95, "Q2": 1.05, "Q3": 1.02, "Q4": 1.0}
        factor = q_map.get(quarter, 1.0)

        features = INDUSTRY_FALLBACK_FEATURES.get(
            industry.lower(),
            {"market_volatility": 0.55, "digital_readiness": 0.60}
        )

        return {
            "market_conditions": {
                "demand_index": round(0.70 * factor, 2),
                "supply_index": round(0.60 / factor, 2),
                "inflation_impact": 0.04
            },
            "players": [
                {
                    "name": f"{industry.replace('_', ' ').title()} Leader",
                    "balance_sheet": {"total_assets": 5000.0, "total_liabilities": 2000.0, "equity": 3000.0},
                    "income_statement": {
                        "revenue": round(2000.0 * factor, 1),
                        "net_income": round(200.0 * factor, 1),
                        "operating_margin": round(0.10 * factor, 3)
                    },
                    "quarterly_growth_yoy": round(0.05 * factor, 3)
                },
                {
                    "name": f"{industry.replace('_', ' ').title()} Challenger",
                    "balance_sheet": {"total_assets": 2500.0, "total_liabilities": 1200.0, "equity": 1300.0},
                    "income_statement": {
                        "revenue": round(900.0 * factor, 1),
                        "net_income": round(80.0 * factor, 1),
                        "operating_margin": round(0.09 * factor, 3)
                    },
                    "quarterly_growth_yoy": round(0.07 * factor, 3)
                }
            ],
            "industry_features": features
        }


knowledge_extractor = KnowledgeExtractor()
