# AI Dubbing Studio - CLAUDE.md

## 프로젝트 개요
ESTsoft Perso AI DevRel 인턴 채용 과제로, AI 더빙 웹 서비스를 구축하는 프로젝트.
비디오/오디오 파일을 업로드하면 원하는 언어로 더빙해주는 서비스.

## Thinking
- 한국어로 생각하기
- 작업 전 `.claude/` 디렉토리 확인 (decisions, memory, rules, examples, tasks)

## 기술 스택
- **프레임워크**: Next.js 16 (App Router, TypeScript)
- **패키지 매니저**: pnpm
- **스타일링**: Tailwind CSS v4 + shadcn/ui
- **인증**: NextAuth.js (Auth.js v5) - Google OAuth
- **데이터베이스**: Turso (libSQL) + Drizzle ORM
- **음성 API**: ElevenLabs (STT + TTS)
- **번역**: google-translate-api-x (무료)
- **배포**: Vercel (GitHub 자동 배포)

## 디렉토리 구조
```
src/
├── app/                    # Next.js App Router 페이지
│   ├── api/                # API Routes
│   │   ├── auth/           # NextAuth 핸들러
│   │   ├── transcribe/     # 음성 전사 (ElevenLabs STT)
│   │   ├── translate/      # 텍스트 번역
│   │   └── synthesize/     # 음성 합성 (ElevenLabs TTS)
│   ├── dashboard/          # 더빙 서비스 메인 (인증 필요)
│   └── access-denied/      # 화이트리스트 미등록 안내
├── components/             # React 컴포넌트
│   └── ui/                 # shadcn/ui 컴포넌트
├── db/                     # 데이터베이스 (Turso + Drizzle)
│   ├── schema.ts           # Drizzle 스키마
│   └── index.ts            # DB 클라이언트
├── lib/                    # 유틸리티
│   └── auth.ts             # NextAuth 설정
└── middleware.ts            # 인증 미들웨어
```

## 코딩 컨벤션

### 함수 선언
- 화살표 함수 사용 (`const fn = () => {}`)

### 네이밍
- **한글 발음 영어 표기 금지** (의미 있는 영어 단어 사용)
- **클래스**: PascalCase (`UserAccount`)
- **함수/변수**: camelCase (`getUserData`)
- **상수**: SCREAMING_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **컴포넌트 파일**: PascalCase (`LoginForm.tsx`)
- **Hook 파일**: camelCase + `use` 접두사 (`useAuth.ts`)
- **API Route**: kebab-case 폴더 (`/api/transcribe/route.ts`)

### 타입
- interface 우선 사용 (type은 유니온/인터섹션에만)
- Props는 `컴포넌트명Props` 네이밍 (`FileUploadProps`)

### 컴포넌트
- 서버 컴포넌트 기본, 클라이언트 필요시만 "use client" 명시

## 커밋 컨벤션

> Udacity Git Style Guide 기반 (`prefix: subject`)

### 1) 커밋 메시지 형식

```
<prefix>: <subject>

<body>

<footer>
```

- `subject` 50자 이내 권장, 마침표 미사용
- `subject` 명사형/요약형
- `body` / `footer` 선택사항
- (선택) 범위가 필요하면: `<prefix>(<scope>): <subject>`
- **Co-Authored-By 사용 금지** — 커밋에 AI 출처 표시하지 않음

### 2) Prefix 목록

| prefix | 의미 |
| --- | --- |
| `feat` | 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | UI/스타일 변경, 포맷팅(로직 변경 없음) |
| `refactor` | 리팩토링(기능 변경 없음) |
| `test` | 테스트 추가/수정 |
| `chore` | 설정/빌드/패키지 등 |
| `hotfix` | 긴급 수정(배포 후/서비스 중) |

### 3) Scope (선택)

- 컴포넌트: `LoginForm`, `UserProfile`
- 모듈/폴더: `api`, `utils`, `store`
- 기능: `auth`, `routing`, `user`

### 4) 본문(Body) (선택)

- 문장형 지양, **짧은 불릿 나열(2~5줄 권장)**
- "무엇이 바뀌었는지" 중심

```
- ~~
- ~~
- ~~
```

### 5) 푸터(Footer) (선택)

이슈 참조:
```
Closes #123
Resolves #321
Related to #100
```

Breaking Change:
```
BREAKING CHANGE: ~~
- 마이그레이션: ~~
```

### 6) 예시

```
feat: 마이페이지 UI
fix(auth): 토큰 누락 오류
style(button): hover 효과
refactor(user): userService 구조 정리
docs: 브랜치 전략 문서
hotfix(api): 배포 후 500 에러 조치
```

본문 + 이슈:
```
fix(api): 네트워크 타임아웃 처리

- 타임아웃 재시도 로직
- 크래시 방지 예외 처리
- 회귀 테스트 시나리오 확인

Closes #45
```

## 환경변수
```
ELEVENLABS_API_KEY        # ElevenLabs API 키
GOOGLE_CLIENT_ID          # Google OAuth 클라이언트 ID
GOOGLE_CLIENT_SECRET      # Google OAuth 시크릿
NEXTAUTH_URL              # NextAuth URL (로컬: http://localhost:3000)
NEXTAUTH_SECRET           # NextAuth 시크릿 (openssl rand -base64 32)
TURSO_DATABASE_URL        # Turso DB URL
TURSO_AUTH_TOKEN          # Turso 인증 토큰
```

## 주요 API 사용 패턴

### ElevenLabs STT
```typescript
// POST https://api.elevenlabs.io/v1/speech-to-text
// Content-Type: multipart/form-data
// body: { audio: File, model_id: "scribe_v1" }
```

### ElevenLabs TTS
```typescript
// POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
// body: { text, model_id: "eleven_multilingual_v2" }
```

### google-translate-api-x
```typescript
import translate from 'google-translate-api-x';
const res = await translate(text, { to: 'ko' });
```

## 화이트리스트 필수 이메일
- kts123@estsoft.com (반드시 포함)
