import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://ai-dubbing-studio.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "AI Dubbing Studio - AI 음성 더빙 서비스",
    template: "%s | AI Dubbing Studio",
  },
  description:
    "오디오/비디오 파일을 업로드하면 AI가 음성을 인식하고, 번역하고, 새로운 음성으로 더빙합니다. ElevenLabs STT/TTS + 다국어 번역 지원.",
  keywords: [
    "AI 더빙",
    "음성 더빙",
    "AI dubbing",
    "음성 번역",
    "ElevenLabs",
    "STT",
    "TTS",
    "다국어 더빙",
  ],
  openGraph: {
    type: "website",
    title: "AI Dubbing Studio - AI 음성 더빙 서비스",
    description:
      "오디오/비디오 파일을 업로드하면 AI가 음성 인식, 번역, 음성 합성을 한 번에 처리합니다.",
    url: BASE_URL,
    siteName: "AI Dubbing Studio",
    locale: "ko_KR",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(BASE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
