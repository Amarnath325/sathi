'use client';

import React, { useState, useEffect } from 'react';
import { ServiceCategory, SubCategoryItem, RiskLevel } from '@/lib/types';
import {
  X, Plus, Trash2, Pencil, ShieldCheck, AlertTriangle, Sparkles, Layers,
  DollarSign, Check, Info, Users, Compass, Heart, BookOpen, Activity, Gamepad
} from 'lucide-react';

interface CategoryFormModalProps {
  isOpen: boolean;
  category?: ServiceCategory | null;
  onClose: () => void;
  onSave: (catData: Omit<ServiceCategory, 'id' | 'companionCount' | 'createdAt'> & { id?: string }) => void;
}

const ICONS = ['Users', 'Compass', 'Heart', 'BookOpen', 'Activity', 'Gamepad'];
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
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {category ? 'Edit Service Category' : 'Create New Service Category'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Configure catalog details, risk policies & sub-services</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">1. Core Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="e.g. Event Companion"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. event-companion"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 font-mono transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Description *</label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of what this service entails..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category Icon</label>
                <div className="flex gap-2">
                  {ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIconName(ic)}
                      className={`p-2 rounded-xl border font-bold text-xs transition-all ${
                        iconName === ic 
                          ? 'gradient-bg-primary text-white border-transparent shadow-sm' 
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Governance */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">2. Pricing Rules & Governance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Risk Assessment Level</label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-medium transition-colors"
                >
                  {RISKS.map((r) => (
                    <option key={r} value={r} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{r} Risk Level</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Base Rate Multiplier</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.5"
                  max="3.0"
                  value={baseRateMultiplier}
                  onChange={(e) => setBaseRateMultiplier(parseFloat(e.target.value) || 1.0)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Min Age Requirement</label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={minAgeLimit}
                  onChange={(e) => setMinAgeLimit(parseInt(e.target.value) || 18)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-medium transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                Mark as Featured Category (Displays on homepage carousel)
              </label>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Safety & Compliance Policy</label>
              <input
                type="text"
                value={safetyPolicy}
                onChange={(e) => setSafetyPolicy(e.target.value)}
                placeholder="e.g. Public venues only. Mandatory emergency check-in every 2 hours."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Subcategories Builder */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">3. Sub-Services Included ({subcategories.length})</h3>
            </div>

            {/* Existing Subcategories List */}
            {subcategories.length > 0 ? (
              <div className="space-y-2.5">
                {subcategories.map((sub) => (
                  <div 
                    key={sub.id} 
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      editingSubId === sub.id
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-400 dark:border-indigo-500/50 shadow-sm'
                        : 'bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{sub.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">(${sub.basePrice}/hr)</span>
                        {sub.requiredVerification && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold">
                            Verified Required
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{sub.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditSubcategory(sub)}
                        title="Edit Sub-Service"
                        className="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubcategory(sub.id)}
                        title="Delete Sub-Service"
                        className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-[11px] p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 text-center border border-dashed border-slate-200 dark:border-slate-800">
                No sub-services added yet. Add at least one below.
              </p>
            )}

            {/* Add / Edit Subcategory Sub-Form */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  {editingSubId ? '✏️ Edit Sub-Service Offering' : '+ Add Sub-Service Offering'}
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
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Sub-service name (e.g. VIP Gala Dinner)"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Base Rate $/hr"
                    value={subPrice}
                    onChange={(e) => setSubPrice(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Brief description..."
                value={subDesc}
                onChange={(e) => setSubDesc(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none font-medium text-[11px]">
                  <input
                    type="checkbox"
                    checked={subReqVerification}
                    onChange={(e) => setSubReqVerification(e.target.checked)}
                    className="w-4 h-4 rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  Requires Verified Companion Badge
                </label>
                <button
                  type="button"
                  onClick={handleSaveSubcategory}
                  className="px-4 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
                >
                  <span className="text-white font-bold">{editingSubId ? 'Update Sub-Service' : 'Add Sub-Service'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full gradient-bg-primary text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
            >
              <span className="text-white font-bold">{category ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

