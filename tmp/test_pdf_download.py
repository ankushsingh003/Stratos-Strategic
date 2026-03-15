import requests
import os

url = "http://localhost:8000/api/report/download/REP-TEST-V3"
save_path = "tmp/vantage_test_report.pdf"

try:
    print(f"Requesting PDF from {url}...")
    resp = requests.get(url, timeout=60)
    
    if resp.status_code == 200:
        with open(save_path, "wb") as f:
            f.write(resp.content)
        print(f"SUCCESS: Report saved to {save_path}")
        print(f"File Size: {os.path.getsize(save_path)} bytes")
    else:
        print(f"FAILED: {resp.status_code} - {resp.text}")
except Exception as e:
    print(f"ERROR: {e}")
