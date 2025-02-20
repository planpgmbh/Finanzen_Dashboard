import React from 'react';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

const baseInputStyles = `
  w-full
  px-3 py-2
  text-sm
  bg-white dark:bg-gray-700
  border border-gray-200 dark:border-gray-600
  rounded-lg
  placeholder-gray-400 dark:placeholder-gray-500
  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
  focus:border-blue-500 dark:focus:border-blue-400
  disabled:bg-gray-50 dark:disabled:bg-gray-800
  disabled:text-gray-500 dark:disabled:text-gray-400
  transition-colors duration-200
`;

export function Input({ 
  label, 
  error, 
  icon, 
  helperText,
  className = '', 
  ...props 
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            ${baseInputStyles}
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

export function SearchInput(props: Omit<InputProps, 'icon'>) {
  return (
    <Input
      icon={<Search className="h-4 w-4" />}
      placeholder="Suchen..."
      {...props}
    />
  );
}