import translate from "google-translate-api-x";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const maxDuration = 60;

const getAvailableVoiceId = async (apiKey: string): Promise<string> => {
  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: { "xi-api-key": apiKey },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch voices");
  }

  const data = await response.json();
  const voices = data.voices as Array<{ voice_id: string; category: string }>;

  const clonedVoice = voices.find((v) => v.category === "cloned");
  if (clonedVoice) return clonedVoice.voice_id;

  const generatedVoice = voices.find((v) => v.category === "generated");
  if (generatedVoice) return generatedVoice.voice_id;

  if (voices.length > 0) return voices[0].voice_id;

  throw new Error("No voices available");
};

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

    const sttForm = new FormData();
    sttForm.append("file", file);
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
        { error: `Transcription failed (${sttResponse.status}): ${error}`, step: "transcribe" },
        { status: 500 }
      );
    }

    const sttData = await sttResponse.json();
    const originalText = sttData.text;

    const translateResult = (await translate(originalText, {
      to: targetLanguage,
    })) as { text: string };
    const translatedText = translateResult.text;

    const voiceId = await getAvailableVoiceId(process.env.ELEVENLABS_API_KEY!);

    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
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
        { error: `TTS failed (${ttsResponse.status}): ${error}`, step: "synthesize" },
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
