// 표준 클라이언트 컴포넌트 패턴
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExampleComponentProps {
  title: string;
  onAction?: () => void;
}

export default function ExampleComponent({
  title,
  onAction,
}: ExampleComponentProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // API 호출 등
      onAction?.();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleClick} disabled={loading}>
          {loading ? "처리 중..." : "실행"}
        </Button>
      </CardContent>
    </Card>
  );
}
