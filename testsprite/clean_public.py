import requests
BASE = "https://clientgataway.vercel.app"
def test_landing():
    assert requests.get(f"{BASE}/").status_code == 200
def test_login():
    assert requests.get(f"{BASE}/login").status_code == 200
def test_signup():
    assert requests.get(f"{BASE}/signup").status_code == 200
def test_pricing():
    assert requests.get(f"{BASE}/pricing").status_code == 200
def test_solutions():
    assert requests.get(f"{BASE}/solutions").status_code == 200
