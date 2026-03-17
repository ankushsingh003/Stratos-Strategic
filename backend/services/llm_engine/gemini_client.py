import google.generativeai as genai
import os
import logging
import dotenv
from typing import Optional
from groq import Groq

logger = logging.getLogger(__name__)

class GeminiClient:
    """
    Unified LLM Client.
    Prioritizes Groq (for speed & free tier) and falls back to Gemini.
    """
    
    def __init__(self):
        # Explicitly load from the backend directory
        env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
        dotenv.load_dotenv(dotenv_path=env_path, override=True)
        
        # Initialize Groq (Primary)
        self.groq_key = os.environ.get("GROQ_API_KEY") or os.environ.get("GROq_API_KEY")
        self.groq_client = None
        if self.groq_key:
            try:
                self.groq_client = Groq(api_key=self.groq_key)
                self.groq_model = "llama-3.3-70b-versatile"
                logger.info("Groq initialized as primary LLM engine.")
            except Exception as e:
                logger.error(f"Failed to initialize Groq: {e}")

        # Initialize Gemini (Secondary/Fallback)
        self.gemini_key = os.environ.get("GEMINI_API_KEY")
        self.gemini_model = None
        if self.gemini_key:
            try:
                genai.configure(api_key=self.gemini_key)
                self.gemini_model = genai.GenerativeModel('gemini-2.0-flash')
                logger.info("Gemini initialized as secondary LLM engine.")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini: {e}")

        self.mock_mode = not (self.groq_client or self.gemini_model)
        if self.mock_mode:
            logger.warning("No LLM keys found. Running in MOCK mode.")
            
    async def generate(self, prompt: str, max_tokens: int = 4000, retries: int = 5) -> str:
        """Sends a prompt to the best available LLM with fallbacks."""
        
        # 1. Try Groq (Primary)
        if self.groq_client:
            try:
                logger.info(f"Using Groq engine ({self.groq_model})...")
                chat_completion = self.groq_client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model=self.groq_model,
                    max_tokens=max_tokens,
                )
                return chat_completion.choices[0].message.content
            except Exception as e:
                logger.warning(f"Groq primary engine failed: {e}. Attempting fallback...")

        # 2. Try Gemini (Secondary)
        if self.gemini_model:
            import asyncio
            for attempt in range(retries):
                try:
                    logger.info(f"Using Gemini engine (Attempt {attempt + 1})...")
                    response = await self.gemini_model.generate_content_async(
                        prompt,
                        generation_config=genai.types.GenerationConfig(
                            max_output_tokens=max_tokens,
                        )
                    )
                    return response.text
                except Exception as e:
                    if "429" in str(e) and attempt < retries - 1:
                        wait_time = (2 ** attempt) + 1
                        await asyncio.sleep(wait_time)
                        continue
                    logger.error(f"Gemini fallback failed: {e}")
                    break

        # 3. Final Mock Fallback (only if all keys are missing or failing)
        if self.mock_mode:
            return self._mock_response(prompt)
            
        return "Error: All LLM services failed to respond."
            
    def _mock_response(self, prompt: str) -> str:
        # Minimal mock to avoid the "constant fixed" feeling
        return f"MOCK ENGINE: AI Intelligence for industry detected from prompt. (No API keys active). \n\nPrompt summary: {prompt[:100]}..."

gemini_client = GeminiClient()
