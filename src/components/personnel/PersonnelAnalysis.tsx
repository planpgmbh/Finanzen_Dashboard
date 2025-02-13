import React, { useState, useEffect } from 'react';
import { format, startOfYear, endOfYear, startOfQuarter, endOfQuarter, subYears, parseISO, eachMonthOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronDown } from 'lucide-react';
import { Chart } from 'chart.js/auto';
import { Employee, MonthlyData, YearData } from '../../types/personnel';
import { formatCurrency } from '../../utils/format';
import { supabase } from '../../lib/supabase';

interface PersonnelAnalysisProps {
  employees: Employee[];
  years: number[];
  yearsData: YearData[];
}

type TimeRange = 'this-year' | 'this-quarter' | 'year-to-date' | 'last-year' | 'custom';

interface FilterState {
  startDate: string;
  endDate: string;
  selectedEmployee: string;
  selectedYear: string;
  comparisonYear: string;
}

export function PersonnelAnalysis({ employees, years, yearsData }: PersonnelAnalysisProps) {
  const currentYear = new Date().getFullYear();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('this-year');
  const [filters, setFilters] = useState<FilterState>({
    startDate: format(startOfYear(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfYear(new Date()), 'yyyy-MM-dd'),
    selectedEmployee: '',
    selectedYear: currentYear.toString(),
    comparisonYear: (currentYear - 1).toString(),
  });
  const [chartData, setChartData] = useState<{
    current: number[];
    comparison: number[];
  }>({ current: [], comparison: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChartData();
  }, [filters.startDate, filters.endDate, filters.selectedEmployee]);

  useEffect(() => {
    loadComparisonData();
  }, [filters.comparisonYear]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = parseISO(filters.startDate);
      const endDate = parseISO(filters.endDate);
      const months = eachMonthOfInterval({ start: startDate, end: endDate });

      const { data, error } = await supabase
        .from('personnel_monthly_data')
        .select(`
          grundgehalt,
          krankenversicherung,
          rentenversicherung,
          arbeitslosenversicherung,
          pflegeversicherung,
          insolvenzgeldumlage,
          umlage_u1,
          umlage_u2,
          month,
          personnel_years!inner(year)
        `)
        .gte('personnel_years.year', startDate.getFullYear())
        .lte('personnel_years.year', endDate.getFullYear())
        .gte('month', startDate.getMonth() + 1)
        .lte('month', endDate.getMonth() + 1)
        .order('month');

      if (error) throw error;

      const monthlyTotals = months.map(month => {
        const monthData = data?.filter(d => 
          d.month === month.getMonth() + 1 && 
          d.personnel_years.year === month.getFullYear()
        ) || [];

        return monthData.reduce((sum, md) => sum + (
          md.grundgehalt +
          md.krankenversicherung +
          md.rentenversicherung +
          md.arbeitslosenversicherung +
          md.pflegeversicherung +
          md.insolvenzgeldumlage +
          md.umlage_u1 +
          md.umlage_u2
        ), 0);
      });

      setChartData(prev => ({ ...prev, current: monthlyTotals }));
    } catch (error) {
      console.error('Error loading chart data:', error);
      setError('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const loadComparisonData = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = parseISO(filters.startDate);
      const endDate = parseISO(filters.endDate);
      const yearDiff = startDate.getFullYear() - parseInt(filters.comparisonYear);
      const comparisonStartDate = subYears(startDate, yearDiff);
      const comparisonEndDate = subYears(endDate, yearDiff);
      const months = eachMonthOfInterval({ start: comparisonStartDate, end: comparisonEndDate });

      const { data, error } = await supabase
        .from('personnel_monthly_data')
        .select(`
          grundgehalt,
          krankenversicherung,
          rentenversicherung,
          arbeitslosenversicherung,
          pflegeversicherung,
          insolvenzgeldumlage,
          umlage_u1,
          umlage_u2,
          month,
          personnel_years!inner(year)
        `)
        .eq('personnel_years.year', parseInt(filters.comparisonYear))
        .gte('month', comparisonStartDate.getMonth() + 1)
        .lte('month', comparisonEndDate.getMonth() + 1)
        .order('month');

      if (error) throw error;

      const monthlyTotals = months.map(month => {
        const monthData = data?.filter(d => d.month === month.getMonth() + 1) || [];
        return monthData.reduce((sum, md) => sum + (
          md.grundgehalt +
          md.krankenversicherung +
          md.rentenversicherung +
          md.arbeitslosenversicherung +
          md.pflegeversicherung +
          md.insolvenzgeldumlage +
          md.umlage_u1 +
          md.umlage_u2
        ), 0);
      });

      setChartData(prev => ({ ...prev, comparison: monthlyTotals }));
    } catch (error) {
      console.error('Error loading comparison data:', error);
      setError('Fehler beim Laden der Vergleichsdaten');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ctx = document.getElementById('personnelAnalysisChart') as HTMLCanvasElement;
    if (!ctx) return;

    const startDate = parseISO(filters.startDate);
    const endDate = parseISO(filters.endDate);
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    const labels = months.map(date => format(date, 'MMM yyyy', { locale: de }));

    const maxValue = Math.max(
      ...chartData.current,
      ...chartData.comparison
    );
    const stepSize = Math.ceil(maxValue / 10);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`,
            data: chartData.current,
            borderColor: '#0000ff', // Primary Blue
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            borderWidth: 2,
            tension: 0.1,
            fill: true
          },
          {
            label: filters.comparisonYear,
            data: chartData.comparison,
            borderColor: 'rgb(107, 114, 128)',
            backgroundColor: 'rgba(107, 114, 128, 0.1)',
            borderWidth: 1.5,
            tension: 0.1,
            borderDash: [5, 5],
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            align: 'center',
            labels: {
              usePointStyle: true,
              padding: 20,
              color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += formatCurrency(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              stepSize: stepSize * 2,
              callback: function(value) {
                return formatCurrency(Number(value));
              },
              color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    return () => {
      chart.destroy();
    };
  }, [filters, chartData]);

  const handleTimeRangeChange = (range: TimeRange) => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (range) {
      case 'this-quarter':
        start = startOfQuarter(now);
        end = endOfQuarter(now);
        break;
      case 'year-to-date':
        start = startOfYear(now);
        end = now;
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
      case 'custom':
        return;
      default:
        start = startOfYear(now);
        end = endOfYear(now);
        break;
    }

    setSelectedTimeRange(range);
    setFilters(prev => ({
      ...prev,
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd')
    }));
  };

  const handleDateChange = (key: 'startDate' | 'endDate', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSelectedTimeRange('custom');
  };

  const SelectWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative inline-block ${className}`}>
      {children}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4 items-center w-full">
          {/* Time range selection */}
          <SelectWrapper>
            <select
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as TimeRange)}
              className="appearance-none h-10 pl-3 pr-8 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-gray-100 min-w-[180px]"
            >
              <option value="this-year">Aktuelles Jahr</option>
              <option value="this-quarter">Aktuelles Quartal</option>
              <option value="year-to-date">Jahr bis heute</option>
              <option value="last-year">Letztes Jahr</option>
              <option value="custom">Benutzerdefiniert</option>
            </select>
          </SelectWrapper>

          {/* Employee selection */}
          <SelectWrapper className="flex-1">
            <select
              value={filters.selectedEmployee}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedEmployee: e.target.value }))}
              className="appearance-none h-10 pl-3 pr-8 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-gray-100 w-full"
            >
              <option value="">Alle Mitarbeiter</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </SelectWrapper>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="h-10 pl-3 pr-3 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-gray-100"
            />
            <span className="text-gray-400 dark:text-gray-500">-</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="h-10 pl-3 pr-3 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Comparison selection */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600 dark:text-gray-400">Vergleichen mit:</span>
            <SelectWrapper>
              <select
                value={filters.comparisonYear}
                onChange={(e) => setFilters(prev => ({ ...prev, comparisonYear: e.target.value }))}
                className="appearance-none h-10 pl-3 pr-8 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-gray-100 w-[100px]"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        <div className="h-64">
          <canvas id="personnelAnalysisChart"></canvas>
        </div>
      </div>
    </div>
  );
}