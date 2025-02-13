import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users,
  FileText,
  CreditCard,
  CircleDollarSign,
  Menu,
  Palette,
  Moon,
  Sun
} from 'lucide-react';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      return stored === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newMode = e.matches;
      setIsDarkMode(newMode);
      localStorage.setItem('darkMode', String(newMode));
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  return (
    <div className="min-h-screen">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${isMenuOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col`}>
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
            {isMenuOpen ? (
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">plan p</h1>
            ) : null}
            <div className="flex items-center ml-auto space-x-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-5 w-5 text-blue-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 flex flex-col justify-between">
            {/* Main Menu Items */}
            <div className="space-y-1">
              {[
                { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
                { id: 'invoices', path: '/invoices', label: 'Rechnungen', icon: FileText },
                { id: 'expenses', path: '/expenses', label: 'Ausgaben', icon: CreditCard },
                { id: 'credit-cards', path: '/credit-cards', label: 'Kreditkarten', icon: CreditCard },
                { id: 'running-costs', path: '/running-costs', label: 'Laufende Kosten', icon: CircleDollarSign },
                { id: 'personnel', path: '/personnel', label: 'Personalkosten', icon: Users },
              ].map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }
                  `}
                >
                  <item.icon className={`${isMenuOpen ? 'mr-3' : 'mx-auto'} h-5 w-5 text-blue-600 dark:text-gray-400`} />
                  {isMenuOpen && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>

            {/* Bottom Menu Items */}
            <div className="space-y-1 border-t border-gray-200 dark:border-gray-700 pt-4">
              {[
                { id: 'design', path: '/design', label: 'Design System', icon: Palette },
                { 
                  id: 'theme-toggle',
                  path: 'theme-toggle', 
                  label: isDarkMode ? 'Light Mode' : 'Dark Mode', 
                  icon: isDarkMode ? Sun : Moon,
                  onClick: toggleDarkMode 
                }
              ].map((item) => (
                item.onClick ? (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <item.icon className={`${isMenuOpen ? 'mr-3' : 'mx-auto'} h-5 w-5 text-blue-600 dark:text-gray-400`} />
                    {isMenuOpen && <span>{item.label}</span>}
                  </button>
                ) : (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2 text-sm font-medium rounded-md
                      ${isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                      }
                    `}
                  >
                    <item.icon className={`${isMenuOpen ? 'mr-3' : 'mx-auto'} h-5 w-5 text-blue-600 dark:text-gray-400`} />
                    {isMenuOpen && <span>{item.label}</span>}
                  </NavLink>
                )
              ))}
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </div>
      </div>
    </div>
  );
}