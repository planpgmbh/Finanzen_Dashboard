import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function Table({ children, className = '', ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table 
        className={`
          min-w-full
          divide-y divide-gray-200 dark:divide-gray-700
          ${className}
        `}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={className}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody 
      className={`
        bg-white dark:bg-gray-800
        divide-y divide-gray-200 dark:divide-gray-700
        ${className}
      `}
    >
      {children}
    </tbody>
  );
}

interface TableFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function TableFooter({ children, className = '' }: TableFooterProps) {
  return (
    <tfoot 
      className={`
        bg-gray-50 dark:bg-gray-700
        ${className}
      `}
    >
      {children}
    </tfoot>
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  isHeader?: boolean;
  onClick?: () => void;
}

export function TableRow({ 
  children, 
  isHeader,
  onClick,
  className = '',
  ...props 
}: TableRowProps) {
  return (
    <tr 
      className={`
        ${onClick ? 'cursor-pointer' : ''}
        ${!isHeader ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
        transition-colors duration-200
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  isHeader?: boolean;
}

export function TableCell({ 
  children, 
  isHeader,
  className = '',
  ...props 
}: TableCellProps) {
  const Component = isHeader ? 'th' : 'td';
  
  return (
    <Component
      className={`
        px-6 py-4
        ${isHeader ? `
          text-left
          text-xs
          font-medium
          text-gray-500 dark:text-gray-400
          uppercase
          tracking-wider
        ` : `
          text-sm
          text-gray-900 dark:text-gray-100
          whitespace-nowrap
        `}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ''
}: TablePaginationProps) {
  return (
    <div 
      className={`
        flex items-center justify-between
        px-4 py-3
        bg-white dark:bg-gray-800
        border-t border-gray-200 dark:border-gray-700
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Zurück
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Seite {currentPage} von {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}

interface TableSortHeaderProps extends TableCellProps {
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

export function TableSortHeader({ 
  children, 
  sorted,
  onSort,
  className = '',
  ...props 
}: TableSortHeaderProps) {
  return (
    <TableCell
      isHeader
      onClick={onSort}
      className={`
        ${onSort ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sorted && (
          <span className="text-gray-400 dark:text-gray-500">
            {sorted === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </TableCell>
  );
}