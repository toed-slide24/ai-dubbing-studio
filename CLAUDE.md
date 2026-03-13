# AI Dubbing Studio - CLAUDE.md

## 프로젝트 개요
ESTsoft Perso AI DevRel 인턴 채용 과제로, AI 더빙 웹 서비스를 구축하는 프로젝트.
비디오/오디오 파일을 업로드하면 원하는 언어로 더빙해주는 서비스.

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
- 컴포넌트: PascalCase (예: FileUpload.tsx → export default function FileUpload)
- 파일명: kebab-case (예: file-upload.tsx, language-select.tsx)
- API Route: kebab-case 폴더 (예: /api/transcribe/route.ts)
- 타입: interface 우선 사용, Props는 컴포넌트명+Props (예: FileUploadProps)
- 서버 컴포넌트 기본, 클라이언트 필요시만 "use client" 명시

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

## 커밋 규칙
- feat: 새 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 리팩토링
- chore: 빌드, 설정 변경
- 모든 커밋에 Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com> 포함

## 화이트리스트 필수 이메일
- kts123@estsoft.com (반드시 포함)
