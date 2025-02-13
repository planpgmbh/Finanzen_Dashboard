import React, { useState, useEffect, useRef } from 'react';
import { format, parseISO, eachMonthOfInterval } from 'date-fns';
import { Chart } from 'chart.js/auto';
import { formatCurrency } from '../../utils/format';
import type { YearData } from '../../types/runningCosts';

interface RunningCostsAnalysisProps {
  categories: Array<{ id: string; name: string }>;
  years: number[];
  yearsData: YearData[];
}

export function RunningCostsAnalysis({ categories, years, yearsData }: RunningCostsAnalysisProps) {
  const chartRef = useRef<Chart | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [comparisonYear, setComparisonYear] = useState<number>(selectedYear - 1);

  const getMonthlyDataForYear = (year: number, categoryId: string = '') => {
    const yearData = yearsData.find(y => y.year === year);
    if (!yearData) return Array(12).fill(0);

    return Array.from({ length: 12 }, (_, month) => {
      const relevantCosts = categoryId
        ? yearData.costs.filter(c => c.id === categoryId)
        : yearData.costs;

      return relevantCosts.reduce((total, cost) => {
        const monthData = cost.monthlyData.find(md => md.month === month + 1);
        return total + (monthData?.cost || 0);
      }, 0);
    });
  };

  useEffect(() => {
    const ctx = document.getElementById('runningCostsChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = [
      'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
      'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
    ];

    const currentData = getMonthlyDataForYear(selectedYear);
    const comparisonData = getMonthlyDataForYear(comparisonYear);

    const maxValue = Math.max(...currentData, ...comparisonData);
    const stepSize = Math.ceil(maxValue / 10);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `${selectedYear}`,
            data: currentData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.1,
            fill: true
          },
          {
            label: `${comparisonYear}`,
            data: comparisonData,
            borderColor: 'rgb(107, 114, 128)',
            backgroundColor: 'rgba(107, 114, 128, 0.1)',
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

    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [yearsData, categories, selectedYear, comparisonYear]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex justify-end mb-4 space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Jahr:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Vergleich mit:</label>
          <select
            value={comparisonYear}
            onChange={(e) => setComparisonYear(Number(e.target.value))}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-64">
        <canvas id="runningCostsChart"></canvas>
      </div>
    </div>
  );
}