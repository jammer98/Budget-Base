"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
      <p className="text-sm text-muted-foreground">
        Signed in as {user?.email}. This is a placeholder — the real expense
        list, filters, and add/edit flow are next.
      </p>
      <Button variant="outline" onClick={logout}>
        Log out
      </Button>
    </div>
  );
}
