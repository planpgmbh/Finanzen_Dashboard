import React from 'react';
import { ChevronDown } from 'lucide-react';
import { format, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subYears, differenceInMonths } from 'date-fns';

interface DateRangeFilterProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  selectedClient: string;
  onClientChange: (client: string) => void;
  clients: Array<{ id: string; name: string; }>;
  clientLabel?: string;
  showComparison: boolean;
  onComparisonToggle: (show: boolean) => void;
  comparisonFromDate: string;
  comparisonToDate: string;
  onComparisonFromDateChange: (date: string) => void;
  onComparisonToDateChange: (date: string) => void;
  comparisonYear?: number;
  onComparisonYearChange?: (year: number) => void;
  comparisonYears?: number[];
}

type TimeRange = 'this-quarter' | 'this-year' | 'this-year-to-date' | 'last-year' | 'custom';

const baseSelectStyles = `
  appearance-none h-10 pl-3 pr-8 text-sm
  bg-white dark:bg-gray-700
  border border-gray-200 dark:border-gray-600
  rounded-lg
  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
  text-gray-900 dark:text-gray-100
  disabled:bg-gray-50 dark:disabled:bg-gray-800
  disabled:text-gray-500 dark:disabled:text-gray-400
  disabled:border-gray-200 dark:disabled:border-gray-700
  transition-colors duration-200
`;

const baseInputStyles = `
  h-10 pl-3 pr-3 text-sm
  bg-white dark:bg-gray-700
  border border-gray-200 dark:border-gray-600
  rounded-lg
  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
  text-gray-900 dark:text-gray-100
  disabled:bg-gray-50 dark:disabled:bg-gray-800
  disabled:text-gray-500 dark:disabled:text-gray-400
  disabled:border-gray-200 dark:disabled:border-gray-700
  transition-colors duration-200
`;

export function DateRangeFilter({ 
  fromDate, 
  toDate, 
  onFromDateChange, 
  onToDateChange,
  selectedClient,
  onClientChange,
  clients,
  clientLabel = "Alle Kunden",
  showComparison,
  onComparisonToggle,
  comparisonFromDate,
  comparisonToDate,
  onComparisonFromDateChange,
  onComparisonToDateChange,
  comparisonYear,
  onComparisonYearChange,
  comparisonYears = []
}: DateRangeFilterProps) {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<TimeRange>('this-year-to-date');
  const [showDatePickers, setShowDatePickers] = React.useState(true);

  const handleTimeRangeChange = (range: TimeRange) => {
    const now = new Date();
    let start: Date;
    let end: Date;
    
    switch (range) {
      case 'this-quarter':
        start = startOfQuarter(now);
        end = endOfQuarter(now);
        break;
      case 'this-year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      case 'this-year-to-date':
        start = startOfYear(now);
        end = now;
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
        end = now;
        break;
    }
    
    setShowDatePickers(true);
    setSelectedTimeRange(range);
    onFromDateChange(format(start, 'yyyy-MM-dd'));
    onToDateChange(format(end, 'yyyy-MM-dd'));

    // Only enable comparison for periods within one year
    const monthDiff = differenceInMonths(end, start);
    if (monthDiff <= 12) {
      onComparisonToggle(true);
    } else {
      onComparisonToggle(false);
    }
  };

  // Update selected time range when dates change manually
  React.useEffect(() => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const now = new Date();

    // Check if dates match any predefined range
    if (format(start, 'yyyy-MM-dd') === format(startOfYear(now), 'yyyy-MM-dd')) {
      if (format(end, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) {
        setSelectedTimeRange('this-year-to-date');
      } else if (format(end, 'yyyy-MM-dd') === format(endOfYear(now), 'yyyy-MM-dd')) {
        setSelectedTimeRange('this-year');
      }
    } else if (
      format(start, 'yyyy-MM-dd') === format(startOfQuarter(now), 'yyyy-MM-dd') &&
      format(end, 'yyyy-MM-dd') === format(endOfQuarter(now), 'yyyy-MM-dd')
    ) {
      setSelectedTimeRange('this-quarter');
    } else {
      setSelectedTimeRange('custom');
    }
  }, [fromDate, toDate]);

  const SelectWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative inline-block ${className}`}>
      {children}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );

  // Check if comparison should be disabled (period > 1 year)
  const monthDiff = differenceInMonths(new Date(toDate), new Date(fromDate));
  const isComparisonDisabled = monthDiff > 12;

  // If comparison is disabled, ensure it's turned off
  React.useEffect(() => {
    if (isComparisonDisabled && showComparison) {
      onComparisonToggle(false);
    }
  }, [isComparisonDisabled, showComparison]);

  // Update dates when time range changes
  React.useEffect(() => {
    if (selectedTimeRange === 'this-year-to-date') {
      const now = new Date();
      const start = startOfYear(now);
      onFromDateChange(format(start, 'yyyy-MM-dd'));
      onToDateChange(format(now, 'yyyy-MM-dd'));
    }
  }, [selectedTimeRange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4 items-center w-full">
          {/* Time range selection */}
          <SelectWrapper>
            <select
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as TimeRange)}
              className={`${baseSelectStyles} min-w-[120px] w-full`}
            >
              <option value="this-quarter">Dieses Quartal</option>
              <option value="this-year">Aktuelles Jahr</option>
              <option value="this-year-to-date">Jahr bis heute</option>
              <option value="last-year">Letztes Jahr</option>
              <option value="custom">Benutzerdefiniert</option>
            </select>
          </SelectWrapper>

          {/* Client selection */}
          <SelectWrapper className="max-w-[250px]">
            <select
              id="client"
              value={selectedClient}
              onChange={(e) => onClientChange(e.target.value)}
              className={`${baseSelectStyles} min-w-[120px] w-full`}
            >
              <option value="">{clientLabel}</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </SelectWrapper>

          {/* Date pickers */}
          {showDatePickers && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => {
                    onFromDateChange(e.target.value);
                    setSelectedTimeRange('custom');
                  }}
                  className={`${baseInputStyles} w-36`}
                />
                <span className="text-gray-400 dark:text-gray-500">-</span>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => {
                    onToDateChange(e.target.value);
                    setSelectedTimeRange('custom');
                  }}
                  className={`${baseInputStyles} w-36`}
                />
              </div>

              {/* Comparison period selection */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600 dark:text-gray-400">Vergleichen mit:</span>
                <SelectWrapper>
                  <select
                    value={showComparison ? (comparisonYear || '') : ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        onComparisonToggle(true);
                        onComparisonYearChange?.(parseInt(value));
                      } else {
                        onComparisonToggle(false);
                      }
                    }}
                    disabled={isComparisonDisabled}
                    className={`${baseSelectStyles} min-w-[120px] w-full`}
                  >
                    <option value="">Nicht vergleichen</option>
                    {comparisonYears.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}