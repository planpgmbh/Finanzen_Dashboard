export interface SalaryComponent {
  grundgehalt: number;
  krankenversicherung: number;
  rentenversicherung: number;
  arbeitslosenversicherung: number;
  pflegeversicherung: number;
  insolvenzgeldumlage: number;
  umlageU1: number;
  umlageU2: number;
}

export interface MonthlyData extends SalaryComponent {
  month: number;
  year: number;
}

export interface Employee {
  id: string;          // global_employee_id
  name: string;
  monthlyData: MonthlyData[];
}

export interface YearData {
  id: string;          // year_id
  year: number;
  employees: Employee[];
  totalCost: number;   // from personnel_year_costs view
}