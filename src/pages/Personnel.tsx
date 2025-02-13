import React, { useState, useEffect } from 'react';
import { YearSection } from '../components/personnel/YearSection';
import { PersonnelAnalysis } from '../components/personnel/PersonnelAnalysis';
import { JsonUploadButton } from '../components/personnel/JsonUploadButton';
import { personnelService } from '../services/personnelService';
import type { YearData, Employee } from '../types/personnel';
import { Loader2, AlertCircle } from 'lucide-react';

export function Personnel() {
  const [years, setYears] = useState<YearData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState<{yearId: string, employeeId: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadedYearIds, setLoadedYearIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await personnelService.fetchYearList();
      
      // Only load details for 2025 initially
      const year2025 = data.find(y => y.year === 2025);
      if (year2025) {
        const yearData = await personnelService.fetchYearDetails(year2025.id);
        setLoadedYearIds(new Set([year2025.id]));
        data[data.findIndex(y => y.id === year2025.id)] = yearData;
      }
      
      setYears(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Laden der Daten';
      setError(message);
      console.error('Error loading personnel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearToggle = async (yearId: string, isExpanded: boolean) => {
    if (!isExpanded || loadedYearIds.has(yearId)) return;

    try {
      setError(null);
      const yearData = await personnelService.fetchYearDetails(yearId);
      setYears(prev => prev.map(y => y.id === yearId ? yearData : y));
      setLoadedYearIds(prev => new Set([...prev, yearId]));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Laden der Jahresdaten';
      setError(message);
      console.error('Error loading year details:', error);
    }
  };

  const handleDuplicateYear = async (yearId: string) => {
    const yearToDuplicate = years.find(y => y.id === yearId);
    if (!yearToDuplicate) return;

    const nextYear = yearToDuplicate.year + 1;

    if (years.some(y => y.year === nextYear)) {
      alert('Das Jahr existiert bereits');
      return;
    }

    try {
      setError(null);
      await personnelService.duplicateYear(yearId, nextYear);
      await loadInitialData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Duplizieren des Jahres';
      setError(message);
      console.error('Error duplicating year:', error);
    }
  };

  const handleDeleteYear = async (yearId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie dieses Jahr löschen möchten?')) {
      return;
    }

    try {
      setError(null);
      await personnelService.deleteYear(yearId);
      await loadInitialData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Löschen des Jahres';
      setError(message);
      console.error('Error deleting year:', error);
    }
  };

  const handleEditEmployee = (yearId: string, employeeId: string) => {
    setEditingEmployee({ yearId, employeeId });
  };

  const handleSaveEmployee = async (yearId: string, updatedEmployee: Employee) => {
    try {
      setError(null);
      await personnelService.updateEmployee(
        updatedEmployee.id,
        yearId,
        updatedEmployee.name,
        updatedEmployee.monthlyData
      );
      await loadInitialData();
      setEditingEmployee(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Speichern des Mitarbeiters';
      setError(message);
      console.error('Error saving employee:', error);
    }
  };

  const handleDuplicateEmployee = async (yearId: string, employeeId: string) => {
    try {
      setError(null);
      await personnelService.duplicateEmployee(yearId, employeeId);
      await loadInitialData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Duplizieren des Mitarbeiters';
      setError(message);
      console.error('Error duplicating employee:', error);
    }
  };

  const handleDeleteEmployee = async (yearId: string, employeeId: string) => {
    if (!yearId || !employeeId) {
      console.error('Invalid yearId or employeeId for deletion');
      return;
    }

    if (!confirm('Sind Sie sicher, dass Sie diesen Mitarbeiter löschen möchten?')) {
      return;
    }

    try {
      setError(null);
      await personnelService.deleteEmployee(employeeId, yearId);
      await loadInitialData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Löschen des Mitarbeiters';
      setError(message);
      console.error('Error deleting employee:', error);
    }
  };

  const editingEmployeeData = editingEmployee 
    ? years.find(y => y.id === editingEmployee.yearId)?.employees.find(e => e.id === editingEmployee.employeeId)
    : null;

  // Get unique employees across all years
  const uniqueEmployees = Array.from(new Set(
    years.flatMap(year => year.employees?.map(emp => emp.name) || [])
  )).map(name => {
    const employee = years.flatMap(y => y.employees || []).find(e => e.name === name);
    return {
      id: employee?.id || '',
      name
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  // Get available years for comparison
  const availableYears = years.map(y => y.year).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Personalkosten</h1>
          <p className="text-base text-gray-900 dark:text-gray-100">
            Verwaltung der Personalkosten nach Jahren und Mitarbeitern
          </p>
        </div>
        <JsonUploadButton onUploadComplete={loadInitialData} />
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

      {/* Personnel Analysis */}
      <div className="mb-8">
        <PersonnelAnalysis 
          employees={uniqueEmployees}
          years={availableYears}
          yearsData={years}
        />
      </div>

      <div className="space-y-6">
        {years.map(yearData => (
          <YearSection
            key={yearData.id}
            yearData={yearData}
            onEditYear={() => {}}
            onDuplicateYear={handleDuplicateYear}
            onDeleteYear={handleDeleteYear}
            onEditEmployee={handleEditEmployee}
            onDuplicateEmployee={handleDuplicateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            existingYears={years.map(y => y.year)}
            onToggle={(isExpanded) => handleYearToggle(yearData.id, isExpanded)}
            defaultExpanded={yearData.year === 2025}
          />
        ))}
      </div>
    </div>
  );
}