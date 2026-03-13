---
name: 기술 스택 선택 배경
description: 프로젝트의 주요 기술 선택 이유와 대안 분석 기록
type: project
---

## 번역 AI: google-translate-api-x
- 선택 이유: 완전 무료, API 키 불필요, 번역 품질 우수
- 대안 검토: Claude API(유료), DeepL(가입 필요), OpenAI(크레딧 소진)

## UI: Tailwind CSS + shadcn/ui
- 선택 이유: 빠른 프로토타이핑, Next.js 궁합, 모던한 디자인
- shadcn/ui는 복사 기반이라 의존성 가볍고 커스터마이징 자유로움

## DB: Turso + Drizzle ORM
- 선택 이유: 과제 요구사항(Turso 지정), Edge에서 동작, 무료 플랜 넉넉
- Drizzle ORM: 타입 안전, 가볍고 빠름

## 인증: NextAuth.js v5 (Auth.js)
- 선택 이유: Google OAuth 쉽게 구현, Next.js 공식 추천
- signIn 콜백에서 화이트리스트 체크 가능

## 패키지 매니저: pnpm
- 사용자 선호에 따라 선택
