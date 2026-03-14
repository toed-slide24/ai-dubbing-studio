interface ElevenLabsVoice {
  voice_id: string;
  category: string;
}

export const getAvailableVoiceId = async (apiKey: string): Promise<string> => {
  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: { "xi-api-key": apiKey },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch voices");
  }

  const data = await response.json();
  const voices = data.voices as ElevenLabsVoice[];

  const clonedVoice = voices.find((v) => v.category === "cloned");
  if (clonedVoice) return clonedVoice.voice_id;

  const generatedVoice = voices.find((v) => v.category === "generated");
  if (generatedVoice) return generatedVoice.voice_id;

  if (voices.length > 0) return voices[0].voice_id;

  throw new Error("No voices available");
};
