const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (Vercel 제한 4.5MB 대비 여유)

const isVideoFile = (file: File): boolean => file.type.startsWith('video/');

const writeString = (view: DataView, offset: number, str: string) => {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
};

const encodeWAV = (samples: Float32Array, sampleRate: number): Blob => {
  const dataLength = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

/**
 * 비디오 파일에서 오디오를 추출하고, 크기가 큰 파일은 다운샘플링하여
 * Vercel 서버리스 함수의 요청 크기 제한(4.5MB) 내로 줄임
 */
export const extractAudio = async (file: File): Promise<File> => {
  if (!isVideoFile(file) && file.size <= MAX_FILE_SIZE) {
    return file;
  }

  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const duration = audioBuffer.duration;

    // WAV 크기 = 44 + duration * sampleRate * 2 (16-bit mono)
    const maxSamples = (MAX_FILE_SIZE - 44) / 2;
    const maxSampleRate = Math.floor(maxSamples / duration);
    const targetSampleRate = Math.min(16000, maxSampleRate);

    if (targetSampleRate < 8000) {
      // 오디오가 너무 길어 최소 품질로도 제한 내 불가 → 원본 반환
      return file;
    }

    const offlineCtx = new OfflineAudioContext(1, Math.ceil(duration * targetSampleRate), targetSampleRate);

    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start(0);

    const rendered = await offlineCtx.startRendering();
    const wavBlob = encodeWAV(rendered.getChannelData(0), targetSampleRate);

    const newName = file.name.replace(/\.[^.]+$/, '.wav');
    return new File([wavBlob], newName, { type: 'audio/wav' });
  } catch {
    // 디코딩 실패 시 원본 반환
    return file;
  } finally {
    await audioContext.close();
  }
};
