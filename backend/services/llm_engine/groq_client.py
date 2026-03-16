import os
import logging
import dotenv
from groq import Groq
from typing import Optional

logger = logging.getLogger(__name__)

class GroqClient:
    """Wrapper for the Groq API to generate market intelligence with Llama 3."""
    
    def __init__(self):
        # Explicitly load from the backend directory
        env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
        dotenv.load_dotenv(dotenv_path=env_path, override=True)
        
        # Handle the user's specific casing if necessary, but prioritize standard naming
        api_key = os.environ.get("GROQ_API_KEY") or os.environ.get("GROq_API_KEY")
        
        if not api_key:
            logger.warning("No GROQ_API_KEY found. Groq integration will be disabled.")
            self.client = None
            self.mock_mode = True
        else:
            self.client = Groq(api_key=api_key)
            # Default to Llama 3 70b for high-quality market analysis
            self.model = "llama-3.3-70b-versatile"
            self.mock_mode = False
            logger.info("Groq initialized successfully.")
            
    async def generate(self, prompt: str, max_tokens: int = 4000) -> str:
        """Sends a prompt to Groq."""
        if self.mock_mode or not self.client:
            return "Error: Groq client not initialized or in mock mode."
            
        try:
            logger.info(f"Sending request to Groq API ({self.model})...")
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=self.model,
                max_tokens=max_tokens,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Error calling Groq API: {e}")
            return f"Error connecting to Groq Service: {str(e)}"

groq_client = GroqClient()
