import requests

payload = {
    "major": "computer_and_systems",
    "liked_courses": ["math1"],
    "completed_courses": ["math1"],
    "preferred_difficulty": "easy"
}

resp = requests.post("http://127.0.0.1:8000/api/recommend/prolog/", json=payload)
print("Prolog response:", resp.json())
