from typing import Optional, Dict, Any
from src.config import logger
from src.schemas.pipeline_schemas import ApplicationContext

# Structural service imports
from src.services.extract_cv_data_service import extract_cv_data
from src.services.scrape_job_description_service import scrape_job_description

# Task module imports
from src.pipelines.tasks.generate_cover_letter_task import run_generate_cover_letter_task
from src.pipelines.tasks.generate_gap_analysis_task import run_generate_gap_analysis_task

def run_pipeline(pdf_path: str, job_url: str, run_gap_analysis: bool = False) -> Optional[Dict[str,Any]]:
    logger.info("=== Starting Master Application Pipeline ===")

    # pipeline execution payload return structure
    pipeline_result = {
        "cover_letter_path":None,
        "gap_analysis_report":None
    }

    # =============================================
    # PHASE 1: Shared Structural Resource Ingestion
    # =============================================
    try:
        logger.info("\n[1/3] Context Phase: Extracting CV Content...")
        cv_data = extract_cv_data(pdf_path=pdf_path)

        logger.info("\n[2/3] Context Phase: Scraping Job Description...")
        job_data = scrape_job_description(job_url=job_url)

        # package data into clean pipeline container
        context = ApplicationContext(cv_data=cv_data, job_data=job_data)

        logger.info("-> Context Phase verification successful.")
        logger.info(f"      Candidate: {context.cv_data.identity.name}")
        logger.info(f"      Target:{context.job_data.data.title} at {context.job_data.data.company}")

    except Exception as e:
        logger.error("Critical Failure during structural context extraction phase", exc_info=True)
        return None

    # =============================================
    # PHASE 2: Downstream Multi-Task Execution Loop
    # =============================================
    
    # Task A: Cover Letter Generation (Core Engine Block)
    try:
        logger.info("\n[3/3] Workflow Phase: Generating Cover Letter Document...")
        cover_letter_file = run_generate_cover_letter_task(context=context)
        pipeline_result["cover_letter_path"] = cover_letter_file
        logger.info("-> Cover Letter Workflow finished succesfully")
    except Exception as e:
        logger.error("Non-critical failure inside Cover Letter task generation", exc_info=True)


    # Task B: Gap Analysis Verification Block (Optional Toggle) 
    if run_gap_analysis:
        try:
            logger.info("\n[OPTIONAL] Workflow Phase: Initializing Gap Analysis evaluation...")
            gap_analysis_payload = run_generate_gap_analysis_task(context=context)
            pipeline_result["gap_analysis_report"] = gap_analysis_payload
            logger.info("-> Gap Analysis Task Finished successfully.")
        except Exception as e:
            logger.error("Non-critical failure inside Gap Analysis processing", exc_info=True)


    logger.info("\=== Master Application Pipeline Run Finished ===")
    return pipeline_result
