import React, { useState, useEffect } from 'react';
import { format, startOfYear, endOfYear, startOfQuarter, endOfQuarter, subYears, parseISO, eachMonthOfInterval } from 'date-fns';
import { Euro, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { DashboardCard } from '../components/DashboardCard';
import { YearComparisonChart } from '../components/YearComparisonChart';
import { getInvoices, getExpenses } from '../api/harvestApi';
import { runningCostsService } from '../services/runningCostsService';
import { personnelService } from '../services/personnelService';
import type { Invoice, Expense } from '../types/harvest';
import { formatCurrency } from '../utils/format';

export function Dashboard() {
  const currentYear = new Date().getFullYear();
  const comparisonYears = Array.from({ length: 4 }, (_, i) => currentYear - i - 1);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [comparisonInvoices, setComparisonInvoices] = useState<Invoice[]>([]);
  const [comparisonExpenses, setComparisonExpenses] = useState<Expense[]>([]);
  const [runningCosts, setRunningCosts] = useState(0);
  const [comparisonRunningCosts, setComparisonRunningCosts] = useState(0);
  const [personnelCosts, setPersonnelCosts] = useState(0);
  const [comparisonPersonnelCosts, setComparisonPersonnelCosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [timeRange, setTimeRange] = useState('year-to-date');
  const [fromDate, setFromDate] = useState(format(startOfYear(new Date()), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [comparisonYear, setComparisonYear] = useState(currentYear - 1);
  const [showComparison, setShowComparison] = useState(true);

  const loadData = async (start: string, end: string, isComparison = false) => {
    try {
      const startDate = parseISO(start);
      const endDate = parseISO(end);

      const [invoicesData, expensesData, runningCostsData, personnelCostsData] = await Promise.all([
        getInvoices(start, end).catch(err => {
          console.error('Error loading invoices:', err);
          return [];
        }),
        getExpenses(start, end).catch(err => {
          console.error('Error loading expenses:', err);
          return [];
        }),
        runningCostsService.getRunningCosts(startDate, endDate).catch(err => {
          console.error('Error loading running costs:', err);
          return 0;
        }),
        personnelService.getPersonnelCosts(startDate, endDate).catch(err => {
          console.error('Error loading personnel costs:', err);
          return 0;
        })
      ]);
      
      if (isComparison) {
        setComparisonInvoices(invoicesData);
        setComparisonExpenses(expensesData);
        setComparisonRunningCosts(runningCostsData);
        setComparisonPersonnelCosts(personnelCostsData);
      } else {
        setInvoices(invoicesData);
        setExpenses(expensesData);
        setRunningCosts(runningCostsData);
        setPersonnelCosts(personnelCostsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
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
        setError('Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.');
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

  const filteredInvoices = invoices.filter(invoice => 
    !selectedClient || String(invoice.client?.id) === selectedClient
  );

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
          // Calculate net amount: amount - tax
          return sum + (invoice.amount - (invoice.tax_amount || 0));
        }
        return sum;
      }, 0);
    });
  };

  const currentStartDate = parseISO(fromDate);
  const currentEndDate = parseISO(toDate);
  const currentPeriodData = getMonthlyData(filteredInvoices, currentStartDate, currentEndDate);

  // Calculate comparison dates based on selected year
  const yearDiff = currentStartDate.getFullYear() - comparisonYear;
  const comparisonStartDate = subYears(currentStartDate, yearDiff);
  const comparisonEndDate = subYears(currentEndDate, yearDiff);
  const comparisonPeriodData = getMonthlyData(filteredComparisonInvoices, comparisonStartDate, comparisonEndDate);

  const currentPeriodLabel = `${format(currentStartDate, 'dd.MM.yyyy')} - ${format(currentEndDate, 'dd.MM.yyyy')}`;
  const comparisonPeriodLabel = `${format(comparisonStartDate, 'dd.MM.yyyy')} - ${format(comparisonEndDate, 'dd.MM.yyyy')}`;

  // Calculate total costs based on whether a client is selected
  const totalInvoices = filteredInvoices.reduce((sum, invoice) => sum + (invoice.amount - (invoice.tax_amount || 0)), 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.total_cost, 0);
  const totalComparisonInvoices = filteredComparisonInvoices.reduce((sum, invoice) => sum + (invoice.amount - (invoice.tax_amount || 0)), 0);
  const totalComparisonExpenses = filteredComparisonExpenses.reduce((sum, expense) => sum + expense.total_cost, 0);

  // Only include running costs and personnel costs if no client is selected
  const totalCosts = selectedClient 
    ? totalExpenses 
    : totalExpenses + runningCosts + personnelCosts;

  const totalComparisonCosts = selectedClient
    ? totalComparisonExpenses
    : totalComparisonExpenses + comparisonRunningCosts + comparisonPersonnelCosts;

  const expectedResult = totalInvoices - totalCosts;
  const expectedComparisonResult = totalComparisonInvoices - totalComparisonCosts;

  const selectedClientName = selectedClient 
    ? clients.find(client => client.id === selectedClient)?.name 
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-base text-gray-900 dark:text-gray-100">
          Finanzübersicht und Kennzahlen
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

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <DashboardCard
          title={selectedClientName ? `Umsatz gesamt ${selectedClientName}` : 'Umsatz gesamt'}
          value={formatCurrency(totalInvoices)}
          icon={Euro}
          comparisonValue={showComparison ? `${formatCurrency(totalComparisonInvoices)} (${comparisonYear})` : undefined}
          percentageChange={
            showComparison && totalComparisonInvoices > 0
              ? ((totalInvoices - totalComparisonInvoices) / totalComparisonInvoices) * 100
              : null
          }
        />
        
        <DashboardCard
          title={selectedClientName ? `Ausgaben gesamt ${selectedClientName}` : 'Ausgaben gesamt'}
          value={formatCurrency(totalCosts)}
          icon={CreditCard}
          comparisonValue={showComparison ? `${formatCurrency(totalComparisonCosts)} (${comparisonYear})` : undefined}
          percentageChange={
            showComparison && totalComparisonCosts > 0
              ? ((totalCosts - totalComparisonCosts) / totalComparisonCosts) * 100
              : null
          }
          inversePercentageColors
          tooltip={selectedClient ? undefined : {
            title: 'Aufschlüsselung der Gesamtkosten',
            items: [
              { label: 'Ausgaben', currentValue: formatCurrency(totalExpenses), comparisonValue: formatCurrency(totalComparisonExpenses) },
              { label: 'Laufende Kosten', currentValue: formatCurrency(runningCosts), comparisonValue: formatCurrency(comparisonRunningCosts) },
              { label: 'Personalkosten', currentValue: formatCurrency(personnelCosts), comparisonValue: formatCurrency(comparisonPersonnelCosts) },
              { label: 'Gesamtkosten', currentValue: formatCurrency(totalCosts), comparisonValue: formatCurrency(totalComparisonCosts) }
            ],
            currentYear: String(currentStartDate.getFullYear()),
            comparisonYear: String(comparisonYear)
          }}
        />

        <DashboardCard
          title="Vorläufiges Ergebnis"
          value={formatCurrency(expectedResult)}
          icon={TrendingUp}
          comparisonValue={showComparison ? `${formatCurrency(expectedComparisonResult)} (${comparisonYear})` : undefined}
          percentageChange={
            showComparison && expectedComparisonResult !== 0
              ? ((expectedResult - expectedComparisonResult) / Math.abs(expectedComparisonResult)) * 100
              : null
          }
        />
      </div>
    </div>
  );
}