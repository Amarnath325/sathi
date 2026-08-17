'use client';

import React, { useState, useEffect } from 'react';
import { ServiceCategory, SubCategoryItem, RiskLevel } from '@/lib/types';
import {
  X, Trash2, Pencil, ShieldCheck, Layers, Sparkles, Users, Compass, Heart, BookOpen, Activity, Gamepad
} from 'lucide-react';

interface CategoryFormModalProps {
  isOpen: boolean;
  category?: ServiceCategory | null;
  onClose: () => void;
  onSave: (catData: Omit<ServiceCategory, 'id' | 'companionCount' | 'createdAt'> & { id?: string }) => void;
}

const ICONS = ['Users', 'Compass', 'Heart', 'BookOpen', 'Activity', 'Gamepad'];
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Compass,
  Heart,
  BookOpen,
  Activity,
  Gamepad,
};

const RISKS: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export function CategoryFormModal({ isOpen, category, onClose, onSave }: CategoryFormModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Users');
  const [bannerUrl, setBannerUrl] = useState('');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('LOW');
  const [baseRateMultiplier, setBaseRateMultiplier] = useState(1.0);
  const [minAgeLimit, setMinAgeLimit] = useState(18);
  const [isFeatured, setIsFeatured] = useState(false);
  const [safetyPolicy, setSafetyPolicy] = useState('');
  const [subcategories, setSubcategories] = useState<SubCategoryItem[]>([]);

  // Subcategory input state
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [subName, setSubName] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subPrice, setSubPrice] = useState(50);
  const [subReqVerification, setSubReqVerification] = useState(true);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug || '');
      setDescription(category.description);
      setIconName(category.iconName || 'Users');
      setBannerUrl(category.bannerUrl || '');
      setRiskLevel(category.riskLevel || 'LOW');
      setBaseRateMultiplier(category.baseRateMultiplier || 1.0);
      setMinAgeLimit(category.minAgeLimit || 18);
      setIsFeatured(category.isFeatured || false);
      setSafetyPolicy(category.safetyPolicy || '');
      setSubcategories(category.subcategories || []);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setIconName('Users');
      setBannerUrl('https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80');
      setRiskLevel('LOW');
      setBaseRateMultiplier(1.0);
      setMinAgeLimit(18);
      setIsFeatured(false);
      setSafetyPolicy('Public venues only. Mandatory emergency check-in every 2 hours.');
      setSubcategories([]);
    }
    setEditingSubId(null);
    setSubName('');
    setSubDesc('');
    setSubPrice(50);
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSaveSubcategory = () => {
    if (!subName.trim()) return;

    if (editingSubId) {
      setSubcategories(subcategories.map(sub => 
        sub.id === editingSubId
          ? {
              ...sub,
              name: subName.trim(),
              description: subDesc.trim() || 'Custom service offering.',
              basePrice: Number(subPrice) || 50,
              requiredVerification: subReqVerification,
            }
          : sub
      ));
      setEditingSubId(null);
    } else {
      const newSub: SubCategoryItem = {
        id: 'sub-' + Date.now(),
        name: subName.trim(),
        description: subDesc.trim() || 'Custom service offering.',
        basePrice: Number(subPrice) || 50,
        requiredVerification: subReqVerification,
      };
      setSubcategories([...subcategories, newSub]);
    }

    setSubName('');
    setSubDesc('');
    setSubPrice(50);
    setSubReqVerification(true);
  };

  const handleEditSubcategory = (sub: SubCategoryItem) => {
    setEditingSubId(sub.id);
    setSubName(sub.name);
    setSubDesc(sub.description);
    setSubPrice(sub.basePrice);
    setSubReqVerification(sub.requiredVerification);
  };

  const handleRemoveSubcategory = (subId: string) => {
    setSubcategories(subcategories.filter(s => s.id !== subId));
    if (editingSubId === subId) {
      setEditingSubId(null);
      setSubName('');
      setSubDesc('');
      setSubPrice(50);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    onSave({
      ...(category?.id ? { id: category.id } : {}),
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
      description: description.trim(),
      iconName,
      bannerUrl: bannerUrl.trim() || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      riskLevel,
      baseRateMultiplier: Number(baseRateMultiplier) || 1.0,
      minAgeLimit: Number(minAgeLimit) || 18,
      isFeatured,
      isActive: category ? category.isActive : true,
      subcategories,
      safetyPolicy: safetyPolicy.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-all animate-fade-in my-auto">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {category ? 'Edit Service Category' : 'Create New Service Category'}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Configure catalog details, risk policies & sub-services</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form - 2 Column Compact Grid */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT COLUMN: Core Info & Pricing Governance (7 Cols) */}
            <div className="lg:col-span-7 space-y-3.5">
              {/* Core Information */}
              <div className="space-y-2.5">
                <h3 className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  1. Core Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px]">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                      }}
                      placeholder="e.g. Event Companion"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px]">URL Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. event-companion"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 font-mono transition-colors text-xs"
                    />
                  </div>
                </div>

                {/* Category Icon Selector with Lucide visual icons */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px]">Category Icon *</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ICONS.map((ic) => {
                      const IconComponent = ICON_MAP[ic] || Users;
                      const isSelected = iconName === ic;
                      return (
                        <button
                          key={ic}
                          type="button"
                          onClick={() => setIconName(ic)}
                          className={`px-2.5 py-1 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                            isSelected 
                              ? 'gradient-bg-primary text-white border-transparent shadow-sm scale-105' 
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5 text-current" />
                          <span>{ic}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px]">Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed description of what this service entails..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px]">Banner Image URL</label>
                  <input
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-colors text-xs"
                  />
                </div>
              </div>

              {/* Pricing & Governance */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  2. Pricing Rules & Governance
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[10px]">Risk Level</label>
                    <select
                      value={riskLevel}
                      onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-medium text-xs"
                    >
                      {RISKS.map((r) => (
                        <option key={r} value={r} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[10px]">Multiplier</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.5"
                      max="3.0"
                      value={baseRateMultiplier}
                      onChange={(e) => setBaseRateMultiplier(parseFloat(e.target.value) || 1.0)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[10px]">Min Age</label>
                    <input
                      type="number"
                      min="18"
                      max="65"
                      value={minAgeLimit}
                      onChange={(e) => setMinAgeLimit(parseInt(e.target.value) || 18)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-medium text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer select-none text-[11px]">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    Featured Category (Displays on homepage carousel)
                  </label>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px]">Safety Policy</label>
                  <input
                    type="text"
                    value={safetyPolicy}
                    onChange={(e) => setSafetyPolicy(e.target.value)}
                    placeholder="e.g. Public venues only..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-colors text-xs"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sub-Services Builder (5 Cols) */}
            <div className="lg:col-span-5 space-y-3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-3.5 lg:pt-0 lg:pl-5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    3. Sub-Services ({subcategories.length})
                  </h3>
                </div>

                {/* Subcategories List Container */}
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                  {subcategories.length > 0 ? (
                    subcategories.map((sub) => (
                      <div 
                        key={sub.id} 
                        className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                          editingSubId === sub.id
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-400 dark:border-indigo-500/50'
                            : 'bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800/80'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">{sub.name}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px]">${sub.basePrice}/hr</span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{sub.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditSubcategory(sub)}
                            className="p-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubcategory(sub.id)}
                            className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 hover:bg-rose-200"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-[10px] p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 text-center border border-dashed border-slate-200 dark:border-slate-800">
                      No sub-services added yet.
                    </p>
                  )}
                </div>

                {/* Subcategory Sub-Form */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      {editingSubId ? '✏️ Edit Sub-Service' : '+ Add Sub-Service Offering'}
                    </span>
                    {editingSubId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSubId(null);
                          setSubName('');
                          setSubDesc('');
                          setSubPrice(50);
                        }}
                        className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Sub-service name"
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-medium text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="$/hr"
                        value={subPrice}
                        onChange={(e) => setSubPrice(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono font-bold text-xs"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Brief description..."
                    value={subDesc}
                    onChange={(e) => setSubDesc(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 text-xs"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer select-none font-medium text-[10px]">
                      <input
                        type="checkbox"
                        checked={subReqVerification}
                        onChange={(e) => setSubReqVerification(e.target.checked)}
                        className="w-3.5 h-3.5 rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-0"
                      />
                      Requires Verified Badge
                    </label>
                    <button
                      type="button"
                      onClick={handleSaveSubcategory}
                      className="px-3 py-1.5 rounded-xl gradient-bg-primary text-white font-bold text-[11px] shadow hover:scale-105 transition-all"
                    >
                      <span className="text-white font-bold">{editingSubId ? 'Update' : '+ Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-full gradient-bg-primary text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
            >
              <span className="text-white font-bold">{category ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
