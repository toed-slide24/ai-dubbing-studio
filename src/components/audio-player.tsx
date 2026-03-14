"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AudioPlayerProps {
  audioBase64: string;
  contentType: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  "zh-CN": "中文",
  es: "Español",
};

export default function AudioPlayer({
  audioBase64,
  contentType,
  originalText,
  translatedText,
  sourceLanguage,
  targetLanguage,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioSrc = `data:${contentType};base64,${audioBase64}`;

  const handlePlayPause = () => {
    if (!audioRef.current) {return;}
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioSrc;
    link.download = `dubbed_${targetLanguage}.mp3`;
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎧</span> 더빙 결과
        </CardTitle>
        <CardDescription>
          {LANGUAGE_NAMES[sourceLanguage] || sourceLanguage} →{" "}
          {LANGUAGE_NAMES[targetLanguage] || targetLanguage}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <audio
            ref={audioRef}
            src={audioSrc}
            onEnded={() => setIsPlaying(false)}
            className="w-full"
            controls
            aria-label="더빙된 오디오"
          />
          <div className="flex gap-2">
            <Button
              onClick={handlePlayPause}
              variant="outline"
              size="sm"
              className="cursor-pointer"
              aria-label={isPlaying ? "오디오 일시정지" : "오디오 재생"}
            >
              {isPlaying ? "⏸ 일시정지" : "▶ 재생"}
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
              className="cursor-pointer"
              aria-label="더빙된 오디오 다운로드"
            >
              📥 다운로드
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              원본 텍스트 ({LANGUAGE_NAMES[sourceLanguage] || sourceLanguage})
            </p>
            <p className="text-sm rounded-lg bg-muted p-3">{originalText}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              번역 텍스트 ({LANGUAGE_NAMES[targetLanguage] || targetLanguage})
            </p>
            <p className="text-sm rounded-lg bg-muted p-3">{translatedText}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
