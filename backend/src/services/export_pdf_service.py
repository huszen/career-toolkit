from weasyprint import HTML
from src.config import logger

def export_pdf(html_content: str, output_pdf_path: str):
    """
    Takes a raw HTML string and compiles it into a printable PDF document using WeasyPrint.
    """
    try:
        logger.info(f"📄 Compiling HTML structure into PDF via WeasyPrint: {output_pdf_path}...")

        # Compile directly from the string
        HTML(string=html_content).write_pdf(output_pdf_path)

        logger.info("✅ PDF Generation Complete!")
    except Exception as e:
        logger.error(f"❌ PDF Compilation Failed: {str(e)}")