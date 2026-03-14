"use client";

import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-lg text-muted-foreground">
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            AI로 음성을
            <span className="text-primary"> 더빙</span>하세요
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            오디오 또는 비디오 파일을 업로드하면, AI가 원하는 언어로 더빙해
            드립니다. ElevenLabs의 최신 음성 AI 기술을 활용합니다.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button
              size="lg"
              className="cursor-pointer"
              onClick={() =>
                signIn("google", { callbackUrl: "/dashboard" })
              }
            >
              Google로 시작하기
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎤</span> 음성 전사
              </CardTitle>
              <CardDescription>
                ElevenLabs Scribe로 오디오를 텍스트로 변환
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                업로드한 파일에서 음성을 자동으로 추출하고, 정확하게
                텍스트로 전사합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌍</span> 다국어 번역
              </CardTitle>
              <CardDescription>
                한국어, 영어, 일본어, 중국어, 스페인어
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                전사된 텍스트를 원하는 언어로 자연스럽게 번역합니다. 5개
                주요 언어를 지원합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔊</span> 음성 합성
              </CardTitle>
              <CardDescription>
                ElevenLabs 다국어 TTS로 자연스러운 음성 생성
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                번역된 텍스트를 자연스러운 음성으로 합성하여 더빙
                결과물을 제공합니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with Claude Code · ESTsoft Perso AI DevRel
        </div>
      </footer>
    </div>
  );
}
