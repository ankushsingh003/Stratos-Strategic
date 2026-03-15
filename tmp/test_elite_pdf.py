import requests
import os

url = "http://localhost:8000/api/report/download/REP-ELITE-001"
params = {
    "company": "Heidelberg Materials",
    "industry": "printing",
    "region": "Global",
    "quarter": "Q4"
}
save_path = "tmp/vantage_elite_report.pdf"

try:
    print(f"Requesting Elite PDF from {url} with params {params}...")
    resp = requests.get(url, params=params, timeout=120) # Long timeout for orchestrator
    
    if resp.status_code == 200:
        with open(save_path, "wb") as f:
            f.write(resp.content)
        print(f"SUCCESS: Elite Report saved to {save_path}")
        print(f"File Size: {os.path.getsize(save_path)} bytes")
    else:
        print(f"FAILED: {resp.status_code} - {resp.text}")
except Exception as e:
    print(f"ERROR: {e}")
