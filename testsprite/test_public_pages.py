import requests

BASE_URL = "https://clientgataway.vercel.app"

def test_landing_page():
    resp = requests.get(f"{BASE_URL}/")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"

def test_login_page():
    resp = requests.get(f"{BASE_URL}/login")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"

def test_signup_page():
    resp = requests.get(f"{BASE_URL}/signup")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"

def test_pricing_page():
    resp = requests.get(f"{BASE_URL}/pricing")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"

def test_solutions_page():
    resp = requests.get(f"{BASE_URL}/solutions")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"

def test_404_page():
    resp = requests.get(f"{BASE_URL}/nonexistent-page-xyz")
    assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"
