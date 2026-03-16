import google.generativeai as genai
import os
import logging
import dotenv
from typing import Optional

logger = logging.getLogger(__name__)

class GeminiClient:
    """Wrapper for the Google Gemini API to generate market intelligence."""
    
    def __init__(self):
        dotenv.load_dotenv()
        # Allow running without API key for initial scaffolding/testing
        api_key = os.environ.get("GEMINI_API_KEY")
        
        if not api_key:
            logger.warning("No GEMINI_API_KEY found. Running in MOCK mode.")
            self.mock_mode = True
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            self.mock_mode = False
            
    async def generate(self, prompt: str, max_tokens: int = 4000, retries: int = 5) -> str:
        """Sends a prompt to Gemini with exponential backoff for rate limits."""
        if self.mock_mode:
            return self._mock_response(prompt)
            
        import time
        import asyncio
        
        for attempt in range(retries):
            try:
                logger.info(f"Sending request to Gemini API (Attempt {attempt + 1})...")
                response = await self.model.generate_content_async(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        max_output_tokens=max_tokens,
                    )
                )
                return response.text
            except Exception as e:
                if "429" in str(e) and attempt < retries - 1:
                    import random
                    wait_time = (2 ** attempt) + random.uniform(1, 4)
                    logger.warning(f"Gemini Rate Limit hit. Retrying in {wait_time:.1f}s...")
                    await asyncio.sleep(wait_time)
                    continue
                
                logger.error(f"Error calling Gemini API: {e}")
                return f"Error connecting to LLM Service: {str(e)}"
        
        return "Error: Maximum retries exceeded for LLM Service."
            
    def _mock_response(self, prompt: str) -> str:
        # Detect industry slugs in the prompt for dynamic testing
        slugs = ["oil", "tech", "pharma", "cosmetics", "finance", "retail", "real_estate", "energy", "aviation", "logistics", "agriculture", "media", "healthcare", "insurance", "coal", "printing"]
        detected_slug = None
        
        lower_prompt = prompt.lower()
        for slug in slugs:
            if slug in lower_prompt:
                detected_slug = slug
                break
        
        industry_tag = f"\n\n[INDUSTRY:{detected_slug}]" if detected_slug else ""
        
        return f"""
# Consultancy Report (GEMINI MOCK OUTPUT)

## 1. Executive Summary
This sector is showing strong resilience in a volatile market. Strategic indicators suggest **Expansion** with 85% confidence.

## 2. Market Dynamics
Operating in a highly competitive landscape. Revenue growth is consistent with recent sectoral benchmarks.

## 3. Growth Trajectory
The trajectory is upward, driven by recent expansions and a stable supply chain.

## 4. Key Strategic Recommendations
1. Secure long-term supply contracts.
2. Leverage high customer sentiment for upcoming launches.
3. Invest heavily in digital transformation.

## 5. 12-Month Outlook
Steady upward climb over the next 4 quarters, outperforming the industry baseline.{industry_tag}
"""

gemini_client = GeminiClient()
