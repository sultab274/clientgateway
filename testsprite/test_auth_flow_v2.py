import requests

BASE_URL = "https://clientgataway.vercel.app"

def test_signup_page_loads():
    resp = requests.get(f"{BASE_URL}/signup")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"

def test_login_page_loads():
    resp = requests.get(f"{BASE_URL}/login")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"

def test_google_oauth_link_exists():
    resp = requests.get(f"{BASE_URL}/login")
    assert "/api/auth/google" in resp.text, "Google OAuth link not found"

def test_pricing_page_has_content():
    resp = requests.get(f"{BASE_URL}/pricing")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    assert "pricing" in resp.text.lower() or "plan" in resp.text.lower()
