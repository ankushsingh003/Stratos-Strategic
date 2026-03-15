import requests
import json
import time

def test_analyze():
    url = "http://localhost:8000/api/analyze"
    payload = {
        "company_name": "Antigravity Corp",
        "industry": "Tech",
        "region": "Global",
        "quarter": "Q4"
    }
    headers = {"Content-Type": "application/json"}
    
    print(f"Triggering analysis for {payload['company_name']}...")
    start_time = time.time()
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        latency = time.time() - start_time
        print(f"Status Code: {response.status_code}")
        print(f"Analysis Latency: {latency:.2f} seconds")
        if response.status_code == 200:
            print("Success! Result preview:")
            result = response.json()
            print(json.dumps(result["ml_verdict"], indent=2))
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_analyze()
