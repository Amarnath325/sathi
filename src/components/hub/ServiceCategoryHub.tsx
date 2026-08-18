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
  Search, Filter, Download, Play, AlertTriangle, RefreshCw, BarChart3, ChevronRight, Check, Upload, Database
} from 'lucide-react';

export function ServiceCategoryHub() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    categories,
    services,
    pricingProfiles,
    policies,
    riskLevels,
    auditLogs,
    addCategory,
    addService
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


      {/* Global Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across categories, services, pricing, rules..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer font-semibold text-xs"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              ✕ Clear
            </button>
          )}
          <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-indigo-400" /> Import Schema
            <input type="file" accept=".json" className="hidden" onChange={handleImportData} />
          </label>
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export All
          </button>
        </div>
      </div>

      {/* Primary 10 Interconnected Top-Level Navigation Module Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {t.count}
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
