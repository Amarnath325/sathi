'use client';

import React, { useRef } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Search,
  Archive,
  Layers
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
}

export const UniversalCrudToolbar: React.FC<UniversalCrudToolbarProps> = ({
  title,
  totalActiveCount,
  totalTrashCount,
  viewTrash,
  setViewTrash,
  onOpenCreateModal,
  onNotify,
  headersForSample = ['name', 'email', 'city', 'country', 'age', 'hourlyRate', 'category'],
  exportRows = [],
  onImportData
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) return;

      const keys = lines[0].split(',').map((k) => k.replace(/"/g, '').trim());
      const parsedRows = lines.slice(1).map((line) => {
        const vals = line.split(',').map((v) => v.replace(/"/g, '').trim());
        const rowObj: any = {};
        keys.forEach((key, i) => {
          rowObj[key] = vals[i] || '';
        });
        return rowObj;
      });

      if (onImportData) {
        onImportData(parsedRows);
        if (onNotify) onNotify(`Successfully imported ${parsedRows.length} records from CSV!`);
      }
    };
    reader.readAsText(file);
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

      {/* Action Toolbar Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Left Side: Create, Import, Export, Sample */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenCreateModal && !viewTrash && (
            <button 
              onClick={onOpenCreateModal}
              className="px-3 py-1.5 rounded-xl gradient-bg-primary text-white font-bold flex items-center gap-1.5 hover:opacity-95 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> Create New
            </button>
          )}

          {/* Import CSV */}
          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".csv" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" /> Import CSV
          </button>

          {/* Export Selected / All */}
          <button 
            onClick={() => {
              exportToCSV(`${title.toLowerCase()}_export`, exportRows);
              if (onNotify) onNotify(`Exported ${exportRows.length} records to CSV!`);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export CSV
          </button>

          {/* Download Sample CSV Template */}
          <button 
            onClick={() => {
              downloadSampleCSV(`${title.toLowerCase()}_template`, headersForSample);
              if (onNotify) onNotify('Sample CSV Template downloaded!');
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-semibold hover:text-white flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" /> Sample CSV Template
          </button>
        </div>

        {/* Right Side: Bulk Actions Bar when items are selected */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 px-3 rounded-2xl border border-slate-800 animate-fade-in">
            <span className="text-[11px] font-bold text-indigo-400">{selectedIds.length} Selected</span>
            
            {!viewTrash ? (
              <>
                <button 
                  onClick={() => { bulkToggleActiveCompanions(true); if (onNotify) onNotify(`Bulk activated ${selectedIds.length} items`); }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[11px] font-bold hover:bg-emerald-500/30"
                >
                  Bulk Activate
                </button>
                <button 
                  onClick={() => { bulkToggleActiveCompanions(false); if (onNotify) onNotify(`Bulk deactivated ${selectedIds.length} items`); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700"
                >
                  Bulk Deactivate
                </button>
                <button 
                  onClick={() => { bulkSoftDeleteCompanions(); if (onNotify) onNotify(`Moved ${selectedIds.length} items to Trash Bin`); }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-[11px] font-bold hover:bg-rose-500/30 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Soft Delete to Trash
                </button>
              </>
            ) : (
              <button 
                onClick={() => { bulkRestoreCompanions(); if (onNotify) onNotify(`Restored ${selectedIds.length} items from Trash`); }}
                className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-500 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Restore Selected
              </button>
            )}

            <button 
              onClick={clearSelection}
              className="text-slate-500 hover:text-white text-[11px] ml-1 font-bold"
            >
              Clear
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
