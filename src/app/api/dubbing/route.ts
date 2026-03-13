import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import translate from "google-translate-api-x";

// ElevenLabs 다국어 음성 ID (기본 multilingual voice)
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetLanguage = formData.get("targetLanguage") as string | null;

    if (!file || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing file or targetLanguage" },
        { status: 400 }
      );
    }

    // Step 1: 음성 전사 (ElevenLabs STT)
    const sttForm = new FormData();
    sttForm.append("audio", file);
    sttForm.append("model_id", "scribe_v1");

    const sttResponse = await fetch(
      "https://api.elevenlabs.io/v1/speech-to-text",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        },
        body: sttForm,
      }
    );

    if (!sttResponse.ok) {
      const error = await sttResponse.text();
      console.error("STT error:", error);
      return NextResponse.json(
        { error: "Transcription failed", step: "transcribe" },
        { status: 500 }
      );
    }

    const sttData = await sttResponse.json();
    const originalText = sttData.text;

    // Step 2: 번역 (google-translate-api-x)
    const translateResult = (await translate(originalText, {
      to: targetLanguage,
    })) as { text: string };
    const translatedText = translateResult.text;

    // Step 3: 음성 합성 (ElevenLabs TTS)
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: translatedText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const error = await ttsResponse.text();
      console.error("TTS error:", error);
      return NextResponse.json(
        { error: "Speech synthesis failed", step: "synthesize" },
        { status: 500 }
      );
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({
      originalText,
      translatedText,
      sourceLanguage: sttData.language_code,
      targetLanguage,
      audioBase64,
      audioContentType: "audio/mpeg",
    });
  } catch (error) {
    console.error("Dubbing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
