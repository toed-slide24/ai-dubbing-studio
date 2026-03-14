# 🎙️ AI Dubbing Studio

> 오디오/비디오 파일을 업로드하면 AI가 원하는 언어로 더빙해주는 웹 서비스

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

🔗 **배포 URL**: [https://ai-dubbing-studio.vercel.app](https://ai-dubbing-studio.vercel.app/)

AI 더빙 웹 서비스입니다.
ElevenLabs의 음성 AI 기술과 다국어 번역을 결합하여, **파일 업로드 한 번으로 STT → 번역 → TTS 파이프라인**을 자동으로 처리합니다.

---

## 📋 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#️-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [API 엔드포인트](#-api-엔드포인트)
- [배포](#-배포)
- [코딩 에이전트 활용 경험](#-코딩-에이전트-활용-경험)
- [라이선스](#-라이선스)

---

## ✨ 주요 기능

### 🎤 음성 전사 (STT)
- ElevenLabs Scribe (`scribe_v1` 모델)를 사용하여 오디오/비디오에서 텍스트를 추출
- 원본 언어 자동 감지

### 🌍 다국어 번역
- 한국어, 영어, 일본어, 중국어, 스페인어 등 다국어 지원
- `google-translate-api-x`를 활용한 무료 번역 (API 키 불필요)

### 🔊 음성 합성 (TTS)
- ElevenLabs Multilingual v2 모델로 자연스러운 음성 생성
- 번역된 텍스트를 고품질 음성으로 합성

### 🔐 Google OAuth 화이트리스트 인증
- Google 계정 로그인 + DB 기반 이메일 화이트리스트
- 등록되지 않은 이메일은 접근 거부 페이지로 리다이렉트

### 🎧 결과 재생 및 다운로드
- 더빙 결과를 브라우저에서 바로 재생
- 원본 텍스트 ↔ 번역 텍스트 비교 확인

---

## 🛠️ 기술 스택

| 분류 | 기술 | 설명 |
|------|------|------|
| **프레임워크** | Next.js 16 (App Router) | React 19 기반, TypeScript |
| **패키지 매니저** | pnpm | 빠르고 효율적인 패키지 관리 |
| **스타일링** | Tailwind CSS v4 + shadcn/ui | 유틸리티 기반 CSS + 모던 UI 컴포넌트 |
| **인증** | NextAuth.js (Auth.js v5) | Google OAuth 2.0 |
| **데이터베이스** | Turso (libSQL) + Drizzle ORM | Edge 호환 SQLite, 타입 안전 ORM |
| **음성 전사 (STT)** | ElevenLabs Scribe API | 고정밀 음성-텍스트 변환 |
| **번역** | google-translate-api-x | 무료 다국어 번역 |
| **음성 합성 (TTS)** | ElevenLabs Multilingual v2 | 다국어 자연스러운 음성 생성 |
| **배포** | Vercel | GitHub 연동 자동 배포 |

---

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- [pnpm](https://pnpm.io/) 설치
- [ElevenLabs API Key](https://elevenlabs.io/)
- [Google Cloud Console](https://console.cloud.google.com/) OAuth 클라이언트
- [Turso](https://turso.tech/) 데이터베이스

### 설치

```bash
# 1. 레포지토리 클론
git clone https://github.com/KyeongJooni/ai-dubbing-studio.git
cd ai-dubbing-studio

# 2. 의존성 설치
pnpm install

# 3. 환경변수 설정
cp .env.example .env.local
```

### 환경변수 설정

`.env.local` 파일에 다음 값들을 설정합니다:

```env
# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret    # openssl rand -base64 32

# Turso
TURSO_DATABASE_URL=libsql://your-db-turso.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token
```

### DB 마이그레이션

```bash
# Drizzle 마이그레이션 생성 및 적용
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 실행

```bash
# 개발 서버 시작
pnpm dev
```

http://localhost:3000 에서 확인할 수 있습니다.

---

## 📁 프로젝트 구조

```
ai-dubbing-studio/
├── .claude/                     # 🤖 Claude Code 에이전트 설정
│   ├── memory/                  # 프로젝트 컨텍스트 메모리
│   │   ├── MEMORY.md            # 메모리 인덱스
│   │   ├── api-notes.md         # API 관련 메모
│   │   ├── patterns.md          # 코드 패턴 메모
│   │   └── tech-decisions.md    # 기술 결정 사항
│   ├── rules/                   # 코딩 규칙 (자동 적용)
│   │   ├── api.md               # API Route 작성 규칙
│   │   └── typescript.md        # TypeScript 컨벤션
│   ├── decisions/               # 아키텍처 의사결정 기록
│   │   └── 001-tech-stack.md    # 기술 스택 선택 근거
│   ├── tasks/                   # 작업 체크리스트
│   │   └── mvp-checklist.md     # MVP 진행 상황 추적
│   ├── examples/                # 코드 패턴 예제
│   │   ├── api-route-pattern.ts # API Route 표준 패턴
│   │   └── component-pattern.tsx# 컴포넌트 표준 패턴
│   └── settings.local.json      # Agent Teams 활성화 설정
├── src/
│   ├── app/                     # Next.js App Router 페이지
│   │   ├── page.tsx             # 랜딩 페이지 (로그인)
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   ├── dashboard/
│   │   │   └── page.tsx         # 더빙 서비스 메인 (인증 필요)
│   │   ├── access-denied/
│   │   │   └── page.tsx         # 화이트리스트 미등록 안내
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts  # NextAuth 핸들러
│   │       ├── dubbing/route.ts             # 🔥 통합 더빙 파이프라인
│   │       ├── transcribe/route.ts          # 음성 전사 (STT)
│   │       ├── translate/route.ts           # 텍스트 번역
│   │       └── synthesize/route.ts          # 음성 합성 (TTS)
│   ├── components/              # React 컴포넌트
│   │   ├── header.tsx           # 헤더/네비게이션
│   │   ├── file-upload.tsx      # 파일 업로드
│   │   ├── language-select.tsx  # 언어 선택
│   │   ├── dubbing-progress.tsx # 더빙 진행 상태 표시
│   │   ├── audio-player.tsx     # 결과 오디오 재생기
│   │   └── ui/                  # shadcn/ui 컴포넌트
│   ├── db/                      # 데이터베이스
│   │   ├── schema.ts            # Drizzle 스키마 (allowed_emails)
│   │   └── index.ts             # DB 클라이언트 (Turso)
│   ├── lib/                     # 유틸리티
│   │   ├── auth.ts              # NextAuth 설정 + 화이트리스트 콜백
│   │   └── utils.ts             # 헬퍼 함수
│   └── middleware.ts            # 인증 미들웨어 (dashboard 보호)
├── CLAUDE.md                    # Claude Code 프로젝트 지침
├── .env.example                 # 환경변수 템플릿
├── package.json
├── drizzle.config.ts
└── tsconfig.json
```

---

## 📡 API 엔드포인트

모든 보호된 API는 NextAuth 세션 인증이 필요합니다.

### `POST /api/dubbing` ⭐ 통합 파이프라인

파일 업로드부터 더빙 완료까지 한 번의 요청으로 처리하는 메인 API입니다.

| 항목 | 설명 |
|------|------|
| **Content-Type** | `multipart/form-data` |
| **인증** | 필수 (NextAuth 세션) |

**요청 파라미터:**

| 필드 | 타입 | 설명 |
|------|------|------|
| `file` | `File` | 오디오/비디오 파일 |
| `targetLanguage` | `string` | 타겟 언어 코드 (예: `ko`, `en`, `ja`) |

**응답:**

```json
{
  "originalText": "원본 전사 텍스트",
  "translatedText": "번역된 텍스트",
  "sourceLanguage": "en",
  "targetLanguage": "ko",
  "audioBase64": "base64 인코딩된 오디오",
  "audioContentType": "audio/mpeg"
}
```

**처리 흐름:**

```
파일 업로드 → [STT] ElevenLabs Scribe → [번역] Google Translate → [TTS] ElevenLabs v2 → 오디오 응답
```

### `POST /api/transcribe` — 음성 전사

오디오 파일을 텍스트로 변환합니다 (ElevenLabs STT).

### `POST /api/translate` — 텍스트 번역

텍스트를 지정된 언어로 번역합니다 (google-translate-api-x).

### `POST /api/synthesize` — 음성 합성

텍스트를 음성으로 변환합니다 (ElevenLabs TTS).

### `GET/POST /api/auth/[...nextauth]` — 인증

NextAuth.js의 Google OAuth 인증을 처리합니다.

---

## 🌐 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에서 GitHub 레포지토리 연동
2. 환경변수 설정 (Settings → Environment Variables)
3. 자동 배포 완료

### 배포 시 추가 작업

- **Turso DB 마이그레이션**: `pnpm drizzle-kit migrate`
- **화이트리스트 시드 데이터**: 필수 이메일을 `allowed_emails` 테이블에 추가
- **Google OAuth**: 배포 URL을 Authorized redirect URI에 추가
- **NEXTAUTH_URL**: 배포 도메인으로 변경

---

## 🤖 코딩 에이전트 활용 경험

이 프로젝트는 **Claude Code**를 핵심 개발 도구로 활용하여 구축했습니다. 단순히 코드 생성을 요청하는 것이 아니라, **체계적인 프로젝트 관리 시스템**을 갖추고 에이전트와 협업하는 방식으로 진행했습니다.

### 📂 `.claude/` 폴더 구조 — 에이전트의 "두뇌"

프로젝트 루트의 `.claude/` 폴더는 Claude Code가 프로젝트를 이해하고 일관된 코드를 생성하기 위한 체계적인 컨텍스트 시스템입니다.

```
.claude/
├── memory/          # 📝 프로젝트 기억 저장소
├── rules/           # 📏 코딩 규칙 (자동 적용)
├── decisions/       # 📋 아키텍처 의사결정 기록 (ADR)
├── tasks/           # ✅ 작업 체크리스트
├── examples/        # 💡 코드 패턴 예제
└── settings.local.json  # ⚙️ Agent Teams 설정
```

#### 1. `memory/` — 프로젝트 기억 저장소

Claude Code가 대화 간에도 프로젝트의 맥락을 유지할 수 있도록, API 사용 패턴, 코드 패턴, 기술 결정 사항 등을 문서화하여 저장합니다. 새로운 대화가 시작되어도 에이전트가 프로젝트의 히스토리와 패턴을 즉시 파악할 수 있습니다.

- `MEMORY.md` — 메모리 인덱스 (다른 메모리 파일 참조)
- `api-notes.md` — ElevenLabs API 호출 방식, 에러 처리 패턴
- `patterns.md` — 반복적으로 사용되는 코드 패턴
- `tech-decisions.md` — 기술 선택의 이유와 맥락

#### 2. `rules/` — 코딩 규칙 (자동 적용)

Claude Code가 코드를 생성할 때 자동으로 참조하는 규칙 파일들입니다. 매번 "interface를 사용해줘", "에러 처리를 이렇게 해줘"라고 지시할 필요 없이, 규칙 파일에 정의해두면 에이전트가 일관된 스타일로 코드를 생성합니다.

- `api.md` — API Route 구조, 인증 패턴, 응답 형식, 파일 업로드 처리
- `typescript.md` — 타입 정의 규칙, import 규칙, 네이밍 컨벤션, 에러 핸들링

#### 3. `decisions/` — 아키텍처 의사결정 기록 (ADR)

프로젝트의 주요 기술적 결정을 **왜 그렇게 결정했는지**와 함께 기록합니다. 나중에 "왜 이 기술을 선택했지?"라는 질문이 생겼을 때, 에이전트도 개발자도 즉시 맥락을 파악할 수 있습니다.

- `001-tech-stack.md` — Next.js 16, shadcn/ui, Drizzle ORM, pnpm 등의 선택 이유

#### 4. `tasks/` — 작업 체크리스트

MVP 구현을 Phase별로 체계적으로 나누어 관리합니다. Claude Code에게 "다음 할 일이 뭐야?"라고 물으면, 이 체크리스트를 참고하여 우선순위에 따라 작업을 진행합니다.

- `mvp-checklist.md` — Phase 0(프로젝트 기반) ~ Phase 6(문서화)까지 전체 진행 상황

#### 5. `examples/` — 코드 패턴 예제

표준적으로 따라야 할 코드 패턴을 예제 파일로 제공합니다. "이 프로젝트에서 API Route는 이렇게 작성해"라고 한 번 보여주면, 이후 생성되는 모든 API Route가 동일한 패턴을 따릅니다.

- `api-route-pattern.ts` — 인증 체크 → 요청 파싱 → 유효성 검사 → 비즈니스 로직 → 응답
- `component-pattern.tsx` — 클라이언트 컴포넌트의 Props 정의, 상태 관리, 에러 처리 패턴

### 🤝 Agent Teams 활용

프로젝트의 `.claude/settings.local.json`에서 **Agent Teams 기능을 활성화**(`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`)하여, 복잡한 작업을 여러 서브 에이전트가 분담하여 처리할 수 있도록 설정했습니다. 예를 들어, API 개발과 UI 개발을 병렬로 진행하거나, 코드 작성과 리뷰를 분리하는 등의 워크플로우가 가능합니다.

### 💡 Claude Code와 협업하며 좋았던 점

1. **CLAUDE.md를 통한 프로젝트 온보딩**
   - 프로젝트 개요, 기술 스택, 디렉토리 구조, 코딩 컨벤션, 커밋 규칙, 환경변수, API 패턴을 하나의 파일에 정리하면, Claude Code가 프로젝트의 전체적인 맥락을 즉시 이해합니다. 마치 새로운 팀원에게 온보딩 문서를 전달하는 것과 같습니다.

2. **규칙과 예제로 일관성 유지**
   - `rules/`와 `examples/` 폴더를 통해 코드 스타일을 한 번 정의하면, 이후 에이전트가 생성하는 모든 코드가 동일한 패턴을 따릅니다. 수동 코드 리뷰의 부담이 크게 줄어듭니다.

3. **체크리스트 기반 점진적 개발**
   - `tasks/mvp-checklist.md`를 통해 Phase별로 작업을 나누고, Claude Code와 함께 순차적으로 진행하면서 각 단계의 완료를 체크했습니다. 큰 프로젝트도 작은 단위로 나누어 안정적으로 구축할 수 있었습니다.

4. **의사결정 기록의 가치**
   - `decisions/` 폴더에 기술 선택의 이유를 기록해두면, 나중에 변경이 필요할 때 원래의 맥락을 빠르게 파악할 수 있습니다. 에이전트도 이 기록을 참고하여 기존 결정과 일관된 제안을 합니다.

5. **빠른 프로토타이핑**
   - 전체 STT → 번역 → TTS 파이프라인, Google OAuth 인증, DB 설정, UI 컴포넌트까지 Claude Code와의 협업으로 빠르게 구현할 수 있었습니다. 특히 ElevenLabs API 연동이나 NextAuth 화이트리스트 로직처럼 보일러플레이트가 많은 부분에서 큰 시간 절약 효과가 있었습니다.

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

<div align="center">

**Built with ❤️ and [Claude Code](https://claude.ai/claude-code)**

ESTsoft Perso AI DevRel 인턴 채용 과제

</div>
