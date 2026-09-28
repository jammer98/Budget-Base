import {
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Wallet,
} from "lucide-react";

const transactions = [
  {
    id: 1,
    name: "Salary",
    category: "Income",
    amount: 65000,
    type: "income",
    icon: Wallet,
  },
  {
    id: 2,
    name: "Rent",
    category: "Housing",
    amount: 12000,
    type: "expense",
    icon: Home,
  },
  {
    id: 3,
    name: "Swiggy",
    category: "Food",
    amount: 580,
    type: "expense",
    icon: Utensils,
  },
  {
    id: 4,
    name: "Uber",
    category: "Transport",
    amount: 320,
    type: "expense",
    icon: Car,
  },
  {
    id: 5,
    name: "Amazon",
    category: "Shopping",
    amount: 1899,
    type: "expense",
    icon: ShoppingBag,
  },
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function RecentTransactions() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-medium">
            Recent Transactions
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Your latest income and expenses.
          </p>
        </div>

        <button className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-1">
        {transactions.map((transaction) => {
          const Icon = transaction.icon;
          const isIncome = transaction.type === "income";

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2.5">
                  <Icon className="size-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {transaction.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {transaction.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isIncome ? (
                  <ArrowDownLeft className="size-4 text-primary" />
                ) : (
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                )}

                <span
                  className={`text-sm font-medium tabular-nums ${
                    isIncome ? "text-primary" : ""
                  }`}
                >
                  {isIncome ? " + " : " - "}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}