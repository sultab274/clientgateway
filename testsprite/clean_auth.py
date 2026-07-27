import requests
BASE = "https://clientgataway.vercel.app"
def test_signup_form():
    r = requests.get(f"{BASE}/signup")
    assert r.status_code == 200, f"Signup returned {r.status_code}"
    assert 'name="email"' in r.text, "Missing email input"
    assert 'name="password"' in r.text, "Missing password input"
def test_login_form():
    r = requests.get(f"{BASE}/login")
    assert r.status_code == 200, f"Login returned {r.status_code}"
    assert 'name="email"' in r.text, "Missing email input"
def test_google_oauth():
    assert "/api/auth/google" in requests.get(f"{BASE}/login").text
