import requests

BASE_URL = "https://clientgataway.vercel.app"

# --- API Health Check ---
def test_search_returns_results():
    resp = requests.get(f"{BASE_URL}/api/search?q=dashboard")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert len(data) > 0, "Search should return results"

def test_search_empty_returns_empty():
    resp = requests.get(f"{BASE_URL}/api/search?q=")
    assert resp.status_code == 200
    assert resp.json() == []

# --- Protected Routes ---
def test_dashboard_requires_auth():
    resp = requests.get(f"{BASE_URL}/dashboard", allow_redirects=False)
    assert resp.status_code == 307, f"Expected 307, got {resp.status_code}"

def test_invoices_requires_auth():
    resp = requests.get(f"{BASE_URL}/dashboard/invoices", allow_redirects=False)
    assert resp.status_code == 307, f"Expected 307, got {resp.status_code}"

def test_clients_requires_auth():
    resp = requests.get(f"{BASE_URL}/dashboard/clients", allow_redirects=False)
    assert resp.status_code == 307, f"Expected 307, got {resp.status_code}"

def test_payments_requires_auth():
    resp = requests.get(f"{BASE_URL}/dashboard/payments", allow_redirects=False)
    assert resp.status_code == 307, f"Expected 307, got {resp.status_code}"

# --- Public Pages ---
def test_landing_returns_200():
    assert requests.get(f"{BASE_URL}/").status_code == 200

def test_login_returns_200():
    assert requests.get(f"{BASE_URL}/login").status_code == 200

def test_signup_returns_200():
    assert requests.get(f"{BASE_URL}/signup").status_code == 200

def test_pricing_returns_200():
    assert requests.get(f"{BASE_URL}/pricing").status_code == 200

def test_solutions_returns_200():
    assert requests.get(f"{BASE_URL}/solutions").status_code == 200

def test_404_returns_404():
    assert requests.get(f"{BASE_URL}/nonexistent-page-xyz").status_code == 404

# --- Auth Flow ---
def test_signup_has_form():
    resp = requests.get(f"{BASE_URL}/signup")
    assert resp.status_code == 200
    assert "Create your account" in resp.text

def test_login_has_form():
    resp = requests.get(f"{BASE_URL}/login")
    assert resp.status_code == 200
    assert "Welcome back" in resp.text

def test_login_has_google_oauth():
    resp = requests.get(f"{BASE_URL}/login")
    assert "/api/auth/google" in resp.text
