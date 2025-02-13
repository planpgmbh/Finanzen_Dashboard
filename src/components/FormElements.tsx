import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            h-10 w-full
            ${icon ? 'pl-10' : 'pl-3'} pr-4
            text-sm
            bg-white dark:bg-gray-700
            border border-gray-200 dark:border-gray-600
            rounded-lg
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
            text-gray-900 dark:text-gray-100
            transition-colors duration-200
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export function SearchInput(props: Omit<InputProps, 'icon'>) {
  return (
    <Input
      icon={<Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
      {...props}
    />
  );
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            appearance-none
            h-10 w-full pl-3 pr-8
            text-sm
            bg-white dark:bg-gray-700
            border border-gray-200 dark:border-gray-600
            rounded-lg
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
            text-gray-900 dark:text-gray-100
            transition-colors duration-200
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}