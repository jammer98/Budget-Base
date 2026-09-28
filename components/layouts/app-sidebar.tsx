"use client";

import Link from "next/link";
import {
  BarChart3,
  LayoutDashboard,
  Receipt,
  Settings,
  Wallet,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Receipt,
  },
  {
    name: "Budgets",
    href: "/budgets",
    icon: Wallet,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r bg-sidebar md:flex md:flex-col">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="font-serif text-2xl font-semibold">
          Budget Base
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Icon className="size-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="size-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}