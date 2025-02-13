export interface Invoice {
  id: number;
  client_key: string;
  number: string;
  purchase_order: string;
  amount: number;
  due_amount: number;
  tax: number;
  tax_amount: number;
  tax2: number;
  tax2_amount: number;
  discount: number | null;
  discount_amount: number;
  subject: string;
  notes: string;
  state: string;
  period_start: string | null;
  period_end: string | null;
  issue_date: string;
  due_date: string;
  payment_term: string;
  sent_at: string | null;
  paid_at: string | null;
  paid_date: string | null;
  closed_at: string | null;
  currency: string;
  client?: {
    id: number;
    name: string;
  };
  line_items: Array<{
    id: number;
    kind: string;
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
    project?: {
      id: number;
      name: string;
      code: string;
    };
  }>;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  unit_price: number | null;
  unit_name: string | null;
}

export interface Project {
  id: number;
  name: string;
  code: string;
}

export interface User {
  id: number;
  name: string;
}

export interface Receipt {
  url: string;
  file_name: string;
  file_size: number;
  content_type: string;
}

export interface Expense {
  id: number;
  notes: string;
  total_cost: number;
  units: number;
  is_closed: boolean;
  is_locked: boolean;
  is_billed: boolean;
  locked_reason: string;
  spent_date: string;
  billable: boolean;
  receipt: Receipt | null;
  user: User;
  project: Project;
  expense_category: ExpenseCategory;
  created_at: string;
  updated_at: string;
}