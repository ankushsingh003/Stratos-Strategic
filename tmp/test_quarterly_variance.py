import requests
import json
import time

def compare_quarters():
    url = "http://localhost:8000/api/analyze"
    test_configs = [
        {"industry": "Printing", "company": "Heidelberg"},
        {"industry": "Pharma", "company": "Pfizer"}
    ]
    quarters = ["Q1", "Q4"]
    
    results = {}
    
    for config in test_configs:
        industry = config["industry"]
        company = config["company"]
        results[industry] = {}
        for q in quarters:
            payload = {
                "company_name": company,
                "industry": industry,
                "region": "Global",
                "quarter": q
            }
            print(f"Testing {industry} - {q} (with 10s cooldown)...")
            time.sleep(10)
            try:
                resp = requests.post(url, json=payload, timeout=60)
                if resp.status_code == 200:
                    data = resp.json()
                    # Store score and forecast sample
                    results[industry][q] = {
                        "score": data["ml_verdict"].get("score"),
                        "forecast_sample": data["ml_verdict"].get("forecast_data", [])[0] if data["ml_verdict"].get("forecast_data") else None
                    }
                else:
                    print(f"Error {resp.status_code}: {resp.text}")
            except Exception as e:
                print(f"Exception: {e}")

    print("\n--- COMPARISON RESULTS ---")
    for industry, qs in results.items():
        print(f"\nIndustry: {industry}")
        if "Q1" in qs and "Q4" in qs:
            q1 = qs["Q1"]
            q4 = qs["Q4"]
            print(f"  Q1 Score: {q1['score']} | Q4 Score: {q4['score']}")
            diff = abs(q1['score'] - q4['score'])
            print(f"  Variance: {diff:.4f}")
            if diff > 0.01:
                print("  ✅ SUCCESS: Quarterly variance detected!")
            else:
                print("  ⚠️ WARNING: Low/No variance detected. Check LLM prompt.")
        else:
            print("  ❌ Missing quarter data.")

if __name__ == "__main__":
    compare_quarters()
