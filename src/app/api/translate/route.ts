import translate from "google-translate-api-x";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { SUPPORTED_LANGUAGE_CODES } from "@/lib/constants";

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
      !SUPPORTED_LANGUAGE_CODES.includes(
        targetLanguage as (typeof SUPPORTED_LANGUAGE_CODES)[number]
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
