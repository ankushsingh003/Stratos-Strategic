from fastapi import APIRouter
from backend.services.market_engine.competitor_analyzer import competitor_analyzer
from backend.services.ml_engine.common.knowledge_extractor import knowledge_extractor

router = APIRouter()

@router.get("/market/competitors/{industry}")
async def get_competitors(industry: str):
    """
    Returns market leaders, their share, and tokens using AI intelligence.
    """
    intelligence = await competitor_analyzer.get_industry_intelligence(industry)
    return {"industry": industry, "competitors": intelligence.get("competitors", [])}

@router.get("/market/signals/{industry}")
async def get_market_signals(industry: str):
    """
    Returns industry-specific success factors and strategic signals using AI intelligence.
    """
    intelligence = await competitor_analyzer.get_industry_intelligence(industry)
    return {
        "industry": industry,
        "success_factors": intelligence.get("success_factors", []),
        "live_signals": intelligence.get("live_signals", [])
    }

@router.get("/market/audit/{industry}")
async def get_industry_audit(industry: str, quarter: str = "Q4"):
    """
    Returns full financial statements (balance sheet, income statement, cash flow)
    for all major companies in the given industry, extracted dynamically via Gemini LLM.
    """
    data = await knowledge_extractor.extract_industry_data(industry, quarter=quarter)
    players = data.get("players", [])
    market_conditions = data.get("market_conditions", {})
    industry_features = data.get("industry_features", {})
    return {
        "industry": industry,
        "quarter": quarter,
        "market_conditions": market_conditions,
        "industry_kpis": industry_features,
        "companies": players
    }
