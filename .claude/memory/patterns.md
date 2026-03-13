---
name: 코드 패턴 및 실수 방지
description: AI Dubbing Studio 프로젝트의 코드 패턴, 자주 하는 실수 방지법
type: project
---

## 코드 패턴

### 컴포넌트 구조
- 서버 컴포넌트가 기본, "use client"는 필요한 경우만
- Props는 interface로 정의, 컴포넌트명+Props 네이밍
- shadcn/ui 컴포넌트는 src/components/ui/에서 import

### API Route 패턴
- 모든 API Route에서 auth() 세션 체크 먼저
- try-catch로 에러 핸들링 필수
- NextResponse.json()으로 일관된 응답 형식

### 자주 하는 실수
- ElevenLabs API 호출 시 FormData와 JSON body 혼동하지 말 것
  - STT: FormData (audio 파일 전송)
  - TTS: JSON body (text 전송)
- google-translate-api-x에서 중국어는 "zh-CN" (zh 아님)
- NextAuth v5에서는 auth() 함수로 세션 가져옴 (getServerSession 아님)
