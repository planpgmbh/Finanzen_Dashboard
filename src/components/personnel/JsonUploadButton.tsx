import React, { useRef, useState } from 'react';
import { Upload, Info } from 'lucide-react';
import { Button } from '../Button';
import { supabase } from '../../lib/supabase';

interface JsonUploadButtonProps {
  onUploadComplete: () => void;
}

interface EmployeeData {
  name: string;
  monthlyData: Array<{
    month: number;
    year: number;
    grundgehalt: number;
    krankenversicherung: number;
    rentenversicherung: number;
    arbeitslosenversicherung: number;
    pflegeversicherung: number;
    insolvenzgeldumlage: number;
    umlageU1: number;
    umlageU2: number;
  }>;
}

export function JsonUploadButton({ onUploadComplete }: JsonUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      const text = await file.text();
      const data = JSON.parse(text) as EmployeeData[];

      for (const employee of data) {
        // First, ensure the employee exists
        let employeeId: string;
        const { data: existingEmployee, error: findError } = await supabase
          .from('global_employees')
          .select('id')
          .eq('name', employee.name)
          .maybeSingle();

        if (findError) throw findError;

        if (!existingEmployee) {
          // Employee doesn't exist, create them
          const { data: newEmployee, error: createError } = await supabase
            .from('global_employees')
            .insert([{ name: employee.name }])
            .select()
            .single();

          if (createError) throw createError;
          employeeId = newEmployee.id;
        } else {
          employeeId = existingEmployee.id;
        }

        // For each month's data
        for (const monthData of employee.monthlyData) {
          // Ensure the year exists
          let yearId: string;
          const { data: existingYear, error: findYearError } = await supabase
            .from('personnel_years')
            .select('id')
            .eq('year', monthData.year)
            .maybeSingle();

          if (findYearError) throw findYearError;

          if (!existingYear) {
            // Year doesn't exist, create it
            const { data: newYear, error: createYearError } = await supabase
              .from('personnel_years')
              .insert([{ year: monthData.year }])
              .select()
              .single();

            if (createYearError) throw createYearError;
            yearId = newYear.id;
          } else {
            yearId = existingYear.id;
          }

          // Update or insert monthly data
          const { error: monthlyError } = await supabase
            .from('personnel_monthly_data')
            .upsert({
              global_employee_id: employeeId,
              year_id: yearId,
              month: monthData.month,
              year: monthData.year,
              grundgehalt: monthData.grundgehalt,
              krankenversicherung: monthData.krankenversicherung,
              rentenversicherung: monthData.rentenversicherung,
              arbeitslosenversicherung: monthData.arbeitslosenversicherung,
              pflegeversicherung: monthData.pflegeversicherung,
              insolvenzgeldumlage: monthData.insolvenzgeldumlage,
              umlage_u1: monthData.umlageU1,
              umlage_u2: monthData.umlageU2
            }, {
              onConflict: 'global_employee_id,year_id,month'
            });

          if (monthlyError) throw monthlyError;
        }
      }

      onUploadComplete();
      alert('Daten erfolgreich aktualisiert');
    } catch (error) {
      console.error('Error uploading data:', error);
      setError(error instanceof Error ? error.message : 'Fehler beim Hochladen der Daten');
      alert('Fehler beim Hochladen der Daten. Bitte überprüfen Sie das Format der JSON-Datei.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const tooltipContent = `
Um eine Excel-Tabelle in das richtige JSON-Format zu konvertieren, können Sie ChatGPT verwenden.

Prompt für ChatGPT:
"Konvertiere diese Excel-Tabelle in ein JSON-Array. Jeder Mitarbeiter soll ein Objekt mit 'name' und 'monthlyData' sein. 'monthlyData' soll ein Array von Objekten sein, die die monatlichen Daten enthalten (month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlageU1, umlageU2). Wenn in einer Zelle kein Wert eingetragen ist, schreibe nicht „NaN“ oder ähnlich sondern einfach „0.0“ Die Monate kannst du aus den tabellen blättern entnehmen."

Beispiel JSON-Format:
[
  {
    "name": "Mustermann Max",
    "monthlyData": [
      {
        "month": 1,
        "year": 2024,
        "grundgehalt": 3000.00,
        "krankenversicherung": 240.00,
        "rentenversicherung": 279.00,
        "arbeitslosenversicherung": 39.00,
        "pflegeversicherung": 51.00,
        "insolvenzgeldumlage": 1.80,
        "umlageU1": 48.00,
        "umlageU2": 13.20
      }
    ]
  }
]`;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Button
          variant="upload"
          icon={<Upload className="h-4 w-4" />}
          onClick={handleButtonClick}
          loading={uploading}
        >
          JSON hochladen
        </Button>
        <button
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {showTooltip && (
        <div className="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-[500px] right-0">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Anleitung zum Hochladen</h4>
          <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {tooltipContent}
          </pre>
        </div>
      )}
    </div>
  );
}