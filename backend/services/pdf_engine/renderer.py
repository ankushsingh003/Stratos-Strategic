from fpdf import FPDF
import logging
import os
from datetime import datetime

logger = logging.getLogger(__name__)

class PDFRenderer:
    """Converts the report data into a beautiful PDF using FPDF2 (no system deps required)."""
    
    async def render(self, report_markdown: str, company_name: str, industry: str) -> bytes:
        logger.info(f"Rendering Elite Consultancy PDF for {company_name}...")
        
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        
        # --- COVER PAGE ---
        pdf.add_page()
        # Background Accent for Cover
        pdf.set_fill_color(15, 23, 42) # Slate 900
        pdf.rect(0, 0, 210, 297, "F")
        
        # Header logo placeholder/accent
        pdf.set_fill_color(16, 185, 129) # Emerald 500
        pdf.rect(20, 40, 5, 20, "F")
        
        pdf.set_y(40)
        pdf.set_x(30)
        pdf.set_font("helvetica", "B", 32)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(0, 20, "STRATEGIC", ln=True)
        pdf.set_x(30)
        pdf.cell(0, 20, "INTELLIGENCE", ln=True)
        pdf.set_x(30)
        pdf.cell(0, 20, "REPORT", ln=True)
        
        pdf.ln(40)
        pdf.set_x(30)
        pdf.set_font("helvetica", "B", 18)
        pdf.set_text_color(16, 185, 129)
        pdf.cell(0, 10, f"PREPARED FOR: {company_name.upper()}", ln=True)
        
        pdf.set_x(30)
        pdf.set_font("helvetica", "", 12)
        pdf.set_text_color(148, 163, 184)
        pdf.cell(0, 10, f"Sector: {industry.title()}", ln=True)
        
        pdf.set_y(-40)
        pdf.set_x(30)
        pdf.set_font("helvetica", "I", 10)
        pdf.cell(0, 10, f"Released: {datetime.now().strftime('%B %Y')}", ln=False)
        pdf.set_x(-60)
        pdf.set_font("helvetica", "B", 12)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(0, 10, "VANTAGE AI", align="R")
        
        # --- MAIN CONTENT ---
        pdf.add_page()
        # Header for internal pages
        pdf.set_fill_color(248, 250, 252) # Light blue/gray
        pdf.rect(0, 0, 210, 25, "F")
        
        pdf.set_y(8)
        pdf.set_font("helvetica", "B", 10)
        pdf.set_text_color(71, 85, 105) # Slate 600
        pdf.cell(0, 10, f"STRATEGIC INTELLIGENCE | {company_name.upper()}", align="L")
        pdf.set_x(-30)
        pdf.cell(0, 10, datetime.now().strftime("%d %b %Y"), align="R")
        pdf.ln(15)
        
        # --- Content Parsing ---
        pdf.set_text_color(30, 41, 59) # Slate 800
        
        lines = report_markdown.split("\n")
        print(f"DEBUG: Starting content parsing for {len(lines)} lines")
        for line in lines:
            line = line.strip()
            if not line:
                pdf.ln(4)
                continue
                
            if line.startswith("# "):
                pdf.ln(8)
                pdf.set_font("helvetica", "B", 20)
                pdf.set_text_color(15, 23, 42)
                # Drawing a subtle accent line under headers
                curr_y = pdf.get_y()
                pdf.line(10, curr_y + 11, 60, curr_y + 11)
                pdf.cell(0, 12, line[2:].upper(), ln=True)
                pdf.ln(3)
                pdf.set_font("helvetica", size=11)
                pdf.set_text_color(30, 41, 59)
            elif line.startswith("## ") or line.startswith("### "):
                pdf.ln(3)
                pdf.set_font("helvetica", "B", 14)
                pdf.set_text_color(51, 65, 85) # Slate 600
                pdf.cell(0, 10, line.strip("# "), ln=True)
                pdf.set_font("helvetica", size=11)
                pdf.set_text_color(30, 41, 59)
            elif line.startswith("- ") or line.startswith("* "):
                pdf.set_x(15)
                # Use a cleaner bullet point
                pdf.set_font("helvetica", "B", 11)
                pdf.cell(5, 7, ">", ln=False)
                pdf.set_font("helvetica", size=11)
                pdf.multi_cell(0, 7, line[2:])
            else:
                pdf.multi_cell(0, 7, line)
                pdf.ln(1)
        
        print("DEBUG: Content parsing complete")

        # --- Footer ---
        pdf.set_y(-20)
        pdf.set_font("helvetica", "I", 8)
        pdf.set_text_color(148, 163, 184) # Slate 400
        pdf.cell(0, 10, f"Page {pdf.page_no()} | Vantage AI Confidential", align="C")
        
        return pdf.output()

pdf_renderer = PDFRenderer()
