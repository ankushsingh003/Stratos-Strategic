from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("helvetica", size=12)
pdf.cell(0, 10, "Test PDF Byte Generation", ln=True)

try:
    content = pdf.output()
    print(f"SUCCESS: Type: {type(content)}, Size: {len(content)} bytes")
except Exception as e:
    print(f"FAILED: {e}")
