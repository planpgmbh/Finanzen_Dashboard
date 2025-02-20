import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Employee, MonthlyData } from '../../types/personnel';
import { supabase } from '../../lib/supabase';

interface EditEmployeeModalProps {
  employee: Employee;
  yearId: string;
  onSave: (employee: Employee) => Promise<void>;
  onClose: () => void;
}

export function EditEmployeeModal({ employee, yearId, onSave, onClose }: EditEmployeeModalProps) {
  const [name, setName] = useState(employee.name);
  const [monthlyData, setMonthlyData] = useState(employee.monthlyData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // Update employee name
      const { error: nameError } = await supabase
        .from('global_employees')
        .update({ name })
        .eq('id', employee.id);

      if (nameError) throw nameError;

      // Update monthly data
      for (const data of monthlyData) {
        const { error: monthlyError } = await supabase
          .from('personnel_monthly_data')
          .upsert({
            global_employee_id: employee.id,
            year_id: yearId,
            month: data.month,
            year: data.year,
            grundgehalt: data.grundgehalt,
            krankenversicherung: data.krankenversicherung,
            rentenversicherung: data.rentenversicherung,
            arbeitslosenversicherung: data.arbeitslosenversicherung,
            pflegeversicherung: data.pflegeversicherung,
            insolvenzgeldumlage: data.insolvenzgeldumlage,
            umlage_u1: data.umlageU1,
            umlage_u2: data.umlageU2
          }, {
            onConflict: 'global_employee_id,year_id,month'
          });

        if (monthlyError) throw monthlyError;
      }

      // Create updated employee object with new data
      const updatedEmployee: Employee = {
        ...employee,
        name,
        monthlyData: [...monthlyData]
      };

      await onSave(updatedEmployee);
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      setError(error instanceof Error ? error.message : 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  const handleMonthlyDataChange = (field: keyof MonthlyData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMonthlyData(prev => prev.map(data => 
      data.month === activeMonth + 1 ? { ...data, [field]: numValue } : data
    ));
  };

  const [activeMonth, setActiveMonth] = useState(0);

  const copyToAllMonths = () => {
    const currentData = monthlyData[activeMonth];
    setMonthlyData(prev => prev.map(data => ({
      ...data,
      grundgehalt: currentData.grundgehalt,
      krankenversicherung: currentData.krankenversicherung,
      rentenversicherung: currentData.rentenversicherung,
      arbeitslosenversicherung: currentData.arbeitslosenversicherung,
      pflegeversicherung: currentData.pflegeversicherung,
      insolvenzgeldumlage: currentData.insolvenzgeldumlage,
      umlageU1: currentData.umlageU1,
      umlageU2: currentData.umlageU2
    })));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mitarbeiter bearbeiten</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/50 border-b border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monat:</label>
                  <select
                    value={activeMonth}
                    onChange={(e) => setActiveMonth(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {[
                      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
                    ].map((month, idx) => (
                      <option key={month} value={idx}>{month}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={copyToAllMonths}
                  className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Werte für alle Monate übernehmen
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grundgehalt
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyData[activeMonth]?.grundgehalt || 0}
                    onChange={(e) => handleMonthlyDataChange('grundgehalt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Krankenversicherung
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyData[activeMonth]?.krankenversicherung || 0}
                    onChange={(e) => handleMonthlyDataChange('krankenversicherung', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rentenversicherung
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyData[activeMonth]?.rentenversicherung || 0}
                    onChange={(e) => handleMonthlyDataChange('rentenversicherung', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Arbeitslosenversicherung
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyData[activeMonth]?.arbeitslosenversicherung || 0}
                    onChange={(e) => handleMonthlyDataChange('arbeitslosenversicherung', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pflegeversicherung
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyData[activeMonth]?.pflegeversicherung || 0}
                    onChange={(e) => handleMonthlyDataChange('pflegeversicherung', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Insolvenzgeldumlage
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyData[activeMonth]?.insolvenzgeldumlage || 0}
                    onChange={(e) => handleMonthlyDataChange('insolvenzgeldumlage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Umlage U1
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyData[activeMonth]?.umlageU1 || 0}
                    onChange={(e) => handleMonthlyDataChange('umlageU1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Umlage U2
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyData[activeMonth]?.umlageU2 || 0}
                    onChange={(e) => handleMonthlyDataChange('umlageU2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md transition-colors duration-200"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Speichern...' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}