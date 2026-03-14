"use client";

import { useState } from "react";
import { toast } from "sonner";
import AudioPlayer from "@/components/audio-player";
import DubbingProgress, { type DubbingStep } from "@/components/dubbing-progress";
import FileUpload from "@/components/file-upload";
import Header from "@/components/header";
import LanguageSelect from "@/components/language-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DubbingResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  audioBase64: string;
  audioContentType: string;
}

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [step, setStep] = useState<DubbingStep>("idle");
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<DubbingResult | null>(null);

  const handleDubbing = async () => {
    if (!file || !targetLanguage) {
      toast.error("파일과 타겟 언어를 모두 선택해주세요.");
      return;
    }

    setResult(null);
    setError("");

    try {
      setStep("uploading");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetLanguage", targetLanguage);

      setStep("transcribing");
      const response = await fetch("/api/dubbing", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "더빙 처리 중 오류가 발생했습니다.");
      }

      setStep("translating");
      await new Promise((r) => setTimeout(r, 500));

      setStep("synthesizing");
      await new Promise((r) => setTimeout(r, 500));

      const data = await response.json();

      setResult({
        originalText: data.originalText,
        translatedText: data.translatedText,
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage,
        audioBase64: data.audioBase64,
        audioContentType: data.audioContentType,
      });

      setStep("complete");
      toast.success("더빙이 완료되었습니다!");
    } catch (err) {
      setStep("error");
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      toast.error(message);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTargetLanguage("");
    setStep("idle");
    setError("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">AI 더빙</h1>
          <p className="mt-2 text-muted-foreground">
            오디오/비디오 파일을 업로드하고 원하는 언어로 더빙하세요
          </p>
        </div>

        <div className="space-y-6">
          <FileUpload
            onFileSelect={setFile}
            disabled={step !== "idle" && step !== "complete" && step !== "error"}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">언어 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageSelect
                value={targetLanguage}
                onChange={(v) => setTargetLanguage(v || "")}
                disabled={
                  step !== "idle" && step !== "complete" && step !== "error"
                }
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={handleDubbing}
              disabled={
                !file ||
                !targetLanguage ||
                (step !== "idle" && step !== "complete" && step !== "error")
              }
              className="flex-1 cursor-pointer disabled:cursor-not-allowed"
            >
              🎙️ 더빙 시작
            </Button>
            {(step === "complete" || step === "error") && (
              <Button size="lg" variant="outline" onClick={handleReset} className="cursor-pointer">
                🔄 다시 시작
              </Button>
            )}
          </div>

          <DubbingProgress step={step} error={error} />

          {result && (
            <AudioPlayer
              audioBase64={result.audioBase64}
              contentType={result.audioContentType}
              originalText={result.originalText}
              translatedText={result.translatedText}
              sourceLanguage={result.sourceLanguage}
              targetLanguage={result.targetLanguage}
            />
          )}
        </div>
      </main>
    </div>
  );
}
