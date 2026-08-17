'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CategoryItem } from '@/lib/types/serviceHub';
import { ImageLightboxModal } from '@/components/common/ImageLightboxModal';
import {
  Users, Plus, Edit2, Trash2, Copy, Eye, Star, Layers, ShieldAlert, AlertTriangle, CheckCircle2, Maximize2
} from 'lucide-react';

export function CategoriesTab() {
  const {
    categories,
    services,
    addCategory,
    updateCategory,
    deleteCategory,
    duplicateCategory,
    toggleCategoryActive,
    toggleCategoryFeatured,
    searchQuery
  } = useServiceHubStore();

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [deleteWarningModalCat, setDeleteWarningModalCat] = useState<{ cat: CategoryItem; serviceCount: number } | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Users');
  const [minAge, setMinAge] = useState(18);
  const [isFeatured, setIsFeatured] = useState(false);

  const filteredCategories = categories.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('Users');
    setMinAge(18);
    setIsFeatured(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setIcon(cat.icon || 'Users');
    setMinAge(cat.minimum_age || 18);
    setIsFeatured(cat.is_featured || false);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        description: description.trim(),
        icon,
        minimum_age: Number(minAge),
        is_featured: isFeatured
      });
    } else {
      addCategory({
        name: name.trim(),
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: description.trim(),
        icon,
        display_order: categories.length + 1,
        status: 'ACTIVE',
        is_featured: isFeatured,
        minimum_age: Number(minAge)
      });
    }
    setIsFormOpen(false);
  };

  const handleDeleteAttempt = (cat: CategoryItem) => {
    const activeSubServices = services.filter(s => s.category_id === cat.id && s.status !== 'ARCHIVED');
    if (activeSubServices.length > 0) {
      setDeleteWarningModalCat({ cat, serviceCount: activeSubServices.length });
    } else {
      if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
        deleteCategory(cat.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Module 1: Categories Management ({categories.length} Total)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize service offerings into top-level categories. Category profiles apply default inheritance rules to sub-services.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs hover:opacity-90 shadow-lg flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const serviceCount = services.filter(s => s.category_id === cat.id && s.status !== 'ARCHIVED').length;
          const banner = cat.banner_image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';

          return (
            <div
              key={cat.id}
              className={`rounded-2xl border transition-all flex flex-col overflow-hidden group hover:shadow-xl ${
                cat.status === 'ACTIVE' ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' : 'bg-slate-950/80 border-slate-900 opacity-60'
              }`}
            >
              {/* Banner Image with Click-to-Preview */}
              <div
                className="relative h-48 sm:h-52 overflow-hidden bg-slate-950 cursor-pointer"
                onClick={() => setLightboxImage(banner)}
                title="Click to preview image"
              >
                <img
                  src={banner}
                  alt={cat.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Hover Preview Overlay */}
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                  <span className="px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-xl">
                    <Maximize2 className="w-3.5 h-3.5 text-indigo-400" /> Click to Preview
                  </span>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-bold border border-slate-700">
                    Min Age: {cat.minimum_age}+
                  </span>

                  {cat.is_featured && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 backdrop-blur-md text-[10px] font-extrabold border border-amber-500/40 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> Featured
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4 z-10">
                  <h4 className="font-extrabold text-white text-base leading-tight truncate">{cat.name}</h4>
                  <p className="text-[11px] text-slate-300 font-medium">{serviceCount} Active Services Linked</p>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{cat.description}</p>

                {/* Action Controls */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleCategoryActive(cat.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                        cat.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {cat.status === 'ACTIVE' ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => toggleCategoryFeatured(cat.id)}
                      className={`p-1.5 rounded-xl border text-xs transition-all ${
                        cat.is_featured ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className={`w-3.5 h-3.5 ${cat.is_featured ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateCategory(cat.id)}
                      className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs"
                      title="Duplicate Category"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 text-xs"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAttempt(cat)}
                      className="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Dependency Protection Warning Modal */}
      {deleteWarningModalCat && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-white text-base">Unsafe Category Deletion Blocked</h4>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono text-left space-y-1">
              <p className="font-bold text-rose-400">Category "{deleteWarningModalCat.cat.name}" contains:</p>
              <p>• {deleteWarningModalCat.serviceCount} Active Services</p>
              <p>• Associated Pricing Profiles & Policies</p>
            </div>
            <p className="text-xs text-slate-400">
              Categories containing active service offerings cannot be deleted. Please reassign or archive sub-services first.
            </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setDeleteWarningModalCat(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-white text-lg">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Service Category'}
            </h4>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Technology & Digital"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed category scope..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Minimum Age Limit</label>
                  <input
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="feat"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                  <label htmlFor="feat" className="text-white font-bold cursor-pointer">Mark as Featured</label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <ImageLightboxModal
          isOpen={!!lightboxImage}
          imageUrl={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
