import React, { useState, useEffect } from 'react';
import { YearSection } from '../components/expenses/YearSection';
import { EditYearModal } from '../components/personnel/EditYearModal';
import { EditExpenseModal } from '../components/expenses/EditExpenseModal';
import { runningCostsService } from '../services/runningCostsService';
import type { YearData, RunningCost } from '../types/runningCosts';
import { AlertCircle } from 'lucide-react';

export function RunningCosts() {
  const [years, setYears] = useState<YearData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingYear, setEditingYear] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<{yearId: string, expense: RunningCost} | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await runningCostsService.fetchAllYears();
      setYears(data);
    } catch (error) {
      console.error('Error loading running costs data:', error);
      setError('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditYear = (yearId: string) => {
    setEditingYear(yearId);
  };

  const handleSaveYear = async (yearId: string, newYear: number) => {
    try {
      setError(null);
      await runningCostsService.updateYear(yearId, newYear);
      await loadData();
      setEditingYear(null);
    } catch (error) {
      console.error('Error saving year:', error);
      setError('Fehler beim Speichern des Jahres');
    }
  };

  const handleDuplicateYear = async (yearId: string) => {
    const yearToDuplicate = years.find(y => y.id === yearId);
    if (!yearToDuplicate) return;

    const nextYear = yearToDuplicate.year + 1;

    if (years.some(y => y.year === nextYear)) {
      setError('Das Jahr existiert bereits');
      return;
    }

    try {
      setError(null);
      await runningCostsService.duplicateYear(yearId, nextYear);
      await loadData();
    } catch (error) {
      console.error('Error duplicating year:', error);
      setError('Fehler beim Duplizieren des Jahres');
    }
  };

  const handleDeleteYear = async (yearId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie dieses Jahr löschen möchten?')) {
      return;
    }

    try {
      setError(null);
      await runningCostsService.deleteYear(yearId);
      await loadData();
    } catch (error) {
      console.error('Error deleting year:', error);
      setError('Fehler beim Löschen des Jahres');
    }
  };

  const handleEditExpense = (yearId: string, expenseId: string) => {
    const year = years.find(y => y.id === yearId);
    const expense = year?.costs.find(c => c.id === expenseId);
    if (expense) {
      setEditingExpense({ yearId, expense });
    }
  };

  const handleSaveExpense = async (yearId: string, updatedExpense: RunningCost) => {
    try {
      setError(null);
      await runningCostsService.updateCost(
        yearId,
        updatedExpense.id,
        updatedExpense.name,
        updatedExpense.monthlyData
      );
      await loadData();
      setEditingExpense(null);
    } catch (error) {
      console.error('Error saving expense:', error);
      setError('Fehler beim Speichern des Kostenpunkts');
    }
  };

  const handleDuplicateExpense = async (yearId: string, expenseId: string) => {
    try {
      setError(null);
      await runningCostsService.duplicateCost(yearId, expenseId);
      await loadData();
    } catch (error) {
      console.error('Error duplicating expense:', error);
      setError('Fehler beim Duplizieren des Kostenpunkts');
    }
  };

  const handleDeleteExpense = async (yearId: string, expenseId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Kostenpunkt löschen möchten?')) {
      return;
    }

    try {
      setError(null);
      await runningCostsService.deleteCost(yearId, expenseId);
      await loadData();
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError('Fehler beim Löschen des Kostenpunkts');
    }
  };

  const editingYearData = editingYear ? years.find(y => y.id === editingYear) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Laufende Kosten</h1>
        <p className="text-base text-gray-900 dark:text-gray-100">
          Verwaltung der laufenden Kosten nach Jahren
        </p>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Ein Fehler ist aufgetreten
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {years.map(yearData => (
          <YearSection
            key={yearData.id}
            yearData={yearData}
            onEditYear={handleEditYear}
            onDuplicateYear={handleDuplicateYear}
            onDeleteYear={handleDeleteYear}
            onEditExpense={handleEditExpense}
            onDuplicateExpense={handleDuplicateExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddExpense={() => {}}
            existingYears={years.map(y => y.year)}
            hideAddButton={true}
          />
        ))}
      </div>

      {editingYear && editingYearData && (
        <EditYearModal
          year={editingYearData.year}
          onSave={(newYear) => handleSaveYear(editingYear, newYear)}
          onClose={() => setEditingYear(null)}
          existingYears={years.map(y => y.year)}
        />
      )}

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense.expense}
          onSave={(updatedExpense) => handleSaveExpense(editingExpense.yearId, updatedExpense)}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}