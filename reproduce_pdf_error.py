import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

from backend.services.pdf_engine.renderer import pdf_renderer

async def test_pdf():
    company = "Test Comp"
    industry = "tech"
    # A markdown that might cause issues - a VERY wide table
    markdown = """
# Wide Table Test
| Col 1 | Col 2 | Col 3 | Col 4 | Col 5 | Col 6 | Col 7 | Col 8 | Col 9 | Col 10 | Col 11 | Col 12 | Col 13 | Col 14 | Col 15 | Col 16 | Col 17 | Col 18 | Col 19 | Col 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T |

Normal text.

### Sub Section
1. Numbered list
2. Another item

Normal text again.
"""
    try:
        pdf_bytes = await pdf_renderer.render(markdown, company, industry)
        with open("test_output.pdf", "wb") as f:
            f.write(pdf_bytes)
        print("PDF generated successfully.")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(test_pdf())
