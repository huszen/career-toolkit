import os
import random
import sys
from datetime import UTC, datetime, timedelta

import firebase_admin
from firebase_admin import credentials, firestore

# Ensure script can locate project root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Initialize firebase admin SDK if not already initialized
SERVICE_ACCOUNT_KEY_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "serviceAccountKey.json",
)

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
    firebase_admin.initialize_app(credential=cred)

db = firestore.client()

# MOCK DATASETS
JOB_TITLES = [
    "Frontend Developer (React.js)",
    "Backend Engineer (Python/FastAPI)",
    "Fullstack Software Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Cloud Solutions Architect (AWS)",
    "DevOps Engineer",
    "Cybersecurity Analyst",
    "Mobile App Developer (Flutter)",
    "AI Research Engineer",
    "UI/UX Engineer",
    "Software QA Automation Specialist",
]

COMPANIES = [
    "Tokopedia",
    "Gojek",
    "Traveloka",
    "Bukalapak",
    "Blibli",
    "Shopee Indonesia",
    "Bank Central Asia (BCA)",
    "Mandiri Innovation Hub",
    "Grab Indonesia",
    "Telkomsel Digital Labs",
]

STATUS_OPTIONS = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"]

SKILL_ADVANTAGES = [
    "Strong proficiency in Python, FastAPI, and Pydantic validation",
    "Solid experience with React.js, Tailwind CSS, and state management",
    "Hands-on background with Firebase Auth, Firestore, and GCP deployment",
    "Good understanding of REST API designs and asynchronous programming",
    "Proven track record in automated web scraping and data extraction pipeline",
    "Familiarity with Cloud Run, Docker containers, and CI/CD pipelines",
]

SKILL_DISADVANTAGES = [
    "Limited experience with Kubernetes cluster management",
    "Lack of direct enterprise-level Golang production exposure",
    "Needs more hands-on practice with high-throughput Kafka streaming",
    "No explicit AWS Cloud Practitioner certification mentioned on CV",
    "Basic knowledge of GraphQL compared to REST endpoints",
]

RECOMMENDATIONS = [
    "Highlight recent FastAPI and Firebase projects prominently in the summary",
    "Add a dedicated section detailing web scraping optimizations and stealth techniques",
    "Prepare a brief demo repository demonstrating end-to-end cloud pipeline deployment",
    "Emphasize experience in performance tuning and API response latency reduction",
]


def generate_mock_job(index: int, platform: str) -> dict:
    title = JOB_TITLES[index % len(JOB_TITLES)]
    company = COMPANIES[index % len(COMPANIES)]
    status = random.choice(STATUS_OPTIONS)

    if platform == "LinkedIn":
        job_id = f"lk-{random.randint(3000000000, 3999999999)}"
        job_url = f"https://www.linkedin.com/jobs/view/{job_id}"
    else:
        job_id = f"js-{random.randint(90000000, 99999999)}"
        job_url = f"https://id.jobstreet.com/id/job/{job_id}"

    match_score = random.randint(65, 95)
    selected_adv = random.sample(SKILL_ADVANTAGES, k=random.randint(2, 3))
    selected_dis = random.sample(SKILL_DISADVANTAGES, k=random.randint(1, 2))
    selected_rec = random.sample(RECOMMENDATIONS, k=random.randint(1, 2))

    now = datetime.now(UTC) - timedelta(days=random.randint(0, 14))
    timestamp_iso = now.isoformat()

    return {
        "job_id": job_id,
        "job_url": job_url,
        "job_title": title,
        "company": company,
        "platform": platform,
        "status": status,
        "cover_letter_url": None,
        "gap_analysis": {
            "match_score": match_score,
            "advantages": selected_adv,
            "disadvantages": selected_dis,
            "recommendations": selected_rec,
        },
        "created_at": timestamp_iso,
        "updated_at": timestamp_iso,
    }


def seed_data(user_uid: str, count: int = 10):
    print(f"\n🚀 Starting seeding process for Target User UID: '{user_uid}'...")
    user_jobs_ref = db.collection("users").document(user_uid).collection("saved_jobs")

    seeded_count = 0
    for i in range(count):
        platform = "LinkedIn" if i % 2 == 0 else "JobStreet"
        job_payload = generate_mock_job(i, platform=platform)

        _, doc_ref = user_jobs_ref.add(job_payload)
        seeded_count += 1
        print(
            f"  [{seeded_count}/{count}] Inserted '{job_payload['job_title']}' at '{job_payload['company']}' (Doc ID: {doc_ref.id})"
        )  # noqa: E501

    print(f"\n✅ Success! Successfully seeded {seeded_count} mock jobs into user '{user_uid}' dashboard.\n")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_uid = sys.argv[1]
    else:
        target_uid = "0pNYNw5kSHZjucaK17ydA7PuVsr1"

    seed_data(user_uid=target_uid, count=10)
