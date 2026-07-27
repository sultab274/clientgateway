import requests

BASE_URL = "https://clientgataway.vercel.app"

def test_signup_page_has_form():
    resp = requests.get(f"{BASE_URL}/signup")
    assert resp.status_code == 200
    assert "Create your account" in resp.text
    assert 'name="name"' in resp.text
    assert 'name="email"' in resp.text

def test_login_page_has_form():
    resp = requests.get(f"{BASE_URL}/login")
    assert resp.status_code == 200
    assert "Welcome back" in resp.text
    assert 'name="email"' in resp.text

def test_google_oauth_link():
    resp = requests.get(f"{BASE_URL}/login")
    assert "/api/auth/google" in resp.text

def test_pricing_has_plans():
    resp = requests.get(f"{BASE_URL}/pricing")
    assert resp.status_code == 200
    assert "Free" in resp.text
    assert "Pro" in resp.text
    assert "Enterprise" in resp.text
    assert "$29" in resp.text
