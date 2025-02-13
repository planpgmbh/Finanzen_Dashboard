import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface YearComparisonChartProps {
  currentData: number[];
  comparisonData?: number[];
  labels: string[];
  currentYear: string;
  comparisonYear?: string;
  showComparison: boolean;
}

export function YearComparisonChart({
  currentData,
  comparisonData = [],
  labels,
  currentYear,
  comparisonYear,
  showComparison
}: YearComparisonChartProps) {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = document.getElementById('yearComparisonChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const maxValue = Math.max(
      ...currentData,
      ...(showComparison ? comparisonData : [])
    );

    const stepSize = Math.ceil(maxValue / 10);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: currentYear,
            data: currentData,
            borderColor: '#0000ff', // Primary Blue
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            borderWidth: 3, // Thicker line for current period
            tension: 0.1,
            fill: true
          },
          ...(showComparison ? [{
            label: comparisonYear,
            data: comparisonData,
            borderColor: 'rgb(107, 114, 128)',
            backgroundColor: 'rgba(107, 114, 128, 0.1)',
            borderWidth: 1.5, // Thinner line for comparison
            tension: 0.1,
            borderDash: [5, 5],
            fill: true
          }] : [])
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
                  label += new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(context.parsed.y);
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
                return new Intl.NumberFormat('de-DE', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(Number(value));
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
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [currentData, comparisonData, labels, currentYear, comparisonYear, showComparison]);

  return (
    <div className="h-64 bg-white dark:bg-gray-800 rounded-md">
      <canvas id="yearComparisonChart" className="w-full h-full"></canvas>
    </div>
  );
}