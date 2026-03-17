import httpx
import asyncio

async def fast_verify():
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get("http://localhost:8000/api/intelligence/full-report")
        data = resp.json()
        report_str = str(data).lower()
        
        markers = ["fhir", "ebitda", "fda", "m&a", "alos", "labor", "audit", "restful", "telemetry"]
        found = [m for m in markers if m in report_str]
        
        print(f"Markers Found: {', '.join(found)}")
        
if __name__ == "__main__":
    asyncio.run(fast_verify())
