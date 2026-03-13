import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing text or targetLanguage" },
        { status: 400 }
      );
    }

    const voiceId = await getAvailableVoiceId(process.env.ELEVENLABS_API_KEY!);

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
