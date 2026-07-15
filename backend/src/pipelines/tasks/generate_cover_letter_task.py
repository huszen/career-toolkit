import os
from typing import Optional
from src.config import logger
from src.schemas.pipeline_schemas import ApplicationContext
from src.schemas.generated_cover_letter_schema import CoverLetterSchema

from src.services.build_cover_letter_generator_prompt_service import build_cover_letter_prompt
from src.services.generate_cover_letter_service import generate_cover_letter
from src.services.json_parser_service import check_and_parse
from src.renderers.new_html_renderer import render_cover_letter_html
from src.services.export_pdf_service import export_pdf
from src.utils.filename_utils import build_output_filename

def run_generate_cover_letter_task(context: ApplicationContext) -> Optional[str]:
    """
    Handles only LLM prompting, HTML rendering and PDF export for cover letters generation process
    """
    
    logger.info("-> Assembling Cover Letter prompts...")
    system_instruction, user_content = build_cover_letter_prompt(
        cv_data=context.cv_data.model_dump(),
        job_data=context.job_data.model_dump()
    )

    logger.info("-> Dispatching request to GEMINI API (Generating RAW Cover Letter)...")
    response = generate_cover_letter(user_content=user_content, system_instruction=system_instruction)

    raw_json_output = check_and_parse(response=response)
    cover_letter_content = CoverLetterSchema.model_validate_json(raw_json_output)

    logger.info("-> Rendering styled HTML document...")
    html_document = render_cover_letter_html(
        metadata=context.cv_data.identity.model_dump(),
        content = cover_letter_content.model_dump()
    )

    base_filename = build_output_filename(
        company_name=context.job_data.data.company,
        job_title=context.job_data.data.title,
        candidate_name=context.cv_data.identity.name
    )

    output_dir = "outputs/generated_cover_letter"
    os.makedirs(output_dir, exist_ok=True)
    output_file_path = os.path.join(output_dir, base_filename)

    logger.info("-> Converting HTML to final PDF...")
    export_pdf(html_content=html_document, output_pdf_path=output_file_path)

    return output_file_path


