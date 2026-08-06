'use client';

import React, { useState, useEffect } from 'react';
import { ServiceCategory, SubCategoryItem, RiskLevel } from '@/lib/types';
import {
  X, Plus, Trash2, ShieldCheck, AlertTriangle, Sparkles, Layers,
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
      setSafetyPolicy('Standard safety guidelines apply. Emergency check-in active.');
      setSubcategories([]);
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleAddSubcategory = () => {
    if (!subName.trim()) return;
    const newSub: SubCategoryItem = {
      id: 'sub-' + Date.now(),
      name: subName.trim(),
      description: subDesc.trim() || 'Custom service offering.',
      basePrice: Number(subPrice) || 50,
      requiredVerification: subReqVerification,
    };
    setSubcategories([...subcategories, newSub]);
    setSubName('');
    setSubDesc('');
    setSubPrice(50);
  };

  const handleRemoveSubcategory = (subId: string) => {
    setSubcategories(subcategories.filter(s => s.id !== subId));
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {category ? 'Edit Service Category' : 'Create New Service Category'}
              </h2>
              <p className="text-xs text-slate-400">Configure catalog details, risk policies & sub-services</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">1. Core Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="e.g. VIP Gala Companion"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. vip-gala-companion"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Description *</label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of what this service entails..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Category Icon</label>
                <div className="flex gap-2">
                  {ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIconName(ic)}
                      className={`p-2 rounded-xl border font-bold text-xs ${iconName === ic ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Governance */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">2. Pricing Rules & Governance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Risk Assessment Level</label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                >
                  {RISKS.map((r) => (
                    <option key={r} value={r}>{r} Risk Level</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Base Rate Multiplier</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.5"
                  max="3.0"
                  value={baseRateMultiplier}
                  onChange={(e) => setBaseRateMultiplier(parseFloat(e.target.value) || 1.0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Min Age Requirement</label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={minAgeLimit}
                  onChange={(e) => setMinAgeLimit(parseInt(e.target.value) || 18)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                />
                Mark as Featured Category (Displays on homepage carousel)
              </label>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Safety & Compliance Policy</label>
              <input
                type="text"
                value={safetyPolicy}
                onChange={(e) => setSafetyPolicy(e.target.value)}
                placeholder="e.g. Public venue rule & SOS dispatch enabled"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Subcategories Builder */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">3. Sub-Services Included ({subcategories.length})</h3>
            </div>

            {/* Existing Subcategories List */}
            {subcategories.length > 0 ? (
              <div className="space-y-2">
                {subcategories.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="font-bold text-white">{sub.name}</span>
                      <span className="ml-2 text-slate-400">(${sub.basePrice}/hr)</span>
                      <p className="text-[10px] text-slate-400">{sub.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcategory(sub.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-[11px]">No sub-services added yet. Add at least one below.</p>
            )}

            {/* Add Subcategory Form */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="font-bold text-slate-300 text-[11px] block">+ Add Sub-Service Offering</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Sub-service name (e.g. VIP Dinner)"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white outline-none"
                />
                <input
                  type="number"
                  placeholder="Base Price $/hr"
                  value={subPrice}
                  onChange={(e) => setSubPrice(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white outline-none font-mono"
                />
              </div>
              <input
                type="text"
                placeholder="Brief description..."
                value={subDesc}
                onChange={(e) => setSubDesc(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white outline-none"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subReqVerification}
                    onChange={(e) => setSubReqVerification(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-800 text-indigo-600"
                  />
                  Requires Verified Companion Badge
                </label>
                <button
                  type="button"
                  onClick={handleAddSubcategory}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-[11px] hover:bg-indigo-500"
                >
                  Add Sub-Service
                </button>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl gradient-bg-primary text-white font-bold hover:opacity-90 shadow-lg shadow-indigo-600/30"
            >
              {category ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
