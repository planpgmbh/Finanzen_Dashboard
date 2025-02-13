import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PersonnelFilterProps {
  fromYear: number;
  toYear: number;
  onFromYearChange: (year: number) => void;
  onToYearChange: (year: number) => void;
  selectedEmployee: string;
  onEmployeeChange: (employeeId: string) => void;
  employees: Array<{ id: string; name: string; }>;
  availableYears: number[];
}

export function PersonnelFilter({
  fromYear,
  toYear,
  onFromYearChange,
  onToYearChange,
  selectedEmployee,
  onEmployeeChange,
  employees,
  availableYears,
}: PersonnelFilterProps) {
  const SelectWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative inline-block ${className}`}>
      {children}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );

  // Remove duplicate employees and sort by name
  const uniqueEmployees = employees
    .reduce((acc, current) => {
      const exists = acc.find(item => item.name === current.name);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, [] as typeof employees)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Generate year range including future years
  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4 items-center w-full">
          {/* Employee selection */}
          <SelectWrapper className="w-[250px]">
            <select
              value={selectedEmployee}
              onChange={(e) => onEmployeeChange(e.target.value)}
              className="appearance-none h-10 pl-3 pr-8 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full text-gray-900 dark:text-gray-100"
            >
              <option value="">Alle Mitarbeiter</option>
              {uniqueEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </SelectWrapper>

          {/* Year selection */}
          <div className="flex items-center gap-2 ml-auto">
            <SelectWrapper>
              <select
                value={fromYear}
                onChange={(e) => onFromYearChange(Number(e.target.value))}
                className="appearance-none h-10 pl-3 pr-8 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-36 text-gray-900 dark:text-gray-100"
              >
                {yearRange.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </SelectWrapper>
            <span className="text-gray-400">-</span>
            <SelectWrapper>
              <select
                value={toYear}
                onChange={(e) => onToYearChange(Number(e.target.value))}
                className="appearance-none h-10 pl-3 pr-8 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-36 text-gray-900 dark:text-gray-100"
              >
                {yearRange.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </SelectWrapper>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="h-64 bg-white dark:bg-gray-800 rounded-md">
          <canvas id="personnelChart" className="w-full h-full"></canvas>
        </div>
      </div>
    </div>
  );
}