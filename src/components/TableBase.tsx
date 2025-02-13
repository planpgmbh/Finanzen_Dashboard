import React from 'react';

interface TableBaseProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBase({ children, className = '' }: TableBaseProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          // If the child is already a tr element with a key, return it as is
          if (child.type === 'tr' && child.key) {
            return child;
          }
          // If the child is a tr element without a key, add one
          if (child.type === 'tr') {
            return React.cloneElement(child, { key: `header-row-${index}` });
          }
          // If the child is not a tr element, wrap it in one with a key
          return (
            <tr key={`header-row-${index}`}>
              {React.Children.map(child.props.children, (headerCell, cellIndex) => {
                if (React.isValidElement(headerCell)) {
                  return React.cloneElement(headerCell, {
                    key: `header-cell-${cellIndex}`,
                    className: `px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${headerCell.props.className || ''}`
                  });
                }
                return null;
              })}
            </tr>
          );
        }
        return null;
      })}
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </tbody>
  );
}

export function TableRow({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr 
      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '', colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <td 
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}

export function TableFooter({ children }: { children: React.ReactNode }) {
  return (
    <tfoot className="bg-gray-50 dark:bg-gray-700">
      {children}
    </tfoot>
  );
}