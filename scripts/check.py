# -*- coding: utf-8 -*-
import sys, requests
sys.stdout.reconfigure(encoding='utf-8')
url = 'https://neighborly-ibis-575.eu-west-1.convex.cloud'
resp = requests.post(f'{url}/api/query', json={'path':'posts:list','args':{}})
posts = resp.json().get('value',[])
print(f'Total posts: {len(posts)}')
for p in posts:
    cat = p.get('category','?')
    title = p.get('title','?')[:50]
    author = p.get('authorName','?')
    print(f'  [{cat}] {title} ({author})')
