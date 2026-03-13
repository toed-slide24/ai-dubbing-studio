# API Route 규칙

## 구조
- 모든 API Route는 `src/app/api/[endpoint]/route.ts`
- HTTP 메서드별 export: `export async function POST(req: NextRequest)`

## 인증
- 보호된 API는 맨 첫 줄에서 세션 체크:
```typescript
const session = await auth();
if (!session) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## 응답 형식
- 성공: `NextResponse.json({ data })`
- 에러: `NextResponse.json({ error: "메시지" }, { status: 코드 })`
- 바이너리(오디오): `new NextResponse(buffer, { headers: { "Content-Type": "audio/mpeg" } })`

## 파일 업로드
- `req.formData()`로 받기
- File 타입 체크 후 처리
- ElevenLabs로 전달 시 새 FormData 생성
