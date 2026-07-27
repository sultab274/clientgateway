import requests
BASE = "https://clientgataway.vercel.app"
def test_signup_form():
    r = requests.get(f"{BASE}/signup")
    assert r.status_code == 200
    assert 'name="email"' in r.text
def test_login_form():
    r = requests.get(f"{BASE}/login")
    assert r.status_code == 200
    assert 'name="email"' in r.text
def test_google():
    assert "/api/auth/google" in requests.get(f"{BASE}/login").text
