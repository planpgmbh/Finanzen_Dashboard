import React, { useState } from 'react';
import { 
  Euro, CreditCard, TrendingUp, Search, FileText, ChevronRight, Edit2, Copy, 
  Trash2, Plus, LayoutDashboard, Settings, Users, Receipt, LogOut, Menu, 
  Palette, Moon, Sun, Shield, CircleDollarSign, Info, Loader2, Eye, EyeOff,
  Upload, Table, X, Lock
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { TopLevelDropdown } from '../components/TopLevelDropdown';

export function DesignSystem() {
  const [expandedA, setExpandedA] = useState(true);
  const [expandedB, setExpandedB] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Design System</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Übersicht aller Design-Komponenten und Stile
        </p>
      </div>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Typografie</h2>
        
        <div className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Überschrift 1</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">text-3xl font-bold</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Überschrift 2</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">text-xl font-semibold</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Überschrift 3</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">text-lg font-medium</p>
          </div>
          
          <div>
            <p className="text-base text-gray-900 dark:text-gray-100">Standardtext</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">text-base</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hilfstext</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">text-sm text-gray-500</p>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Farben</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div>
            <div className="h-20 bg-[#0000ff] rounded-lg mb-2"></div>
            <p className="text-sm font-medium dark:text-gray-100">Primary Blue</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">#0000ff</p>
          </div>
          
          <div>
            <div className="h-20 bg-gray-900 dark:bg-gray-100 rounded-lg mb-2"></div>
            <p className="text-sm font-medium dark:text-gray-100">Text Dark/Light</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">text-gray-900 dark:text-gray-100</p>
          </div>
          
          <div>
            <div className="h-20 bg-gray-500 rounded-lg mb-2"></div>
            <p className="text-sm font-medium dark:text-gray-100">Text Medium</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">text-gray-500</p>
          </div>
          
          <div>
            <div className="h-20 bg-gray-50 dark:bg-gray-900 rounded-lg mb-2 border border-gray-200 dark:border-gray-700"></div>
            <p className="text-sm font-medium dark:text-gray-100">Background</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">bg-gray-50 dark:bg-gray-900</p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Karten</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <DashboardCard
            title="Gesamtumsatz (netto)"
            value="€50.000,00"
            icon={Euro}
            comparisonValue="€45.000,00 (2023)"
            percentageChange={11.11}
          />
          
          <DashboardCard
            title="Gesamtausgaben (netto)"
            value="€30.000,00"
            icon={CreditCard}
            comparisonValue="€28.000,00 (2023)"
            percentageChange={7.14}
            inversePercentageColors
          />
          
          <DashboardCard
            title="Voraussichtlicher Gewinn (netto)"
            value="€20.000,00"
            icon={TrendingUp}
            comparisonValue="€17.000,00 (2023)"
            percentageChange={17.65}
          />
        </div>
      </section>

      {/* Toplevel Dropdowns */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Toplevel Dropdowns</h2>

        {/* Example A - Expanded */}
        <div className="mb-4">
          <TopLevelDropdown
            title="Beispiel A"
            isExpanded={expandedA}
            onToggle={() => setExpandedA(!expandedA)}
            onEdit={() => console.log('Edit A')}
            onDuplicate={() => console.log('Duplicate A')}
            onDelete={() => console.log('Delete A')}
            onAdd={() => console.log('Add to A')}
            value="€120.000,00"
          >
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Beispielposition
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    title="Bearbeiten"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    title="Duplizieren"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    title="Löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <span className="ml-4 font-medium text-gray-900 dark:text-white">
                    €5.000,00
                  </span>
                </div>
              </div>
            </div>
          </TopLevelDropdown>
        </div>

        {/* Example B - Collapsed */}
        <TopLevelDropdown
          title="Beispiel B"
          isExpanded={expandedB}
          onToggle={() => setExpandedB(!expandedB)}
          onEdit={() => console.log('Edit B')}
          onDuplicate={() => console.log('Duplicate B')}
          onDelete={() => console.log('Delete B')}
          onAdd={() => console.log('Add to B')}
          value="€110.000,00"
        />
      </section>

      {/* Personnel Cost Components */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Personalkosten-Komponenten</h2>

        {/* Monthly Data Table Example */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Monatliche Daten Tabelle</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-[10px]">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase"></th>
                  {['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ', '13.', '14.'].map((month) => (
                    <th key={month} className="px-2 py-2 text-right font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  'Grundgehalt',
                  'Krankenversicherung',
                  'Rentenversicherung',
                  'Arbeitslosenversicherung',
                  'Pflegeversicherung',
                  'Insolvenzgeldumlage',
                  'Umlage U1',
                  'Umlage U2'
                ].map((row) => (
                  <tr key={row} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-2 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100">{row}</td>
                    {Array.from({ length: 14 }, (_, i) => (
                      <td key={i} className="px-2 py-3 text-right whitespace-nowrap text-gray-900 dark:text-gray-100">
                        €{(Math.random() * 1000).toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Icons</h2>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: LayoutDashboard, name: 'Dashboard' },
              { icon: FileText, name: 'Dokumente' },
              { icon: CreditCard, name: 'Kreditkarte' },
              { icon: CircleDollarSign, name: 'Kosten' },
              { icon: Users, name: 'Benutzer' },
              { icon: Settings, name: 'Einstellungen' },
              { icon: Shield, name: 'Sicherheit' },
              { icon: Edit2, name: 'Bearbeiten' },
              { icon: Copy, name: 'Kopieren' },
              { icon: Trash2, name: 'Löschen' },
              { icon: Plus, name: 'Hinzufügen' },
              { icon: Search, name: 'Suchen' },
              { icon: Menu, name: 'Menü' },
              { icon: ChevronRight, name: 'Pfeil' },
              { icon: Info, name: 'Info' },
              { icon: Loader2, name: 'Laden' },
              { icon: Eye, name: 'Anzeigen' },
              { icon: EyeOff, name: 'Ausblenden' },
              { icon: Upload, name: 'Hochladen' },
              { icon: Table, name: 'Tabelle' },
              { icon: X, name: 'Schließen' },
              { icon: Lock, name: 'Sperren' },
              { icon: Moon, name: 'Dunkel' },
              { icon: Sun, name: 'Hell' },
              { icon: LogOut, name: 'Abmelden' },
              { icon: Palette, name: 'Design' }
            ].map(({ icon: Icon, name }) => (
              <div key={name} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <Icon className="h-6 w-6 text-[#0000ff]" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}