"use client";

import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto flex max-w-lg items-center justify-center px-4 py-20">
        <Card className="w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 text-6xl">🚫</div>
            <CardTitle className="text-2xl">접근이 제한되었습니다</CardTitle>
            <CardDescription className="text-base">
              현재 사용 중인 Google 계정의 이메일이 허용 리스트에 등록되어 있지
              않습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              서비스 이용을 원하시면 관리자에게 이메일 등록을 요청해주세요.
            </p>
            <Link href="/">
              <Button variant="outline" className="cursor-pointer">홈으로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
