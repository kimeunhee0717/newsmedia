# -*- coding: utf-8 -*-
import os, sys, json, requests, time, re
sys.stdout.reconfigure(encoding='utf-8')

from openai import OpenAI

# Config
SOURCE_DIR = r"C:\Newproject\2602\bujatime\bujatime\src\data\posts"
CONVEX_URL = None
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
with open(env_path, 'r', encoding='utf-8') as f:
    for line in f:
        if line.startswith('NEXT_PUBLIC_CONVEX_URL='):
            CONVEX_URL = line.strip().split('=', 1)[1]

print(f"Convex URL: {CONVEX_URL}")

client = OpenAI()

# Category mapping
CATEGORY_MAP = {
    "digital-life": "디지털라이프",
    "digital-skill": "디지털라이프",
    "briefing": "브리핑",
    "money-plus": "재테크",
    "mindset": "재테크",
}

SYSTEM_PROMPT = """당신은 블로그 콘텐츠 리라이터입니다. 원본 글을 아래 규칙에 따라 완전히 새로운 글로 변환하세요.

## 변환 규칙

1. **타겟**: 시니어/어르신 전용 → 20~50대 전 연령 실용 가이드
2. **관점**: "이렇게 하세요" 교육형 → "직접 써봤습니다" 1인칭 체험 리뷰형
3. **톤**: 부드러운 어르신 톤 → 깔끔하고 솔직한 리뷰어 톤 (존댓말 유지)
4. **브랜드**: "부자타임" 언급 모두 제거
5. **구조**: 
   - 제목: 체험/리뷰 느낌으로 변경
   - 본문: 핵심만 압축 (원본의 40~60% 분량)
   - "직접 해봤더니", "솔직히 말하면", "현실적으로" 같은 체험 표현 사용
6. **절대 금지**: 원본 문장을 그대로 복사하지 마세요. 모든 문장을 새로 작성하세요.

## 출력 형식 (JSON)
{
  "title": "새 제목",
  "summary": "한줄평 (30자 이내)",
  "content": "변환된 본문 (마크다운 없이 순수 텍스트, 줄바꿈만 사용)"
}

JSON만 출력하세요. 다른 텍스트는 출력하지 마세요."""

def read_md_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Extract title from first # heading
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else os.path.basename(filepath).replace('.md', '')
    # Remove frontmatter
    content = re.sub(r'^---[\s\S]*?---\s*', '', content)
    return title, content

def transform_post(title, content):
    # Truncate if too long (save tokens)
    if len(content) > 6000:
        content = content[:6000] + "\n...(이하 생략)"
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"## 원본 제목\n{title}\n\n## 원본 본문\n{content}"}
            ],
            temperature=0.7,
            max_tokens=3000,
        )
        result_text = response.choices[0].message.content.strip()
        # Clean markdown code block if present
        result_text = re.sub(r'^```json\s*', '', result_text)
        result_text = re.sub(r'\s*```$', '', result_text)
        return json.loads(result_text)
    except Exception as e:
        print(f"    Transform error: {e}")
        return None

def upload_to_convex(post_data):
    mutation_url = f"{CONVEX_URL}/api/mutation"
    payload = {
        "path": "posts:create",
        "args": post_data
    }
    try:
        resp = requests.post(mutation_url, json=payload, timeout=10)
        return resp.status_code == 200
    except:
        return False

# Collect all files
all_files = []
for folder in ["digital-life", "digital-skill", "briefing", "money-plus", "mindset"]:
    folder_path = os.path.join(SOURCE_DIR, folder)
    if not os.path.exists(folder_path):
        continue
    for fname in sorted(os.listdir(folder_path)):
        if fname.endswith('.md'):
            all_files.append((folder, os.path.join(folder_path, fname)))

print(f"Total files: {len(all_files)}")
print("=" * 60)

success = 0
fail = 0

for i, (folder, filepath) in enumerate(all_files):
    fname = os.path.basename(filepath)
    category = CATEGORY_MAP.get(folder, "디지털라이프")
    
    print(f"\n[{i+1}/{len(all_files)}] {folder}/{fname}")
    
    # Read original
    title, content = read_md_file(filepath)
    print(f"  Original: {title[:50]}...")
    
    # Transform
    print(f"  Transforming...")
    result = transform_post(title, content)
    
    if not result:
        print(f"  SKIP - transform failed")
        fail += 1
        continue
    
    new_title = result.get("title", title)
    new_summary = result.get("summary", "")
    new_content = result.get("content", "")
    
    if not new_content or len(new_content) < 100:
        print(f"  SKIP - content too short")
        fail += 1
        continue
    
    print(f"  New title: {new_title[:50]}...")
    
    # Upload
    post_data = {
        "title": new_title,
        "toolName": new_title.split("—")[0].split("-")[0].split(":")[0].strip()[:30],
        "category": category,
        "rating": 4,
        "summary": new_summary,
        "content": new_content,
        "pricing": "",
        "authorId": "admin",
        "authorName": "테크 리뷰어",
    }
    
    if upload_to_convex(post_data):
        print(f"  OK!")
        success += 1
    else:
        print(f"  FAIL - upload error")
        fail += 1
    
    # Rate limit
    time.sleep(0.5)

print(f"\n{'=' * 60}")
print(f"Done! Success: {success}, Failed: {fail}, Total: {len(all_files)}")
