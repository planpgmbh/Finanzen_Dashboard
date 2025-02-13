import React from 'react';
import { format, parse, isValid } from 'date-fns';
import { de } from 'date-fns/locale';

interface Transaction {
  date: Date | null;
  bookingDate: Date | null;
  description: string;
  amount: number;
  currency: string;
  foreignAmount?: number;
  foreignCurrency?: string;
  exchangeRate?: number;
  status?: string;
}

interface CreditCardTransactionsTableProps {
  text: string;
}

export function CreditCardTransactionsTable({ text }: CreditCardTransactionsTableProps) {
  const parseTransactions = (text: string): Transaction[] => {
    const transactions: Transaction[] = [];
    const lines = text.split('\n');
    let currentTransaction: Partial<Transaction> = {};

    // Regular expressions for coordinates and text
    const coordsRegex = /@(\d+),(\d+)\[(\d+)x(\d+)\]:(.*)/;
    const dateRegex = /(\d{2})\.(\d{2})\.(\d{4})/;
    const amountRegex = /([-]?\d+[,.]\d{2})\s*(EUR|USD|GBP|CHF)/;
    const exchangeRateRegex = /Kurs:\s*([\d,.]+)/;

    for (let line of lines) {
      const coordsMatch = line.match(coordsRegex);
      if (!coordsMatch) continue;

      const [, x, y, width, height, text] = coordsMatch;
      const cleanText = text.trim();

      // Try to match a date
      const dateMatch = cleanText.match(dateRegex);
      if (dateMatch) {
        const dateStr = `${dateMatch[1]}.${dateMatch[2]}.${dateMatch[3]}`;
        const parsedDate = parse(dateStr, 'dd.MM.yyyy', new Date());
        
        if (isValid(parsedDate)) {
          if (!currentTransaction.date) {
            currentTransaction.date = parsedDate;
          } else if (!currentTransaction.bookingDate) {
            currentTransaction.bookingDate = parsedDate;
          }
        }
        continue;
      }

      // Try to match amount and currency
      const amountMatch = cleanText.match(amountRegex);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1].replace(',', '.'));
        const currency = amountMatch[2];

        if (!currentTransaction.amount) {
          currentTransaction.amount = amount;
          currentTransaction.currency = currency;
        } else if (!currentTransaction.foreignAmount && currency !== currentTransaction.currency) {
          currentTransaction.foreignAmount = amount;
          currentTransaction.foreignCurrency = currency;
        }

        // Check for exchange rate in the same line
        const exchangeRateMatch = cleanText.match(exchangeRateRegex);
        if (exchangeRateMatch) {
          currentTransaction.exchangeRate = parseFloat(exchangeRateMatch[1].replace(',', '.'));
        }
        continue;
      }

      // If line contains neither date nor amount, it's probably the description
      if (!currentTransaction.description && 
          !cleanText.includes('Kurs:') && 
          !cleanText.includes('Betrag') &&
          !cleanText.includes('Datum') &&
          !cleanText.includes('Seite') &&
          !cleanText.includes('Kreditkarte') &&
          !cleanText.match(/^\d+$/) // Ignore lines that are just numbers
      ) {
        currentTransaction.description = cleanText;
      }

      // If we have all required fields, save the transaction and start a new one
      if (currentTransaction.date && currentTransaction.amount && currentTransaction.description) {
        transactions.push(currentTransaction as Transaction);
        currentTransaction = {};
      }
    }

    return transactions;
  };

  const transactions = parseTransactions(text);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Keine Transaktionen gefunden
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Belegdatum
            </th>
            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Buchungsdatum
            </th>
            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Verwendungszweck
            </th>
            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Währung
            </th>
            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Betrag
            </th>
            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Kurs
            </th>
            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Betrag in EUR
            </th>
            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {transaction.date && format(transaction.date, 'dd.MM.yyyy', { locale: de })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {transaction.bookingDate && format(transaction.bookingDate, 'dd.MM.yyyy', { locale: de })}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {transaction.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                {transaction.currency}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                {formatCurrency(transaction.amount, transaction.currency)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                {transaction.exchangeRate && 
                  new Intl.NumberFormat('de-DE', { 
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4 
                  }).format(transaction.exchangeRate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                {transaction.currency === 'EUR' 
                  ? formatCurrency(transaction.amount, 'EUR')
                  : transaction.exchangeRate 
                    ? formatCurrency(transaction.amount * transaction.exchangeRate, 'EUR')
                    : ''}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                {transaction.status || 'Gebucht'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}