import os
import random
import sys
from datetime import UTC, datetime, timedelta

import firebase_admin
from firebase_admin import credentials, firestore

# Ensure script can locate project root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

SERVICE_ACCOUNT_KEY_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "serviceAccountKey.json",
)

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
    firebase_admin.initialize_app(credential=cred)

db = firestore.client()

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

LOCATIONS = [
    "Jakarta (Hybrid)",
    "South Jakarta (On-site)",
    "Remote, Indonesia",
    "Bandung (Hybrid)",
    "Yogyakarta (Remote)",
    "Tangerang (On-site)",
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
    location = random.choice(LOCATIONS)

    if platform == "LinkedIn":
        job_id = f"lk-{random.randint(3000000000, 3999999999)}"
        job_url = f"https://www.linkedin.com/jobs/view/{job_id}"
    else:
        job_id = f"js-{random.randint(90000000, 99999999)}"
        job_url = f"https://id.jobstreet.com/id/job/{job_id}"

    # Spread timestamps across the last 30 days for time-series charts
    days_ago = random.randint(0, 30)
    created_dt = datetime.now(UTC) - timedelta(days=days_ago)
    created_iso = created_dt.isoformat()

    applied_iso = None
    if status in ["Applied", "Interviewing", "Offer", "Rejected"]:
        applied_dt = created_dt + timedelta(days=random.randint(0, 3))
        applied_iso = applied_dt.isoformat()

    # ~80% chance of having gap analysis to test optionality
    has_gap_analysis = random.random() < 0.8
    match_score = None
    gap_analysis = None

    if has_gap_analysis:
        match_score = random.randint(60, 96)
        gap_analysis = {
            "match_score": match_score,
            "advantages": random.sample(SKILL_ADVANTAGES, k=random.randint(2, 3)),
            "disadvantages": random.sample(SKILL_DISADVANTAGES, k=random.randint(1, 2)),
            "recommendations": random.sample(RECOMMENDATIONS, k=random.randint(1, 2)),
        }

    return {
        "job_id": job_id,
        "job_url": job_url,
        "job_title": title,
        "company": company,
        "platform": platform,
        "location": location,
        "status": status,
        "match_score": match_score,
        "cover_letter_url": None,
        "gap_analysis": gap_analysis,
        "notes": "",
        "created_at": created_iso,
        "applied_at": applied_iso,
        "updated_at": created_iso,
    }


def seed_data(user_uid: str, count: int = 12):
    print(f"\n🚀 Starting seeding process for Target User UID: '{user_uid}'...")
    user_jobs_ref = db.collection("users").document(user_uid).collection("saved_jobs")

    seeded_count = 0
    for i in range(count):
        platform = "LinkedIn" if i % 2 == 0 else "JobStreet"
        job_payload = generate_mock_job(i, platform=platform)

        _, doc_ref = user_jobs_ref.add(job_payload)
        seeded_count += 1
        print(
            f"  [{seeded_count}/{count}] Inserted '{job_payload['job_title']}' at '{job_payload['company']}' "
            f"(Score: {job_payload['match_score']}, Status: {job_payload['status']})"
        )

    print(f"\n✅ Success! Seeded {seeded_count} mock jobs into user '{user_uid}' dashboard.\n")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_uid = sys.argv[1]
    else:
        target_uid = "kk8Cq8JxnbT3DrzLQjy1zjUMw5O2"

    seed_data(user_uid=target_uid, count=5)
