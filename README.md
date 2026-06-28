# 러비의 사진관 · LoveCam

AI 인생네컷 프로토타입 — 채팅 캐릭터/연예인과 "내 얼굴은 그대로, 상대는 AI 합성"으로 커플샷을 찍는 포토부스.
BeautyCam / 러비더비 사진관 화면 흐름을 재현했습니다.

## 화면 흐름
1. **포토부스 홈** (`/`) — 인기 테마 TOP 5 + 전체 테마
2. **부스** (`/theme/[id]`) — 캐릭터/연예인 선택(업로드 또는 좋아요한 캐릭터) + 내 사진 업로드 + 컨셉 선택/직접 입력 → 생성
3. **결과** (`/result`) — 생성 이미지, 저장/기록, 다시 찍기

## 기술 스택
- Next.js 14 (App Router) · TypeScript · Tailwind CSS
- zustand (화면 간 선택 상태)
- 이미지 생성: `/app/api/generate/route.ts` (Google Gemini 이미지, 프로바이더 교체 가능)

## 실행
```bash
npm install
cp .env.example .env   # GEMINI_API_KEY 채우면 실제 AI 생성, 비우면 DEMO 플레이스홀더
npm run dev            # http://localhost:3000
```

## 이미지 생성 동작
- `GEMINI_API_KEY` 설정 시: 캐릭터 사진 + 내 사진 + 컨셉 프롬프트를 Gemini 이미지 모델로 합성("캐릭터는 실사로, 내 얼굴은 유지").
- 미설정 시: 라벨이 박힌 DEMO 플레이스홀더 반환(흐름 테스트용).
- 배포 환경에서 아웃바운드 HTTPS가 프록시를 거치면 `HTTPS_PROXY`를 런타임에 설정하세요.

## ⚠️ 법적 주의
"실사 연예인/실명 운동선수" 합성은 한국 퍼블리시티권·초상권, 미국 ELVIS Act, 앱스토어 정책상 리스크가 큽니다.
자세한 분석과 권장 방향(자사 IP 캐릭터)은 [`docs/research/photobooth-competitor-legal-research.md`](docs/research/photobooth-competitor-legal-research.md) 참고.
런칭 전 반드시 검토하세요.
