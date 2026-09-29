// ---- Auth -------------------------------------------------------------------

export interface User {
  id: number;
  name: string;
  email: string;
  createdat: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ---- Categories ---------------------------------------------------------------

export interface Category {
  id: number;
  name: string;
}
// ---- Expenses -------------------------------------------------------------------

/** Raw shape from the API. `amount` is a string — cast with Number() before math/formatting. */
export interface Expense {
  id: number;
  userid: number;
  categoryid: number | null;
  categoryname: string | null;
  amount: string;
  description: string | null;
  spenton: string; // "YYYY-MM-DD"
  createdat: string;
}

export interface ExpenseResponse {
  expense: Expense;
}

export interface ExpenseListResponse {
  expenses: Expense[];
}

export interface ExpenseListParams {
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateExpenseInput {
  categoryId?: number;
  amount: number;
  description?: string;
  spentOn: string; // "YYYY-MM-DD"
}

export type UpdateExpenseInput = Partial<CreateExpenseInput>;

// ---- Reports ----------------------------------------------------------------------

export interface SummaryByCategory {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export interface SummaryReport {
  startDate: string;
  endDate: string;
  total: number;
  expenseCount: number;
  byCategory: SummaryByCategory[];
}

export interface SummaryReportResponse {
  report: SummaryReport;
}

export interface TrendPoint {
  day: string;
  total: number;
  runningBalance: number;
  movingAvg7d: number;
}

export interface TrendResponse {
  trend: TrendPoint[];
}

export interface MonthOverMonthRow {
  categoryId: number;
  category: string;
  month: string;
  total: number;
  prevTotal: number | null;
  change: number | null;
  percentChange: number | null;
}

export interface MonthOverMonthResponse {
  monthOverMonth: MonthOverMonthRow[];
}

export interface BudgetStatusRow {
  categoryId: number;
  category: string;
  monthlyLimit: number;
  spent: number;
  overBudget: boolean;
  percentUsed: number;
}

export interface BudgetStatusResponse {
  budgetStatus: BudgetStatusRow[];
}
// ---- Budgets ----------------------------------------------------------------------

export interface Budget {
  id: number;
  categoryid: number;
  categoryname: string;
  /** Assuming NUMERIC → string, same driver behavior as `amount`. Worth confirming. */
  monthlylimit: string;
}

export interface BudgetListResponse {
  budgets: Budget[];
}

export interface CreateBudgetInput {
  categoryId: number;
  monthlyLimit: number;
}

export interface CreateBudgetResponse {
  budget: {
    id: number;
    categoryid: number;
    monthlylimit: string;
  };
}

// ---- Errors -----------------------------------------------------------------------

export interface ApiErrorBody {
  error: string;
}
