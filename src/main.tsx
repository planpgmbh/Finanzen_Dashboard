import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './components/auth/LoginPage';
import { RequireAuth } from './components/auth/RequireAuth';
import { AuthProvider } from './components/auth/AuthProvider';
import { Dashboard } from './pages/Dashboard';
import { Personnel } from './pages/Personnel';
import { Expenses } from './pages/Expenses';
import { Invoices } from './pages/Invoices';
import { RunningCosts } from './pages/RunningCosts';
import { Administration } from './pages/Administration';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/common/Toast';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    errorElement: <ErrorBoundary><Layout /></ErrorBoundary>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'personnel', element: <Personnel /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'invoices', element: <Invoices /> },
      { path: 'running-costs', element: <RunningCosts /> },
      { path: 'administration', element: <Administration /> }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);