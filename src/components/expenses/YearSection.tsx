import React from 'react';
import { TopLevelDropdown } from '../TopLevelDropdown';
import { ExpenseRow } from './ExpenseRow';
import { formatCurrency } from '../../utils/format';
import type { YearData } from '../../types/expenses';

interface YearSectionProps {
  yearData: YearData;
  onEditYear: (yearId: string) => void;
  onDuplicateYear: (yearId: string) => void;
  onDeleteYear: (yearId: string) => void;
  onEditExpense: (yearId: string, expenseId: string) => void;
  onDuplicateExpense: (yearId: string, expenseId: string) => void;
  onDeleteExpense: (yearId: string, expenseId: string) => void;
  onAddExpense: (yearId: string) => void;
  existingYears: number[];
  hideAddButton?: boolean;
}

export function YearSection({
  yearData,
  onEditYear,
  onDuplicateYear,
  onDeleteYear,
  onEditExpense,
  onDuplicateExpense,
  onDeleteExpense,
  onAddExpense,
  existingYears,
  hideAddButton = false
}: YearSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const handleDuplicateYear = () => {
    const nextYear = yearData.year + 1;
    if (!existingYears.includes(nextYear)) {
      onDuplicateYear(yearData.id);
    } else {
      alert('Das Jahr existiert bereits');
    }
  };

  return (
    <TopLevelDropdown
      title={yearData.year.toString()}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      onEdit={() => onEditYear(yearData.id)}
      onDuplicate={handleDuplicateYear}
      onDelete={() => onDeleteYear(yearData.id)}
      onAdd={hideAddButton ? undefined : () => onAddExpense(yearData.id)}
      value={formatCurrency(yearData.totalCost)}
    >
      <div className="space-y-2">
        {yearData.costs.map((expense) => (
          <ExpenseRow
            key={expense.id}
            expense={expense}
            yearId={yearData.id}
            onEdit={onEditExpense}
            onDuplicate={onDuplicateExpense}
            onDelete={onDeleteExpense}
          />
        ))}
      </div>
    </TopLevelDropdown>
  );
}