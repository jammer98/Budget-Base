
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />

        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
