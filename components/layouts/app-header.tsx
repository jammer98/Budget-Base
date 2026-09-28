"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div>
        <h1 className="font-serif text-xl font-medium tracking-tight">
          Dashboard
        </h1>
      </div>

        <div className="flex items-center gap-2">
  <ThemeToggle />

  <Button variant="ghost" size="icon" aria-label="Notifications">
    <Bell className="size-4" />
  </Button>

  <Separator orientation="vertical" className="mx-1 h-6" />

  <Avatar className="size-8">
    <AvatarFallback>AK</AvatarFallback>
  </Avatar>
</div>
    </header>
  );
}