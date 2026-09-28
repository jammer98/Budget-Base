import { AppShell } from "@/components/layouts/app-shell";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  PiggyBank,
} from "lucide-react";

import { SummaryCard } from "@/components/dashboard/summary-card";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { SpendingCategoryChart } from "@/components/dashboard/spending-category-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { BudgetProgress } from "@/components/dashboard/budget-progress";

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm text-muted-foreground">
            Your financial overview
          </p>

          <h2 className="mt-1 font-serif text-3xl font-medium tracking-tight">
            Good morning
          </h2>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Current Balance"
            value="₹42,580"
            icon={Wallet}
            description="Available balance"
          />

          <SummaryCard
            title="Income"
            value="₹65,000"
            icon={ArrowDownLeft}
            description="This month"
          />

          <SummaryCard
            title="Expenses"
            value="₹22,420"
            icon={ArrowUpRight}
            description="This month"
          />

          <SummaryCard
            title="Savings Rate"
            value="65.5%"
            icon={PiggyBank}
            description="This month"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <IncomeExpenseChart />
          </div>

          <div className="lg:col-span-2">
            <SpendingCategoryChart />
          </div>
        </div>

        {/* Transactions + Budgets */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RecentTransactions />
          </div>

          <div className="lg:col-span-2">
            <BudgetProgress />
          </div>
        </div>
      </div>
    </AppShell>
  );
}