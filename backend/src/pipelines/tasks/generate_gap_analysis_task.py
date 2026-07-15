import os
import json
from typing import Optional
from src.config import logger
from src.schemas.pipeline_schemas import ApplicationContext
from src.schemas.generated_gap_analysis_schema import GapAnalysisSchema

from src.services.build_analyze_cv_match_prompt_service import build_gap_analysis_prompt
from src.services.generate_gap_analysis_service import generate_gap_analysis
from src.services.json_parser_service import check_and_parse

from src.utils.filename_utils import build_output_filename

def run_generate_gap_analysis_task(context: ApplicationContext) -> Optional[str]:
    """
    Handles only LLM prompting for Gap Analysis generation process
    """

    logger.info("-> Assembling Gap Analysis prompts...")
    system_instruction, user_content = build_gap_analysis_prompt(
        cv_data=context.cv_data.model_dump(),
        job_data=context.job_data.model_dump(),
    )

    logger.info("-> Dispatching request to GEMINI API (Generating RAW Gap Analysis)")
    response = generate_gap_analysis(user_content=user_content, system_instruction=system_instruction)

    raw_json_output = check_and_parse(response=response)
    gap_analysis_content = GapAnalysisSchema.model_validate_json(raw_json_output)


    print(gap_analysis_content)

    output_dir = "outputs/generated_gap_analysis"
    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(output_dir, "gap_analysis.json")

    logger.info("Writing Gap Analysis to JSON format")
    with open(output_path,"w", encoding="utf-8") as f:
        json.dump(gap_analysis_content.model_dump(),f, indent=4)


    return gap_analysis_content
