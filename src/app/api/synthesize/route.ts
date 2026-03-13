import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// ElevenLabs 다국어 음성 ID 매핑
const VOICE_MAP: Record<string, string> = {
  ko: "jBpfAFnaylXS5xSIHfVj", // Korean voice
  en: "21m00Tcm4TlvDq8ikWAM", // Rachel - English
  ja: "jBpfAFnaylXS5xSIHfVj", // Japanese voice
  "zh-CN": "jBpfAFnaylXS5xSIHfVj", // Chinese voice
  es: "jBpfAFnaylXS5xSIHfVj", // Spanish voice
};

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

    const voiceId = VOICE_MAP[targetLanguage] || VOICE_MAP["en"];

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("ElevenLabs TTS error:", error);
      return NextResponse.json(
        { error: "Speech synthesis failed" },
        { status: 500 }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="dubbed_${targetLanguage}.mp3"`,
      },
    });
  } catch (error) {
    console.error("Synthesize error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
