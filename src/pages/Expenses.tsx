import React, { useState, useEffect } from 'react';
import { format, startOfYear, endOfYear, startOfQuarter, endOfQuarter, subYears, parseISO, eachMonthOfInterval } from 'date-fns';
import { FileText, Search } from 'lucide-react';
import { getExpenses } from '../api/harvestApi';
import type { Expense } from '../types/harvest';
import { formatCurrency } from '../utils/format';
import { YearComparisonChart } from '../components/YearComparisonChart';
import { EditExpenseModal } from '../components/expenses/EditExpenseModal';

export function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [comparisonExpenses, setComparisonExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [timeRange, setTimeRange] = useState('year-to-date');
  const [fromDate, setFromDate] = useState(format(startOfYear(new Date()), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [comparisonYear, setComparisonYear] = useState(new Date().getFullYear() - 1);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const loadExpenses = async (start: string, end: string, isComparison = false) => {
    try {
      const data = await getExpenses(start, end);
      if (isComparison) {
        setComparisonExpenses(data);
      } else {
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      
      await loadExpenses(fromDate, toDate, false);

      const comparisonStart = format(subYears(parseISO(fromDate), 1), 'yyyy-MM-dd');
      const comparisonEnd = format(subYears(parseISO(toDate), 1), 'yyyy-MM-dd');
      await loadExpenses(comparisonStart, comparisonEnd, true);
      
      setLoading(false);
    };

    loadAllData();
  }, [fromDate, toDate]);

  useEffect(() => {
    const loadComparisonData = async () => {
      const currentStartDate = parseISO(fromDate);
      const currentEndDate = parseISO(toDate);
      const yearDiff = comparisonYear - currentStartDate.getFullYear();
      
      const comparisonStart = format(subYears(currentStartDate, -yearDiff), 'yyyy-MM-dd');
      const comparisonEnd = format(subYears(currentEndDate, -yearDiff), 'yyyy-MM-dd');
      
      await loadExpenses(comparisonStart, comparisonEnd, true);
    };

    loadComparisonData();
  }, [comparisonYear]);

  const handleTimeRangeChange = (range: string) => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (range) {
      case 'year-to-date':
        start = startOfYear(now);
        end = now;
        break;
      case 'this-quarter':
        start = startOfQuarter(now);
        end = endOfQuarter(now);
        break;
      case 'this-year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      case 'last-year':
        const lastYear = subYears(now, 1);
        start = startOfYear(lastYear);
        end = endOfYear(lastYear);
        break;
      default:
        return;
    }

    setTimeRange(range);
    setFromDate(format(start, 'yyyy-MM-dd'));
    setToDate(format(end, 'yyyy-MM-dd'));
  };

  const handleDateChange = (date: string, isStart: boolean) => {
    if (isStart) {
      setFromDate(date);
    } else {
      setToDate(date);
    }
    setTimeRange('custom');
  };

  const categories = Array.from(new Set(expenses.map(e => e.expense_category.name))).sort();

  const filteredExpenses = expenses.filter(expense => {
    const nettoAmount = expense.total_cost || 0;
    const bruttoAmount = nettoAmount * 1.19;
    const nettoStr = nettoAmount.toFixed(2).replace('.', ',');
    const bruttoStr = bruttoAmount.toFixed(2).replace('.', ',');

    return (!selectedCategory || expense.expense_category.name === selectedCategory) &&
      (!searchTerm || 
        expense.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.expense_category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nettoStr.includes(searchTerm) ||
        bruttoStr.includes(searchTerm)
      );
  });

  const filteredComparisonExpenses = comparisonExpenses.filter(expense =>
    (!selectedCategory || expense.expense_category.name === selectedCategory)
  );

  const getMonthlyData = (expenses: Expense[], startDate: Date, endDate: Date) => {
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    return months.map(month => {
      return expenses.reduce((sum, expense) => {
        const expenseDate = parseISO(expense.spent_date);
        if (expenseDate.getFullYear() === month.getFullYear() && 
            expenseDate.getMonth() === month.getMonth()) {
          return sum + expense.total_cost;
        }
        return sum;
      }, 0);
    });
  };

  const currentStartDate = parseISO(fromDate);
  const currentEndDate = parseISO(toDate);
  const currentPeriodData = getMonthlyData(filteredExpenses, currentStartDate, currentEndDate);

  const comparisonStartDate = subYears(currentStartDate, currentStartDate.getFullYear() - comparisonYear);
  const comparisonEndDate = subYears(currentEndDate, currentEndDate.getFullYear() - comparisonYear);
  const comparisonPeriodData = getMonthlyData(filteredComparisonExpenses, comparisonStartDate, comparisonEndDate);

  const currentYear = new Date().getFullYear();
  const comparisonYears = Array.from({ length: 5 }, (_, i) => currentYear - i).slice(1);

  const currentPeriodLabel = `${format(currentStartDate, 'dd.MM.yyyy')} - ${format(currentEndDate, 'dd.MM.yyyy')}`;
  const comparisonPeriodLabel = `${format(comparisonStartDate, 'dd.MM.yyyy')} - ${format(comparisonEndDate, 'dd.MM.yyyy')}`;

  const totalNetto = filteredExpenses.reduce((sum, expense) => sum + expense.total_cost, 0);
  const totalBrutto = totalNetto * 1.19;

  const handleSaveExpense = async (updatedExpense: Expense) => {
    try {
      // Update the expense in the list
      const updatedExpenses = expenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      );
      
      setExpenses(updatedExpenses);
      setEditingExpense(null);
      
      // Reload expenses to ensure we have the latest data
      await loadExpenses(fromDate, toDate, false);
    } catch (error) {
      console.error('Error saving expense:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ausgaben</h1>
        <p className="text-base text-gray-900 dark:text-gray-100">
          Übersicht aller Ausgaben
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="h-10 pl-3 pr-8 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <option value="year-to-date">Jahr bis heute</option>
              <option value="this-quarter">Aktuelles Quartal</option>
              <option value="this-year">Aktuelles Jahr</option>
              <option value="last-year">Letztes Jahr</option>
              <option value="custom">Benutzerdefiniert</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 pl-3 pr-8 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <option value="">Alle Kategorien</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => handleDateChange(e.target.value, true)}
                className="h-10 pl-3 pr-3 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => handleDateChange(e.target.value, false)}
                className="h-10 pl-3 pr-3 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-600 dark:text-gray-400">Vergleichen mit:</span>
              <select
                value={comparisonYear}
                onChange={(e) => setComparisonYear(Number(e.target.value))}
                className="h-10 pl-3 pr-8 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                {comparisonYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <YearComparisonChart
            currentData={currentPeriodData}
            comparisonData={comparisonPeriodData}
            labels={eachMonthOfInterval({ start: currentStartDate, end: currentEndDate }).map(date => 
              format(date, 'MMM yyyy')
            )}
            currentYear={currentPeriodLabel}
            comparisonYear={comparisonPeriodLabel}
            showComparison={true}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 pl-3 pr-8 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <option value="">Alle Kategorien</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 pl-10 pr-4 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg w-[200px]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Datum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Netto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Brutto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Projekt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Beleg</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredExpenses.map((expense) => (
                  <tr 
                    key={expense.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setEditingExpense(expense)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(expense.spent_date), 'dd.MM.yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {expense.expense_category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatCurrency(expense.total_cost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatCurrency(expense.total_cost * 1.19)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[12rem]">
                      {expense.project.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.receipt && (
                        <a
                          href={expense.receipt.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                          title={expense.receipt.file_name}
                          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking receipt
                        >
                          <FileText className="w-4 w-4" />
                          <span className="ml-1">Beleg</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td colSpan={2} className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Gesamtsumme
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(totalNetto)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(totalBrutto)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onSave={handleSaveExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}