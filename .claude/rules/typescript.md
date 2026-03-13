# TypeScript 규칙

## 타입 정의
- interface 우선 사용 (type은 유니온/인터섹션에만)
- Props는 `컴포넌트명Props` 네이밍: `interface FileUploadProps { ... }`
- API 응답 타입은 `src/types/` 또는 해당 파일에 정의

## import 규칙
- 절대 경로 사용: `@/components/...`, `@/lib/...`, `@/db/...`
- 상대 경로는 같은 디렉토리 내에서만

## 네이밍
- 컴포넌트: PascalCase (`FileUpload`)
- 파일명: kebab-case (`file-upload.tsx`)
- 변수/함수: camelCase (`handleUpload`)
- 상수: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)
- API Route: kebab-case 폴더 (`/api/transcribe/route.ts`)

## 에러 핸들링
- API Route: try-catch + NextResponse.json({ error: "..." }, { status: ... })
- 클라이언트: try-catch + 사용자 친화적 에러 메시지 (toast)
