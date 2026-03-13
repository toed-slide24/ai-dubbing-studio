# MVP 체크리스트

## Phase 0: 프로젝트 기반 ✅
- [x] Next.js 프로젝트 초기화 (pnpm)
- [x] CLAUDE.md 작성
- [x] .claude/ 폴더 구조 세팅
- [x] shadcn/ui 초기화 + 필수 컴포넌트 추가
- [x] 환경변수 템플릿 (.env.example)

## Phase 1: 데이터베이스 ✅
- [x] Drizzle 스키마 정의 (allowed_emails)
- [x] DB 클라이언트 설정
- [x] drizzle.config.ts 설정
- [ ] Turso DB 생성 및 마이그레이션 (배포 시 수동)
- [ ] kts123@estsoft.com 시드 데이터 (배포 시 수동)

## Phase 2: 인증 ✅
- [x] NextAuth.js 설정 (Google OAuth)
- [x] 화이트리스트 signIn 콜백
- [x] 미들웨어 (dashboard 보호)
- [x] Auth API Route
- [ ] Google Cloud Console OAuth 클라이언트 생성 (배포 시 수동)

## Phase 3: AI 더빙 기능 ✅
- [x] /api/transcribe (ElevenLabs STT)
- [x] /api/translate (google-translate-api-x)
- [x] /api/synthesize (ElevenLabs TTS)
- [x] /api/dubbing (통합 파이프라인)

## Phase 4: UI/UX ✅
- [x] 랜딩 페이지 (로그인 버튼)
- [x] 대시보드 (더빙 서비스 메인)
- [x] 파일 업로드 컴포넌트
- [x] 언어 선택 컴포넌트
- [x] 진행 상태 표시
- [x] 결과 재생/다운로드
- [x] access-denied 페이지
- [x] 헤더/네비게이션
- [x] 빌드 성공 확인

## Phase 5: 배포 🔄
- [ ] GitHub 레포 생성 + 초기 푸시
- [ ] Vercel 프로젝트 연동
- [ ] 환경변수 설정 (ElevenLabs, Google OAuth, Turso, NextAuth)
- [ ] Turso DB 마이그레이션 + 시드
- [ ] 배포 확인 + 동작 테스트

## Phase 6: 문서화 ⬜
- [ ] README.md 작성 (프로젝트 소개, 기술 스택, 설치 방법)
- [ ] 코딩 에이전트 활용 노하우 섹션
- [ ] 배포 URL 포함
