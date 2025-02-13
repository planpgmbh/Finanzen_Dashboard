import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EditYearModalProps {
  year: number;
  onSave: (year: number) => void;
  onClose: () => void;
  existingYears: number[];
}

const baseInputStyles = `
  w-full px-3 py-2
  bg-white dark:bg-gray-700
  border border-gray-200 dark:border-gray-600
  rounded-md
  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-800
  text-gray-900 dark:text-gray-100
  transition-colors duration-200
`;

export function EditYearModal({ year, onSave, onClose, existingYears }: EditYearModalProps) {
  const [newYear, setNewYear] = useState(year);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (existingYears.includes(newYear) && newYear !== year) {
      setError('Dieses Jahr existiert bereits');
      return;
    }

    onSave(newYear);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Jahr bearbeiten</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jahr
            </label>
            <input
              type="number"
              id="year"
              value={newYear}
              onChange={(e) => {
                setNewYear(parseInt(e.target.value));
                setError('');
              }}
              className={baseInputStyles}
              required
            />
            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md transition-colors duration-200"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors duration-200"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}