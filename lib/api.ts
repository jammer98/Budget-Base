import type {
  ApiErrorBody,
  AuthResponse,
  Budget,
  BudgetListResponse,
  BudgetStatusResponse,
  Category,
  CreateBudgetInput,
  CreateBudgetResponse,
  CreateExpenseInput,
  Expense,
  ExpenseListParams,
  ExpenseListResponse,
  ExpenseResponse,
  LoginInput,
  MonthOverMonthResponse,
  RegisterInput,
  SummaryReportResponse,
  TrendResponse,
  UpdateExpenseInput,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class NetworkError extends Error {
  constructor(
    message = "Could not reach the server. If it's been idle, waking it up can take up to a minute — please try again."
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

/**
 * Registered once by AuthProvider. Lets a 401 on any *authenticated* request
 * clear the session and redirect to /login globally, instead of each page
 * showing its own stale inline error while silently leaving a dead token
 * sitting in localStorage.
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  token?: string | null;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
}

function buildQueryString(query?: RequestOptions["query"]): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it to .env.local — see .env.local.example."
    );
  }

  const { method = "GET", token, body, query } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}${buildQueryString(query)}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new NetworkError();
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let data: unknown = {};
  let parseFailed = false;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // Non-JSON body — typically an HTML error page from a cold-starting or
    // misbehaving server, not something the caller can act on directly.
    parseFailed = true;
  }

  if (!response.ok || parseFailed) {
    const message = parseFailed
      ? "The server sent back an unexpected response — it may still be waking up. Please try again in a moment."
      : (data as ApiErrorBody)?.error ?? `Request failed (${response.status})`;

    // A 401 on a request that *did* carry a token means the session itself
    // is invalid/expired — not just "you're logged out yet" (login/register
    // calls never pass a token, so they can't trigger this).
    if (response.status === 401 && token) {
      unauthorizedHandler?.();
    }

    throw new ApiError(response.status, message);
  }

  return data as T;
}

// ---- Auth -----------------------------------------------------------------

export const register = (input: RegisterInput) =>
  request<AuthResponse>("/api/auth/register", { method: "POST", body: input });

export const login = (input: LoginInput) =>
  request<AuthResponse>("/api/auth/login", { method: "POST", body: input });

// ---- Categories -------------------------------------------------------------

export const getCategories = (token: string) =>
  request<{ categories: Category[] }>("/api/categories", { token });

export const createCategory = (token: string, name: string) =>
  request<{ category: Category }>("/api/categories", { method: "POST", token, body: { name } });

// ---- Expenses ---------------------------------------------------------------

export const getExpenses = (token: string, params: ExpenseListParams = {}) =>
  request<ExpenseListResponse>("/api/expenses", { token, query: { ...params } });

export const getExpense = (token: string, id: number) =>
  request<ExpenseResponse>(`/api/expenses/${id}`, { token });

export const createExpense = (token: string, input: CreateExpenseInput) =>
  request<ExpenseResponse>("/api/expenses", { method: "POST", token, body: input });

export const updateExpense = (token: string, id: number, input: UpdateExpenseInput) =>
  request<ExpenseResponse>(`/api/expenses/${id}`, { method: "PATCH", token, body: input });

export const deleteExpense = (token: string, id: number) =>
  request<void>(`/api/expenses/${id}`, { method: "DELETE", token });

// ---- Reports ------------------------------------------------------------------

export const getSummaryReport = (token: string, startDate: string, endDate: string) =>
  request<SummaryReportResponse>("/api/reports/summary", { token, query: { startDate, endDate } });

export const getTrendReport = (token: string, startDate: string, endDate: string) =>
  request<TrendResponse>("/api/reports/trend", { token, query: { startDate, endDate } });

export const getMonthOverMonth = (token: string) =>
  request<MonthOverMonthResponse>("/api/reports/month-over-month", { token });

export const getBudgetStatus = (token: string, month: string) =>
  request<BudgetStatusResponse>("/api/reports/budget-status", { token, query: { month } });

// ---- Budgets --------------------------------------------------------------------

export const getBudgets = (token: string) =>
  request<BudgetListResponse>("/api/budgets", { token });

export const upsertBudget = (token: string, input: CreateBudgetInput) =>
  request<CreateBudgetResponse>("/api/budgets", { method: "POST", token, body: input });

// ---- Health -----------------------------------------------------------------------

export const checkHealth = () => request<{ status: string }>("/health");