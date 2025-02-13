import React, { useState } from 'react';
import { ChevronRight, Edit2, Copy, Trash2 } from 'lucide-react';
import { RunningCost } from '../../types/expenses';
import { MonthlyDataTable } from './MonthlyDataTable';
import { formatCurrency } from '../../utils/format';

interface ExpenseRowProps {
  expense: RunningCost;
  yearId: string;
  onEdit: (yearId: string, expenseId: string) => void;
  onDuplicate: (yearId: string, expenseId: string) => void;
  onDelete: (yearId: string, expenseId: string) => void;
}

export function ExpenseRow({
  expense,
  yearId,
  onEdit,
  onDuplicate,
  onDelete,
}: ExpenseRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalCost = expense.monthlyData.reduce((sum, month) => sum + month.cost, 0);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
          <ChevronRight
            className={`h-4 w-4 mr-2 transition-transform ${
              isExpanded ? 'transform rotate-90' : ''
            }`}
          />
          {expense.name}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(yearId, expense.id);
            }}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            title="Kostenpunkt bearbeiten"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(yearId, expense.id);
            }}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            title="Kostenpunkt duplizieren"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(yearId, expense.id);
            }}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title="Kostenpunkt löschen"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <span className="ml-4 font-medium text-gray-900 dark:text-gray-100">
            {formatCurrency(totalCost)}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4">
          <MonthlyDataTable monthlyData={expense.monthlyData} />
        </div>
      )}
    </div>
  );
}