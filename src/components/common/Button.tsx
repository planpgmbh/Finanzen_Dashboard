import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon' | 'upload';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:bg-primary-hover text-white dark:bg-primary-dark dark:hover:bg-primary-dark-hover',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600',
  danger: 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600',
  icon: 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400',
  upload: 'bg-primary hover:bg-primary-hover text-white dark:bg-primary-dark dark:hover:bg-primary-dark-hover shadow-sm'
};

const baseStyles = `
  inline-flex items-center justify-center
  transition-colors duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
  rounded-md
`;

const sizeStyles = {
  icon: 'p-1',
  default: 'px-4 py-2 text-sm font-medium'
};

export function Button({ 
  children, 
  variant = 'primary', 
  loading = false,
  icon,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${variant === 'icon' ? sizeStyles.icon : sizeStyles.default}
        ${className}
      `}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
      )}
      {!loading && icon && (
        <span className={children ? 'mr-2' : ''}>{icon}</span>
      )}
      {children}
    </button>
  );
}