export interface MonthlyExpense {
  month: number;
  year: number;
  cost: number;
}

export interface RunningCost {
  id: string;
  name: string;
  monthlyData: MonthlyExpense[];
}

export interface YearData {
  id: string;
  year: number;
  costs: RunningCost[];
  totalCost: number;
}