import os
import json
import logging
from google import genai


from src.config import settings, logger

from src.renderers.new_html_renderer import render_cover_letter_html

from src.services.export_pdf_service import export_pdf
from src.services.json_parser_service import check_and_parse
from src.services.extract_cv_data_service import extract_cv_data
from src.services.scrape_job_description_service import scrape_job_description
from src.services.generate_cover_letter_service import generate_cl, CoverLetterSchema
from src.services.build_cover_letter_generator_prompt_service import build_cover_letter_prompt

from src.utils.filename_utils import build_output_filename


def run_pipeline(pdf_path: str, job_url:str, output_file_name:str = None):
    logger.info("Starting Cover Letter Generation Pipeline")

    # Step 1: CV Extraction
    logger.info("\n[1/7] Extracting CV Content...")
    try:    
        cv_data = extract_cv_data(pdf_path=pdf_path)
        logger.debug(f"Extracted CV Object Structures: {cv_data.model_dump_json()}")
    except:
        logger.error("Critical Failure during CV structural extraction", exc_info=True)
        return None

    # Step 2: Link Scraping
    logger.info("\n[2/7] Scraping Jobstreet Requirements...")
    try:
        job_data = scrape_job_description(job_url)
        logger.debug(f"Scraped Job Object Strucure: {job_data.model_dump_json()}")
    except Exception as e:
        logger.error("Critical Failure during browser automation/scraping", exc_info=True)
        return None

    # Step 3: Verification Showcase
    logger.info("\n[3/7] Verification Check:")
    logger.info(f" -> Candidate Name detected: {cv_data.identity.name}")
    logger.info(f" -> Target Company detected: {job_data.data.company}")
    logger.info(f" -> Target Job Title detected: {job_data.data.title}")
    

    # Step 4: Aggregation and Context Merging
    logger.info("\n[4/7] Merging datasets into unified system prompt")
    system_instruction, user_content = build_cover_letter_prompt(
        cv_data.model_dump(), 
        job_data.model_dump()
        )
    logger.debug(f"Compiled System Prompt: {system_instruction}")
    logger.debug(f"Compiled User Context Content: {user_content}")

    # Step 5: LLM Inference
    logger.info("\n[5/7] Sending request to GEMINI API")
    try:
        response = generate_cl(user_content, system_instruction)

        raw_json_output = check_and_parse(response=response)
        logger.debug(f"Raw GEMINI Data Output Payload: {raw_json_output}")

        cover_letter_content = CoverLetterSchema.model_validate_json(raw_json_output)

        # Step 6/7
        logger.info("\n[6/7] Rendering styled HTML document...")
        html_document = render_cover_letter_html(
            metadata=cv_data.identity.model_dump(),
            content=cover_letter_content.model_dump()
        )

        # Step 7: Convert Raw HTML to PDF File
        logger.info("\n[7/7] Converting Gemini Raw HTML to PDF")
        base_filename = build_output_filename(
            company_name = job_data.data.company,
            job_title = job_data.data.title,
            candidate_name = cv_data.identity.name
        )
        output_dir = "outputs"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        output_file_path = os.path.join(output_dir, base_filename)
        
        export_pdf(html_document, output_file_path)

        logger.info("\nPipeline completed succesfully")
        logger.info(f"PDF generated: {output_file_path}")

        # return output_file_name
        return output_file_path

    except Exception as e:
        logger.error("Pipeline processing execution failed", exc_info=True)
        logger.info("\nPipeline Failed. Check 'pipeline.log' for detailed debugging telemetry")

        return None



