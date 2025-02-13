export interface MonthlyEntry {
  month: number;
  cost: number;
}

export interface RunningCost {
  id: string;
  name: string;
  monthlyData: MonthlyEntry[];
}

export interface YearData {
  id: string;
  year: number;
  costs: RunningCost[];
  totalCost: number;
}