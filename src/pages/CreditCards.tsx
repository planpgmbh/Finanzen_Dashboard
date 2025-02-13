import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { TextLightbox } from '../components/TextLightbox';
import { TopLevelDropdown } from '../components/TopLevelDropdown';
import { Button } from '../components/Button';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface CreditCardDocument {
  id: string;
  filename: string;
  storage_path: string;
  uploaded_at: string;
  month: number;
  year: number;
  extracted_text?: string | null;
  cardholder: string;
}

interface DocumentGroup {
  cardholder: string;
  documents: CreditCardDocument[];
}

export function CreditCards() {
  const [documents, setDocuments] = useState<CreditCardDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<CreditCardDocument | null>(null);
  const [extracting, setExtracting] = useState<string | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_card_documents')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const storagePath = `credit-card-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Extract text from PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items as { str: string; transform: number[] }[];
        
        items.forEach(item => {
          const [, , x, y] = item.transform;
          fullText += `@${Math.round(x)},${Math.round(y)}[${item.str.length}x9]:${item.str}\n`;
        });
      }

      // Extract cardholder and date information
      const cardholderMatch = fullText.match(/Karteninhaber:.*?([^\n]+)/);
      const monthMatch = fullText.match(/Abrechnung:.*?(\w+)\s+(\d{4})/);
      
      const cardholder = cardholderMatch ? cardholderMatch[1].trim() : 'Unbekannt';
      const monthStr = monthMatch ? monthMatch[1] : '';
      const year = monthMatch ? parseInt(monthMatch[2]) : new Date().getFullYear();
      
      const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                         'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
      const month = monthNames.indexOf(monthStr) + 1 || new Date().getMonth() + 1;

      // Create database record
      const { error: dbError } = await supabase
        .from('credit_card_documents')
        .insert({
          filename: file.name,
          storage_path: storagePath,
          month,
          year,
          cardholder,
          extracted_text: fullText
        });

      if (dbError) throw dbError;

      // Refresh document list
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Fehler beim Hochladen des Dokuments');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (document: CreditCardDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.storage_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Fehler beim Herunterladen des Dokuments');
    }
  };

  const handleDelete = async (document: CreditCardDocument) => {
    if (!confirm('Möchten Sie dieses Dokument wirklich löschen?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.storage_path]);

      if (storageError) throw storageError;

      // Delete database record
      const { error: dbError } = await supabase
        .from('credit_card_documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      // Refresh document list
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Fehler beim Löschen des Dokuments');
    }
  };

  const toggleTextView = (document: CreditCardDocument) => {
    if (selectedDocument?.id === document.id) {
      setSelectedDocument(null);
      setExtractionError(null);
    } else {
      setSelectedDocument(document);
    }
  };

  const toggleGroup = (cardholder: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(cardholder)) {
        next.delete(cardholder);
      } else {
        next.add(cardholder);
      }
      return next;
    });
  };

  // Group documents by cardholder
  const groupedDocuments = documents.reduce<DocumentGroup[]>((groups, doc) => {
    const existingGroup = groups.find(g => g.cardholder === doc.cardholder);
    if (existingGroup) {
      existingGroup.documents.push(doc);
    } else {
      groups.push({ cardholder: doc.cardholder, documents: [doc] });
    }
    return groups;
  }, []);

  // Sort groups by cardholder name
  groupedDocuments.sort((a, b) => a.cardholder.localeCompare(b.cardholder));

  // Sort documents within each group by date
  groupedDocuments.forEach(group => {
    group.documents.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Kreditkarten</h1>
          <p className="text-muted">
            Übersicht aller Kreditkartenabrechnungen
          </p>
        </div>
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button
              variant="upload"
              loading={uploading}
              icon={<Upload className="-ml-1 mr-2 h-5 w-5" />}
              disabled={uploading}
            >
              {uploading ? 'Lädt hoch...' : 'PDF hochladen'}
            </Button>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : groupedDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Keine Dokumente</h3>
          <p className="mt-1 text-muted">
            Laden Sie Ihre ersten Kreditkartenabrechnungen hoch
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedDocuments.map(group => (
            <TopLevelDropdown
              key={group.cardholder}
              title={group.cardholder}
              isExpanded={expandedGroups.has(group.cardholder)}
              onToggle={() => toggleGroup(group.cardholder)}
              value={`${group.documents.length} ${group.documents.length === 1 ? 'Abrechnung' : 'Abrechnungen'}`}
            >
              <div className="space-y-2">
                {group.documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                        {format(new Date(doc.year, doc.month - 1), 'MMMM yyyy', { locale: de })}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="icon"
                          onClick={() => toggleTextView(doc)}
                          title={selectedDocument?.id === doc.id ? "Text ausblenden" : "Text anzeigen"}
                          icon={selectedDocument?.id === doc.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        />
                        <Button
                          variant="icon"
                          onClick={() => handleDownload(doc)}
                          title="Herunterladen"
                          icon={<FileText className="h-4 w-4" />}
                        />
                        <Button
                          variant="icon"
                          onClick={() => handleDelete(doc)}
                          title="Löschen"
                          icon={<Trash2 className="h-4 w-4" />}
                        />
                        <div className="ml-4 text-muted">
                          Hochgeladen am {format(new Date(doc.uploaded_at), 'dd.MM.yyyy', { locale: de })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TopLevelDropdown>
          ))}
        </div>
      )}

      {selectedDocument && selectedDocument.extracted_text && (
        <TextLightbox
          text={selectedDocument.extracted_text}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}