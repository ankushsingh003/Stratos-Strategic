from fastapi import APIRouter, Response, Query
import logging
from backend.services.pdf_engine.renderer import pdf_renderer
from backend.core.orchestrator import orchestrator

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/report/download/{report_id}")
async def download_report(
    report_id: str,
    company: str = Query("Vantage Corp"),
    industry: str = Query("cosmetics"),
    region: str = Query("Global"),
    quarter: str = Query("Q4")
):
    """Generates and returns the elite PDF report for download using real-time analysis."""
    
    logger.info(f"Generating full strategic intelligence report for {company} (Industry: {industry})")
    
    try:
        # 1. Run full analysis via Orchestrator to get real insights
        company_input = {
            "company_id": report_id,
            "company_name": company,
            "industry": industry,
            "region": region,
            "quarter": quarter
        }
        
        analysis_result = await orchestrator.run_full_analysis(company_input)
        report_markdown = analysis_result.get("report_markdown", "# Error: No report generated.")
        
        # 2. Render to Premium PDF
        pdf_bytes = await pdf_renderer.render(
            report_markdown=report_markdown,
            company_name=company,
            industry=industry
        )
        
        filename = f"Vantage_Strategic_Report_{company.replace(' ', '_')}_{quarter}.pdf"
        
        return Response(
            content=bytes(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        logger.error(f"Critical failure in report generation: {e}")
        return Response(content=f"Error generating report: {str(e)}", status_code=500)

@router.post("/report")
async def generate_pdf_only():
    """Trigger just the PDF Engine on existing data."""
    return {"message": "Hook for PDF generation (V1 stub)"}
