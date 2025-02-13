import React from 'react';
import { ChevronRight, Edit2, Copy, Trash2, Plus, Loader2 } from 'lucide-react';

interface TopLevelDropdownProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  value?: string;
  children?: React.ReactNode;
  isDuplicating?: boolean;
  progress?: number;
}

export function TopLevelDropdown({
  title,
  isExpanded,
  onToggle,
  onEdit,
  onDuplicate,
  onDelete,
  onAdd,
  value,
  children,
  isDuplicating,
  progress
}: TopLevelDropdownProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <div 
        className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 ${
          isExpanded ? 'rounded-t-lg' : 'rounded-lg'
        } transition-colors duration-200`}
      >
        <button
          onClick={onToggle}
          className="flex items-center text-lg font-medium text-gray-900 dark:text-white focus:outline-none"
        >
          <ChevronRight
            className={`h-5 w-5 mr-2 transition-transform duration-200 ${
              isExpanded ? 'transform rotate-90' : ''
            }`}
          />
          {title}
        </button>
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              title="Bearbeiten"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              disabled={isDuplicating}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Duplizieren"
            >
              {isDuplicating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              title="Löschen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              title="Hinzufügen"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          {value && (
            <span className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
              {value}
            </span>
          )}
        </div>
      </div>

      {isDuplicating && (
        <div className="px-4 py-2 bg-white dark:bg-gray-800">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
            Dupliziere Daten... {progress}%
          </p>
        </div>
      )}

      {isExpanded && children && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
          <div className="space-y-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}