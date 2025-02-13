import axios, { AxiosError } from 'axios';
import type { Invoice, Expense, Project, ExpenseCategory, Receipt } from '../types/harvest';

const HARVEST_API_TOKEN = import.meta.env.VITE_HARVEST_API_TOKEN;
const HARVEST_ACCOUNT_ID = import.meta.env.VITE_HARVEST_ACCOUNT_ID;

if (!HARVEST_API_TOKEN || !HARVEST_ACCOUNT_ID) {
  throw new Error('Harvest API Token und Account ID müssen in der .env Datei konfiguriert sein');
}

const harvestClient = axios.create({
  baseURL: 'https://api.harvestapp.com/v2',
  headers: {
    'Authorization': `Bearer ${HARVEST_API_TOKEN}`,
    'Harvest-Account-Id': HARVEST_ACCOUNT_ID,
    'Content-Type': 'application/json',
  },
});

async function getAllPages(url: string, params: Record<string, string>) {
  const allData = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const response = await harvestClient.get(url, {
      params: {
        ...params,
        page: currentPage,
        per_page: 100
      },
    });

    const { data } = response;
    const items = url === '/invoices' ? data.invoices : data.expenses;
    
    if (!items || !Array.isArray(items)) {
      throw new Error('Ungültige Antwort vom Server');
    }

    allData.push(...items);

    // Check if we have more pages based on the total_pages field
    totalPages = data.total_pages || 1;
    currentPage++;
  } while (currentPage <= totalPages);

  return allData;
}

export const getInvoices = async (from: string, to: string): Promise<Invoice[]> => {
  try {
    return await getAllPages('/invoices', { from, to });
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error_description || 
        'Fehler beim Abrufen der Rechnungen'
      );
    }
    throw error;
  }
};

export const getExpenses = async (from: string, to: string): Promise<Expense[]> => {
  try {
    return await getAllPages('/expenses', { from, to });
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error_description || 
        'Fehler beim Abrufen der Ausgaben'
      );
    }
    throw error;
  }
};

export const updateExpense = async (expenseId: number, data: {
  spent_date?: string;
  total_cost?: number;
  notes?: string;
  expense_category_id?: number;
  project_id?: number;
  billable?: boolean;
}): Promise<Expense> => {
  try {
    const response = await harvestClient.patch(`/expenses/${expenseId}`, data);
    
    if (!response.data) {
      throw new Error('Keine Daten in der Antwort');
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.response?.data?.error_description;
      throw new Error(message || 'Fehler beim Aktualisieren der Ausgabe');
    }
    throw error;
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await harvestClient.get('/projects', {
      params: {
        is_active: true
      }
    });
    return response.data.projects;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error_description || 
        'Fehler beim Abrufen der Projekte'
      );
    }
    throw error;
  }
};

export const getExpenseCategories = async (): Promise<ExpenseCategory[]> => {
  try {
    const response = await harvestClient.get('/expense_categories', {
      params: {
        is_active: true
      }
    });
    return response.data.expense_categories;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error_description || 
        'Fehler beim Abrufen der Kategorien'
      );
    }
    throw error;
  }
};

export const uploadReceipt = async (expenseId: number, file: File): Promise<Receipt> => {
  try {
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await harvestClient.post(`/expenses/${expenseId}/receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!response.data?.receipt) {
      throw new Error('Keine Beleg-Daten in der Antwort');
    }

    return response.data.receipt;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.response?.data?.error_description;
      throw new Error(message || 'Fehler beim Hochladen des Belegs');
    }
    throw error;
  }
};

export const deleteReceipt = async (expenseId: number): Promise<void> => {
  try {
    await harvestClient.delete(`/expenses/${expenseId}/receipt`);
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.response?.data?.error_description;
      throw new Error(message || 'Fehler beim Löschen des Belegs');
    }
    throw error;
  }
};