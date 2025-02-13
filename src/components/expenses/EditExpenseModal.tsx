import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import type { Expense, Project, ExpenseCategory } from '../../types/harvest';
import { formatCurrency } from '../../utils/format';
import { updateExpense, getProjects, getExpenseCategories } from '../../api/harvestApi';

interface EditExpenseModalProps {
  expense: Expense;
  onSave: (expense: Expense) => Promise<void>;
  onClose: () => void;
}

export function EditExpenseModal({ expense, onSave, onClose }: EditExpenseModalProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [projectId, setProjectId] = useState(expense.project.id);
  const [categoryId, setCategoryId] = useState(expense.expense_category.id);
  const [notes, setNotes] = useState(expense.notes);
  const [totalCost, setTotalCost] = useState(expense.total_cost);
  const [spentDate, setSpentDate] = useState(expense.spent_date);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, categoriesData] = await Promise.all([
          getProjects(),
          getExpenseCategories()
        ]);
        setProjects(projectsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Fehler beim Laden der Projekte und Kategorien');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const updatedExpense = await updateExpense(expense.id, {
        project_id: projectId,
        expense_category_id: categoryId,
        spent_date: spentDate,
        total_cost: totalCost,
        notes: notes
      });

      await onSave(updatedExpense);
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      setError(error instanceof Error ? error.message : 'Failed to save expense');
    } finally {
      setSaving(false);
    }
  };

  const harvestUrl = `https://ppgmbh.harvestapp.com/expenses/people/${expense.user.id}?expense_id=${expense.id}#expense_${expense.id}`;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-300">Lade Daten...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Ausgabe bearbeiten</h2>
            <a
              href={harvestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              title="In Harvest öffnen"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
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
                Projekt
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategorie
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notizen
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Betrag (netto)
              </label>
              <input
                type="number"
                step="0.01"
                value={totalCost}
                onChange={(e) => setTotalCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Datum
              </label>
              <input
                type="date"
                value={spentDate}
                onChange={(e) => setSpentDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
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