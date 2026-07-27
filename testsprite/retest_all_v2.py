import requests

BASE_URL = "https://clientgataway.vercel.app"

# --- Public Pages Load ---
def test_landing_page():
    resp = requests.get(f"{BASE_URL}/")
    assert resp.status_code == 200, f"Landing page returned {resp.status_code}, expected 200"

def test_login_page():
    resp = requests.get(f"{BASE_URL}/login")
    assert resp.status_code == 200, f"Login page returned {resp.status_code}, expected 200"

def test_signup_page():
    resp = requests.get(f"{BASE_URL}/signup")
    assert resp.status_code == 200, f"Signup page returned {resp.status_code}, expected 200"

def test_pricing_page():
    resp = requests.get(f"{BASE_URL}/pricing")
    assert resp.status_code == 200, f"Pricing page returned {resp.status_code}, expected 200"

def test_solutions_page():
    resp = requests.get(f"{BASE_URL}/solutions")
    assert resp.status_code == 200, f"Solutions page returned {resp.status_code}, expected 200"

def test_404_page():
    resp = requests.get(f"{BASE_URL}/nonexistent-xyz")
    assert resp.status_code == 404, f"Nonexistent page returned {resp.status_code}, expected 404"

# --- Protected Routes ---
def test_dashboard_redirects():
    resp = requests.get(f"{BASE_URL}/dashboard", allow_redirects=False)
    assert resp.status_code == 307, f"Dashboard returned {resp.status_code}, expected 307"

def test_invoices_redirects():
    resp = requests.get(f"{BASE_URL}/dashboard/invoices", allow_redirects=False)
    assert resp.status_code == 307, f"Invoices returned {resp.status_code}, expected 307"

def test_clients_redirects():
    resp = requests.get(f"{BASE_URL}/dashboard/clients", allow_redirects=False)
    assert resp.status_code == 307, f"Clients returned {resp.status_code}, expected 307"

def test_payments_redirects():
    resp = requests.get(f"{BASE_URL}/dashboard/payments", allow_redirects=False)
    assert resp.status_code == 307, f"Payments returned {resp.status_code}, expected 307"

def test_settings_redirects():
    resp = requests.get(f"{BASE_URL}/dashboard/settings", allow_redirects=False)
    assert resp.status_code == 307, f"Settings returned {resp.status_code}, expected 307"

# --- API Health Check ---
def test_search_api():
    resp = requests.get(f"{BASE_URL}/api/search?q=dashboard")
    assert resp.status_code == 200, f"Search API returned {resp.status_code}, expected 200"

def test_search_returns_data():
    resp = requests.get(f"{BASE_URL}/api/search?q=dashboard")
    data = resp.json()
    assert len(data) > 0, "Search should return at least one result"

def test_search_empty():
    resp = requests.get(f"{BASE_URL}/api/search?q=")
    assert resp.status_code == 200
    assert resp.json() == []

# --- Auth Flow ---
def test_signup_has_form():
    resp = requests.get(f"{BASE_URL}/signup")
    assert resp.status_code == 200
    assert 'name="email"' in resp.text, "Signup page should have email input"

def test_signup_has_password():
    resp = requests.get(f"{BASE_URL}/signup")
    assert 'name="password"' in resp.text, "Signup page should have password input"

def test_login_has_form():
    resp = requests.get(f"{BASE_URL}/login")
    assert resp.status_code == 200
    assert 'name="email"' in resp.text, "Login page should have email input"

def test_login_has_google():
    resp = requests.get(f"{BASE_URL}/login")
    assert "/api/auth/google" in resp.text, "Login page should have Google OAuth link"
