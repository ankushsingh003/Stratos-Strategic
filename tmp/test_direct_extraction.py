import asyncio
import os
import sys
import json

# Add project root to path
sys.path.append(os.getcwd())

from backend.services.ml_engine.common.knowledge_extractor import knowledge_extractor
from backend.services.llm_engine.gemini_client import gemini_client

async def test_direct_extraction():
    industry = "Printing"
    quarters = ["Q1", "Q4"]
    
    for q in quarters:
        print(f"\n--- TESTING {q} ---")
        try:
            data = await knowledge_extractor.extract_industry_data(industry, quarter=q)
            # Print specific health indicators
            market = data.get("market_conditions", {})
            players = data.get("players", [])
            avg_growth = sum(p.get("quarterly_growth_yoy", 0) for p in players) / len(players) if players else 0
            
            print(f"Results for {q}:")
            print(f"  Demand Index: {market.get('demand_index')}")
            print(f"  Avg Growth YoY: {avg_growth:.4f}")
            print(f"  First Player Revenue: {players[0]['income_statement']['revenue'] if players else 'N/A'}")
        except Exception as e:
            print(f"Error in {q}: {e}")

if __name__ == "__main__":
    asyncio.run(test_direct_extraction())
