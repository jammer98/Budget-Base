const budgets = [
  {
    id: 1,
    category: "Food",
    spent: 7200,
    limit: 10000,
  },
  {
    id: 2,
    category: "Transport",
    spent: 3420,
    limit: 7000,
  },
  {
    id: 3,
    category: "Shopping",
    spent: 2800,
    limit: 8000,
  },
  {
    id: 4,
    category: "Entertainment",
    spent: 3600,
    limit: 5000,
  },
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function BudgetProgress() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-serif text-xl font-medium">
          Budget Progress
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Track your spending against your monthly budgets.
        </p>
      </div>

      <div className="space-y-6">
        {budgets.map((budget) => {
          const percentage = Math.round(
            (budget.spent / budget.limit) * 100
          );

          const progress = Math.min(percentage, 100);

          return (
            <div key={budget.id}>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {budget.category}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(budget.spent)} of{" "}
                    {formatCurrency(budget.limit)}
                  </p>
                </div>

                <span className="text-sm font-medium tabular-nums">
                  {percentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}