"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export type DubbingStep =
  | "idle"
  | "uploading"
  | "transcribing"
  | "translating"
  | "synthesizing"
  | "complete"
  | "error";

interface DubbingProgressProps {
  step: DubbingStep;
  error?: string;
}

const STEPS: Record<
  DubbingStep,
  { label: string; progress: number; icon: string }
> = {
  idle: { label: "대기 중", progress: 0, icon: "⏳" },
  uploading: { label: "파일 업로드 중...", progress: 10, icon: "📤" },
  transcribing: {
    label: "음성을 텍스트로 전사 중...",
    progress: 30,
    icon: "🎤",
  },
  translating: { label: "텍스트 번역 중...", progress: 60, icon: "🌍" },
  synthesizing: { label: "음성 합성 중...", progress: 85, icon: "🔊" },
  complete: { label: "더빙 완료!", progress: 100, icon: "✅" },
  error: { label: "오류가 발생했습니다", progress: 0, icon: "❌" },
};

export default function DubbingProgress({
  step,
  error,
}: DubbingProgressProps) {
  const current = STEPS[step];

  if (step === "idle") {return null;}

  return (
    <Card aria-live="polite" aria-atomic="true" role="status">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span aria-hidden="true">{current.icon}</span>
          {current.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === "error" ? (
          <p className="text-sm text-destructive" role="alert">
            {error || "알 수 없는 오류가 발생했습니다."}
          </p>
        ) : (
          <Progress
            value={current.progress}
            className="h-2"
            aria-label={`더빙 진행률 ${current.progress}%`}
          />
        )}
      </CardContent>
    </Card>
  );
}
