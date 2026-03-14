"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎙️</span>
          <h1 className="text-xl font-bold">AI Dubbing Studio</h1>
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" className="relative h-10 w-10 rounded-full" />}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session.user.image || ""}
                    alt={session.user.name || ""}
                  />
                  <AvatarFallback>
                    {session.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="cursor-pointer" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
              Google로 로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
