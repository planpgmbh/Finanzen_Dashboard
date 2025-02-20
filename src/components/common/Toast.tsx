import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

const toastTypeConfig: Record<ToastType, { icon: typeof CheckCircle; className: string }> = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200'
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200'
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-yellow-50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
  }
};

function ToastMessage({ id, type, message, duration = 5000, onClose }: ToastProps) {
  const { icon: Icon, className } = toastTypeConfig[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={`
        flex items-center justify-between
        w-full max-w-sm
        p-4 mb-4
        rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-4 flex-shrink-0 hover:opacity-75 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

export const ToastContext = React.createContext<ToastContextType>({
  showToast: () => {}
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
          {toasts.map(toast => (
            <ToastMessage
              key={toast.id}
              {...toast}
              onClose={removeToast}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}