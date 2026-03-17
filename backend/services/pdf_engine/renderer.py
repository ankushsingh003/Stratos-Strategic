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
        
        # Calculate effective page width
        epw = pdf.w - 2 * 15 # A4 width is 210, using 15mm margins
        pdf.set_left_margin(15)
        pdf.set_right_margin(15)
        
        lines = report_markdown.split("\n")
        in_code_block = False
        
        for line in lines:
            line_stripped = line.strip()
            
            # Toggle code block mode
            if line_stripped.startswith("```"):
                in_code_block = not in_code_block
                if in_code_block:
                    pdf.ln(3)
                    pdf.set_fill_color(241, 245, 249)
                    pdf.set_font("courier", "B", 8)
                    pdf.set_text_color(51, 65, 85)
                else:
                    pdf.set_font("helvetica", size=11)
                    pdf.set_text_color(30, 41, 59)
                    pdf.ln(3)
                continue
            
            if in_code_block:
                clean_line = line.encode("latin-1", errors="replace").decode("latin-1")
                pdf.set_fill_color(241, 245, 249)
                # Use multi_cell for code to avoid overflow
                pdf.multi_cell(epw, 5.5, clean_line, fill=True)
                continue
            
            if not line_stripped:
                pdf.ln(4)
                continue
            
            if line_stripped.startswith("[INDUSTRY:"):
                continue
            
            # Markdown table rows
            if line_stripped.startswith("|"):
                pdf.set_font("helvetica", size=8)
                pdf.set_text_color(30, 41, 59)
                cells = [c.strip() for c in line_stripped.strip("|").split("|")]
                if not cells or all(not c.strip() for c in cells): continue
                
                # Detect header separators |---|---|
                is_sep = all(set(c).issubset({'-', ':', ' '}) for c in cells)
                if is_sep: continue
                
                col_w = epw / max(len(cells), 1)
                is_bold = any(c.isupper() or c.startswith("**") for c in cells)
                pdf.set_font("helvetica", "B" if is_bold else "", 8)
                
                # Record Y to handle multi-line cells if needed (simplified for high-tier layout)
                start_x = pdf.get_x()
                for cell in cells:
                    clean_cell = cell.replace("**", "").encode("latin-1", errors="replace").decode("latin-1")
                    # Use a small width buffer
                    pdf.cell(col_w, 7, clean_cell[:30], border=1, ln=False)
                pdf.ln()
                pdf.set_font("helvetica", size=11)
                pdf.set_text_color(30, 41, 59)
                continue
            
            # Use latin-1 and replace non-supported chars to prevent crash
            safe_line = line_stripped.encode("latin-1", errors="replace").decode("latin-1")

            # H1
            if line_stripped.startswith("# "):
                pdf.ln(8)
                pdf.set_font("helvetica", "B", 18)
                pdf.set_text_color(15, 23, 42)
                pdf.multi_cell(epw, 12, safe_line[2:].upper())
                pdf.set_draw_color(16, 185, 129)
                pdf.line(pdf.get_x(), pdf.get_y(), pdf.get_x() + 60, pdf.get_y())
                pdf.ln(3)
                pdf.set_font("helvetica", size=11)
                pdf.set_text_color(30, 41, 59)
            # H2
            elif line_stripped.startswith("## "):
                pdf.ln(5)
                pdf.set_font("helvetica", "B", 14)
                pdf.set_text_color(16, 185, 129)
                pdf.multi_cell(epw, 10, safe_line[3:])
                pdf.set_font("helvetica", size=11)
                pdf.set_text_color(30, 41, 59)
            # H3
            elif line_stripped.startswith("### "):
                pdf.ln(3)
                pdf.set_font("helvetica", "B", 12)
                pdf.set_text_color(51, 65, 85)
                pdf.multi_cell(epw, 9, safe_line[4:])
                pdf.set_font("helvetica", size=11)
                pdf.set_text_color(30, 41, 59)
            # Bullets
            elif line_stripped.startswith("- ") or line_stripped.startswith("* "):
                pdf.set_x(20) # Indent
                pdf.set_font("helvetica", "B", 11)
                pdf.cell(5, 7, ">", ln=False)
                pdf.set_font("helvetica", size=11)
                # Available width = epw - (20+5 - 15) = epw - 10
                pdf.multi_cell(epw - 10, 7, safe_line[2:])
            # Numbered lists
            elif len(line_stripped) > 2 and line_stripped[0].isdigit() and line_stripped[1] in ".):":
                pdf.set_x(20) # Indent
                pdf.set_font("helvetica", size=11)
                # Available width = epw - (20 - 15) = epw - 5
                pdf.multi_cell(epw - 5, 7, safe_line)
            else:
                pdf.set_font("helvetica", size=11)
                pdf.multi_cell(epw, 7, safe_line)
                pdf.ln(1)

        # --- Footer ---
        pdf.set_y(-20)
        pdf.set_font("helvetica", "I", 8)
        pdf.set_text_color(148, 163, 184) # Slate 400
        pdf.cell(0, 10, f"Page {pdf.page_no()} | Vantage AI Confidential", align="C")
        
        return pdf.output()

pdf_renderer = PDFRenderer()
