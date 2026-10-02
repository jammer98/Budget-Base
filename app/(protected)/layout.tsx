import { ProtectedRoute } from "@/components/protected-route";
import { NavHeader } from "@/components/nav-header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <NavHeader />
      {children}
    </ProtectedRoute>
  );
}