# ComfyUI 다중인물 표현 완전 정복
## 10강 완성 커리큘럼

> 작성일: 2026-02-23
> 대상: ComfyUI 기초 사용 가능한 중급자 이상
> 목표: 다중인물 생성을 안정적으로 반복 재현할 수 있는 워크플로우 완성

---

## 전체 커리큘럼 구성

| 강 | 제목 | 핵심 도구 | 난이도 |
|----|------|----------|--------|
| 1강 | 왜 항상 실패하는가 — 원리부터 이해하기 | 개념 이해 | ⭐ |
| 2강 | Regional Prompter 완전 정복 | Regional Prompter | ⭐⭐ |
| 3강 | ControlNet으로 포즈 고정하기 | OpenPose / DWPose | ⭐⭐ |
| 4강 | IP-Adapter로 캐릭터 일관성 만들기 | IP-Adapter | ⭐⭐⭐ |
| 5강 | 캐릭터 시트 — 주인공과 조연 세팅 | IP-Adapter + 프롬프트 | ⭐⭐ |
| 6강 | 실전 프로젝트 1 — 로맨스/액션 투샷 | OpenPose + Depth + IP-Adapter | ⭐⭐⭐ |
| 7강 | 실전 프로젝트 2 — 그룹/팀 화보 (3~4명) | Regional Prompter + ControlNet | ⭐⭐⭐ |
| 8강 | 실전 프로젝트 3 — 군중 속 주인공 DOF 연출 | Mask + Depth + 프롬프트 | ⭐⭐⭐ |
| 9강 | 후보정 완전 정복 — FaceDetailer, Tile, Upscale | Impact Pack + ControlNet Tile | ⭐⭐⭐ |
| 10강 | 트러블슈팅 오답 노트 — 증상별 처방전 | 전체 통합 | ⭐⭐ |

---

---

# 1강. 왜 항상 실패하는가 — 원리부터 이해하기

## 학습 목표
- 다중인물 생성이 어려운 이유를 구조적으로 이해한다
- 실패의 3대 원인을 파악하고 해결 방향을 설정한다
- 이후 강의에서 사용할 도구의 역할을 미리 파악한다

---

## 1-1. 디퓨전 모델이 텍스트를 처리하는 방식

ComfyUI에서 사용하는 Stable Diffusion 계열 모델은 텍스트 프롬프트를 다음 순서로 처리합니다.

```
[텍스트 입력]
     ↓
[CLIP 텍스트 인코더 — 토큰화]
     ↓
[Cross-Attention — 토큰이 이미지 어느 픽셀에 영향 줄지 결정]
     ↓
[노이즈 제거 과정 — UNet]
     ↓
[VAE 디코딩 — 최종 이미지]
```

여기서 핵심은 **Cross-Attention** 단계입니다. 각 토큰이 이미지의 특정 픽셀에 영향을 주는데, 이 영향 범위가 기본적으로 **이미지 전체**에 걸쳐 퍼집니다.

즉, `red hair`라는 토큰은 이미지 오른쪽 인물에만 영향을 주지 않고 이미지 전체에 영향을 줍니다. `blue hair`도 마찬가지입니다. 두 토큰이 전체 이미지에서 경쟁하면 결과는 예측 불가능합니다.

---

## 1-2. 실패의 3대 원인

### 원인 1: 프롬프트 충돌 (Prompt Conflict)

**현상**: 빨간 머리를 A에게, 파란 머리를 B에게 지정했는데 둘 다 보라색 머리가 됨

**이유**: Cross-Attention이 두 색상을 공간 분리 없이 혼합함

**해결 방향**: Regional Prompter로 프롬프트 영향 범위를 공간적으로 분리 → **2강**

---

### 원인 2: 포즈 혼선 (Pose Confusion)

**현상**: 두 인물이 포옹하는 포즈를 원했는데 팔이 세 개가 됨

**이유**: ControlNet이 여러 인물의 키포인트(관절 위치)를 혼동함

**해결 방향**: DWPose + Depth 맵으로 신체 소유권 분리 → **3강**

---

### 원인 3: 캐릭터 미고정 (Character Inconsistency)

**현상**: 같은 프롬프트를 써도 생성할 때마다 얼굴이 달라짐

**이유**: 텍스트 프롬프트는 외모의 방향성만 제시할 뿐, 구체적 외형을 고정하지 못함

**해결 방향**: IP-Adapter로 이미지 참조 기반 외형 고정 → **4강**

---

## 1-3. 이후 강의에서 사용하는 도구 개요

| 도구 | 역할 | 강 |
|------|------|---|
| Regional Prompter | 프롬프트를 공간별로 분리 적용 | 2강 |
| ControlNet OpenPose | 인물 포즈 스켈레톤으로 고정 | 3강 |
| ControlNet DWPose | OpenPose보다 정확한 다중인물 포즈 | 3강 |
| ControlNet Depth | 공간 깊이(원근감) 제어 | 3강, 6강 |
| IP-Adapter | 참조 이미지 기반 외형 고정 | 4강 |
| FaceDetailer | 생성 후 얼굴 디테일 보완 | 9강 |
| ControlNet Tile | 전체 이미지 톤 통합 후보정 | 9강 |

---

## 1-4. 환경 준비 체크리스트

이 강의 시리즈를 따라하려면 아래가 모두 설치되어 있어야 합니다.

```
필수 설치 목록:
□ ComfyUI (최신 버전)
□ ComfyUI Manager
□ ComfyUI_IPAdapter_plus
□ ComfyUI-Advanced-ControlNet
□ ComfyUI Impact Pack (FaceDetailer 포함)
□ comfyui-nodes-docs 또는 Regional Prompter

필수 모델 파일:
□ 베이스 체크포인트 1개 이상
   - 실사: RealisticVision_V6.safetensors
   - 애니: AnythingV5.safetensors 또는 CounterfeitV3.safetensors
□ ControlNet 모델
   - control_v11p_sd15_openpose.pth
   - control_v11f1p_sd15_depth.pth
   - control_v11f1e_sd15_tile.pth
□ IP-Adapter 모델
   - ip-adapter-plus_sd15.bin
   - ip-adapter-plus-face_sd15.bin
□ CLIP Vision
   - CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors
□ Detection 모델 (FaceDetailer용)
   - face_yolov8n.pt

모델 저장 위치:
checkpoints   → ComfyUI/models/checkpoints/
ControlNet    → ComfyUI/models/controlnet/
IP-Adapter    → ComfyUI/models/ipadapter/
CLIP Vision   → ComfyUI/models/clip_vision/
Detection     → ComfyUI/models/ultralytics/bbox/
```

---

## 1강 핵심 요약

```
✅ 디퓨전 모델은 프롬프트를 공간 구분 없이 전체 이미지에 적용한다
✅ 실패 원인: 프롬프트 충돌 / 포즈 혼선 / 캐릭터 미고정
✅ 해결 도구: Regional Prompter / ControlNet / IP-Adapter
✅ 2강부터 각 도구를 순서대로 실습한다
```

---
---

# 2강. Regional Prompter 완전 정복

## 학습 목표
- Regional Prompter의 원리와 동작 방식을 이해한다
- 2인 구도의 기본 세팅을 처음부터 끝까지 직접 구성한다
- 각 파라미터의 역할을 파악하고 상황에 맞게 조절한다

---

## 2-1. Regional Prompter란 무엇인가

Regional Prompter는 이미지를 여러 영역으로 분할하고, 각 영역에 독립적인 프롬프트 조건을 적용하는 ComfyUI 커스텀 노드입니다.

**핵심 원리**: 각 영역에 별도의 Cross-Attention 조건을 주입해서 프롬프트 충돌을 차단합니다.

```
[이미지 영역 분할]
┌──────────┬──────────┐
│  영역 1  │  영역 2  │
│ 프롬프트 │ 프롬프트 │
│    A     │    B     │
└──────────┴──────────┘
베이스 프롬프트 (전체 적용)
```

---

## 2-2. 노드 연결 구조

Regional Prompter를 사용하는 기본 워크플로우 구조입니다.

```
[Load Checkpoint] ──→ model, clip, vae
                          │
         clip ────────────┼────────────────────────┐
                          │                        │
              [CLIPTextEncode] (베이스)             │
              [CLIPTextEncode] (영역1)              │
              [CLIPTextEncode] (영역2)              │
                          │                        │
              [Regional Prompter] ◄────────────────┘
                          │
                     conditioning
                          │
              [KSampler] ◄──── model
                          │
              [VAE Decode]
                          │
              [Save Image]
```

**노드별 역할 정리**

| 노드 | 입력 | 출력 | 역할 |
|------|------|------|------|
| CLIPTextEncode (베이스) | clip, 베이스 텍스트 | conditioning | 전체 이미지 공통 조건 |
| CLIPTextEncode (영역1) | clip, 영역1 텍스트 | conditioning | 왼쪽 인물 조건 |
| CLIPTextEncode (영역2) | clip, 영역2 텍스트 | conditioning | 오른쪽 인물 조건 |
| Regional Prompter | 위 3개 conditioning | conditioning | 영역별 조건 합성 |

---

## 2-3. 주요 파라미터 상세 설명

### mode (분할 방식)

```
Columns  → 좌우 수직 분할 (2인 나란히 서 있는 구도에 사용)
Rows     → 상하 수평 분할 (원경/근경 분리, 앉은 인물과 선 인물 구분 등)
Mask     → 자유형 마스크 (원하는 형태로 영역 직접 지정)
Prompt   → 프롬프트 내부 구분자로 영역 지정 (고급 사용법)
```

### ratios (영역 비율)

```
형식: "숫자,숫자,숫자..." (쉼표로 구분, 각 영역의 상대적 크기)

예시:
  "1,1"     → 50% / 50% (2인 동등 분할)
  "1,2"     → 33% / 67% (오른쪽 인물 강조)
  "2,1"     → 67% / 33% (왼쪽 인물 강조)
  "1,1,1"   → 33% / 33% / 33% (3인 동등 분할)
  "1,1.5,1" → 25% / 37.5% / 25% (가운데 인물 강조)
```

### base_ratio (베이스 프롬프트 영향력)

```
범위: 0.0 ~ 1.0
권장값: 0.1 ~ 0.25

낮을수록: 영역별 프롬프트 영향 강해짐 (인물 특징 더 잘 분리됨)
높을수록: 베이스 프롬프트 영향 강해짐 (영역 경계가 흐려질 수 있음)

실전 팁: 0.2 로 시작해서 결과 보며 조절
```

### use_base_prompt (베이스 프롬프트 사용 여부)

```
True  → 베이스 프롬프트를 전체 이미지에 먼저 적용 후 영역 조건 적용
False → 영역 조건만 적용
권장: True (배경, 품질 태그는 베이스에 넣는 것이 효과적)
```

---

## 2-4. 첫 번째 실습: 2인 기본 구도

**목표**: 빨간 머리 소녀(왼쪽)와 파란 머리 소년(오른쪽)이 나란히 서 있는 이미지 생성

### Step 1 — 세팅값 확인

```
[기본 세팅]
베이스 모델: RealisticVision_V6 (실사) 또는 AnythingV5 (애니)
해상도: 832 x 512
샘플러: DPM++ 2M Karras
Steps: 25
CFG Scale: 7.0
Seed: 아무 값 (랜덤)
```

### Step 2 — 프롬프트 작성

```
[베이스 프롬프트]
(masterpiece, best quality, highres), 2 people, standing side by side,
city street background, afternoon sunlight, full body shot, looking at viewer

[왼쪽 영역 — 인물 A]
1girl, red hair, long wavy hair, white blouse, jeans, warm smile,
bright eyes, slim figure

[오른쪽 영역 — 인물 B]
1boy, blue short hair, navy hoodie, black pants, neutral expression,
tall, athletic build

[네거티브 프롬프트 (공통)]
(worst quality, low quality:1.4), bad anatomy, extra limbs, extra faces,
merged characters, duplicate, deformed, disfigured, watermark,
(3 people:1.3), (4 people:1.3)
```

### Step 3 — Regional Prompter 세팅

```
mode: Columns
ratios: 1,1
base_ratio: 0.2
use_base_prompt: True
```

### Step 4 — 생성 결과 점검 항목

```
□ 두 인물이 명확히 분리되어 있는가
□ 왼쪽 인물이 빨간 머리인가
□ 오른쪽 인물이 파란 머리인가
□ 옷 색상이 바뀌거나 섞이지 않았는가
□ 인물 수가 정확히 2명인가
```

---

## 2-5. base_ratio 조절 실험

같은 프롬프트에서 base_ratio만 바꿔가며 차이를 관찰합니다.

```
base_ratio: 0.05 → 영역 프롬프트 강하게 적용, 경계 선명
base_ratio: 0.2  → 균형 잡힌 결과 (권장 시작값)
base_ratio: 0.5  → 베이스 프롬프트 영향 강함, 영역 프롬프트 약해짐
base_ratio: 0.8  → 영역 분리 거의 안 됨 (사용하지 않음)
```

**실전 결론**: 인물 특징 분리가 목적이라면 **0.15 ~ 0.25** 범위가 최적입니다.

---

## 2-6. 3인 구도 세팅

2인 구도를 이해했다면 3인으로 확장합니다.

```
[3인 세팅 변경점]
mode: Columns
ratios: 1,1,1  (또는 가운데 강조: 1,1.5,1)
base_ratio: 0.15
CLIPTextEncode 노드 1개 추가 (영역3)

[영역 추가 프롬프트 예시 — 가운데 인물]
1girl, silver hair, bob cut, red dress, confident expression,
center position, eye contact
```

---

## 2-7. Mask 모드 활용 (고급)

Columns/Rows로 해결이 안 되는 복잡한 구도에는 Mask 모드를 사용합니다.

**언제 사용하는가**
- 인물이 화면 정중앙에 크게 배치되고 조연이 측면에 있을 때
- 원형/대각선 구도로 인물을 배치할 때
- 인물 하나가 화면의 2/3를 차지하는 비대칭 구도

**마스크 이미지 만들기**

```
1. 이미지 편집 툴(Krita, Photoshop, Paint)에서 캔버스 열기
   → 생성할 이미지와 동일한 해상도 (예: 832x512)

2. 흰색(255,255,255)으로 영역 1 칠하기
   검은색(0,0,0)으로 영역 2 칠하기

3. 저장 후 ComfyUI에서 Load Image 노드로 불러오기

4. Regional Prompter mode를 Mask로 설정하고 마스크 이미지 연결
```

---

## 2강 핵심 요약

```
✅ Regional Prompter는 이미지를 영역으로 나눠 프롬프트를 독립 적용한다
✅ base_ratio: 0.15~0.25 권장
✅ ratios로 각 인물의 화면 비중 조절
✅ 2인: Columns + ratios "1,1" / 3인: ratios "1,1,1"
✅ 복잡한 구도는 Mask 모드로 직접 영역 지정
```

---
---

# 3강. ControlNet으로 포즈 고정하기

## 학습 목표
- OpenPose와 DWPose의 차이를 이해하고 적절히 선택한다
- 포즈 참조 이미지를 준비하는 3가지 방법을 익힌다
- Depth 맵을 활용해 공간감과 신체 겹침을 처리한다

---

## 3-1. OpenPose vs DWPose

두 방식 모두 인물의 포즈를 스켈레톤(관절 키포인트)으로 추출해 ControlNet에 입력합니다.

```
[OpenPose]
장점: 속도 빠름, 단순한 포즈에 적합
단점: 다중인물에서 관절 혼동 자주 발생
      손가락 세부 정보 없음
사용 시기: 단일 인물 또는 인물 간 거리가 충분한 단순 포즈

[DWPose]
장점: 다중인물 각각의 키포인트를 더 정확하게 분리
      손가락, 발 키포인트 포함 (상세 포즈 가능)
단점: 처리 속도가 OpenPose보다 약간 느림
사용 시기: 두 인물 이상, 신체 접촉/겹침이 있는 복잡한 포즈
권장: 다중인물에서는 항상 DWPose 사용
```

---

## 3-2. 포즈 참조 이미지 준비 방법 3가지

### 방법 1: 기존 사진에서 포즈 추출

이미 원하는 포즈에 가까운 사진을 레퍼런스로 사용합니다.

**적합한 레퍼런스 이미지 조건**:
```
✅ 두 인물 사이에 명확한 공간이 있음 (겹침 최소화)
✅ 전신 또는 상반신이 모두 보임
✅ 밝고 배경과 인물이 잘 구분됨
✅ 원하는 포즈와 유사한 팔다리 배치
❌ 두 인물이 너무 붙어 있는 사진 (키포인트 혼동)
❌ 어둡거나 흐릿한 사진
```

**ComfyUI에서 추출 과정**:
```
1. Load Image 노드 → 레퍼런스 사진 불러오기
2. DWPose Estimator 노드 연결 (controlnet_aux)
   - detect_hand: True
   - detect_body: True
   - detect_face: True
3. PreviewImage 노드로 추출된 포즈 확인
4. Apply ControlNet 노드에 연결
```

---

### 방법 2: 포즈 에디터 직접 조작

`ComfyUI Pose Editor` 확장을 사용해 캔버스에서 직접 포즈를 제작합니다.

**설치**:
```
ComfyUI Manager → "openpose editor" 검색 → 설치
```

**사용법**:
```
1. 노드 추가: OpenPose Editor
2. 에디터 창에서 Add Person 클릭 → 인물 추가
3. 각 관절(동그라미) 드래그로 원하는 포즈 구성
4. 다중인물: Add Person 반복 → 인물별 포즈 독립 설정
5. 저장 → ControlNet 입력으로 사용
```

**포즈 에디터 활용 팁**:
```
- 두 인물 생성 시 두 스켈레톤을 원하는 위치에 배치
- 인물 간 충분한 간격 유지 (최소 어깨 너비)
- 손을 표현할 경우 hand 키포인트도 설정
```

---

### 방법 3: 3D 포즈 툴 활용

웹 기반 3D 포즈 툴로 가장 정밀한 포즈 제작이 가능합니다.

**추천 도구**:
```
Posemy.art (웹, 무료)
  → 3D 인물 모델을 자유롭게 회전/배치
  → 복수 인물 추가 가능
  → 스크린샷 → DWPose로 추출 → ControlNet 입력

Magic Poser (앱, 일부 유료)
  → 더 사실적인 인물 모델
  → 소품(의자, 테이블 등) 배치 가능
```

---

## 3-3. ControlNet 노드 세팅

### Apply ControlNet 노드 파라미터

```
[strength] (영향력)
  범위: 0.0 ~ 1.0
  OpenPose 권장: 0.75 ~ 0.85
  DWPose 권장: 0.70 ~ 0.80
  낮으면: 포즈 무시됨 / 높으면: 포즈가 딱딱하고 부자연스러움

[start_percent] (ControlNet 시작 시점)
  범위: 0.0 ~ 1.0
  권장: 0.0 (처음부터 포즈 적용)

[end_percent] (ControlNet 종료 시점)
  범위: 0.0 ~ 1.0
  권장: 0.75 ~ 0.85
  설명: 생성 후반부(디테일 단계)에서 ControlNet을 끊어야 자연스러운 결과
  0.85 이상: 포즈는 정확하지만 경직된 느낌
  0.70 이하: 포즈 일부 무시될 수 있음
```

### 실전 권장 세팅 (DWPose 기준)

```
프리프로세서: DWPose
ControlNet 모델: control_v11p_sd15_openpose.pth
strength: 0.75
start_percent: 0.0
end_percent: 0.80
```

---

## 3-4. Depth 맵 활용

Depth 맵은 이미지의 원근감(깊이 정보)을 회색조로 표현한 이미지입니다.

```
흰색(255) = 카메라에 가장 가까운 부분
검은색(0)  = 가장 멀리 있는 부분 (배경)
회색 계열  = 중간 거리
```

**언제 Depth를 추가하는가**:
```
✅ 두 인물 중 한 명이 앞에, 한 명이 뒤에 있는 원근 구도
✅ 인물들이 테이블/소파 등 소품과 상호작용하는 씬
✅ 신체 접촉이 있어 팔다리 겹침이 발생하는 씬
✅ 배경의 공간감이 중요한 씬
```

**자동 Depth 추출**:
```
1. Load Image 노드 → 레퍼런스 이미지
2. MiDaS Depth Estimator 또는 LeReS Depth Estimator 연결
3. PreviewImage로 Depth 맵 확인
4. Apply ControlNet (Depth 모델)에 연결
```

**수동 Depth 맵 제작 (꿀팁)**:

자동 추출 결과가 부정확할 때, 간단하게 손으로 그립니다.

```
1. 이미지 편집 툴에서 새 캔버스 (생성 해상도와 동일)
2. 배경부터 채색:
   - 하늘/먼 배경: 검은색(20~40)
   - 중간 거리 배경: 어두운 회색(60~100)
3. 인물 채색:
   - 뒤쪽 인물: 중간 회색(120~160)
   - 앞쪽 인물: 밝은 회색(180~220)
   - 카메라에 가장 가까운 부위(손, 발 등): 흰색(240~255)
4. 저장 → ControlNet Depth 입력으로 사용

제작 시간: 5~10분
효과: 자동 추출 대비 훨씬 정확한 공간감 표현 가능
```

---

## 3-5. OpenPose + Depth 동시 적용

두 ControlNet을 동시에 사용하면 포즈와 공간감을 함께 제어합니다.

```
[ControlNet 체인 연결]
Apply ControlNet (OpenPose/DWPose)
  ↓ conditioning 출력
Apply ControlNet (Depth)
  ↓ conditioning 출력
KSampler

[각 세팅]
DWPose: strength 0.75, end_percent 0.80
Depth:  strength 0.50, end_percent 0.85
(Depth는 OpenPose보다 약하게 설정 — 보조 역할)
```

---

## 3강 핵심 요약

```
✅ 다중인물에는 OpenPose보다 DWPose가 더 정확하다
✅ 포즈 이미지 준비: 사진 추출 / 포즈 에디터 / 3D 툴 3가지 방법
✅ strength 0.75, end_percent 0.80이 기본 권장값
✅ 신체 접촉/겹침이 있는 씬에는 Depth 맵 추가
✅ 수동 Depth 맵 제작은 5~10분으로 정확도를 높이는 꿀팁
```

---
---

# 4강. IP-Adapter로 캐릭터 일관성 만들기

## 학습 목표
- IP-Adapter의 원리와 두 가지 모드(전체/얼굴)를 이해한다
- 참조 이미지를 올바르게 준비하는 방법을 익힌다
- 다중인물에서 각 인물에 다른 참조 이미지를 독립 적용한다
- weight와 noise 파라미터를 조절해 최적 결과를 찾는다

---

## 4-1. IP-Adapter란 무엇인가

IP-Adapter는 텍스트 대신 **이미지**로 생성 결과를 제어하는 도구입니다.

```
[기존 방식]
텍스트 프롬프트 → "red hair, brown eyes, oval face" → 매번 다른 얼굴

[IP-Adapter 방식]
참조 이미지 → CLIP Vision 인코더 → 이미지 특징 추출
                                          ↓
                              생성 과정에 직접 주입 → 참조 이미지와 유사한 결과
```

**IP-Adapter가 참조하는 것들**:
```
ip-adapter-plus_sd15.bin       → 전체 스타일, 색감, 구도 참조
ip-adapter-plus-face_sd15.bin  → 얼굴 특징에 특화 (얼굴 일관성 유지)
```

다중인물 작업에서는 두 가지를 상황에 따라 선택하거나 조합합니다.

---

## 4-2. 참조 이미지 준비 가이드

IP-Adapter의 결과 품질은 참조 이미지 품질에 직결됩니다.

**좋은 참조 이미지 조건**:

```
✅ 얼굴이 이미지의 30~50% 이상 차지 (너무 작으면 특징 추출 부정확)
✅ 정면 또는 약간 측면 (45도 이상 측면은 피함)
✅ 밝고 고화질 (흐릿하거나 압축된 이미지는 결과 품질 저하)
✅ 단순한 배경 (흰 배경이 가장 좋음 — 인물 특징만 추출)
✅ 조명이 균일하게 얼굴을 비춤

❌ 피해야 할 조건:
  - 얼굴이 작거나 멀리 있는 이미지
  - 선글라스, 마스크 등으로 얼굴이 가려진 이미지
  - 극단적인 측면 프로필 (귀만 보이는 각도)
  - 그룹 사진 (다른 인물의 특징이 혼입될 수 있음)
```

**참조 이미지 직접 생성하는 방법**:

참조 이미지가 없다면 먼저 원하는 캐릭터를 단독으로 생성합니다.

```
프롬프트 예시 (참조 이미지 생성용):
(masterpiece, best quality, highres), 1girl, [원하는 헤어], [원하는 눈],
[원하는 얼굴형], portrait, close up, white background, front view,
soft studio lighting, sharp focus

해상도: 512x512 또는 768x768
Steps: 30 (평소보다 높게 — 디테일 중요)
CFG: 6.5~7.0
```

마음에 드는 결과가 나오면 그 이미지를 IP-Adapter 참조 이미지로 사용합니다.

---

## 4-3. IP-Adapter 노드 연결 구조

```
[CLIP Vision 로드]
Load CLIP Vision ──→ clip_vision

[IP-Adapter 모델 로드]
Load IPAdapter Model ──→ ipadapter

[참조 이미지]
Load Image ──→ image

[적용]
IPAdapter Apply ◄── model (from checkpoint)
                ◄── ipadapter
                ◄── clip_vision
                ◄── image (참조 이미지)
      ↓
   model (IP-Adapter 적용된 모델)
      ↓
   KSampler
```

---

## 4-4. 핵심 파라미터 상세

### weight (영향력)

```
범위: 0.0 ~ 1.0 (일부 노드는 1.5까지)
권장 범위: 0.55 ~ 0.80

0.3 이하 → 참조 이미지 거의 반영 안 됨 (의미 없음)
0.55     → 참조 이미지 적당히 반영, 텍스트 프롬프트와 균형
0.70     → 참조 이미지 강하게 반영, 얼굴 일관성 좋음 (권장)
0.85 이상 → 참조 이미지가 너무 강해 포즈/배경이 왜곡될 수 있음
1.0      → 참조 이미지를 거의 복사하는 수준 (원하는 씬과 달라질 수 있음)

실전 팁: 0.65로 시작 → 결과 보며 ±0.05씩 조절
```

### noise (노이즈 주입)

```
범위: 0.0 ~ 1.0
권장: 0.0 ~ 0.15

0.0  → 참조 이미지를 가장 충실하게 재현 (뻣뻣할 수 있음)
0.1  → 약간의 변주 허용, 자연스러운 결과
0.3+ → 참조 이미지에서 많이 벗어남 (원하는 경우 외 비권장)

실전 팁: 0.05~0.10으로 설정하면 얼굴 유사성은 유지하면서 자연스러운 변주 가능
```

### weight_type (가중치 적용 방식)

```
linear          → 전체 생성 과정에 균일하게 적용 (기본값)
ease in         → 생성 초반에 강하게, 후반에 약하게
ease out        → 생성 초반에 약하게, 후반에 강하게
ease in-out     → 중반에 가장 강하게 (구도는 자유롭게, 디테일에 강하게 반영)

권장: linear (기본) 또는 ease in-out (자연스러운 결과 원할 때)
```

---

## 4-5. 다중인물 — 인물별 IP-Adapter 독립 적용

두 인물에게 각각 다른 참조 이미지를 적용하는 방법입니다.

**핵심 원리**: Regional Prompter와 동일한 마스크를 IP-Adapter에도 적용

```
[마스크 생성]
Solid Mask 노드 (또는 직접 마스크 이미지)
  → 왼쪽 절반 흰색, 오른쪽 절반 검은색 (인물 A용 마스크)
  → 왼쪽 절반 검은색, 오른쪽 절반 흰색 (인물 B용 마스크)

[노드 연결]
IPAdapter Apply (인물 A)
  ← model
  ← ipadapter (face 모델)
  ← clip_vision
  ← image (인물 A 참조)
  ← mask (왼쪽 마스크)
      ↓
   model_A

IPAdapter Apply (인물 B)
  ← model_A
  ← ipadapter (face 모델)
  ← clip_vision
  ← image (인물 B 참조)
  ← mask (오른쪽 마스크)
      ↓
   model_AB (두 인물 IP-Adapter 모두 적용된 모델)
      ↓
   KSampler
```

---

## 4-6. IP-Adapter + Regional Prompter 조합

두 도구를 함께 사용할 때의 역할 분담입니다.

```
Regional Prompter → 프롬프트 영역 분리 (옷, 헤어색, 표정 등 텍스트 속성)
IP-Adapter        → 이미지 기반 얼굴/스타일 고정 (구체적인 외모)

두 도구가 서로를 보완:
  - Regional Prompter만 → 매번 다른 얼굴이 생성됨
  - IP-Adapter만        → 프롬프트 충돌로 특징이 섞임
  - 둘 다 사용          → 외모 고정 + 특징 분리 동시 달성
```

**주의사항**: IP-Adapter weight가 너무 높으면 Regional Prompter의 분리 효과가 줄어들 수 있습니다. weight 0.65~0.70 범위를 권장합니다.

---

## 4강 핵심 요약

```
✅ IP-Adapter는 텍스트가 아닌 이미지로 외형을 고정한다
✅ 참조 이미지: 얼굴이 30% 이상, 정면, 고화질, 단순 배경
✅ weight: 0.65~0.70 권장 (너무 높으면 포즈/배경 왜곡)
✅ 다중인물: 마스크로 영역 분리 → 인물별 별도 IP-Adapter 적용
✅ Regional Prompter + IP-Adapter 조합이 최강의 다중인물 세팅
```

---
---

# 5강. 캐릭터 시트 만들기 — 주인공과 조연 세팅

## 학습 목표
- 재사용 가능한 캐릭터를 처음부터 끝까지 만든다
- 캐릭터 프롬프트 시트와 참조 이미지를 완성한다
- 주인공과 조연의 시각적 차별화 포인트를 설정한다

---

## 5-1. 캐릭터 시트란 무엇인가

웹툰이나 광고 시리즈물처럼 동일한 캐릭터가 여러 장면에 반복 등장할 때, 매번 새로 설정하는 것은 비효율적이고 일관성도 유지하기 어렵습니다.

캐릭터 시트는 한 번 만들어두면 이후 모든 장면에서 참조하는 **캐릭터 설정 문서**입니다.

**캐릭터 시트 구성요소**:
```
1. 비주얼 레퍼런스 이미지 (정면 기준, 흰 배경)
2. 고정 프롬프트 (매 생성마다 동일하게 사용)
3. 시드값 기록 (같은 모델에서 재현 가능한 경우)
4. IP-Adapter weight 최적값
5. 캐릭터 메모 (설정, 분위기, 사용 시 주의점)
```

---

## 5-2. 주인공 A 캐릭터 시트 만들기

### Step 1 — 캐릭터 콘셉트 정의

```
[주인공 A 설정]
코드명: CHAR_A
성별/나이: 여성, 20대 초반
헤어: 검은색, 어깨 길이, 약간 웨이브
눈: 짙은 갈색, 조금 큰 편, 쌍꺼풀
얼굴형: 갸름한 타원형
피부: 밝은 중간 톤
체형: 슬림, 165cm 정도
시그니처 의상: 흰 셔츠 + 청바지 (기본 복장)
분위기/인상: 친근하고 밝은, 자연스러운 미소
특이사항: 왼쪽 귀 피어싱, 항상 팔찌 착용
```

### Step 2 — 기본 참조 이미지 생성

```
[생성 세팅]
모델: AnythingV5 또는 원하는 베이스 모델
해상도: 512 x 768 (세로형 — 상반신 기준)
Steps: 30
CFG: 6.5
Sampler: DPM++ 2M Karras

[프롬프트]
(masterpiece, best quality, highres), 1girl, 20s,
black wavy hair, shoulder length, dark brown eyes, double eyelids,
oval face, fair skin, white shirt, blue jeans, warm natural smile,
looking at viewer, portrait, upper body, simple white background,
soft studio lighting, front view, sharp focus

[네거티브]
(worst quality, low quality:1.4), bad anatomy, extra limbs,
deformed face, ugly, watermark, text, logo
```

생성 후 **마음에 드는 결과물의 시드값을 반드시 기록**합니다.

### Step 3 — 캐릭터 프롬프트 시트 작성

```
[CHAR_A 고정 프롬프트]
기본: 1girl, black wavy shoulder-length hair, dark brown eyes, oval face
표정 고정: warm smile, natural expression
의상 기본: white shirt, blue jeans
의상 응용: [상황별 변경 가능]
분위기: soft, friendly, approachable
IP-Adapter 참조: char_a_reference.png
IP-Adapter weight: 0.68 (실험 후 조정)
시드값: [기록]
```

---

## 5-3. 조연 B 캐릭터 시트 만들기

조연 B는 주인공 A와 **충분히 차별화**되어야 합니다. 비슷한 특징이 많으면 두 인물이 함께 등장할 때 모델이 혼동합니다.

### 주인공 A vs 조연 B 차별화 설계

```
[차별화 포인트 설계]

요소        주인공 A              조연 B             차이
─────────────────────────────────────────────────────────
헤어 색    검은색              밝은 갈색          명도 대비
헤어 길이  어깨 길이           짧은 단발           길이 차이
헤어 스타일 웨이브              직선 (스트레이트)   질감 차이
눈 색      짙은 갈색            파란색/청회색       색상 차이
눈 크기    큰 편               보통/작은 편        크기 차이
체형       슬림                 조금 더 탄탄한       실루엣 차이
분위기     밝고 친근            쿨하고 차분          인상 차이
시그니처   흰 셔츠 + 청바지     검은 자켓           색상 대비
```

### 조연 B 생성 프롬프트

```
[생성 세팅]
동일 세팅 사용 (해상도, Steps, CFG)

[프롬프트]
(masterpiece, best quality, highres), 1girl, 20s,
light brown short straight hair, bob cut, blue-grey eyes,
slightly smaller eyes, athletic build, black jacket, black pants,
cool expression, serious look, looking at viewer,
portrait, upper body, simple white background,
soft studio lighting, front view, sharp focus

[네거티브]
동일
```

---

## 5-4. 캐릭터 시트 파일 관리

```
[추천 폴더 구조]
📁 characters/
  📁 char_a/
    char_a_reference.png       (기본 참조 이미지)
    char_a_ref_smile.png       (웃는 표정 변형)
    char_a_ref_casual.png      (캐주얼 의상 변형)
    char_a_sheet.txt           (프롬프트 시트)
  📁 char_b/
    char_b_reference.png
    char_b_sheet.txt

[char_a_sheet.txt 내용 예시]
=== CHAR_A 캐릭터 시트 ===
생성일: 2026-02-23
베이스 모델: AnythingV5.safetensors
시드값: 1234567890

기본 프롬프트:
1girl, black wavy shoulder-length hair, dark brown eyes, oval face,
warm smile, white shirt

IP-Adapter:
  모델: ip-adapter-plus-face_sd15.bin
  참조: char_a_reference.png
  weight: 0.68
  noise: 0.05

주의사항:
- 다른 인물과 함께 등장 시 IP-Adapter 마스크 필수
- 의상 변경 시 고정 프롬프트의 헤어/눈/얼굴 특징은 유지
=========================
```

---

## 5-5. 캐릭터 변형 이미지 만들기 (응용)

기본 캐릭터 시트가 완성되면 다양한 상황을 미리 만들어둡니다.

```
만들어두면 유용한 변형 이미지:
□ 기본 정면 (흰 배경)
□ 약간 측면 (30도)
□ 다양한 표정: 웃음 / 진지함 / 놀람
□ 다양한 의상: 캐주얼 / 포멀 / 스포츠
□ 다양한 조명: 밝은 낮 / 저녁 / 실내
```

이 변형 이미지들을 상황에 맞는 IP-Adapter 참조로 사용하면 더욱 자연스러운 결과가 나옵니다.

---

## 5강 핵심 요약

```
✅ 캐릭터 시트 = 참조 이미지 + 고정 프롬프트 + IP-Adapter 세팅
✅ 참조 이미지 생성: Steps 30, CFG 6.5, 흰 배경, 정면
✅ 주인공과 조연: 헤어색/길이/눈색/분위기 등 최소 4가지 차별화
✅ 시드값과 세팅을 반드시 기록해둔다
✅ 변형 이미지(표정/의상/조명) 미리 준비하면 나중에 활용도 높음
```

---
---

# 6강. 실전 프로젝트 1 — 로맨스/액션 투샷

## 학습 목표
- 두 인물이 단순 나란히 서기를 넘어 실제 상호작용하는 씬을 만든다
- 대화/마주보기 씬과 신체 접촉 씬을 각각 완성한다
- DWPose + Depth + IP-Adapter + Regional Prompter 풀 세팅을 구성한다

---

## 6-1. 씬 A: 카페 대화 씬

**최종 목표 이미지**: 카페 테이블을 사이에 두고 서로 마주보며 대화하는 두 인물

### 전체 워크플로우 구성

```
[필요한 노드 목록]
Load Checkpoint (AnythingV5)
CLIPTextEncode × 3 (베이스 / CHAR_A / CHAR_B)
Regional Prompter (Columns, ratios 1,1, base_ratio 0.2)
Load CLIP Vision
Load IPAdapter Model (face) × 2
IPAdapter Apply × 2 (각각 마스크 포함)
Load ControlNet Model × 2 (DWPose, Depth)
Apply ControlNet × 2
KSampler
VAE Decode
Save Image
```

### Step 1 — 포즈 이미지 준비

카페에서 마주보는 포즈 레퍼런스를 준비합니다.

```
포즈 조건:
- 두 인물이 테이블을 사이에 두고 앉아 있음
- 서로 바라보는 방향 (한 명은 왼쪽을 향해, 다른 한 명은 오른쪽을 향해)
- 팔은 테이블 위에 자연스럽게 놓여 있음
- 두 인물 사이에 충분한 공간 (테이블)

추출 방법: DWPose Estimator
```

### Step 2 — Depth 맵 준비

테이블과 두 인물의 공간적 위치를 명확히 합니다.

```
수동 Depth 맵 제작:
배경 (카페 내부): 어두운 회색 (50~70)
테이블: 중간 회색 (100~120)
뒤쪽 인물: 중간 회색 (140~160)
앞쪽 인물 (카메라 쪽): 밝은 회색 (190~210)
```

### Step 3 — 프롬프트 작성

```
[베이스 프롬프트]
(masterpiece, best quality, highres, 8k),
2 girls sitting face to face, wooden table between them,
cozy cafe interior, warm afternoon sunlight through window,
soft bokeh background, potted plants, coffee cups on table,
shallow depth of field, cinematic, full shot

[CHAR_A 영역 — 왼쪽]
1girl, black wavy shoulder-length hair, dark brown eyes,
white shirt, leaning forward, warm smile, engaged in conversation,
elbow on table, looking at the person across

[CHAR_B 영역 — 오른쪽]
1girl, light brown bob cut, blue-grey eyes, black jacket,
relaxed posture, slight smile, listening attentively,
hands wrapped around coffee cup

[네거티브]
(worst quality, low quality:1.4), bad anatomy, extra limbs,
merged faces, deformed hands, extra fingers, watermark,
3 people, solo, ugly, duplicate
```

### Step 4 — 전체 세팅값

```
[생성 세팅]
해상도: 1024 x 768
Steps: 28
CFG Scale: 7.0
Sampler: DPM++ 2M Karras
Seed: 랜덤

[Regional Prompter]
mode: Columns
ratios: 1,1
base_ratio: 0.20

[IP-Adapter (CHAR_A)]
모델: ip-adapter-plus-face_sd15.bin
참조: char_a_reference.png
weight: 0.68
noise: 0.05
마스크: 왼쪽 절반 (0~512px)

[IP-Adapter (CHAR_B)]
모델: ip-adapter-plus-face_sd15.bin
참조: char_b_reference.png
weight: 0.68
noise: 0.05
마스크: 오른쪽 절반 (512~1024px)

[ControlNet 1 — DWPose]
strength: 0.75
start_percent: 0.0
end_percent: 0.80

[ControlNet 2 — Depth]
strength: 0.50
start_percent: 0.0
end_percent: 0.85
```

### Step 5 — 결과 점검 및 조정

```
점검 항목:
□ CHAR_A가 왼쪽에, CHAR_B가 오른쪽에 위치하는가
□ 각 인물의 헤어 색상이 올바른가
□ 테이블이 두 인물 사이에 자연스럽게 배치되었는가
□ 카페 분위기와 따뜻한 조명이 표현되었는가
□ 손/팔의 해부학적 구조가 자연스러운가

문제 발생 시:
  얼굴 섞임 → IP-Adapter 마스크 경계 확인
  포즈 무시 → DWPose strength 0.05 상향 (0.80까지)
  인물 뭉침 → base_ratio 0.15로 낮추기
  손 이상   → 9강 후보정에서 FaceDetailer + 인페인팅으로 처리
```

---

## 6-2. 씬 B: 신체 접촉 씬 (포옹/손잡기)

**최종 목표 이미지**: 두 인물이 포옹하는 장면

이 씬은 신체가 겹치기 때문에 기본 세팅에서 추가 처리가 필요합니다.

### 신체 접촉 씬 전용 추가 세팅

```
[추가 작업: Depth 맵 직접 제작]

포옹 씬 Depth 맵 규칙:
- 뒤에서 안는 인물의 팔: 앞쪽 인물(밝게)과 뒤쪽 인물(어둡게) 사이 중간값
- 안기는 인물의 몸통: 밝게 (카메라에 가깝다고 가정)
- 뒤에서 안는 인물의 몸통: 중간 회색
- 배경: 어둡게

이 Depth 맵을 통해 어느 팔이 앞에 있는지 명확히 지정
```

```
[포옹 씬 프롬프트]
[베이스]
(masterpiece, best quality), 2 girls hugging,
one person hugging from behind, outdoor park, sunset lighting,
warm orange light, romantic atmosphere, cinematic

[앞쪽 인물 — CHAR_A]
1girl, black wavy hair, white shirt,
being hugged, eyes closed, gentle smile, relaxed expression

[뒤쪽 인물 — CHAR_B]
1girl, light brown bob, black jacket,
arms around the other person, chin resting on shoulder,
content expression, eyes slightly closed

[네거티브]
extra arms, fused limbs, tangled limbs, bad anatomy,
(worst quality, low quality:1.4), deformed, merged faces
```

```
[포옹 씬 ControlNet 세팅 조정]
DWPose: strength 0.70 (신체 겹침 있을 때 약간 낮춤)
Depth:  strength 0.65 (겹침 처리에 더 강하게)
Regional Prompter base_ratio: 0.15 (분리 강화)
```

---

## 6-3. 상황별 프롬프트 템플릿 모음

```
[로맨스 씬 기본 템플릿]
상황: [상황 설명]
베이스: (masterpiece, best quality), 2 people,
        [구체적 상황], [장소], [조명], [분위기]
인물1: [CHAR_A 고정 프롬프트], [이 씬에서의 표정/자세]
인물2: [CHAR_B 고정 프롬프트], [이 씬에서의 표정/자세]
키워드: [장르/분위기 키워드]
ControlNet: DWPose 0.75 + Depth 0.50
IP-Adapter: weight 0.68 + 마스크

---

[대화 씬]
배경: [장소], conversational atmosphere, [조명]
인물1 추가: engaged, leaning forward, making eye contact
인물2 추가: listening attentively, nodding, thoughtful expression

[이별 씬]
배경: [장소], bittersweet atmosphere, [시간대] lighting
인물1 추가: turning away, looking back, teary eyes
인물2 추가: reaching out, melancholic expression

[재회 씬]
배경: [장소], joyful atmosphere, bright lighting
인물1 추가: surprised expression, hand over mouth
인물2 추가: wide smile, arms open wide, approaching

[긴장/대립 씬]
배경: [장소], tense atmosphere, dramatic lighting
인물1 추가: arms crossed, stern expression, holding ground
인물2 추가: pointing, confrontational, leaning forward
```

---

## 6강 핵심 요약

```
✅ 대화 씬: Columns 분할 + DWPose 0.75 + Depth 0.50 + IP-Adapter 0.68
✅ 신체 접촉 씬: Depth 맵 직접 제작 필수 + Depth strength 높이기
✅ 포옹 씬: DWPose 0.70(약간 낮춤) + Depth 0.65(높임)
✅ 손/팔 오류는 후보정(9강)으로 최종 처리
✅ 상황별 프롬프트 템플릿을 보관해두고 재활용
```

---
---

# 7강. 실전 프로젝트 2 — 그룹/팀 화보 (3~4명)

## 학습 목표
- 3~4명 이상 그룹 화보의 구도와 세팅을 완성한다
- 의상 통일감을 유지하면서 인물별 차별화를 표현한다
- 해상도와 분할 비율의 관계를 이해하고 최적값을 찾는다

---

## 7-1. 그룹 화보의 구도 유형

```
[2인 구도]
나란히 서기      ██│██
원근 구도        ██  ██  (앞/뒤 배치)

[3인 구도]
나란히 서기      ██│██│██
삼각 구도           ██
                  ██  ██

[4인 구도]
일렬              ██│██│██│██
2×2               ██ ██
                  ██ ██
W자 구도          ██   ██
                    ██ ██   (중앙 2명이 약간 앞으로)
```

---

## 7-2. 3인 그룹 화보 완전 가이드

**목표**: 3인 걸그룹 콘셉트 화보 (올블랙 스트릿 패션, 도심 배경)

### Step 1 — 세팅값

```
[기본 세팅]
해상도: 1152 x 768
(3인 기준 인물 1명당 최소 380px 폭 확보)
Steps: 28
CFG: 7.0
Sampler: DPM++ 2M Karras

[Regional Prompter]
mode: Columns
ratios: 1,1.2,1  (가운데 인물 약간 강조)
base_ratio: 0.15
```

### Step 2 — 프롬프트 작성

```
[베이스]
(masterpiece, best quality, highres), 3 girls standing together,
urban alley, brick wall background, overcast sky,
coordinated black outfits, street fashion concept,
professional group photo, editorial style,
all looking at camera, confident expressions

[왼쪽 인물]
1girl, blonde hair, short bob, bright eyes,
black leather biker jacket, black skinny jeans,
hand on hip, fierce expression, side eye glance

[가운데 인물 — 센터]
1girl, black long straight hair, center position,
black corset top, black wide leg pants, high heels,
direct eye contact, charismatic, commanding presence

[오른쪽 인물]
1girl, red shoulder-length hair, slight wave,
black oversized hoodie, black mini skirt, sneakers,
casual confident pose, bright energetic expression

[네거티브]
(worst quality, low quality:1.4), bad anatomy,
extra limbs, merged faces, 4 people, 5 people,
2 people, solo, deformed, watermark, duplicate characters
```

### Step 3 — 의상 통일감 유지 공식

```
[의상 통일감 레이어 구조]

레이어 1 (베이스에 적용) — 전체 통일 요소:
  coordinated outfits, all black color scheme,
  matching aesthetic, same fashion style

레이어 2 (각 영역 프롬프트에 적용) — 개인 차별화 아이템:
  인물1: black leather biker jacket (재킷)
  인물2: black corset top (탑)
  인물3: black oversized hoodie (후드)

레이어 3 (베이스에 추가) — 분위기 통일:
  editorial photography, professional, cohesive look
```

### Step 4 — 포즈 가이드

3인 그룹에서 자연스러운 포즈를 위한 포즈 에디터 배치 팁:

```
가운데 인물: 화면 정중앙, 약간 앞으로 (카메라에 약간 더 가깝게)
왼쪽 인물: 살짝 왼쪽, 가운데 인물 방향으로 약간 틀기
오른쪽 인물: 살짝 오른쪽, 가운데 인물 방향으로 약간 틀기
세 인물 모두 카메라를 향한 시선

포즈 레퍼런스 키워드로 사진 검색 시:
"girl group concept photo", "kpop idol group photo",
"fashion editorial group", "3 models standing"
```

---

## 7-3. 4인 그룹 화보

```
[4인 세팅]
해상도: 1536 x 768 (인물 1명당 384px)
Regional Prompter: ratios 1,1,1,1
base_ratio: 0.15
CLIPTextEncode 노드 5개 (베이스 + 4인물)
```

**4인 이상에서의 현실적 접근**:

```
IP-Adapter 전략:
  전체 4명에 개별 IP-Adapter 적용: 가능하지만 워크플로우 복잡
  실용적 방법:
    - 주인공 2명: IP-Adapter face 개별 적용 (weight 0.68)
    - 조연 2명: IP-Adapter 없이 프롬프트로만 제어

이렇게 하면:
  - 워크플로우 복잡도 감소
  - 주인공의 얼굴 일관성은 유지
  - 조연은 프롬프트로 충분히 차별화 가능
```

```
[4인 화보 프롬프트 구조]
[베이스] 4 girls, group photo, [콘셉트], [배경], coordinated outfits

[인물1 — 맨 왼쪽] 1girl, [헤어], [의상], [포즈], [표정]
[인물2 — 왼쪽]    1girl, [헤어], [의상], [포즈], [표정]
[인물3 — 오른쪽]  1girl, [헤어], [의상], [포즈], [표정]
[인물4 — 맨 오른쪽] 1girl, [헤어], [의상], [포즈], [표정]

[네거티브] 5 people, 3 people, 2 people, bad anatomy,
           merged faces, duplicate, extra limbs
```

---

## 7-4. 그룹 화보 완성도를 높이는 팁

```
팁 1: 화면 높이 활용
  인물들의 키 차이를 약간 주면 자연스러움
  키가 큰 인물: tall, long legs 추가
  키가 작은 인물: petite, short stature 추가

팁 2: 시선 방향 변주
  모두가 카메라를 보면 딱딱해 보일 수 있음
  한 명은 카메라, 다른 명은 옆을 보게 하면 역동적
  looking at viewer (카메라 시선)
  looking to the side (측면 시선)
  looking down / looking up

팁 3: 포즈 다양성
  서 있는 포즈 혼합:
  standing straight / hand on hip / arms crossed /
  leaning against wall / sitting on ledge

팁 4: 네거티브에 인원수 강화
  "(5 people:1.3), (6 people:1.3)" 추가로 인물 수 폭발 방지
```

---

## 7강 핵심 요약

```
✅ 3인: 해상도 1152x768, ratios 1,1.2,1 (가운데 강조)
✅ 4인: 해상도 1536x768, ratios 1,1,1,1
✅ 의상 통일 = 색상은 베이스에 / 아이템은 개별 영역에
✅ 4인 이상 IP-Adapter: 주인공 2명만 개별 적용, 나머지는 프롬프트
✅ 시선 방향과 포즈 다양성으로 자연스러운 그룹감 연출
```

---
---

# 8강. 실전 프로젝트 3 — 군중 속 주인공 DOF 연출

## 학습 목표
- 피사계 심도(DOF) 연출의 원리를 이해한다
- 주인공에게 포커스를 집중시키고 배경 인물을 흐리는 방법을 익힌다
- Mask 모드와 Depth 맵을 활용한 레이어 기반 씬을 완성한다

---

## 8-1. DOF 연출의 원리

실제 카메라에서 피사계 심도가 얕을 때(조리개 개방) 초점이 맞은 피사체만 선명하고 나머지는 흐릿해집니다. 이 효과를 AI 이미지에서 구현합니다.

```
[DOF 연출 구성 요소]

1. 주인공: 이미지 중앙, 선명한 포커스, 디테일 풍부
2. 배경 인물: 흐릿하게 처리, 움직이는 듯한 느낌
3. 배경 자체: 보케(bokeh) 효과, 빛 번짐

[프롬프트 레이어]
레이어 1 (베이스): 군중 + 배경 + 보케
레이어 2 (포그라운드 마스크): 주인공 포커스
```

---

## 8-2. 씬 설정

**목표 이미지**: 번잡한 도심 거리에서 걷고 있는 주인공. 주변 군중은 흐릿하게 처리되고 주인공만 선명하게 포커스.

```
씬 설명:
배경: 도심 번화가, 저녁 시간
주인공 (CHAR_A): 화면 정중앙, 선명
주변 군중: 흐릿한 실루엣, 운동 블러 효과
조명: 도시 가로등 + 상점 네온사인
분위기: 도시 속 고독, 영화적 감성
```

---

## 8-3. Regional Prompter Mask 모드 세팅

이 씬에서는 Columns 대신 Mask 모드로 주인공 영역만 별도 지정합니다.

### 마스크 이미지 제작

```
[마스크 1 — 주인공 영역]
흰색으로 채울 영역: 화면 중앙 타원형 (상하 전체, 좌우 약 30~40% 폭)
나머지: 검은색

예시 (1024x768 해상도 기준):
  캔버스: 1024 x 768
  흰색 타원: 중심점 (512, 384), 가로 350px, 세로 700px
  나머지: 검은색

이 마스크를 Regional Prompter의 mask 입력으로 연결
→ 마스크 흰색 영역에 주인공 프롬프트 적용
→ 마스크 검은색 영역에 베이스 프롬프트(군중) 적용
```

---

## 8-4. 프롬프트 작성

```
[베이스 프롬프트 — 군중/배경]
(masterpiece, best quality), busy city street at dusk,
crowd of blurred people, pedestrians, out of focus background,
shallow depth of field, bokeh lights, neon signs,
motion blur on crowd, street lights, cinematic atmosphere,
urban night, moody

[주인공 영역 프롬프트 — CHAR_A]
1girl, black wavy shoulder-length hair, dark brown eyes,
white shirt, jeans, sharp focus, in focus, highly detailed,
walking forward, confident stride, slight breeze in hair,
looking forward, determined expression

[네거티브]
(worst quality, low quality:1.4), multiple focused faces,
sharp background, flat image, no blur, cartoon, anime (실사 원할 때),
bad anatomy, watermark
```

---

## 8-5. Depth 맵 세팅

군중보다 주인공이 앞에 있음을 Depth 맵으로 명확히 합니다.

```
[DOF 씬 Depth 맵 제작]

구분                색상값 (0~255)
─────────────────────────────
배경 건물/하늘        20~40
멀리 있는 군중        60~90
중거리 군중           100~130
주인공 뒤 공간        140~160
주인공              190~220
주인공 앞 공간        230~255

핵심: 주인공의 깊이값이 군중보다 확실히 밝아야 함
```

---

## 8-6. 전체 세팅값

```
[기본 세팅]
해상도: 1024 x 1536 (세로형 — 군중 씬에 적합)
또는: 1024 x 768 (가로형)
Steps: 30
CFG: 7.5 (DOF 씬은 약간 높게)
Sampler: DPM++ 2M Karras

[Regional Prompter]
mode: Mask
마스크: 중앙 타원 마스크 이미지
base_ratio: 0.25

[IP-Adapter — CHAR_A만 적용]
모델: ip-adapter-plus-face_sd15.bin
참조: char_a_reference.png
weight: 0.70
마스크: 동일한 중앙 타원 마스크
(군중 영역에는 IP-Adapter 적용 안 함)

[ControlNet — Depth]
strength: 0.60
(DWPose는 이 씬에서 선택사항 — 군중 포즈는 흐릿해도 OK)
```

---

## 8-7. 후보정으로 DOF 강화

생성 결과에서 DOF 효과가 충분하지 않을 때 후보정으로 보완합니다.

```
[방법 1: img2img로 배경 흐리기]
1. 생성된 이미지를 img2img에 입력
2. 배경(군중) 부분만 마스크 선택
3. denoising_strength: 0.30~0.40
4. 프롬프트: "blurred crowd, bokeh background, out of focus,
              motion blur, shallow depth of field"
5. 주인공 영역 마스크: 검게 처리 (수정 안 함)

[방법 2: 이미지 편집 툴 후처리]
1. 이미지 편집 툴에서 열기
2. 주인공 영역 선택 (자동 선택 또는 수동)
3. 선택 영역 반전 (배경/군중 선택)
4. 가우시안 블러 적용 (반지름 8~15px)
5. 블러 강도는 거리에 따라 그라데이션으로 적용
```

---

## 8-8. 응용: 주인공 부각 씬 템플릿 모음

```
[도시 고독 — 기본형]
배경: busy city street, crowd of blurred people, bokeh
주인공: walking alone, confident, sharp focus, foreground
키워드: cinematic, moody, shallow depth of field

[파티 속 고독]
배경: crowded party, dancing people, colorful bokeh lights, out of focus
주인공: standing still, observing, sharp focus, surrounded by blur
키워드: contrast, isolation, warm party lights

[역 플랫폼]
배경: train station, blurred commuters, motion blur, crowded
주인공: standing on platform, waiting, sharp focus, luggage beside
키워드: departure, anticipation, cinematic

[운동장/공연장]
배경: crowd of people, cheering, blurred, bokeh spotlights
주인공: standing in spotlight, center, sharp focus
키워드: spotlight, dramatic, performance
```

---

## 8강 핵심 요약

```
✅ DOF 씬 = Regional Prompter Mask 모드 + Depth 맵 + bokeh 키워드
✅ 마스크: 중앙 타원형으로 주인공 영역만 선명하게
✅ 베이스 프롬프트에 반드시: out of focus, bokeh, shallow depth of field
✅ IP-Adapter는 주인공 마스크 영역에만 적용
✅ 생성 후 DOF 강화 필요시: img2img 또는 이미지 편집 툴로 보완
```

---
---

# 9강. 후보정 완전 정복 — FaceDetailer, Tile, Upscale

## 학습 목표
- FaceDetailer로 다중인물의 얼굴을 각각 디테일하게 보완한다
- ControlNet Tile로 전체 이미지 톤을 통합한다
- Ultimate SD Upscale로 고해상도 최종 출력을 만든다
- 후보정 순서와 각 단계의 역할을 이해한다

---

## 9-1. 후보정이 필요한 이유

다중인물 이미지는 단일 인물보다 생성이 복잡해 다음 문제가 자주 남습니다.

```
생성 직후 자주 남는 문제:
- 인물 얼굴 중 한 명이 흐릿하거나 비율이 어색함
- 전체 이미지 색감이 영역별로 미묘하게 다름
- 손가락이 이상하거나 세부 디테일이 부족함
- 해상도가 충분하지 않아 확대 시 품질 저하

후보정 순서:
1단계: FaceDetailer — 얼굴 디테일 보완
2단계: img2img + ControlNet Tile — 전체 톤 통합
3단계: Ultimate SD Upscale — 고해상도 최종 출력
```

---

## 9-2. FaceDetailer 완전 설정 가이드

FaceDetailer는 이미지에서 얼굴을 자동 감지하고 해당 부분만 인페인팅으로 재생성해 디테일을 보완합니다.

### 노드 구성

```
[필요 노드]
Load Image (또는 이전 단계 출력)
  ↓
FaceDetailer
  ← 베이스 모델 (Load Checkpoint)
  ← VAE
  ← bbox_model (face_yolov8n.pt)
  ← sam_model (선택사항 — 더 정밀한 마스크)
  ↓
Save Image
```

### 상세 파라미터

```
[감지 설정]
bbox_model: face_yolov8n.pt
  → 얼굴 위치 감지용 YOLO 모델
bbox_threshold: 0.5
  → 얼굴로 인식하는 최소 신뢰도 (낮추면 더 많은 얼굴 감지)
bbox_dilation: 30~50
  → 감지된 얼굴 영역을 얼마나 확장할지 (너무 좁으면 턱/이마 잘림)
bbox_crop_factor: 3.0
  → 얼굴 주변 맥락 얼마나 포함할지 (높을수록 자연스러운 연결)

[다중 얼굴 처리]
max_count: 0
  → 0 = 감지된 모든 얼굴 처리 (기본값 1에서 반드시 0으로 변경)
drop_size: 10
  → 이 픽셀 이하 크기의 얼굴은 무시 (너무 작은 배경 인물 제외)

[인페인팅 설정]
denoising_strength: 0.40~0.55
  → 낮음: 원본 유지 강함 (얼굴 형태 보존)
  → 높음: 더 많이 재생성 (퀄리티 향상 폭 큼, 원본과 달라질 수 있음)
  → 권장 시작값: 0.45

steps: 20~25
  → 생성 Steps (메인 생성보다 적어도 됨)

sampler_name: DPM++ 2M Karras (메인과 동일 권장)
scheduler: karras

[프롬프트]
positive: 메인 생성에 사용한 베이스 프롬프트 그대로 사용
  + "perfect face, detailed eyes, sharp focus, beautiful eyes"
negative: 메인과 동일
  + "blurry face, ugly face, bad face"
```

### 두 인물 얼굴 품질 차이 해결

```
문제: 왼쪽 얼굴은 잘 나왔는데 오른쪽은 여전히 뭉개짐

해결: 영역별 FaceDetailer 2회 적용

[1차 — 전체 얼굴 처리]
max_count: 0
denoising_strength: 0.45

[2차 — 문제 있는 얼굴만]
mask로 해당 얼굴 영역만 선택
denoising_strength: 0.55 (좀 더 적극적 재생성)
프롬프트에 해당 인물 특징 추가
```

---

## 9-3. ControlNet Tile로 전체 톤 통합

Regional Prompter를 사용한 이미지는 영역 경계에서 색감/조명이 미묘하게 달라질 수 있습니다. ControlNet Tile은 이를 자연스럽게 통합합니다.

### 원리

```
ControlNet Tile:
  입력: 원본 이미지 (타일 단위로 분할)
  동작: 각 타일의 구조를 유지하면서 전체 이미지를 재생성
  결과: 색감과 조명이 일관되게 통합됨
```

### 노드 세팅

```
[img2img + ControlNet Tile]

img2img 세팅:
  denoising_strength: 0.30~0.40
  (너무 높으면 인물 외모가 바뀜, 너무 낮으면 효과 미미)
  steps: 20

ControlNet Tile 세팅:
  모델: control_v11f1e_sd15_tile.pth
  프리프로세서: tile_resample
    → downsample_factor: 8
  strength: 0.60~0.70
  start_percent: 0.0
  end_percent: 1.0

프롬프트:
  베이스 프롬프트 그대로 사용
  추가: "consistent lighting, cohesive color tone,
         uniform atmosphere, seamless"
```

---

## 9-4. Ultimate SD Upscale 고해상도 출력

최종 이미지를 2~4배 업스케일해 고해상도 출력을 만듭니다.

### 세팅

```
[Ultimate SD Upscale 노드]

기본 설정:
  upscale_model: 4x-UltraSharp (또는 RealESRGAN_x4plus)
  upscale_by: 2 (2배 업스케일 — 권장)
  또는 target_size_type: width/height 지정 (원하는 최종 해상도)

타일 설정:
  tile_width: 512
  tile_height: 512
  tile_padding: 32 (타일 경계 자연스럽게 연결)

재생성 설정:
  denoising_strength: 0.25~0.35
  steps: 20
  (낮은 denoising으로 원본 구조 유지하면서 디테일만 추가)

권장 프롬프트:
  메인 프롬프트 그대로
  추가: "(ultra sharp, 8k, highly detailed:1.1)"
```

---

## 9-5. 완성 후보정 파이프라인

```
[다중인물 이미지 완성 후보정 순서]

입력: 메인 생성 이미지 (예: 1024x768)

STEP 1: FaceDetailer
  → 모든 얼굴 디테일 보완
  → denoising: 0.45, max_count: 0
  출력: 얼굴 개선된 이미지 (동일 해상도)

STEP 2: img2img + ControlNet Tile
  → 전체 톤/색감 통합
  → denoising: 0.35, Tile strength: 0.65
  출력: 색감 통합된 이미지 (동일 해상도)

STEP 3: Ultimate SD Upscale
  → 2배 고해상도 출력
  → upscale 2x, denoising: 0.30
  출력: 최종 이미지 (2048x1536)

선택 STEP 4: 손/특정 부위 인페인팅
  → 문제 있는 부위만 선택 마스크
  → denoising: 0.70~0.80
  → 해당 부위 특화 프롬프트 사용

총 소요 시간 (RTX 3080 기준):
  STEP 1: 30~60초
  STEP 2: 20~40초
  STEP 3: 2~5분
  전체: 약 5~7분
```

---

## 9강 핵심 요약

```
✅ FaceDetailer: max_count 0, denoising 0.45, bbox_dilation 30~50
✅ 얼굴 품질 차이: 2회 적용 (1차 전체, 2차 문제 영역 집중)
✅ ControlNet Tile: denoising 0.35, strength 0.65 — 전체 톤 통합
✅ Upscale: 2배, denoising 0.30 — 고해상도 최종 출력
✅ 순서: FaceDetailer → Tile img2img → Upscale
```

---
---

# 10강. 트러블슈팅 오답 노트 — 증상별 처방전

## 학습 목표
- 다중인물 생성에서 가장 자주 발생하는 7가지 문제를 해결한다
- Before & After 접근으로 원인부터 솔루션까지 빠르게 파악한다
- 치트시트로 두고두고 참조할 수 있는 형태로 정리한다

---

## 빠른 참조 인덱스

| 번호 | 증상 | 핵심 해결책 | 난이도 |
|------|------|------------|--------|
| 1 | 옷이 서로 바뀌거나 섞임 | ConditioningSetArea + base_ratio 낮추기 | ⭐ |
| 2 | 팔다리가 기괴하게 꼬임 | DWPose + Depth 맵 직접 제작 | ⭐⭐ |
| 3 | 한 명만 잘 나오고 옆 사람 뭉개짐 | 해상도 증가 + FaceDetailer max_count 0 | ⭐ |
| 4 | 배경과 인물이 합성처럼 보임 | img2img + ControlNet Tile | ⭐⭐ |
| 5 | 인물 수가 맞지 않음 | 베이스 프롬프트 인원수 강화 | ⭐ |
| 6 | 손/손가락이 이상함 | 네거티브 강화 + 인페인팅 | ⭐⭐ |
| 7 | 두 인물이 한 덩어리로 뭉침 | 분리 키워드 + 포즈 수정 | ⭐ |

---

## 증상 1: 옷이 서로 바뀌거나 섞여요

### Before
```
의도: 왼쪽 인물 — 빨간 드레스 / 오른쪽 인물 — 검은 수트
결과: 왼쪽 인물이 어두운 드레스 / 오른쪽 인물이 붉은 톤 수트
```

### 원인 분석
```
Cross-Attention이 영역을 무시하고 "red dress"와 "black suit" 토큰을
이미지 전체에 동시 적용 → 색상이 혼합됨
```

### After — 처방전

**처방 1: base_ratio 낮추기**
```
현재: base_ratio 0.3 이상
수정: base_ratio 0.15 이하

효과: 영역별 프롬프트 영향력 강화, 베이스 영향 감소
```

**처방 2: Conditioning Set Area 추가**
```
노드: ConditioningSetArea
연결: CLIPTextEncode (의상 프롬프트) → ConditioningSetArea → Regional Prompter

파라미터 (1024x512 해상도, 왼쪽 인물 기준):
  x: 0, y: 0
  width: 512, height: 512
  strength: 1.0

효과: 의상 프롬프트를 지정한 픽셀 영역에만 강제 적용
```

**처방 3: 의상 색상 대비 확인**
```
❌ 혼동되는 조합:
  red dress / orange skirt → 색조 유사
  navy blue / dark purple → 명도 유사

✅ 명확한 대비:
  red dress / black suit → 색상 + 명도 모두 대비
  white dress / dark green coat → 명확한 차이
```

**점검 체크리스트**
```
□ base_ratio 0.15 이하로 설정했는가
□ 각 영역 프롬프트에 다른 인물 의상 언급이 없는가
□ 의상 색상이 충분히 대비되는가
□ ConditioningSetArea 적용했는가 (심각한 경우)
```

---

## 증상 2: 팔다리가 기괴하게 꼬여요

### Before
```
의도: 두 인물이 손을 잡은 포즈
결과: 팔이 세 개 / 누구의 팔인지 알 수 없는 기괴한 형태
```

### 원인 분석
```
ControlNet이 두 인물의 키포인트(관절 위치)를 혼동
신체가 겹치는 영역에서 어느 인물의 팔인지 구분 불가
```

### After — 처방전

**처방 1: OpenPose → DWPose 교체**
```
기존: DWPose Preprocessor 또는 OpenPose
교체: DWPose (ViTPose_large 모델 사용)

ComfyUI 노드:
  DWPose Estimator
  detect_hand: True
  detect_body: True
  detect_face: True
```

**처방 2: Depth 맵 직접 제작**
```
도구: Krita (무료), Paint, Photoshop

제작 방법 (포옹 씬 예시):
  캔버스: 생성 해상도와 동일 (예: 1024x768)

  배경: #202020 (어두운 회색)
  뒤에 있는 인물 몸통: #909090 (중간 회색)
  앞에 있는 인물 몸통: #C0C0C0 (밝은 회색)

  겹치는 팔 처리:
    앞쪽 인물의 팔: #D0D0D0 (더 밝게)
    뒤쪽 인물의 팔: #808080 (더 어둡게)

  저장: PNG로 저장 → ComfyUI Load Image로 불러오기
  적용: ControlNet Depth 모델에 연결
```

**처방 3: ControlNet 세팅 조정**
```
DWPose strength: 0.70 (신체 겹침 있을 때 약간 낮춤)
Depth strength: 0.65 (겹침 처리 강화)
end_percent: 0.80
```

**처방 4: 네거티브 강화**
```
추가: extra arms, extra legs, fused limbs, tangled limbs,
      merged body parts, incorrect anatomy, twisted limbs,
      floating limbs, disconnected limbs
```

**점검 체크리스트**
```
□ DWPose로 교체했는가
□ Depth 맵 추가했는가 (겹치는 씬 필수)
□ DWPose strength 0.70 이하로 낮췄는가
□ 네거티브에 팔다리 관련 태그 추가했는가
□ 겹침이 적은 포즈로 레퍼런스 교체 고려했는가
```

---

## 증상 3: 한 명만 잘 나오고 옆 사람은 뭉개져요

### Before
```
의도: 두 인물 모두 선명하게
결과: 왼쪽 인물 선명, 오른쪽 인물 얼굴 뭉개짐 + 디테일 부족
```

### 원인 분석
```
원인 A: 해상도 부족 → 인물 1명당 픽셀 수가 얼굴 디테일 표현에 부족
원인 B: FaceDetailer가 얼굴 하나만 처리 (max_count: 1)
원인 C: IP-Adapter weight 불균형 (한 인물에만 강하게 적용됨)
```

### After — 처방전

**처방 1: 해상도 증가**
```
현재: 768x512 (1인당 384px)
수정:
  2인: 1024x512 이상 (1인당 512px)
  고품질: 1280x640 (1인당 640px)

공식: 인물 수 × 512px = 최소 가로 해상도
```

**처방 2: FaceDetailer max_count 수정**
```
현재: max_count: 1
수정: max_count: 0 (0 = 모든 얼굴 처리)

추가 설정:
  drop_size: 15 (너무 작은 얼굴은 건너뜀)
  bbox_threshold: 0.45 (감지 감도 약간 높임)
```

**처방 3: 두 얼굴 별도 FaceDetailer**
```
두 얼굴의 크기/각도 차이가 클 때:

1차 FaceDetailer:
  마스크: 왼쪽 얼굴 영역만
  denoising: 0.45

2차 FaceDetailer (1차 출력을 입력으로):
  마스크: 오른쪽 얼굴 영역만
  denoising: 0.50 (뭉개진 쪽은 더 적극적으로)
```

**처방 4: denoising 최적값**
```
얼굴이 흐릿할 때:   denoising 0.50~0.60
얼굴이 원본과 달라질 때: denoising 0.35~0.40
권장 시작값: 0.45 → 결과 보며 ±0.05 조절
```

**점검 체크리스트**
```
□ 해상도 인물 수 × 512px 이상인가
□ FaceDetailer max_count: 0으로 설정했는가
□ denoising_strength 0.40~0.55 범위인가
□ 뭉개진 쪽 단독 FaceDetailer 추가 적용했는가
```

---

## 증상 4: 배경과 인물이 합성처럼 보여요

### Before
```
의도: 자연스럽게 어우러진 인물 + 배경
결과: 인물과 배경 사이에 보이지 않는 경계선 / 색감 불일치 / 조명 방향 다름
```

### 원인 분석
```
Regional Prompter 영역 분리 과정에서 색온도, 조명 방향, 노이즈 패턴이
영역별로 미묘하게 다르게 생성됨
베이스 프롬프트에 조명 통일 키워드 부재
```

### After — 처방전

**처방 1: 베이스 프롬프트에 조명 통일 키워드**
```
추가 키워드:
  consistent lighting          (통일된 조명)
  single light source          (단일 광원)
  same color temperature       (동일 색온도)
  natural ambient light        (자연스러운 주변광)
  soft diffused lighting       (확산된 부드러운 조명)
  cinematic uniform lighting   (영화적 통일 조명)
```

**처방 2: img2img + ControlNet Tile**
```
img2img 설정:
  입력: 생성된 이미지
  denoising_strength: 0.30~0.38
  steps: 20

ControlNet Tile:
  모델: control_v11f1e_sd15_tile.pth
  프리프로세서: tile_resample
  strength: 0.60~0.70

프롬프트:
  베이스와 동일
  추가: "seamless, cohesive, uniform atmosphere,
         harmonious lighting, consistent color grading"
```

**처방 3: 후보정 순서 최적화**
```
1. FaceDetailer (얼굴 먼저)
   → 얼굴 디테일 고정
2. img2img + ControlNet Tile (전체 톤 통합)
   → 이 순서로 해야 얼굴이 Tile에 의해 재생성되지 않음
3. Upscale
```

**점검 체크리스트**
```
□ 베이스 프롬프트에 조명 통일 키워드 포함했는가
□ img2img denoising 0.35 이하인가 (너무 높으면 인물 변형)
□ ControlNet Tile strength 0.60~0.70인가
□ FaceDetailer → Tile 순서로 처리했는가
```

---

## 증상 5: 인물 수가 맞지 않아요

### Before
```
의도: 2인 생성
결과 A: 1인만 생성됨
결과 B: 3인이 생성됨
결과 C: 한 인물이 화면 끝에서 잘림
```

### After — 처방전

**처방 1: 베이스 프롬프트 인원수 강화**
```
약한 표현 → 강한 표현:
  "people"          → "exactly 2 people"
  "2girls"          → "(2 girls:1.3)"  (가중치 추가)
  "a couple"        → "1 girl and 1 girl, 2 people total"

공식: (정확한 인원수 표현:1.2~1.4)로 가중치 부여
```

**처방 2: 해상도를 인원수에 맞게**
```
인원수별 최소 해상도:
  2인: 832x512
  3인: 1152x512
  4인: 1280x512 이상

인물이 잘리는 경우: 가로 해상도 더 늘리기
```

**처방 3: 네거티브에 원하지 않는 인원수**
```
2인 목표: "(1 person:1.2), (solo:1.2), (3 people:1.2), (4 people:1.2)"
3인 목표: "(2 people:1.2), (4 people:1.2), (5 people:1.2)"
```

**처방 4: Regional Prompter 영역 수와 인원 수 일치**
```
2인 생성 → 영역 2개 (Columns, ratios 1,1)
3인 생성 → 영역 3개 (Columns, ratios 1,1,1)
영역 수 ≠ 인원 수이면 반드시 문제 발생
```

---

## 증상 6: 손/손가락이 이상해요

### Before
```
의도: 자연스러운 손 포즈
결과: 손가락 6개 / 뭉개진 손 / 손 위치가 이상함
```

### After — 처방전

**처방 1: 네거티브 강화 (즉시 적용)**
```
추가:
bad hands, extra fingers, missing fingers, fused fingers,
too many fingers (6 fingers:1.4), mutated hands,
poorly drawn hands, deformed hands, cloned hands,
extra hands, malformed hands, wrong finger count
```

**처방 2: 손 영역 인페인팅**
```
마스크: 이상한 손 부분만 선택
denoising_strength: 0.75~0.85
  (손은 많이 바꿔야 효과적 — 높은 값 사용)

프롬프트:
  "perfect hands, 5 fingers, natural hand pose,
   [원래 포즈 설명: relaxed hand, open palm, etc.]"

한 번에 안 되면 2~3회 반복
```

**처방 3: 손이 보이지 않는 포즈로 대체**
```
손을 가리는 자연스러운 포즈:
  hands in pocket (주머니에 손)
  arms crossed (팔짱)
  hands behind back (등 뒤로 손)
  holding object (물건 들기 — 컵, 가방)
  blurred/out of focus hands (아웃포커싱 처리)
```

**처방 4: ControlNet Depth로 손 깊이 정보**
```
손이 겹치거나 복잡한 포즈일 때
Depth 맵에서 손 부분의 깊이값을 명확히 구분
앞쪽 손: 흰색에 가깝게
뒤쪽 손: 어두운 회색으로
```

---

## 증상 7: 두 인물이 한 덩어리로 뭉쳐요

### Before
```
의도: 두 인물이 나란히 서 있는 구도
결과: 두 인물의 몸이 하나로 합쳐진 것처럼 보임
```

### After — 처방전

**처방 1: 베이스 프롬프트에 분리 키워드**
```
추가:
"two separate people", "clear space between them",
"standing apart", "distinct figures", "individual characters",
"gap between the two", "not touching"
```

**처방 2: 포즈 레퍼런스 수정**
```
포즈 이미지에서 두 인물 사이 간격 확인
최소 어깨 너비만큼의 공간이 있어야 함

포즈 에디터에서 직접 수정:
  두 스켈레톤 사이 X축 거리 늘리기
  겹치는 팔다리 없도록 수정
```

**처방 3: 경계 부분 인페인팅**
```
뭉쳐 있는 경계 부분만 마스크 선택
denoising_strength: 0.65~0.80

프롬프트:
  "empty space between two people,
   background visible between them,
   [배경 요소: wall, street, etc.],
   two separate standing figures"
```

**처방 4: Regional Prompter base_ratio 낮추기**
```
base_ratio 0.25 이상이면 경계가 흐려질 수 있음
0.15 이하로 낮춰서 영역 분리 강화
```

---

## 10강 종합 치트시트

```
┌─────────────────────────────────────────────────────────────────┐
│              다중인물 트러블슈팅 치트시트                         │
├──────────────────┬──────────────────────┬───────────────────────┤
│ 증상             │ 즉시 시도             │ 심화 해결책            │
├──────────────────┼──────────────────────┼───────────────────────┤
│ 옷이 섞임        │ base_ratio 0.15 이하  │ ConditioningSetArea   │
│ 팔다리 꼬임      │ DWPose + 네거티브     │ Depth 맵 직접 제작     │
│ 한 명만 선명     │ max_count: 0          │ 별도 FaceDetailer 2회 │
│ 합성처럼 보임    │ 조명 키워드 추가      │ img2img + Tile        │
│ 인물 수 틀림     │ 인원수 가중치 강화    │ 해상도 + 네거티브      │
│ 손이 이상        │ 네거티브 강화         │ 손 인페인팅           │
│ 인물 뭉침        │ 분리 키워드 추가      │ 포즈 수정 + 인페인팅   │
└──────────────────┴──────────────────────┴───────────────────────┘

범용 네거티브 프롬프트 (다중인물 표준):
(worst quality, low quality:1.4), bad anatomy, extra limbs,
extra arms, extra legs, extra faces, merged faces, merged bodies,
duplicate, cloned, bad hands, extra fingers, missing fingers,
fused fingers, (6 fingers:1.3), mutated hands, deformed,
disfigured, watermark, signature, text, logo
```

---

## 전체 커리큘럼 마무리

```
[10강 학습 완료 후 달성 가능한 것들]

기초 (1~5강):
  ✅ 다중인물 실패 원인 파악 및 해결 방향 이해
  ✅ Regional Prompter로 프롬프트 충돌 해결
  ✅ DWPose + Depth로 포즈 안정적 고정
  ✅ IP-Adapter로 캐릭터 일관성 유지
  ✅ 재사용 가능한 캐릭터 시트 완성

실전 (6~8강):
  ✅ 로맨스/액션 투샷 완성
  ✅ 3~4인 그룹 화보 완성
  ✅ 군중 속 주인공 DOF 씬 완성

마무리 (9~10강):
  ✅ FaceDetailer + Tile + Upscale 후보정 파이프라인 구축
  ✅ 7가지 트러블슈팅 처방전 숙지

[권장 학습 방법]
1~2강: 이론 + 기본 실습 (하루)
3~4강: 도구 설치 + 파라미터 실험 (하루)
5강: 자신의 캐릭터 시트 완성 (하루)
6~8강: 각 프로젝트 1개씩 완성 (프로젝트당 하루)
9강: 후보정 파이프라인 구축 (하루)
10강: 문제 발생 시마다 참조
```

---

*문서 버전: 1.0*
*작성일: 2026-02-23*
*다음 업데이트: 실제 생성 예제 이미지 + 워크플로우 JSON 추가 예정*
