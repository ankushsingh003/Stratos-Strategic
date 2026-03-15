import asyncio
import os
import sys

# Add project root to path
sys.path.append(os.getcwd())

from backend.services.llm_engine.gemini_client import gemini_client

async def test_gemini():
    print("Testing Gemini Client...")
    prompt = "Say 'Gemini is active' if you can read this."
    try:
        response = await gemini_client.generate(prompt)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
