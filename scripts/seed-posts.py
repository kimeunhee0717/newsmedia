# -*- coding: utf-8 -*-
import os
import sys
import json
import requests

# Fix encoding
sys.stdout.reconfigure(encoding='utf-8')

CONVEX_URL = None
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
with open(env_path, 'r', encoding='utf-8') as f:
    for line in f:
        if line.startswith('NEXT_PUBLIC_CONVEX_URL='):
            CONVEX_URL = line.strip().split('=', 1)[1]

if not CONVEX_URL:
    print("ERROR: CONVEX_URL not found")
    exit(1)

print(f"Convex URL: {CONVEX_URL}")

# Unsplash free images for each category
POSTS = [
    {
        "title": "ChatGPT 완전 정복 가이드 - 초보자도 바로 쓸 수 있는 AI",
        "toolName": "ChatGPT",
        "category": "AI 챗봇",
        "rating": 5,
        "pricing": "무료 / Plus $20/월",
        "summary": "모르는 게 있으면 물어보세요. 진짜 뭐든 대답해줍니다.",
        "content": """ChatGPT는 OpenAI가 만든 AI 챗봇입니다. 2022년 출시 이후 전 세계에서 가장 많이 사용되는 AI 도구가 되었습니다.

이런 분께 추천합니다
- AI를 처음 써보시는 분
- 글쓰기, 번역, 요약이 필요한 분
- 코딩 질문이 있는 분
- 아이디어 브레인스토밍이 필요한 분

장점
1. 한국어를 매우 잘 이해합니다
2. 무료로도 충분히 사용할 수 있습니다
3. 대화하듯 자연스럽게 질문하면 됩니다
4. 글쓰기, 코딩, 분석 등 거의 모든 작업이 가능합니다

단점
1. 가끔 틀린 정보를 자신 있게 말합니다 (할루시네이션)
2. 최신 정보는 부정확할 수 있습니다
3. Plus 요금제가 다소 비쌉니다 ($20/월)

활용 팁
"~해줘" 보다 "~의 전문가로서 ~에 대해 설명해줘"처럼 역할을 지정하면 훨씬 좋은 답변을 받을 수 있습니다.

총평: AI 입문자가 가장 먼저 써봐야 할 도구입니다. 무료 버전만으로도 충분히 가치 있습니다.""",
        "imageUrl": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
    },
    {
        "title": "Midjourney로 AI 그림 그리기 - 누구나 아티스트가 될 수 있다",
        "toolName": "Midjourney",
        "category": "이미지 생성",
        "rating": 5,
        "pricing": "Basic $10/월",
        "summary": "글로 설명하면 AI가 그림을 그려줍니다. 퀄리티가 미쳤습니다.",
        "content": """Midjourney는 텍스트를 입력하면 AI가 이미지를 생성해주는 도구입니다. Discord에서 사용하다가 최근 웹 버전도 출시되었습니다.

이런 분께 추천합니다
- 블로그/SNS용 이미지가 필요한 분
- 디자인 감각은 있지만 그림 실력이 없는 분
- 프레젠테이션에 고퀄리티 이미지를 넣고 싶은 분

장점
1. 이미지 퀄리티가 압도적입니다
2. 영어로 "a cat sitting on a cloud"처럼 간단히 입력하면 됩니다
3. 4장의 이미지를 동시에 생성해서 선택할 수 있습니다
4. 스타일 지정이 가능합니다 (유화풍, 사진풍, 일러스트 등)

단점
1. 무료 플랜이 없습니다 (최소 $10/월)
2. 한국어 프롬프트는 영어보다 결과가 떨어집니다
3. 정확한 텍스트를 이미지에 넣기 어렵습니다
4. 사람 손가락이 가끔 이상하게 나옵니다

활용 팁
영어 프롬프트 끝에 "--ar 16:9"를 붙이면 와이드 비율로, "--v 6"을 붙이면 최신 모델로 생성됩니다.

총평: AI 이미지 생성의 최강자. 월 $10이 아깝지 않은 퀄리티입니다.""",
        "imageUrl": "https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=800&q=80"
    },
    {
        "title": "Cursor 에디터 - AI가 코드를 대신 짜주는 시대",
        "toolName": "Cursor",
        "category": "코딩 도구",
        "rating": 4,
        "pricing": "무료 / Pro $20/월",
        "summary": "코딩 초보도 AI한테 시키면 앱을 만들 수 있습니다.",
        "content": """Cursor는 AI가 내장된 코드 에디터입니다. VS Code를 기반으로 만들어져서 익숙한 환경에서 AI의 도움을 받을 수 있습니다.

이런 분께 추천합니다
- 코딩을 배우고 있는 초보 개발자
- 반복적인 코드 작성이 지겨운 분
- 빠르게 프로토타입을 만들고 싶은 분

장점
1. "이 기능 만들어줘"라고 말하면 AI가 코드를 작성합니다
2. 기존 코드를 이해하고 수정 제안을 해줍니다
3. 에러가 나면 원인과 해결책을 알려줍니다
4. VS Code와 거의 동일한 인터페이스라 적응이 쉽습니다

단점
1. 무료 버전은 AI 사용 횟수 제한이 있습니다
2. 가끔 엉뚱한 코드를 생성하기도 합니다
3. 대규모 프로젝트에서는 컨텍스트 이해가 부족할 수 있습니다

활용 팁
Ctrl+K로 인라인 편집, Ctrl+L로 사이드 채팅을 활용하세요. 코드 전체를 선택하고 "리팩토링해줘"라고 하면 코드 품질이 올라갑니다.

총평: 코딩의 진입 장벽을 확 낮춰주는 도구. 초보자에게 특히 추천합니다.""",
        "imageUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
    },
    {
        "title": "Notion AI - 메모앱이 AI 비서로 진화했다",
        "toolName": "Notion AI",
        "category": "생산성",
        "rating": 4,
        "pricing": "무료 / AI 추가 $10/월",
        "summary": "메모, 문서, 프로젝트 관리를 AI가 도와줍니다. 업무 효율이 2배!",
        "content": """Notion은 이미 인기 있는 올인원 워크스페이스 앱이었는데, 여기에 AI 기능이 추가되면서 더욱 강력해졌습니다.

이런 분께 추천합니다
- 문서 작업이 많은 분
- 회의록 정리가 필요한 분
- 프로젝트/일정 관리를 하는 분
- 글쓰기를 자주 하는 분

장점
1. 기존 Notion 문서에서 바로 AI를 호출할 수 있습니다
2. 긴 문서를 한 줄로 요약해줍니다
3. 회의록에서 액션 아이템을 자동 추출합니다
4. 한국어 지원이 우수합니다
5. 표 만들기, 번역, 톤 변경 등 다양한 기능

단점
1. AI 기능은 추가 요금 ($10/월)
2. ChatGPT처럼 자유로운 대화는 안 됩니다
3. Notion을 안 쓰시는 분은 진입 장벽이 있습니다

활용 팁
스페이스바를 누르면 AI가 나타납니다. "이 페이지 요약해줘", "영어로 번역해줘", "더 친근한 톤으로 바꿔줘" 등 다양하게 활용하세요.

총평: 이미 Notion을 쓰고 있다면 AI 추가는 필수입니다. 문서 작업 속도가 확실히 빨라집니다.""",
        "imageUrl": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80"
    },
    {
        "title": "Perplexity AI - 구글 검색의 미래는 이런 모습일까?",
        "toolName": "Perplexity AI",
        "category": "기타",
        "rating": 4,
        "pricing": "무료 / Pro $20/월",
        "summary": "검색하면 AI가 답변을 정리해주고, 출처까지 알려줍니다.",
        "content": """Perplexity AI는 AI 기반 검색 엔진입니다. 구글처럼 검색하면 AI가 여러 출처를 분석해서 깔끔하게 답변을 정리해줍니다.

이런 분께 추천합니다
- 정보 검색을 자주 하는 분
- ChatGPT의 할루시네이션이 걱정되는 분
- 출처가 명확한 답변이 필요한 분
- 최신 정보가 필요한 분

장점
1. 답변에 반드시 출처(링크)를 표시합니다
2. 최신 정보를 실시간으로 검색합니다
3. 후속 질문을 자동으로 제안해줍니다
4. 무료 버전도 매우 유용합니다
5. 한국어 질문에 한국어로 답변합니다

단점
1. 창작이나 글쓰기는 ChatGPT가 더 낫습니다
2. Pro 버전이 $20/월로 비싼 편입니다
3. 아직 한국 관련 정보는 부족할 때가 있습니다

활용 팁
"Focus" 기능으로 검색 범위를 지정할 수 있습니다. Academic(논문), YouTube(영상), Reddit(커뮤니티) 등에서만 검색 가능합니다.

총평: AI 답변이 불안한 분께 강력 추천. 출처 확인이 가능한 AI 검색의 새로운 기준입니다.""",
        "imageUrl": "https://images.unsplash.com/photo-1555952494-efd681c7e3f9?w=800&q=80"
    }
]

for i, post_data in enumerate(POSTS):
    print(f"\n[{i+1}/5] {post_data['category']}: {post_data['toolName']}")
    
    mutation_url = f"{CONVEX_URL}/api/mutation"
    payload = {
        "path": "posts:create",
        "args": {
            "title": post_data["title"],
            "toolName": post_data["toolName"],
            "category": post_data["category"],
            "rating": post_data["rating"],
            "summary": post_data["summary"],
            "content": post_data["content"],
            "pricing": post_data["pricing"],
            "imageUrl": post_data["imageUrl"],
            "authorId": "admin",
            "authorName": "AI 도구 리뷰어",
        }
    }
    
    try:
        resp = requests.post(mutation_url, json=payload)
        if resp.status_code == 200:
            print(f"  OK - post created!")
        else:
            print(f"  FAIL: {resp.status_code} {resp.text}")
    except Exception as e:
        print(f"  FAIL: {e}")

print("\nDone!")
