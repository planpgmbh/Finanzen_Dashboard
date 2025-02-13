import React, { useState } from 'react';
import { X, Table, FileText } from 'lucide-react';
import { CreditCardTransactionsTable } from './CreditCardTransactionsTable';

interface TextLightboxProps {
  text: string;
  onClose: () => void;
}

export function TextLightbox({ text, onClose }: TextLightboxProps) {
  const [showRawText, setShowRawText] = useState(false);
  const characterCount = text.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col relative">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {showRawText ? 'Extrahierter Text' : 'Kreditkartentransaktionen'}
            </h3>
            <button
              onClick={() => setShowRawText(!showRawText)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {showRawText ? (
                <>
                  <Table className="h-4 w-4 mr-2" />
                  Tabelle anzeigen
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Text anzeigen
                </>
              )}
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {showRawText ? (
            <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-mono">
              {text}
            </pre>
          ) : (
            <CreditCardTransactionsTable text={text} />
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Anzahl Zeichen: {characterCount.toLocaleString('de-DE')}
          </p>
        </div>
      </div>
    </div>
  );
}