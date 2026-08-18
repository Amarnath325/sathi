'use client';

import React, { useState } from 'react';
import { useServiceHubStore, HubTabId } from '@/lib/serviceHubStore';
import { CategoriesTab } from './tabs/CategoriesTab';
import { ServicesTab } from './tabs/ServicesTab';
import { PricingTab } from './tabs/PricingTab';
import { RulesTab } from './tabs/RulesTab';
import { PoliciesTab } from './tabs/PoliciesTab';
import { RiskLevelsTab } from './tabs/RiskLevelsTab';
import { VerificationTab } from './tabs/VerificationTab';
import { SafetyTab } from './tabs/SafetyTab';
import { BookingCancellationTab } from './tabs/BookingCancellationTab';
import { EligibilityTab } from './tabs/EligibilityTab';

import {
  Layers, Sparkles, DollarSign, Sliders, Shield, ShieldAlert, UserCheck, ShieldCheck, Clock, CheckCircle2,
  Search, Filter, Download, Play, AlertTriangle, RefreshCw, BarChart3, ChevronRight, Check, Upload, Database, Plus
} from 'lucide-react';

export function ServiceCategoryHub() {
  const {
    activeTab,
    setActiveTab,
    categories,
    services,
    pricingProfiles,
    policies,
    riskLevels,
    auditLogs,
    addCategory,
    addService,
    setCategoryFormOpen,
    setServiceWizardOpen
  } = useServiceHubStore();

  const tabs: { id: HubTabId; label: string; count?: number; icon: any }[] = [
    { id: 'categories', label: 'Categories', count: categories.length, icon: Layers },
    { id: 'services', label: 'Services', count: services.length, icon: Sparkles },
    { id: 'pricing', label: 'Pricing', count: pricingProfiles.length, icon: DollarSign },
    { id: 'rules', label: 'Rules', icon: Sliders },
    { id: 'policies', label: 'Policies', count: policies.length, icon: Shield },
    { id: 'risk', label: 'Risk Levels', count: riskLevels.length, icon: ShieldAlert },
    { id: 'verification', label: 'Verification Requirements', icon: UserCheck },
    { id: 'safety', label: 'Safety & Trust', icon: ShieldCheck },
    { id: 'booking', label: 'Booking & Cancellation', icon: Clock },
    { id: 'eligibility', label: 'Service Eligibility', icon: CheckCircle2 }
  ];

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      categories,
      services,
      pricingProfiles,
      policies,
      riskLevels
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `service_hub_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        let count = 0;
        if (data.categories && Array.isArray(data.categories)) {
          data.categories.forEach((cat: any) => { addCategory(cat); count++; });
        }
        if (data.services && Array.isArray(data.services)) {
          data.services.forEach((srv: any) => { addService(srv); count++; });
        }
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            if (item.name && item.slug) { addCategory(item); count++; }
          });
        }
        alert(`Successfully imported configuration schema (${count} items)!`);
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">


      {/* Top Schema Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
            Service & Category Management Engine
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 border border-slate-200/90 cursor-pointer shadow-xs transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-600" /> Import Schema
            <input type="file" accept=".json" className="hidden" onChange={handleImportData} />
          </label>
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 border border-slate-200/90 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" /> Export All
          </button>
          {activeTab === 'categories' && (
            <button
              onClick={() => setCategoryFormOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-200 flex items-center gap-1.5 transition-all ml-1"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          )}
          {activeTab === 'services' && (
            <button
              onClick={() => setServiceWizardOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-200 flex items-center gap-1.5 transition-all ml-1"
            >
              <Plus className="w-4 h-4" /> Create New Service
            </button>
          )}
        </div>
      </div>

      {/* Primary 10 Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shrink-0 border ${
                isActive
                  ? 'bg-purple-50/90 border-purple-400 text-purple-700 font-bold shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200/90 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className={`text-[11px] font-mono ${
                  isActive ? 'text-purple-700 font-bold' : 'text-slate-500'
                }`}>
                  ({t.count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Module Workspace Rendering */}
      <div className="animate-fade-in">
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'pricing' && <PricingTab />}
        {activeTab === 'rules' && <RulesTab />}
        {activeTab === 'policies' && <PoliciesTab />}
        {activeTab === 'risk' && <RiskLevelsTab />}
        {activeTab === 'verification' && <VerificationTab />}
        {activeTab === 'safety' && <SafetyTab />}
        {activeTab === 'booking' && <BookingCancellationTab />}
        {activeTab === 'eligibility' && <EligibilityTab />}
      </div>
    </div>
  );
}
