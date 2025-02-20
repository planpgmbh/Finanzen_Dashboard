import React from 'react';
import { TopLevelDropdown } from '../TopLevelDropdown';
import { EmployeeRow } from './EmployeeRow';
import { formatCurrency } from '../../utils/format';
import type { YearData } from '../../types/personnel';
import { supabase } from '../../lib/supabase';

interface YearSectionProps {
  yearData: YearData;
  onEditYear?: (yearId: string) => void;
  onDuplicateYear: (yearId: string) => void;
  onDeleteYear: (yearId: string) => void;
  onEditEmployee: (yearId: string, employeeId: string) => void;
  onDuplicateEmployee: (yearId: string, employeeId: string) => void;
  onDeleteEmployee: (yearId: string, employeeId: string) => void;
  existingYears: number[];
  onToggle: (isExpanded: boolean) => void;
  defaultExpanded?: boolean;
}

export function YearSection({
  yearData,
  onDuplicateYear,
  onDeleteYear,
  onEditEmployee,
  onDuplicateEmployee,
  onDeleteEmployee,
  existingYears,
  onToggle,
  defaultExpanded = false
}: YearSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [totalCost, setTotalCost] = React.useState(yearData.totalCost);

  const handleDuplicateYear = async () => {
    const nextYear = yearData.year + 1;
    if (!existingYears.includes(nextYear)) {
      onDuplicateYear(yearData.id);
    } else {
      alert('Das Jahr existiert bereits');
    }
  };

  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onToggle(newExpandedState);
  };

  const handleEditEmployee = async (yearId: string, employeeId: string) => {
    await onEditEmployee(yearId, employeeId);
    
    // Update total cost after employee edit
    const { data, error } = await supabase
      .from('total_yearly_costs')
      .select('total_cost')
      .eq('year_id', yearId)
      .single();

    if (!error && data) {
      setTotalCost(data.total_cost);
    }
  };

  return (
    <TopLevelDropdown
      title={yearData.year.toString()}
      isExpanded={isExpanded}
      onToggle={handleToggle}
      onDuplicate={handleDuplicateYear}
      onDelete={() => onDeleteYear(yearData.id)}
      value={formatCurrency(totalCost)}
    >
      <div className="space-y-2">
        {yearData.employees?.map((employee) => (
          <EmployeeRow
            key={employee.id}
            employee={employee}
            yearId={yearData.id}
            onEdit={handleEditEmployee}
            onDuplicate={onDuplicateEmployee}
            onDelete={onDeleteEmployee}
          />
        ))}
      </div>
    </TopLevelDropdown>
  );
}