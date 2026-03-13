# 001. 기술 스택 선택

**날짜**: 2026-03-14
**상태**: 채택됨

## 맥락
ESTsoft Perso AI DevRel 인턴 과제로 AI 더빙 웹 서비스를 구축해야 함.
과제에서 지정한 기술: Next.js, ElevenLabs API, Turso DB, Vercel, Google OAuth

## 결정
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4 + shadcn/ui
- NextAuth.js v5 (Google OAuth)
- Turso + Drizzle ORM
- ElevenLabs API (STT + TTS)
- google-translate-api-x (번역)
- pnpm (패키지 매니저)

## 이유
- Next.js: 과제 필수 요구사항
- shadcn/ui: 빠른 프로토타이핑 + 모던 UI
- Drizzle ORM: 타입 안전, Turso와 공식 지원
- google-translate-api-x: 완전 무료, API 키 불필요
- pnpm: 사용자 선호
