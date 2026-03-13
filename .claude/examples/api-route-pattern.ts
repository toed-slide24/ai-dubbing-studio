// 표준 API Route 패턴
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // 1. 인증 체크
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. 요청 파싱
    const body = await req.json();
    // 또는 FormData: const formData = await req.formData();

    // 3. 유효성 검사
    if (!body.requiredField) {
      return NextResponse.json(
        { error: "Missing required field" },
        { status: 400 }
      );
    }

    // 4. 비즈니스 로직

    // 5. 성공 응답
    return NextResponse.json({ data: "result" });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
