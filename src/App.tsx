import React, { useState, useEffect, useRef } from 'react';
import { format, isValid, parseISO, subYears, eachMonthOfInterval, eachWeekOfInterval, startOfYear, differenceInMonths } from 'date-fns';
import { Euro, CreditCard, FileText, ChevronDown, Search } from 'lucide-react';
import { DateRangeFilter } from './components/DateRangeFilter';
import { DashboardCard } from './components/DashboardCard';
import { getInvoices, getExpenses } from './api/harvestApi';
import type { Invoice, Expense } from './types/harvest';
import { Chart, ChartConfiguration } from 'chart.js/auto';

function App() {
  // Initialize current dates
  const currentStartDate = startOfYear(new Date());
  const currentEndDate = new Date();
  
  const [fromDate, setFromDate] = useState(format(currentStartDate, 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(currentEndDate, 'yyyy-MM-dd'));
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [comparisonInvoices, setComparisonInvoices] = useState<Invoice[]>([]);
  const [comparisonExpenses, setComparisonExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses'>('invoices');
  const chartRef = useRef<Chart | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
  
  // Initialize comparison dates
  const [comparisonFromDate, setComparisonFromDate] = useState(() => {
    const comparisonStart = subYears(currentStartDate, 1);
    return format(comparisonStart, 'yyyy-MM-dd');
  });
  
  const [comparisonToDate, setComparisonToDate] = useState(() => {
    const comparisonEnd = subYears(currentEndDate, 1);
    return format(comparisonEnd, 'yyyy-MM-dd');
  });

  const currentYear = format(parseISO(fromDate), 'yyyy');
  const selectedComparisonYear = format(parseISO(comparisonFromDate), 'yyyy');

  // Mock values for personnel and running costs - replace with actual data later
  const personnelCosts = 65584.45;
  const runningCosts = 5457.45;

  const updateYearComparisonChart = (currentInvoices: Invoice[], comparisonInvoices: Invoice[]) => {
    const ctx = document.getElementById('yearComparisonChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // ... (rest of the chart update logic)
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [currentInvoices, currentExpenses, comparisonInvoicesData, comparisonExpensesData] = await Promise.all([
          getInvoices(fromDate, toDate),
          getExpenses(fromDate, toDate),
          showComparison ? getInvoices(comparisonFromDate, comparisonToDate) : Promise.resolve([]),
          showComparison ? getExpenses(comparisonFromDate, comparisonToDate) : Promise.resolve([])
        ]);

        setInvoices(currentInvoices || []);
        setExpenses(currentExpenses || []);
        setComparisonInvoices(comparisonInvoicesData || []);
        setComparisonExpenses(comparisonExpensesData || []);
        updateYearComparisonChart(currentInvoices || [], comparisonInvoicesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [fromDate, toDate, comparisonFromDate, comparisonToDate, showComparison, selectedClient]);

  const formatAmount = (amount: number | undefined | null) => {
    if (amount == null) return '€0';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
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
  });

  const selectedClientName = selectedClient 
    ? clients.find(client => client.id === selectedClient)?.name 
    : '';

  const filteredInvoices = invoices.filter(invoice => {
    const matchesClient = !selectedClient || String(invoice.client?.id) === selectedClient;
    const amount = invoice.amount || 0;
    const amountStr = amount.toFixed(2).replace('.', ',');
    
    const matchesSearch = !invoiceSearchTerm || 
      invoice.subject?.toLowerCase().includes(invoiceSearchTerm.toLowerCase()) ||
      amountStr.includes(invoiceSearchTerm);

    return matchesClient && matchesSearch;
  });

  const filteredExpenses = expenses.filter(expense => {
    const nettoAmount = expense.total_cost || 0;
    const bruttoAmount = nettoAmount * 1.19;
    const nettoStr = nettoAmount.toFixed(2).replace('.', ',');
    const bruttoStr = bruttoAmount.toFixed(2).replace('.', ',');

    return (!selectedClient || String(expense.client?.id) === selectedClient) &&
      (!selectedCategory || String(expense.expense_category.id) === selectedCategory) &&
      (!searchTerm || 
        expense.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.expense_category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nettoStr.includes(searchTerm) ||
        bruttoStr.includes(searchTerm)
      );
  });

  const filteredComparisonInvoices = comparisonInvoices.filter(invoice => 
    !selectedClient || String(invoice.client?.id) === selectedClient
  );

  const filteredComparisonExpenses = comparisonExpenses.filter(expense =>
    (!selectedClient || String(expense.client?.id) === selectedClient) &&
    (!selectedCategory || String(expense.expense_category.id) === selectedCategory)
  );

  const totalInvoices = filteredInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + (expense.total_cost || 0), 0);
  const totalComparisonInvoices = filteredComparisonInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
  const totalComparisonExpenses = filteredComparisonExpenses.reduce((sum, expense) => sum + (expense.total_cost || 0), 0);

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  const invoicesPercentageChange = calculatePercentageChange(totalInvoices, totalComparisonInvoices);
  const expensesPercentageChange = calculatePercentageChange(totalExpenses, totalComparisonExpenses);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Add Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Finanzübersicht und Kennzahlen
        </p>
      </div>

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
        comparisonFromDate={comparisonFromDate}
        comparisonToDate={comparisonToDate}
        onComparisonFromDateChange={setComparisonFromDate}
        onComparisonToDateChange={setComparisonToDate}
      />

      {loading ? (
        <div className="mt-8 text-center text-gray-500">Laden...</div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <DashboardCard
              title={selectedClientName ? `Gesamtumsatz ${selectedClientName} (netto)` : 'Gesamtumsatz (netto)'}
              value={formatAmount(totalInvoices)}
              icon={Euro}
              comparisonValue={showComparison ? `${formatAmount(totalComparisonInvoices)} (${selectedComparisonYear})` : undefined}
              percentageChange={invoicesPercentageChange}
            />
            <DashboardCard
              title={selectedClientName ? `Gesamtausgaben ${selectedClientName} (netto)` : 'Gesamtausgaben (netto)'}
              value={formatAmount(totalExpenses + personnelCosts + runningCosts)}
              icon={CreditCard}
              comparisonValue={showComparison ? `${formatAmount(totalComparisonExpenses)} (${selectedComparisonYear})` : undefined}
              percentageChange={expensesPercentageChange}
              inversePercentageColors
              tooltip={{
                title: 'Aufschlüsselung der Gesamtausgaben',
                items: [
                  { label: 'Ausgaben', value: formatAmount(totalExpenses) },
                  { label: 'Laufende Kosten', value: formatAmount(runningCosts) },
                  { label: 'Personalkosten', value: formatAmount(personnelCosts) },
                  { label: 'Gesamtkosten', value: formatAmount(totalExpenses + personnelCosts + runningCosts) }
                ]
              }}
            />
          </div>

          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === 'invoices'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('invoices')}
                  >
                    Rechnungen
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === 'expenses'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('expenses')}
                  >
                    Ausgaben
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  {activeTab === 'invoices' && (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Suchen..."
                          value={invoiceSearchTerm}
                          onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                          className="h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-[200px]"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </>
                  )}
                  {activeTab === 'expenses' && (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Suchen..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-[200px]"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                {activeTab === 'invoices' ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px] max-w-[150px]">Nr.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kunde</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Rechnungsdatum</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Fällig</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Betrag</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredInvoices.map((invoice) => (
                        <tr 
                          key={invoice.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => window.open(`https://ppgmbh.harvestapp.com/invoices/${invoice.id}`, '_blank')}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[150px]">
                            {invoice.number}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatAmount(invoice.amount)}
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
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900">
                          Gesamtsumme
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatAmount(totalInvoices)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
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
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExpenses.map((expense) => (
                        <tr 
                          key={expense.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => window.open(`https://ppgmbh.harvestapp.com/expenses/people/${expense.user.id}?expense_id=${expense.id}#expense_${expense.id}`, '_blank')}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(parseISO(expense.spent_date), 'dd.MM.yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expense.expense_category.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatAmount(expense.total_cost)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatAmount(expense.total_cost * 1.19)}
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
                                <FileText className="w-4 h-4" />
                                <span className="ml-1">Beleg</span>
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan={2} className="px-6 py-4 text-sm font-medium text-gray-900">
                          Gesamtsumme
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatAmount(totalExpenses)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatAmount(totalExpenses * 1.19)}
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;