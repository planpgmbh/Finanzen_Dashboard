import React from 'react';
import { MonthlyExpense } from '../../types/expenses';
import { formatCurrency } from '../../utils/format';

interface MonthlyDataTableProps {
  monthlyData: MonthlyExpense[];
}

const MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember'
];

export function MonthlyDataTable({ monthlyData }: MonthlyDataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-[10px]">
        <thead>
          <tr>
            <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Position</th>
            {MONTHS.map((month) => (
              <th key={month} className="px-2 py-2 text-right font-medium text-gray-500 dark:text-gray-400">
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-2 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100">Kosten (netto)</td>
            {monthlyData.slice(0, 12).map((data, idx) => (
              <td key={idx} className="px-2 py-3 text-right whitespace-nowrap text-gray-900 dark:text-gray-100">
                {formatCurrency(data.cost)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}