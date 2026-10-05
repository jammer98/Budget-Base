"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import * as React from "react";
import { ArrowRight, CalendarDays, Filter, Plus, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/format";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ShaderGradientScene = dynamic(
  () => import("@/components/shader-gradient").then((module) => module.ShaderGradientScene),
  { ssr: false, loading: () => null }
);

const expenses = [
  { category: "Food", note: "Dinner with friends", date: "04 Oct 2026", amount: 860 },
  { category: "Transport", note: "Metro recharge", date: "03 Oct 2026", amount: 420 },
  { category: "Utilities", note: "Electricity bill", date: "01 Oct 2026", amount: 1840 },
  { category: "Rent", note: "October rent", date: "01 Oct 2026", amount: 28000 },
];

const budgets = [
  { category: "Food", spent: 7400, limit: 8000, percent: 92 },
  { category: "Transport", spent: 3200, limit: 3000, percent: 100, over: true },
  { category: "Utilities", spent: 1840, limit: 4000, percent: 46 },
];

const reportBars = [
  { category: "Rent", amount: 28000, width: "100%" },
  { category: "Food", amount: 7400, width: "46%" },
  { category: "Utilities", amount: 4000, width: "27%" },
  { category: "Transport", amount: 3200, width: "22%" },
];

function themeColor(variable: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  if (!value) return fallback;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  if (!context) return fallback;
  context.fillStyle = value;
  context.fillRect(0, 0, 1, 1);
  const pixel = context.getImageData(0, 0, 1, 1).data;
  return `#${[pixel[0], pixel[1], pixel[2]].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function StaticGradient({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 ${className}`}
      style={{
        background:
          "radial-gradient(circle at 18% 18%, color-mix(in oklch, var(--primary) 82%, var(--background)) 0%, transparent 46%), radial-gradient(circle at 82% 76%, color-mix(in oklch, var(--secondary) 88%, var(--primary)) 0%, transparent 52%), var(--background)",
      }}
    />
  );
}

class ShaderBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function HeroBackground() {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = React.useState<[string, string, string] | null>(null);
  const [canAnimate, setCanAnimate] = React.useState(false);
  const heroRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = document.documentElement;
    const updateColors = () => {
      setColors([
        themeColor("--primary", "#3f6f5b"),
        themeColor("--background", "#f6f5ed"),
        themeColor("--secondary", "#dfeadf"),
      ]);
    };
    updateColors();
    const observer = new MutationObserver(updateColors);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    return () => observer.disconnect();
  }, [resolvedTheme]);

  React.useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const webgl = document.createElement("canvas").getContext("webgl");
    if (reduceMotion.matches || !webgl) return;
    const mediaListener = () => setCanAnimate(!reduceMotion.matches);
    reduceMotion.addEventListener("change", mediaListener);
    const visibilityListener = () => setCanAnimate(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", visibilityListener);
    const intersection = new IntersectionObserver(
      ([entry]) => setCanAnimate(entry.isIntersecting && document.visibilityState === "visible" && !reduceMotion.matches),
      { threshold: 0.05 }
    );
    if (heroRef.current) intersection.observe(heroRef.current);
    return () => {
      reduceMotion.removeEventListener("change", mediaListener);
      document.removeEventListener("visibilitychange", visibilityListener);
      intersection.disconnect();
    };
  }, []);

  const pixelDensity = typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches ? 1 : 1.5;

  return (
    <div ref={heroRef} className="absolute inset-0 overflow-hidden">
      <StaticGradient />
      {canAnimate && colors && (
        <ShaderBoundary>
          <ShaderGradientScene colors={colors} pixelDensity={pixelDensity} />
        </ShaderBoundary>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/75" />
    </div>
  );
}

function WindowFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl shadow-primary/10">
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
        <span className="size-2 rounded-full bg-destructive/60" />
        <span className="size-2 rounded-full bg-chart-5" />
        <span className="size-2 rounded-full bg-primary/60" />
        <span className="ml-3 text-xs text-muted-foreground">{title}</span>
      </div>
      {children}
    </div>
  );
}

function DashboardPreview() {
  return (
    <WindowFrame title="Budget Base / Dashboard">
      <div className="grid gap-4 p-4 sm:grid-cols-[1.1fr_0.9fr] sm:p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">October 2026</p>
            <p className="mt-1 font-serif text-2xl font-semibold">₹40,840</p>
            <p className="text-xs text-muted-foreground">total spent this month</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[68%] rounded-full bg-primary" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["Food", "Rent", "Transport", "Utilities"].map((category, index) => (
              <div key={category} className="rounded-lg border border-border/70 p-3">
                <p className="text-xs text-muted-foreground">{category}</p>
                <p className="mt-1 text-sm font-medium tabular-nums">
                  {formatCurrency([7400, 28000, 3200, 1840][index])}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-muted/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium">Recent expenses</p>
            <Plus className="size-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {expenses.slice(0, 3).map((expense) => (
              <div key={expense.note} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{expense.category}</p>
                  <p className="truncate text-xs text-muted-foreground">{expense.note}</p>
                </div>
                <span className="shrink-0 tabular-nums">{formatCurrency(expense.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function ExpensesPreview() {
  return (
    <WindowFrame title="Expenses">
      <div className="space-y-4 p-4 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <div className="relative"><Filter className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" /><Input aria-label="Filter by category" placeholder="Filter category" className="h-8 pl-8 text-xs" /></div>
          <div className="relative"><CalendarDays className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" /><Input aria-label="Filter by date range" placeholder="Date range" className="h-8 pl-8 text-xs" /></div>
          <Button size="sm" className="h-8"><Plus className="size-3.5" /> Add expense</Button>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Category</TableHead><TableHead className="hidden sm:table-cell">Date</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
          <TableBody>{expenses.map((expense) => <TableRow key={expense.note}><TableCell><p className="font-medium">{expense.category}</p><p className="text-xs text-muted-foreground">{expense.note}</p></TableCell><TableCell className="hidden text-muted-foreground sm:table-cell">{expense.date}</TableCell><TableCell className="text-right tabular-nums">{formatCurrency(expense.amount)}</TableCell></TableRow>)}</TableBody>
        </Table>
      </div>
    </WindowFrame>
  );
}

function BudgetsPreview() {
  return (
    <WindowFrame title="Budgets / October 2026">
      <div className="space-y-5 p-4 sm:p-6">
        {budgets.map((budget) => <div key={budget.category} className="space-y-2"><div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium">{budget.category}</span>{budget.over ? <Badge variant="destructive">Over budget</Badge> : <span className="tabular-nums text-muted-foreground">{formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}</span>}</div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${budget.over ? "bg-destructive" : "bg-primary"}`} style={{ width: `${budget.percent}%` }} /></div></div>)}
      </div>
    </WindowFrame>
  );
}

function ReportsPreview() {
  return (
    <WindowFrame title="Reports / October 2026">
      <div className="space-y-4 p-4 sm:p-6">
        <div className="flex items-center justify-between"><p className="text-sm font-medium">Spending by category</p><TrendingUp className="size-4 text-primary" /></div>
        {reportBars.map((bar) => <div key={bar.category} className="grid grid-cols-[76px_1fr_auto] items-center gap-3 text-xs"><span className="text-muted-foreground">{bar.category}</span><div className="h-3 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: bar.width }} /></div><span className="tabular-nums">{formatCurrency(bar.amount)}</span></div>)}
        <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs"><span className="text-muted-foreground">Daily trend</span><span className="text-right font-medium">₹2,160 average</span><span className="text-muted-foreground">vs September</span><span className="text-right font-medium text-primary">12% lower</span></div>
      </div>
    </WindowFrame>
  );
}

function FeatureSection({ title, children, preview, reversed = false }: { title: string; children: React.ReactNode; preview: React.ReactNode; reversed?: boolean }) {
  return <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-24"><div className={reversed ? "lg:order-2" : ""}><h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">{title}</h2><div className="mt-4 max-w-md space-y-3 text-muted-foreground">{children}</div></div><div className={reversed ? "lg:order-1" : ""}>{preview}</div></section>;
}

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const primaryHref = user ? "/dashboard" : "/register";
  const primaryLabel = user ? "Open dashboard" : "Get started";

  return (
    <main className="overflow-hidden">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight">Budget Base</Link>
        <nav className="flex items-center gap-2 sm:gap-5">
          <ModeToggle />
          <Link href="/login" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline">Log in</Link>
          <Button asChild size="sm"><Link href={primaryHref}>{isLoading ? "Get started" : primaryLabel}</Link></Button>
        </nav>
      </header>

      <section className="relative min-h-[760px] px-5 pb-0 pt-20 sm:px-8 sm:pt-28">
        <HeroBackground />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mx-auto max-w-3xl font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">Know where your money goes.</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-foreground/75 sm:text-lg">Log expenses, set monthly budgets and see your spending patterns in one place.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild size="lg"><Link href={primaryHref}>{primaryLabel}<ArrowRight className="size-4" /></Link></Button><Button asChild variant="outline" size="lg" className="bg-background/30"><Link href="/login">Log in</Link></Button></div>
        </div>
        <div className="relative z-10 mx-auto mt-20 max-w-5xl translate-y-20"><DashboardPreview /></div>
      </section>

      <div className="bg-background pt-28">
        <FeatureSection title="Log expenses in seconds" preview={<ExpensesPreview />}>
          <p>Add an expense, assign a category, and keep moving. Filter the list by category or date range whenever you need a closer look.</p>
          <p className="text-sm">Amounts and dates stay familiar: ₹, lakh grouping, and DD Mon YYYY.</p>
        </FeatureSection>
        <FeatureSection title="Stay inside your budget" preview={<BudgetsPreview />} reversed>
          <p>Set a monthly limit for each category and see exactly how much is used as the month unfolds.</p>
          <p>When spending passes a limit, an “Over budget” status makes it clear where to pay attention.</p>
        </FeatureSection>
        <FeatureSection title="See where it goes" preview={<ReportsPreview />}>
          <p>Understand your spending with a category summary, a daily trend, and a month-over-month comparison.</p>
          <p>Clear views turn a pile of transactions into a plan you can act on.</p>
        </FeatureSection>
      </div>

      <section className="border-t border-border bg-primary px-5 py-20 text-center text-primary-foreground sm:py-28">
        <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">Start tracking today.</h2>
        <p className="mx-auto mt-4 max-w-md text-primary-foreground/75">A calmer way to keep your spending in view.</p>
        <Button asChild size="lg" variant="secondary" className="mt-8"><Link href={primaryHref}>{primaryLabel}<ArrowRight className="size-4" /></Link></Button>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span className="font-serif text-base font-medium text-foreground">Budget Base</span>
        <div className="flex gap-5"><Link href="/login" className="hover:text-foreground">Log in</Link><Link href={primaryHref} className="hover:text-foreground">{primaryLabel}</Link></div>
        <span>© 2026 Budget Base</span>
      </footer>
    </main>
  );
}
