import requests
BASE = "https://clientgataway.vercel.app"
def test_search():
    r = requests.get(f"{BASE}/api/search?q=dashboard")
    assert r.status_code == 200
    assert len(r.json()) > 0
def test_search_empty():
    assert requests.get(f"{BASE}/api/search?q=").json() == []
