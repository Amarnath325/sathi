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
    bulkUpdateServiceStatus
  } = useServiceHubStore();

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  const publishedServicesCount = services.filter(s => s.status === 'PUBLISHED').length;
  const draftServicesCount = services.filter(s => s.status === 'DRAFT').length;

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

  return (
    <div className="space-y-6">
      {/* Centralized Hub Dashboard Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-extrabold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Companion Connect ERP
              </span>
              <span className="text-xs font-mono text-slate-500">v2.4 Enterprise Edition</span>
            </div>
            <h2 className="font-extrabold text-white text-2xl sm:text-3xl tracking-tight mt-2">
              Service & Category Management Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Centralized 10-module configuration engine orchestrating categories, service offerings, multi-type pricing, dynamic rules, versioned policies, risk scores, verification, safety controls, booking rules, and companion service eligibility.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Categories</span>
              <span className="font-extrabold text-white text-xl">{categories.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Services</span>
              <span className="font-extrabold text-indigo-400 text-xl">{services.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Published</span>
              <span className="font-extrabold text-emerald-400 text-xl">{publishedServicesCount}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Drafts</span>
              <span className="font-extrabold text-amber-400 text-xl">{draftServicesCount}</span>
            </div>
          </div>
        </div>
      </div>

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
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export All
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
