import httpx
import json
import asyncio

async def verify_multi_pillar():
    print("Fetching Full Intelligence Report...")
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.get("http://localhost:8000/api/intelligence/full-report")
            if resp.status_code == 200:
                data = resp.json()
                pillars = ["financial", "regulatory", "digital", "growth", "operational"]
                
                print("\n=== Technical Marker Audit ===")
                for p in pillars:
                    spec = data.get(p, {}).get("specialized", {})
                    print(f"\n[PILLAR: {p.upper()}]")
                    if not spec:
                        print("  ERROR: Specialized report MISSING.")
                        continue
                    
                    # Check for generic filler vs technical density
                    why = spec.get("executive_summary", {}).get("why", "")
                    tech_audit = spec.get("tech_audit", {}).get("ehr_integration", "")
                    
                    print(f"  Summary Why: {why[:100]}...")
                    print(f"  Tech Audit: {tech_audit[:100]}...")
                    
                    # Search for keywords
                    keywords = {
                        "digital": ["FHIR", "telemetry", "ETL", "RESTful"],
                        "financial": ["EBITDA", "Net-Income", "CMS"],
                        "regulatory": ["FDA", "HIPAA", "Adverse", "Safe"],
                        "growth": ["revenue", "M&A", "entry", "CVS"],
                        "operational": ["labor", "output", "ALOS", "triage"]
                    }
                    
                    found = [k for k in keywords.get(p, []) if k.lower() in str(spec).lower()]
                    print(f"  Technical Markers Found: {', '.join(found) if found else 'NONE'}")
                    
                print("\nVerification Complete.")
            else:
                print(f"Error: Backend returned {resp.status_code}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(verify_multi_pillar())
