'use client';

import React, { useState } from 'react';
import { BookingDetails, PaymentMethod } from '@/lib/types';
import { ALL_CATEGORIES } from '@/lib/mockData';
import { X, Calendar, Clock, MapPin, DollarSign, User, ShieldCheck, CreditCard, Plus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BookingDetails, 'id' | 'createdAt' | 'bookingNumber'>) => void;
}

export function BookingFormModal({ isOpen, onClose, onSubmit }: Props) {
  if (!isOpen) return null;

  const [userName, setUserName] = useState('');
  const [companionName, setCompanionName] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES[0] || 'Event Companion');
  const [subCategory, setSubCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationHours, setDurationHours] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [locationAddress, setLocationAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('STRIPE');
  const [specialNotes, setSpecialNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseAmount = durationHours * hourlyRate;
    const platformFee = Math.round(baseAmount * 0.1);
    const escrowFee = Math.round(baseAmount * 0.05);
    const totalAmount = baseAmount + platformFee + escrowFee;

    onSubmit({
      userId: 'usr-' + Date.now(),
      userName: userName || 'Admin Dispatch Client',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
      companionId: 'comp-' + Date.now(),
      companionName: companionName || 'Verified Companion',
      companionAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      category,
      subCategory,
      date,
      startTime: `${date}T10:00:00Z`,
      endTime: `${date}T${10 + durationHours}:00:00Z`,
      durationHours,
      locationName: locationAddress || 'Selected Venue',
      locationAddress,
      specialNotes,
      hourlyRate,
      baseAmount,
      subtotal: baseAmount,
      platformFee,
      escrowFee,
      totalAmount,
      status: 'ESCROW_LOCKED',
      paymentMethod,
      escrowStatus: 'HELD'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" /> Create Manual Escrow Booking
            </h2>
            <p className="text-xs text-slate-400 mt-1">Dispatch a new companion meetup ticket with locked bank escrow.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Client Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Michael Jordan"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Companion Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sophia Chen"
                value={companionName}
                onChange={e => setCompanionName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Service Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              >
                {ALL_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sub-service Specialty</label>
              <input
                type="text"
                placeholder="e.g. Corporate Gala Escort"
                value={subCategory}
                onChange={e => setSubCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration (Hours)</label>
              <input
                type="number"
                min={1} max={24}
                value={durationHours}
                onChange={e => setDurationHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hourly Rate ($)</label>
              <input
                type="number"
                min={10} max={500}
                value={hourlyRate}
                onChange={e => setHourlyRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Meeting Location Address</label>
            <input
              type="text"
              required
              placeholder="e.g. Palace of Fine Arts, San Francisco, CA"
              value={locationAddress}
              onChange={e => setLocationAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Gateway</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="STRIPE">STRIPE</option>
                <option value="RAZORPAY">RAZORPAY</option>
                <option value="WALLET">WALLET</option>
                <option value="UPI">UPI</option>
                <option value="CREDIT_CARD">CREDIT_CARD</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Calculated Escrow</label>
              <div className="px-3.5 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-extrabold text-sm">
                ${durationHours * hourlyRate + Math.round(durationHours * hourlyRate * 0.15)}.00
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Special Client Requirements</label>
            <textarea
              rows={2}
              placeholder="Any special instructions, dress code, or language requirements..."
              value={specialNotes}
              onChange={e => setSpecialNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white font-extrabold hover:opacity-90 shadow-lg shadow-indigo-600/30"
            >
              Create & Lock Escrow Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
