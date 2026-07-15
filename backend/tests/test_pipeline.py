import unittest
import json
from unittest.mock import patch, MagicMock
from src.pipelines.cover_letter_generator_pipeline import run_pipeline
from src.schemas.cv_schema import CVDataModel, CVContentModel, IdentityModel
from backend.src.schemas.job_description_schema import JobContentModel, JobDescriptionModel

class TestCoverLetterPipeline(unittest.TestCase):

    @patch('src.pipelines.cover_letter_generator_pipeline.extract_cv_data')
    @patch('src.pipelines.cover_letter_generator_pipeline.scrape_job_description')
    @patch('src.pipelines.cover_letter_generator_pipeline.generate_cl')
    @patch('src.pipelines.cover_letter_generator_pipeline.export_pdf')
    def test_run_pipeline_success(self, mock_export_pdf, mock_generate_cl, mock_scrape_job, mock_extract_cv):
        """Test the entire pipeline by mocking external dependencies and API calls."""
        
        # 1. Mock complete CV Extraction Data structure
        mock_extract_cv.return_value = CVDataModel(
            identity=IdentityModel(
                name="Hasbi Hussein",
                email="hasbi@example.com",
                phone="628123456789",
                linkedin="https://linkedin.com/in/hasbi",
                website=None
            ),
            content=CVContentModel(
                summary="Fresh graduate in Informatics Engineering with hands-on experience in Machine Learning.",
                experience="Research Assistant at Universitas Sriwijaya.",
                skills="Python, TensorFlow, Machine Learning",
                education="Universitas Sriwijaya",
                certifications="TensorFlow Certified Developer",
                projects="Cover Letter Generator Pipeline Application",
                training="Bangkit Academy Machine Learning Cohort"
            )
        )

        mock_scrape_job.return_value = JobDescriptionModel(
            url="https://id.jobstreet.com/id/job/92036471",
            job_id="92036471",
            timestamp="2026-06-18 16:15:00",
            data=JobContentModel(
                title="Machine Learning Engineer",
                company="Tech Corp",
                location="Jakarta",
                description="We are looking for a Machine Learning Engineer...",
                requirements="Experience with Python, LLMs, and Cloud deployments.",
                employment_type="Full-time",
                salary="None"
            )
        )

        # 3. Mock Gemini API Response Object
        mock_json_response = {
            "greeting": "Dear Hiring Team at Tech Corp,",
            "opening_paragraph": "I am thrilled to express my interest in the Machine Learning Engineer position...",
            "body_paragraph_1": "During my time at Universitas Sriwijaya, I developed deep skills in building workflows...",
            "body_paragraph_2": "Furthermore, my experience with TensorFlow and NLP allows me to address complex automation problems...",
            "closing_paragraph": "Thank you for considering my application.",
            "sign_off": "Sincerely,\nHasbi Hussein"
        }
        
        # Create a mock object to represent the response returned by generate_cl
        mock_response_obj = MagicMock()
        # Set its 'text' attribute to contain the raw JSON data string
        mock_response_obj.text = json.dumps(mock_json_response)
        
        # Assign the mock object as the return value of generate_cl
        mock_generate_cl.return_value = mock_response_obj

        # 4. Mock the PDF exportation side-effect
        mock_export_pdf.return_value = True

        # Pipeline Arguments
        pdf_path = "dummy_cv.pdf"
        job_url = "https://id.jobstreet.com/id/job/92036471"
        output_name = "test_output.pdf"

        # Execute
        run_pipeline(pdf_path, job_url, output_name)

        # Assertions to ensure each stage of your logic was handled correctly
        mock_extract_cv.assert_called_once_with(pdf_path=pdf_path)
        mock_scrape_job.assert_called_once_with(job_url)
        mock_generate_cl.assert_called_once()
        mock_export_pdf.assert_called_once()

if __name__ == '__main__':
    unittest.main()