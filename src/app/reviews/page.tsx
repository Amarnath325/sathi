'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, ArrowLeft, Plus, CheckCircle2, MessageSquare } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import { SearchAndLimitBar, PaginationFooter, PageSizeOption } from '@/components/common/PaginationBar';
import { ReviewCard } from '@/components/review/ReviewCard';
import { ReviewFormModal } from '@/components/review/ReviewFormModal';

export default function PublicReviewsPage() {
  const { reviews } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRating, setSelectedRating] = useState<string>('ALL');

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Show only approved reviews publicly
  const approvedReviews = useMemo(() => {
    return reviews.filter(r => r.status === 'APPROVED');
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let result = [...approvedReviews];

    if (selectedRating !== 'ALL') {
      result = result.filter(r => r.rating === Number(selectedRating));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        r =>
          r.authorName.toLowerCase().includes(q) ||
          (r.companionName && r.companionName.toLowerCase().includes(q)) ||
          r.comment.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)

      );
    }

    return result;
  }, [approvedReviews, selectedRating, searchQuery]);

  const paginatedReviews = useMemo(() => {
    if (pageSize === 'All') return filteredReviews;
    const start = (currentPage - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, currentPage, pageSize]);

  const triggerNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const avgScore = useMemo(() => {
    if (approvedReviews.length === 0) return '5.0';
    return (approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length).toFixed(1);
  }, [approvedReviews]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
                <Star className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white">Community Reviews & Ratings</h1>
                <p className="text-[10px] text-amber-400 font-mono">100% Verified Companion Feedback</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Rate a Companion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Rating Overview Header */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-black text-white flex items-center gap-2 justify-center md:justify-start">
              Client Satisfaction & Trust Hub <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Explore authentic ratings and feedback from verified client bookings. Every review undergoes automated sentiment verification and anti-spam moderation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0 space-y-1 min-w-[180px]">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Overall Platform Rating</span>
            <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-6 h-6 fill-amber-400" /> {avgScore}
            </div>
            <span className="text-[10px] text-emerald-400 font-bold block">{approvedReviews.length} Verified Reviews</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Star Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {['ALL', '5', '4', '3', '2', '1'].map((rating) => (
                <button
                  key={rating}
                  onClick={() => { setSelectedRating(rating); setCurrentPage(1); }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                    selectedRating === rating
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {rating === 'ALL' ? 'All Ratings' : `${rating} Stars`}
                  {rating !== 'ALL' && <Star className="w-3 h-3 fill-current" />}
                </button>
              ))}
            </div>

            {/* Standardized Search & Limit Selector Bar */}
            <SearchAndLimitBar
              searchQuery={searchQuery}
              onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              pageSize={pageSize}
              onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
              placeholder="Search author, companion, review text..."
            />
          </div>

          {/* Cards Grid */}
          {paginatedReviews.length === 0 ? (
            <div className="p-16 text-center text-slate-500 space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
              <Star className="w-12 h-12 text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-white">No reviews found</h3>
              <p className="text-xs text-slate-400">There are no reviews matching your current rating filter or search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {/* Pagination Footer */}
          {filteredReviews.length > 0 && (
            <PaginationFooter
              currentPage={currentPage}
              totalItems={filteredReviews.length}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
              labelSingular="review"
              labelPlural="reviews"
            />
          )}

        </div>

      </main>

      {/* Review Form Modal */}
      {isWriteModalOpen && (
        <ReviewFormModal
          bookingId="bk-current-101"
          bookingNumber="CC-2026-9088"
          companionId="comp-101"
          companionName="Sophia Chen"
          authorId="usr-current"
          authorName="Valued Client"
          authorEmail="client@sathi.com"
          onClose={() => setIsWriteModalOpen(false)}
          onSuccessNotification={(msg) => triggerNotify(msg)}
        />
      )}

    </div>
  );
}
