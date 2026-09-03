import time
from typing import Any, Optional

from src.config import logger

# Task module imports
from src.pipelines.tasks.generate_cover_letter_task import run_generate_cover_letter_task
from src.pipelines.tasks.generate_gap_analysis_task import run_generate_gap_analysis_task
from src.schemas.cv_schema import CVDataModel
from src.schemas.pipeline_schemas import ApplicationContext, PipelineResultModel

# Structural service imports
from src.services.extract_cv_data_service import extract_cv_data
from src.services.scrape_job_description_service import scrape_job_description


def run_pipeline(
    pdf_path: str, job_url: str, run_gap_analysis: bool = False, cv_data: CVDataModel | None = None
) -> dict[str, Any] | None:
    pipeline_start_time = time.perf_counter()
    logger.info("=== Starting Master Application Pipeline ===")

    pipeline_result = PipelineResultModel()

    # =============================================
    # PHASE 1: Shared Structural Resource Ingestion
    # =============================================
    t0 = time.perf_counter()
    try:
        # 1. Resolve CV Data
        if cv_data is None:
            if not pdf_path:
                raise ValueError("Neither cv_data nor pdf_path was provided to pipeline")
            logger.info("\n[1/3] Context Phase: Extracting CV Content from PDF...")
            t_cv = time.perf_counter()
            cv_data = extract_cv_data(pdf_path=pdf_path)
            logger.info(f"⏱️ CV Extraction took: {time.perf_counter() - t_cv:.2f}s")
        else:
            logger.info("\n[1/3] Context Phase: Using Pre-Saved CV Profile...")

        # 2. Scrape target Job
        logger.info("\n[2/3] Context Phase: Scraping Job Description...")
        t_scrape = time.perf_counter()
        job_data = scrape_job_description(job_url=job_url)
        logger.info(f"⏱️ Job Scraping took: {time.perf_counter() - t_scrape:.2f}s")

        context = ApplicationContext(cv_data=cv_data, job_data=job_data)

        pipeline_result.job_title = context.job_data.data.title or "Unknown Title"
        pipeline_result.company = context.job_data.data.company or "Unknown Company"

        logger.info("-> Context Phase verification successful.")
        logger.info(f"      Candidate Name: {context.cv_data.identity.name}")
        logger.info(f"      Position: {context.job_data.data.title}")
        logger.info(f"      Company: {context.job_data.data.company}")
        logger.info(f"⏱️ PHASE 1 (Total Context Phase) took: {time.perf_counter() - t0:.2f}s")

    except Exception as e:
        logger.error("Critical Failure during structural context extraction phase", exc_info=True)
        return None

    # =============================================
    # PHASE 2: Downstream Multi-Task Execution Loop (Sequential)
    # =============================================
    t_phase2 = time.perf_counter()

    # Task A: Cover Letter Generation
    try:
        logger.info("\n[3/3] Workflow Phase: Generating Cover Letter Document...")
        t_cl = time.perf_counter()
        cover_letter_file = run_generate_cover_letter_task(context=context)
        pipeline_result.cover_letter_path = cover_letter_file
        logger.info("-> Cover Letter Workflow finished successfully")
        logger.info(f"⏱️ Cover Letter Task took: {time.perf_counter() - t_cl:.2f}s")
    except Exception as e:
        logger.error("Non-critical failure inside Cover Letter task generation", exc_info=True)
        # Catch and store the error string for the user
        err_msg = (
            "Cover Letter generation failed due to Gemini API high demand (503). Please try again later."
            if "503" in str(e)
            else f"Cover Letter failed: {str(e)}"
        )
        pipeline_result.errors.append(err_msg)

    # Task B: Gap Analysis Verification Block (Optional Toggle)
    if run_gap_analysis:
        try:
            logger.info("\n[3/3] Workflow Phase: Generating Gap Analysis Report...")
            t_gap = time.perf_counter()
            gap_report = run_generate_gap_analysis_task(context=context)
            pipeline_result.gap_analysis_report = gap_report
            logger.info("-> Gap Analysis Task finished successfully")
            logger.info(f"⏱️ Gap Analysis Task took: {time.perf_counter() - t_gap:.2f}s")
        except Exception as e:
            logger.error("Non-critical failure inside Gap Analysis processing", exc_info=True)
            # Catch and store the error string for the user
            err_msg = (
                "Gap Analysis failed due to Gemini API high demand (503). Please try again later."
                if "503" in str(e)
                else f"Gap Analysis failed: {str(e)}"
            )
            pipeline_result.errors.append(err_msg)

    logger.info(f"⏱️ PHASE 2 (Tasks Execution Total) took: {time.perf_counter() - t_phase2:.2f}s")

    total_time = time.perf_counter() - pipeline_start_time
    logger.info("==================================================")
    logger.info(f"🏁 Master Application Pipeline Finished in {total_time:.2f}s")
    logger.info("==================================================")

    return pipeline_result
