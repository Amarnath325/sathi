'use client';

import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Trash2, 
  RotateCcw, 
  Search,
  Archive,
  Layers,
  FileText,
  Printer,
  X
} from 'lucide-react';
import { useCrudStore } from '@/lib/crudStore';

interface UniversalCrudToolbarProps {
  title: string;
  totalActiveCount: number;
  totalTrashCount: number;
  viewTrash: boolean;
  setViewTrash: (val: boolean) => void;
  onOpenCreateModal?: () => void;
  onNotify?: (msg: string) => void;
  headersForSample?: string[];
  exportRows?: object[];
  onImportData?: (parsedRows: any[]) => void;
  onSearchChange?: (query: string) => void;
  pageSize?: number | 'All';
  onPageSizeChange?: (size: number | 'All') => void;
}

export const UniversalCrudToolbar: React.FC<UniversalCrudToolbarProps> = ({
  title,
  totalActiveCount,
  totalTrashCount,
  viewTrash,
  setViewTrash,
  onOpenCreateModal,
  onNotify,
  headersForSample = ['name', 'email', 'phone', 'city', 'country', 'role', 'hourlyRate', 'category'],
  exportRows = [],
  onImportData,
  onSearchChange,
  pageSize,
  onPageSizeChange
}) => {

  const { 
    selectedIds, 
    clearSelection, 
    bulkSoftDeleteCompanions, 
    bulkRestoreCompanions, 
    bulkToggleActiveCompanions,
    exportToCSV,
    downloadSampleCSV
  } = useCrudStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  // Support CSV & XLSX Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) return;

      const keys = lines[0].split(/,|\t/).map((k) => k.replace(/"/g, '').trim());
      const parsedRows = lines.slice(1).map((line) => {
        const vals = line.split(/,|\t/).map((v) => v.replace(/"/g, '').trim());
        const rowObj: any = {};
        keys.forEach((key, i) => {
          rowObj[key] = vals[i] || '';
        });
        return rowObj;
      });

      if (onImportData) {
        onImportData(parsedRows);
        if (onNotify) onNotify(`Successfully imported ${parsedRows.length} records from ${file.name.endsWith('.xlsx') ? 'XLSX' : 'CSV'}!`);
      }
    };
    reader.readAsText(file);
  };

  // Download Sample XLSX
  const downloadSampleXLSX = () => {
    const headerLine = headersForSample.join('\t');
    const sampleRow = headersForSample.map(h => h === 'hourlyRate' ? '75' : h === 'email' ? 'sample@example.com' : 'SampleData').join('\t');
    const content = `${headerLine}\n${sampleRow}`;

    const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase()}_sample_template.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    if (onNotify) onNotify('Downloaded Sample XLSX Template!');
  };

  // Export XLSX
  const exportToXLSX = () => {
    if (exportRows.length === 0) return;
    const keys = Object.keys(exportRows[0]);
    let xmlTable = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="${title}"><Table><Row>`;
    keys.forEach(k => { xmlTable += `<Cell><Data ss:Type="String">${k}</Data></Cell>`; });
    xmlTable += `</Row>`;
    exportRows.forEach(r => {
      xmlTable += `<Row>`;
      keys.forEach(k => { xmlTable += `<Cell><Data ss:Type="String">${String((r as any)[k] || '')}</Data></Cell>`; });
      xmlTable += `</Row>`;
    });
    xmlTable += `</Table></Worksheet></Workbook>`;

    const blob = new Blob([xmlTable], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase()}_export.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    if (onNotify) onNotify(`Exported ${exportRows.length} records to XLSX!`);
  };

  return (
    <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
      
      {/* Top Header & View Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {title} Management Panel
            </h3>
            <p className="text-[11px] text-slate-400">
              {viewTrash ? `Trash Bin (${totalTrashCount} soft deleted)` : `Active Directory (${totalActiveCount} records)`}
            </p>
          </div>
        </div>

        {/* View Toggle: Active Directory vs Trash Bin */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setViewTrash(false); clearSelection(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${!viewTrash ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            Active Directory ({totalActiveCount})
          </button>
          <button 
            onClick={() => { setViewTrash(true); clearSelection(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${viewTrash ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            <Archive className="w-3.5 h-3.5" /> Trash Bin ({totalTrashCount})
          </button>
        </div>
      </div>

      {/* 🔍 SEARCH BAR & PAGE SIZE SELECTOR */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Search Input Bar + Page Size Dropdown Right Next to It */}
        <div className="flex items-center gap-2 w-full lg:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={handleSearchInput}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-all"
            />
          </div>

          {/* Page Size Dropdown directly on the RIGHT SIDE of Search! */}
          {pageSize !== undefined && onPageSizeChange && (
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 shrink-0 text-xs">
              <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  const val = e.target.value;
                  onPageSizeChange(val === 'All' ? 'All' : Number(val));
                }}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
              >
                <option value={10} className="bg-slate-900 text-white">10</option>
                <option value={25} className="bg-slate-900 text-white">25</option>
                <option value={50} className="bg-slate-900 text-white">50</option>
                <option value={100} className="bg-slate-900 text-white">100</option>
                <option value="All" className="bg-slate-900 text-white">All</option>
              </select>
            </div>
          )}
        </div>


        {/* Buttons: Create, Import (CSV/XLSX), Export (CSV/XLSX/PDF), Samples */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          {onOpenCreateModal && !viewTrash && (
            <button 
              onClick={onOpenCreateModal}
              className="px-3.5 py-2 rounded-xl gradient-bg-primary text-white font-bold flex items-center gap-1.5 hover:opacity-95 shadow-md shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Create New
            </button>
          )}

          {/* Import Data */}
          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".csv, .xlsx" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white flex items-center gap-1.5 shrink-0"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" /> Import Data
          </button>

          {/* Export Sheet */}
          <button 
            onClick={() => {
              exportToCSV(`${title.toLowerCase()}_export`, exportRows);
              if (onNotify) onNotify(`Exported ${exportRows.length} records!`);
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold hover:text-white flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export Sheet
          </button>

          {/* Export Excel */}
          <button 
            onClick={exportToXLSX}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-300 font-bold hover:text-white flex items-center gap-1.5 shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" /> Export Excel
          </button>

          {/* Export PDF (Opens PDF Printable Preview Modal) */}
          <button 
            onClick={() => setShowPdfModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-300 font-bold hover:text-white flex items-center gap-1.5 shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" /> Export PDF
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Sample Template */}
          <button 
            onClick={() => {
              downloadSampleCSV(`${title.toLowerCase()}_template`, headersForSample);
              if (onNotify) onNotify('Sample Template downloaded!');
            }}
            className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[11px] hover:text-white shrink-0"
            title="Download Sample Template"
          >
            Sample Template
          </button>

          {/* Sample Excel */}
          <button 
            onClick={downloadSampleXLSX}
            className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[11px] hover:text-white shrink-0"
            title="Download Sample Excel Template"
          >
            Sample Excel
          </button>
        </div>

      </div>

      {/* Bulk Actions Bar when items are selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 bg-slate-950 p-2 px-3 rounded-2xl border border-slate-800 animate-fade-in text-xs">
          <span className="font-bold text-indigo-400">{selectedIds.length} Selected</span>
          
          {!viewTrash ? (
            <>
              <button 
                onClick={() => { bulkToggleActiveCompanions(true); if (onNotify) onNotify(`Bulk activated ${selectedIds.length} items`); }}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/30"
              >
                Bulk Activate
              </button>
              <button 
                onClick={() => { bulkToggleActiveCompanions(false); if (onNotify) onNotify(`Bulk deactivated ${selectedIds.length} items`); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 font-bold hover:bg-slate-700"
              >
                Bulk Deactivate
              </button>
              <button 
                onClick={() => { bulkSoftDeleteCompanions(); if (onNotify) onNotify(`Moved ${selectedIds.length} items to Trash Bin`); }}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 font-bold hover:bg-rose-500/30 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Soft Delete to Trash
              </button>
            </>
          ) : (
            <button 
              onClick={() => { bulkRestoreCompanions(); if (onNotify) onNotify(`Restored ${selectedIds.length} items from Trash`); }}
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Restore Selected
            </button>
          )}

          <button 
            onClick={clearSelection}
            className="text-slate-500 hover:text-white ml-1 font-bold"
          >
            Clear
          </button>
        </div>
      )}

      {/* 🔴 PDF PRINTABLE PREVIEW MODAL (Fixes auto-downloading issue!) */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-3xl shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-400" /> {title} - PDF Document Preview
              </h3>
              <button onClick={() => setShowPdfModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Preview Area */}
            <div id="pdf-print-area" className="p-6 bg-white text-slate-900 rounded-2xl space-y-4 shadow-inner font-sans">
              <div className="flex justify-between items-center border-b pb-3 border-slate-200">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{title} Directory Report</h2>
                  <p className="text-xs text-slate-500">Sathi ERP Enterprise Companion Connect Platform</p>
                </div>
                <div className="text-right text-xs text-slate-500 font-mono">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Total Records: {exportRows.length}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 font-bold text-slate-700">
                      {exportRows.length > 0 && Object.keys(exportRows[0]).slice(0, 6).map((k) => (
                        <th key={k} className="p-2 uppercase font-mono text-[10px]">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {exportRows.map((row: any, idx) => (
                      <tr key={idx}>
                        {Object.keys(row).slice(0, 6).map((k) => (
                          <td key={k} className="p-2 truncate max-w-[120px]">{String(row[k] || 'N/A')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between">
                <span>Confidential - For Internal Admin Use Only</span>
                <span>Page 1 of 1</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">PDF Preview Ready ({exportRows.length} rows)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25"
                >
                  <Printer className="w-4 h-4" /> Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:text-white"
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
