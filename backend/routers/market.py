from fastapi import APIRouter
from backend.services.market_engine.competitor_analyzer import competitor_analyzer

router = APIRouter()

@router.get("/market/competitors/{industry}")
async def get_competitors(industry: str):
    """
    Returns market leaders, their share, and growth for the given industry.
    """
    competitors = await competitor_analyzer.get_industry_competitors(industry)
    return {"industry": industry, "competitors": competitors}

@router.get("/market/signals/{industry}")
async def get_market_signals(industry: str):
    """
    Returns industry-specific success factors and strategic signals.
    """
    factors = await competitor_analyzer.get_success_factors(industry)
    return {
        "industry": industry,
        "success_factors": factors,
        "live_signals": [
            {"type": "regulatory", "msg": f"New sustainability guidelines detected for {industry}."},
            {"type": "merger", "msg": f"Consolidation talk in {industry} mid-market increases."},
            {"type": "tech", "msg": f"AI-driven automation adoption hits 40% in {industry} leaders."}
        ]
    }
