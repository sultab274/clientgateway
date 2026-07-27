import requests

BASE_URL = "https://clientgataway.vercel.app"

def test_search_api():
    resp = requests.get(f"{BASE_URL}/api/search?q=dashboard")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert len(data) > 0, "Search should return results"
    assert any("Dashboard" in item.get("title", "") for item in data)

def test_search_empty_query():
    resp = requests.get(f"{BASE_URL}/api/search?q=")
    assert resp.status_code == 200
    assert resp.json() == []

def test_search_invoice():
    resp = requests.get(f"{BASE_URL}/api/search?q=invoice")
    assert resp.status_code == 200
    data = resp.json()
    assert any("Invoice" in item.get("title", "") for item in data)

def test_search_payment():
    resp = requests.get(f"{BASE_URL}/api/search?q=payment")
    assert resp.status_code == 200
    data = resp.json()
    assert any("Payment" in item.get("title", "") for item in data)
