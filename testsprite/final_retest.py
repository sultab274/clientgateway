import requests

BASE = "https://clientgataway.vercel.app"

# --- Public Pages Load ---
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

# --- Protected Routes ---
def test_dashboard():
    assert requests.get(f"{BASE}/dashboard", allow_redirects=False).status_code == 307

def test_invoices():
    assert requests.get(f"{BASE}/dashboard/invoices", allow_redirects=False).status_code == 307

def test_clients():
    assert requests.get(f"{BASE}/dashboard/clients", allow_redirects=False).status_code == 307

def test_payments():
    assert requests.get(f"{BASE}/dashboard/payments", allow_redirects=False).status_code == 307

# --- API Health Check ---
def test_search():
    r = requests.get(f"{BASE}/api/search?q=dashboard")
    assert r.status_code == 200
    assert len(r.json()) > 0

def test_search_empty():
    assert requests.get(f"{BASE}/api/search?q=").json() == []

# --- Auth Flow ---
def test_signup_form():
    r = requests.get(f"{BASE}/signup")
    assert r.status_code == 200
    assert 'name="email"' in r.text
    assert 'name="password"' in r.text

def test_login_form():
    r = requests.get(f"{BASE}/login")
    assert r.status_code == 200
    assert 'name="email"' in r.text

def test_google_oauth():
    assert "/api/auth/google" in requests.get(f"{BASE}/login").text
