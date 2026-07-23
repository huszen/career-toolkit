import requests
import firebase_admin
from firebase_admin import auth, credentials
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

cred = credentials.Certificate(
    BASE_DIR / "serviceAccountKey.json"
)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# 2. Get or create a dummy user in Firebase Auth
try:
    user = auth.get_user_by_email("testuser@example.com")
except:
    user = auth.create_user(email="testuser@example.com", password="password123")

# 3. Create a custom token and exchange it / or verify user UID
print(f"Test User UID: {user.uid}")