import React, { useState, useEffect } from 'react';
import { format, startOfYear, endOfYear, startOfQuarter, endOfQuarter, subYears, parseISO, eachMonthOfInterval } from 'date-fns';
import { FileText, Search } from 'lucide-react';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { DashboardCard } from '../components/DashboardCard';
import { YearComparisonChart } from '../components/YearComparisonChart';
import { getInvoices, getExpenses } from '../api/harvestApi';
import type { Invoice, Expense } from '../types/harvest';
import { formatCurrency } from '../utils/format';

export function Invoices() {
  const currentYear = new Date().getFullYear();
  const comparisonYears = Array.from({ length: 4 }, (_, i) => currentYear - i - 1);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [comparisonInvoices, setComparisonInvoices] = useState<Invoice[]>([]);
  const [comparisonExpenses, setComparisonExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('year-to-date');
  const [fromDate, setFromDate] = useState(format(startOfYear(new Date()), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [comparisonYear, setComparisonYear] = useState(currentYear - 1);
  const [showComparison, setShowComparison] = useState(true);

  const loadData = async (start: string, end: string, isComparison = false) => {
    try {
      const [invoicesData, expensesData] = await Promise.all([
        getInvoices(start, end),
        getExpenses(start, end)
      ]);
      
      if (isComparison) {
        setComparisonInvoices(invoicesData);
        setComparisonExpenses(expensesData);
      } else {
        setInvoices(invoicesData);
        setExpenses(expensesData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Fehler beim Laden der Daten');
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await loadData(fromDate, toDate, false);

        if (showComparison) {
          // Calculate comparison dates based on selected year
          const currentStartDate = parseISO(fromDate);
          const currentEndDate = parseISO(toDate);
          const yearDiff = currentStartDate.getFullYear() - comparisonYear;
          
          const comparisonStart = format(subYears(currentStartDate, yearDiff), 'yyyy-MM-dd');
          const comparisonEnd = format(subYears(currentEndDate, yearDiff), 'yyyy-MM-dd');
          
          await loadData(comparisonStart, comparisonEnd, true);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Fehler beim Laden der Daten');
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [fromDate, toDate, comparisonYear, showComparison]);

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

  const clients = Array.from(new Set([
    ...invoices.map(invoice => invoice.client?.id),
    ...expenses.map(expense => expense.client?.id)
  ]))
  .filter((id): id is number => id != null)
  .map(id => {
    const invoice = invoices.find(inv => inv.client?.id === id);
    const expense = expenses.find(exp => exp.client?.id === id);
    return {
      id: String(id),
      name: invoice?.client?.name || expense?.client?.name || 'Unbekannter Kunde'
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const filteredInvoices = invoices.filter(invoice => {
    return (!selectedClient || String(invoice.client?.id) === selectedClient) &&
      (!searchTerm || 
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.amount.toString().includes(searchTerm)
      );
  });

  const filteredExpenses = expenses.filter(expense => 
    !selectedClient || String(expense.client?.id) === selectedClient
  );

  const filteredComparisonInvoices = comparisonInvoices.filter(invoice => 
    !selectedClient || String(invoice.client?.id) === selectedClient
  );

  const filteredComparisonExpenses = comparisonExpenses.filter(expense =>
    !selectedClient || String(expense.client?.id) === selectedClient
  );

  const getMonthlyData = (invoices: Invoice[], startDate: Date, endDate: Date) => {
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    return months.map(month => {
      return invoices.reduce((sum, invoice) => {
        const invoiceDate = parseISO(invoice.issue_date);
        if (invoiceDate.getFullYear() === month.getFullYear() && 
            invoiceDate.getMonth() === month.getMonth()) {
          return sum + (invoice.amount - (invoice.tax_amount || 0));
        }
        return sum;
      }, 0);
    });
  };

  const currentStartDate = parseISO(fromDate);
  const currentEndDate = parseISO(toDate);
  const currentPeriodData = getMonthlyData(filteredInvoices, currentStartDate, currentEndDate);

  const yearDiff = currentStartDate.getFullYear() - comparisonYear;
  const comparisonStartDate = subYears(currentStartDate, yearDiff);
  const comparisonEndDate = subYears(currentEndDate, yearDiff);
  const comparisonPeriodData = getMonthlyData(filteredComparisonInvoices, comparisonStartDate, comparisonEndDate);

  const currentPeriodLabel = `${format(currentStartDate, 'dd.MM.yyyy')} - ${format(currentEndDate, 'dd.MM.yyyy')}`;
  const comparisonPeriodLabel = `${format(comparisonStartDate, 'dd.MM.yyyy')} - ${format(comparisonEndDate, 'dd.MM.yyyy')}`;

  const totalInvoices = filteredInvoices.reduce((sum, invoice) => sum + (invoice.amount - (invoice.tax_amount || 0)), 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.total_cost, 0);
  const totalComparisonInvoices = filteredComparisonInvoices.reduce((sum, invoice) => sum + (invoice.amount - (invoice.tax_amount || 0)), 0);
  const totalComparisonExpenses = filteredComparisonExpenses.reduce((sum, expense) => sum + expense.total_cost, 0);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Bezahlt';
      case 'open':
        return 'Offen';
      case 'draft':
        return 'Entwurf';
      case 'closed':
        return 'Geschlossen';
      default:
        return status;
    }
  };

  const selectedClientName = selectedClient 
    ? clients.find(client => client.id === selectedClient)?.name 
    : '';

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Rechnungen</h1>
        <p className="text-base text-gray-900 dark:text-gray-100">
          Übersicht aller Rechnungen
        </p>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <DateRangeFilter
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        selectedClient={selectedClient}
        onClientChange={setSelectedClient}
        clients={clients}
        showComparison={showComparison}
        onComparisonToggle={setShowComparison}
        comparisonFromDate={format(comparisonStartDate, 'yyyy-MM-dd')}
        comparisonToDate={format(comparisonEndDate, 'yyyy-MM-dd')}
        onComparisonFromDateChange={() => {}}
        onComparisonToDateChange={() => {}}
        comparisonYear={comparisonYear}
        onComparisonYearChange={setComparisonYear}
        comparisonYears={comparisonYears}
      />

      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <YearComparisonChart
            currentData={currentPeriodData}
            comparisonData={comparisonPeriodData}
            labels={eachMonthOfInterval({ start: currentStartDate, end: currentEndDate }).map(date => 
              format(date, 'MMM yyyy')
            )}
            currentYear={currentPeriodLabel}
            comparisonYear={comparisonPeriodLabel}
            showComparison={showComparison}
          />
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="h-10 pl-3 pr-8 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg max-w-[360px] truncate"
            >
              <option value="">Alle Kunden</option>
              {clients.map(client => (
                <option key={client.id} value={client.id} className="truncate">
                  {client.name}
                </option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px] max-w-[150px]">Nr.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kunde</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Rechnungsdatum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Fällig</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Netto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.map((invoice) => (
                <tr 
                  key={invoice.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => window.open(`https://ppgmbh.harvestapp.com/invoices/${invoice.id}`, '_blank')}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                    {invoice.number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <div>{invoice.client?.name || 'Unbekannter Kunde'}</div>
                    {invoice.subject && (
                      <div className="text-xs text-gray-500 mt-1">{invoice.subject}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(invoice.issue_date), 'dd.MM.yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(invoice.due_date), 'dd.MM.yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatCurrency(invoice.amount - (invoice.tax_amount || 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.state)}`}>
                      {getStatusText(invoice.state)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Gesamtsumme
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalInvoices)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}