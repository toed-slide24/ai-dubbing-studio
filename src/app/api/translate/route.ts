import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import translate from "google-translate-api-x";

const SUPPORTED_LANGUAGES = ["ko", "en", "ja", "zh-CN", "es"] as const;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing text or targetLanguage" },
        { status: 400 }
      );
    }

    if (
      !SUPPORTED_LANGUAGES.includes(
        targetLanguage as (typeof SUPPORTED_LANGUAGES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    const result = (await translate(text, { to: targetLanguage })) as {
      text: string;
      from: { language: { iso: string } };
    };

    return NextResponse.json({
      translatedText: result.text,
      sourceLanguage: result.from.language.iso,
    });
  } catch (error) {
    console.error("Translate error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
