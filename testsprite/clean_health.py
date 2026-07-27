import requests
BASE = "https://clientgataway.vercel.app"
def test_search():
    r = requests.get(f"{BASE}/api/search?q=dashboard")
    assert r.status_code == 200, f"Search returned {r.status_code}"
    assert len(r.json()) > 0, "Search returned no results"
def test_search_empty():
    assert requests.get(f"{BASE}/api/search?q=").json() == []
