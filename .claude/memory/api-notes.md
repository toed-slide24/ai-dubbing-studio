---
name: API 사용 주의사항
description: ElevenLabs, Google Translate API 호출 시 주의할 점과 제한사항
type: reference
---

## ElevenLabs API
- 무료 플랜: 월 10,000자 제한
- STT 엔드포인트: POST https://api.elevenlabs.io/v1/speech-to-text
  - model_id: "scribe_v1"
  - Content-Type: multipart/form-data
- TTS 엔드포인트: POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
  - model_id: "eleven_multilingual_v2" (다국어 지원)
  - Content-Type: application/json
- 헤더: xi-api-key

## google-translate-api-x
- API 키 불필요 (무료 라이브러리)
- 언어 코드: ko, en, ja, zh-CN, es
- 비공식 API이므로 rate limiting 가능성 있음
- import 방식: import translate from 'google-translate-api-x'

## Turso (libSQL)
- 무료 플랜: 9GB 스토리지, 500M 행 읽기/월
- URL 형식: libsql://[db-name]-[username].turso.io
- @libsql/client로 연결
