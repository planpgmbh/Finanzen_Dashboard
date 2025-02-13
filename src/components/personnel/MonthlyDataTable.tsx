import React from 'react';
import { MonthlyData } from '../../types/personnel';
import { formatCurrency } from '../../utils/format';

interface MonthlyDataTableProps {
  monthlyData: MonthlyData[];
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
            <th className="px-1 py-2 text-left font-medium text-gray-500 dark:text-gray-400 w-32"></th>
            {MONTHS.map((month) => (
              <th key={month} className="px-1 py-2 text-right font-medium text-gray-500 dark:text-gray-400 w-20">
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-1 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">Grundgehalt</td>
            {monthlyData.slice(0, 12).map((data, idx) => (
              <td key={idx} className="px-1 py-3 text-right whitespace-nowrap text-gray-900 dark:text-gray-100">
                {formatCurrency(data.grundgehalt)}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-1 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">Krankenversicherung</td>
            {monthlyData.slice(0, 12).map((data, idx) => (
              <td key={idx} className="px-1 py-3 text-right whitespace-nowrap text-gray-900 dark:text-gray-100">
                {formatCurrency(data.krankenversicherung)}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-1 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">Rentenversicherung</td>
            {monthlyData.slice(0, 12).map((data, idx) => (
              <td key={idx} className="px-1 py-3 text-right whitespace-nowrap text-gray-900 dark:text-gray-100">
                {formatCurrency(data.rentenversicherung)}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-1 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">Arbeitslosenversicherung</td>
            {monthlyData.slice(0, 12).map((data, idx) => (
              <td key={idx} className="px-1 py-3 text-right whitespace-nowrap text-gray-900 dark:text-gray-100">
                {formatCurrency(data.arbeitslosenversicherung)}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-1 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">Pflegeversicherung</td>
            {monthlyData.slice(0, 12).map((data, idx) => (
              <td key={idx} className="px-1 py-3 text-right whitespace-nowrap text-gray-900 dark:text-gray-100">
                {formatCurrency(data.pflegeversicherung)}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-1 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">Insolvenzgeldumlage</td>
            {monthlyData.slice(0, 12).map((data, idx) => (
              <td key={idx} className="px-1 py-3 text-right whitespace-nowrap text-gray-900 dark:text-gray-100">
                {formatCurrency(data.insolvenzgeldumlage)}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-1 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">Umlage U1</td>
            {monthlyData.slice(0, 12).map((data, idx) => (
              <td key={idx} className="px-1 py-3 text-right whitespace-nowrap text-gray-900 dark:text-gray-100">
                {formatCurrency(data.umlageU1)}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-1 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">Umlage U2</td>
            {monthlyData.slice(0, 12).map((data, idx) => (
              <td key={idx} className="px-1 py-3 text-right whitespace-nowrap text-gray-900 dark:text-gray-100">
                {formatCurrency(data.umlageU2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}