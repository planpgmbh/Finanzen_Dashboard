import React, { useState, useEffect } from 'react';
import { ChevronRight, Edit2, Copy, Trash2 } from 'lucide-react';
import { Employee } from '../../types/personnel';
import { MonthlyDataTable } from './MonthlyDataTable';
import { formatCurrency } from '../../utils/format';
import { supabase } from '../../lib/supabase';
import { EditEmployeeModal } from './EditEmployeeModal';

interface EmployeeRowProps {
  employee: Employee;
  yearId: string;
  onEdit: (yearId: string, employeeId: string) => void;
  onDuplicate: (yearId: string, employeeId: string) => void;
  onDelete: (yearId: string, employeeId: string) => void;
}

export function EmployeeRow({
  employee,
  yearId,
  onEdit,
  onDuplicate,
  onDelete,
}: EmployeeRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [monthlyData, setMonthlyData] = useState(employee.monthlyData);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Load total costs immediately
    const fetchTotalCost = async () => {
      const { data, error } = await supabase
        .from('employee_yearly_costs')
        .select('yearly_cost')
        .eq('employee_id', employee.id)
        .eq('year_id', yearId)
        .single();

      if (!error && data) {
        setTotalCost(data.yearly_cost);
      }
    };

    fetchTotalCost();
  }, [employee.id, yearId]);

  // Load detail data only when dropdown is opened
  useEffect(() => {
    if (isExpanded && !monthlyData.length) {
      const fetchMonthlyData = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('personnel_monthly_data')
          .select('*')
          .eq('global_employee_id', employee.id)
          .eq('year_id', yearId)
          .order('month');

        if (!error && data) {
          setMonthlyData(data);
        }
        setLoading(false);
      };

      fetchMonthlyData();
    }
  }, [isExpanded, employee.id, yearId]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  return (
    <>
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
            {employee.name}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              title="Mitarbeiter bearbeiten"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(yearId, employee.id);
              }}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              title="Mitarbeiter duplizieren"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(yearId, employee.id);
              }}
              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              title="Mitarbeiter löschen"
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
            {loading ? (
              <div className="text-center py-4 text-gray-500">Laden...</div>
            ) : (
              <MonthlyDataTable monthlyData={monthlyData} />
            )}
          </div>
        )}
      </div>

      {showEditModal && (
        <EditEmployeeModal
          employee={employee}
          yearId={yearId}
          onSave={async (updatedEmployee) => {
            await onEdit(yearId, employee.id);
            setShowEditModal(false);
          }}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}