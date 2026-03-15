from pypdf import PdfReader

reader = PdfReader("tmp/vantage_elite_report.pdf")
print(f"Total Pages: {len(reader.pages)}")

full_text = ""
for page in reader.pages:
    full_text += page.extract_text() + "\n"

print("--- PDF CONTENT PREVIEW ---")
print(full_text[:1000])
print("--- END PREVIEW ---")

# Check for keywords
keywords = ["McKinsey", "BCG", "SWOT", "Strategic", "Blueprint", "Board", "Dynamics"]
found = [k for k in keywords if k.lower() in full_text.lower()]
print(f"Keywords identified: {found}")
