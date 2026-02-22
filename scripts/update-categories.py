# -*- coding: utf-8 -*-
import os, sys, requests, json, time
sys.stdout.reconfigure(encoding='utf-8')

CONVEX_URL = None
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
with open(env_path, 'r', encoding='utf-8') as f:
    for line in f:
        if line.startswith('NEXT_PUBLIC_CONVEX_URL='):
            CONVEX_URL = line.strip().split('=', 1)[1]

print(f"Convex URL: {CONVEX_URL}")
print("Waiting 5s for mutation to deploy...")
time.sleep(5)

# Get all posts
resp = requests.post(f"{CONVEX_URL}/api/query", json={"path": "posts:list", "args": {}})
data = resp.json()
posts = data.get("value", [])
print(f"Found {len(posts)} posts\n")

MAPPING = {
    "AI 챗봇": "AI소식",
    "이미지 생성": "디지털라이프",
    "코딩 도구": "디지털라이프",
    "생산성": "브리핑",
    "기타": "브리핑",
}

for post in posts:
    old_cat = post["category"]
    new_cat = MAPPING.get(old_cat, old_cat)
    if old_cat != new_cat:
        print(f"  {post['toolName']}: {old_cat} -> {new_cat}")
        resp = requests.post(f"{CONVEX_URL}/api/mutation", json={
            "path": "posts:updateCategory",
            "args": {"id": post["_id"], "category": new_cat}
        })
        if resp.status_code == 200:
            print(f"    OK!")
        else:
            print(f"    FAIL: {resp.status_code} {resp.text}")
    else:
        print(f"  {post['toolName']}: {old_cat} (no change)")

print("\nDone!")
