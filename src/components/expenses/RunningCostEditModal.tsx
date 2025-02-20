import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { RunningCost } from '../../types/runningCosts';

interface RunningCostEditModalProps {
  expense: RunningCost;
  onSave: (expense: RunningCost) => Promise<void>;
  onClose: () => void;
}

export function RunningCostEditModal({ expense, onSave, onClose }: RunningCostEditModalProps) {
  const [name, setName] = useState(expense.name);
  const [monthlyData, setMonthlyData] = useState(expense.monthlyData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await onSave({
        ...expense,
        name,
        monthlyData
      });
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      setError(error instanceof Error ? error.message : 'Failed to save expense');
    } finally {
      setSaving(false);
    }
  };

  const handleMonthlyDataChange = (month: number, value: string) => {
    const cost = parseFloat(value) || 0;
    setMonthlyData(prev => 
      prev.map(data => 
        data.month === month ? { ...data, cost } : data
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Kostenpunkt bearbeiten</h2>
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
          <div className="space-y-6">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monatliche Kosten
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {monthlyData.map((data) => (
                  <div key={data.month}>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {new Date(2024, data.month - 1).toLocaleString('de-DE', { month: 'long' })}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.cost}
                      onChange={(e) => handleMonthlyDataChange(data.month, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                ))}
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