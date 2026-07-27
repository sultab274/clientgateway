import requests
BASE = "https://clientgataway.vercel.app"
def test_dashboard():
    assert requests.get(f"{BASE}/dashboard", allow_redirects=False).status_code == 307
def test_invoices():
    assert requests.get(f"{BASE}/dashboard/invoices", allow_redirects=False).status_code == 307
def test_clients():
    assert requests.get(f"{BASE}/dashboard/clients", allow_redirects=False).status_code == 307
def test_payments():
    assert requests.get(f"{BASE}/dashboard/payments", allow_redirects=False).status_code == 307
