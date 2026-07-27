import requests

BASE_URL = "https://clientgataway.vercel.app"

def test_dashboard_redirects():
    resp = requests.get(f"{BASE_URL}/dashboard", allow_redirects=False)
    assert resp.status_code == 307, f"Expected 307, got {resp.status_code}"

def test_invoices_redirects():
    resp = requests.get(f"{BASE_URL}/dashboard/invoices", allow_redirects=False)
    assert resp.status_code == 307, f"Expected 307, got {resp.status_code}"

def test_clients_redirects():
    resp = requests.get(f"{BASE_URL}/dashboard/clients", allow_redirects=False)
    assert resp.status_code == 307, f"Expected 307, got {resp.status_code}"

def test_payments_redirects():
    resp = requests.get(f"{BASE_URL}/dashboard/payments", allow_redirects=False)
    assert resp.status_code == 307, f"Expected 307, got {resp.status_code}"

def test_settings_redirects():
    resp = requests.get(f"{BASE_URL}/dashboard/settings", allow_redirects=False)
    assert resp.status_code == 307, f"Expected 307, got {resp.status_code}"
