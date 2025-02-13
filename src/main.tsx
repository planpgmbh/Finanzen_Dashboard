import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Personnel } from './pages/Personnel';
import { Expenses } from './pages/Expenses';
import { Invoices } from './pages/Invoices';
import { RunningCosts } from './pages/RunningCosts';
import { CreditCards } from './pages/CreditCards';
import { DesignSystem } from './pages/DesignSystem';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary><Layout /></ErrorBoundary>,
    children: [
      {
        index: true,
        element: <ErrorBoundary><Dashboard /></ErrorBoundary>,
      },
      {
        path: 'personnel',
        element: <ErrorBoundary><Personnel /></ErrorBoundary>,
      },
      {
        path: 'expenses',
        element: <ErrorBoundary><Expenses /></ErrorBoundary>,
      },
      {
        path: 'invoices',
        element: <ErrorBoundary><Invoices /></ErrorBoundary>,
      },
      {
        path: 'credit-cards',
        element: <ErrorBoundary><CreditCards /></ErrorBoundary>,
      },
      {
        path: 'running-costs',
        element: <ErrorBoundary><RunningCosts /></ErrorBoundary>,
      },
      {
        path: 'design',
        element: <ErrorBoundary><DesignSystem /></ErrorBoundary>,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);