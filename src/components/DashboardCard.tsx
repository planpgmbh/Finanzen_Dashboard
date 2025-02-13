import React, { useState } from 'react';
import { DivideIcon as LucideIcon, Info } from 'lucide-react';

interface TooltipItem {
  label: string;
  currentValue: string;
  comparisonValue?: string;
  value?: string; // For backward compatibility
}

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
  comparisonValue?: string;
  percentageChange?: number | null;
  inversePercentageColors?: boolean;
  tooltip?: {
    title: string;
    items: TooltipItem[];
    currentYear?: string;
    comparisonYear?: string;
  };
}

export function DashboardCard({ 
  title, 
  value, 
  icon: Icon, 
  subtitle,
  comparisonValue,
  percentageChange,
  inversePercentageColors = false,
  tooltip
}: DashboardCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getPercentageColor = (change: number) => {
    if (inversePercentageColors) {
      return change < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    }
    return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getPercentageText = (change: number) => {
    const year = comparisonValue?.match(/\((\d{4})\)/)?.[1] || '';
    const yearText = year ? ` (${year})` : '';
    const absChange = Math.abs(change);

    if (inversePercentageColors) {
      // For expenses
      return change >= 0 
        ? `${absChange.toFixed(1)}% mehr Ausgaben${yearText}`
        : `${absChange.toFixed(1)}% weniger Ausgaben${yearText}`;
    }
    // For revenue
    return change >= 0 
      ? `${absChange.toFixed(1)}% mehr Gewinn ${yearText}`
      : `${absChange.toFixed(1)}% weniger Gewinn ${yearText}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
            {tooltip && (
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <Info className="h-4 w-4" />
              </button>
            )}
          </div>
          {tooltip && showTooltip && (
            <div className="absolute z-10 mt-2 w-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">{tooltip.title}</h4>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div></div>
                  {tooltip.currentYear && <div className="text-right text-gray-500 dark:text-gray-400">{tooltip.currentYear}</div>}
                  {tooltip.comparisonYear && <div className="text-right text-gray-500 dark:text-gray-400">{tooltip.comparisonYear}</div>}
                </div>
                {tooltip.items.map((item, index) => (
                  <div key={index} className={`grid grid-cols-3 gap-4 ${index === tooltip.items.length - 1 ? 'font-bold' : ''}`}>
                    <div className="text-gray-600 dark:text-gray-300">{item.label}</div>
                    <div className="text-right text-gray-900 dark:text-gray-100">{item.currentValue}</div>
                    {item.comparisonValue && (
                      <div className="text-right text-gray-900 dark:text-gray-100">{item.comparisonValue}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
          {comparisonValue && (
            <div className="mt-1">
              <p className="text-lg text-gray-500 dark:text-gray-400">{comparisonValue}</p>
            </div>
          )}
          {percentageChange !== null && percentageChange !== undefined && (
            <p className={`mt-1 text-sm ${getPercentageColor(percentageChange)}`}>
              {getPercentageText(percentageChange)}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/50 rounded-full transition-colors duration-200">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );
}