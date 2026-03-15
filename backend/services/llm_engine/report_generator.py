from backend.services.llm_engine.gemini_client import gemini_client
from backend.services.llm_engine.prompt_builder import prompt_builder

import logging
logger = logging.getLogger(__name__)

class ReportGenerator:
    """Coordinates the dynamic prompt building and calls the Gemini API."""
    
    async def generate_consultancy_report(self, ml_output: dict, market_data: dict, company_input: dict) -> str:
        logger.info(f"Generating consultancy report for {company_input.get('company_name', 'Company')}")
        
        # 1. Build prompt
        prompt = prompt_builder.build_consultancy_prompt(
            ml_output=ml_output,
            market_data=market_data,
            company_input=company_input
        )
        
        # 2. Query LLM
        report_markdown = await gemini_client.generate(prompt)
        
        return report_markdown

report_generator = ReportGenerator()
