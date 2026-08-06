'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  Star, 
  AlertTriangle,
  Info,
  DollarSign,
  ArrowRight,
  UserCheck,
  Tag
} from 'lucide-react';
import { MOCK_COMPANIONS } from '@/lib/mockData';
import { useAdminStore } from '@/lib/adminStore';
import { PromoCodeItem } from '@/lib/types';


export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const companionId = params?.id as string;
  const companion = MOCK_COMPANIONS.find(c => c.id === companionId) || MOCK_COMPANIONS[0];

  const { config, promos, addBooking } = useAdminStore();

  const [bookingType, setBookingType] = useState<'hourly' | 'daily'>('hourly');
  const [selectedHours, setSelectedHours] = useState(3);
  const [selectedDate, setSelectedDate] = useState('2026-08-10');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('14:00 - 17:00');
  const [category, setCategory] = useState(companion.categories[0] || 'Event Companion');
  const [locationAddress, setLocationAddress] = useState('Metropolitan Gala Center, 5th Ave, NY');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentProvider, setPaymentProvider] = useState<'STRIPE' | 'RAZORPAY' | 'WALLET'>('STRIPE');
  
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Dynamic Financial Pricing Logic connected to Admin Store
  const hourlyRate = companion.hourlyRate || 75;
  const rawBaseAmount = bookingType === 'hourly' ? hourlyRate * selectedHours : (companion.dailyRate || 500);
  const baseAmount = discountPercent > 0 ? Math.round(rawBaseAmount * (1 - discountPercent / 100)) : rawBaseAmount;

  const escrowFee = Math.round(baseAmount * (config.escrowHoldingFeePercent / 100)); // Dynamic Bank Escrow Fee
  const platformFee = Math.round(baseAmount * (config.platformFeePercent / 100)); // Dynamic Platform Fee
  const gstTax = Math.round(baseAmount * (config.gstTaxPercent / 100)); // Dynamic GST Tax
  const totalAmount = baseAmount + escrowFee + platformFee + gstTax;

  const handleApplyPromo = () => {
    const match = promos.find((p: PromoCodeItem) => p.code.toUpperCase() === promoInput.trim().toUpperCase() && p.isActive);
    if (match) {
      const discountVal = match.discountPercent || match.discountValue || match.flatDiscount || 15;
      setDiscountPercent(discountVal);
      setPromoMessage(`Promo Code "${match.code}" applied! ${discountVal}% OFF`);
    } else {
      setPromoMessage('Invalid or expired promo code');
    }
  };


  const handleLockEscrowBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    addBooking({
      userId: 'usr-201',
      userName: 'Verified Client',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
      companionId: companion.id,
      companionName: companion.name,
      companionAvatar: companion.avatar,
      category,
      subCategory: 'Standard Escrow Companion Request',
      date: selectedDate,
      startTime: `${selectedDate}T10:00:00Z`,
      endTime: `${selectedDate}T${10 + selectedHours}:00:00Z`,
      durationHours: selectedHours,
      locationName: locationAddress,
      locationAddress,
      specialNotes,
      hourlyRate,
      baseAmount,
      subtotal: baseAmount,
      platformFee,
      escrowFee,
      totalAmount,
      status: 'ESCROW_LOCKED',
      paymentMethod: paymentProvider,
      escrowStatus: 'HELD'
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmed(true);
    }, 1200);
  };


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title & Breadcrumb */}
      <div className="space-y-1">
        <Link href="/search" className="text-xs text-indigo-400 font-semibold hover:underline">
          ← Back to Companion Search
        </Link>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Configure Escrow Booking</h1>
        <p className="text-xs text-slate-400">Lock funds into secure escrow holding until your booking is completed.</p>
      </div>

      {bookingConfirmed ? (
        /* Confirmation State View */
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/40 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-900/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
              ESCROW HOLD ACTIVE
            </span>
            <h2 className="text-2xl font-bold text-white">Booking Request Dispatched!</h2>
            <p className="text-xs text-slate-300">
              Your payment of <span className="font-extrabold text-white">${totalAmount}.00 USD</span> is now securely held in bank escrow. Funds will NOT be paid to <span className="text-white font-bold">{companion.name}</span> until you mutually approve task completion.
            </p>
          </div>

          {/* Booking Summary Ticket */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 text-xs">
            <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span>Booking Reference</span>
              <span className="font-mono text-white font-bold">#BK-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Companion</span>
              <span className="text-white font-bold">{companion.name} ({companion.city})</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Date & Time</span>
              <span className="text-white font-bold">{selectedDate} @ {selectedTimeSlot}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Location</span>
              <span className="text-white font-bold truncate max-w-[200px]">{locationAddress}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/chat"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl gradient-bg-primary text-white font-bold text-xs hover:opacity-95 transition-opacity"
            >
              Open Direct Encrypted Chat
            </Link>
            <Link 
              href="/wallet"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:text-white"
            >
              View Escrow Wallet Status
            </Link>
          </div>
        </div>
      ) : (
        /* Configurator Grid View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Controls Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Companion Card Summary */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex items-center gap-4">
              <img 
                src={companion.avatar} 
                alt={companion.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700" 
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{companion.name}, {companion.age}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                    <UserCheck className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-400">{companion.city}, {companion.country} • {companion.responseTimeMin}m Response Time</p>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {companion.ratingAvg} ({companion.ratingCount} reviews)
                </div>
              </div>
            </div>

            {/* Booking Details Form */}
            <form onSubmit={handleLockEscrowBooking} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-400" /> Schedule & Service Category
              </h3>

              {/* Service Category */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Category / Service Needed</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {companion.categories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                  <option value="Event Companion">Event Companion & Gala Partner</option>
                  <option value="Travel Buddy">City Sightseeing & Travel Buddy</option>
                  <option value="Elderly Assistance">Elderly Assistance & Errands</option>
                </select>
              </div>

              {/* Rate Model Selector */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setBookingType('hourly')}
                  className={`p-4 rounded-2xl border text-left transition-all ${bookingType === 'hourly' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider">Hourly Booking</h4>
                  <p className="text-lg font-black text-white mt-1">${companion.hourlyRate}<span className="text-xs font-normal text-slate-400">/hr</span></p>
                </button>

                <button 
                  type="button"
                  onClick={() => setBookingType('daily')}
                  className={`p-4 rounded-2xl border text-left transition-all ${bookingType === 'daily' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider">Full Day Pass</h4>
                  <p className="text-lg font-black text-white mt-1">${companion.dailyRate || 500}<span className="text-xs font-normal text-slate-400">/day</span></p>
                </button>
              </div>

              {/* Duration Slider if Hourly */}
              {bookingType === 'hourly' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Duration (Hours)</span>
                    <span className="text-indigo-400 font-bold">{selectedHours} Hours</span>
                  </div>
                  <input 
                    type="range" 
                    min={1} 
                    max={12} 
                    value={selectedHours} 
                    onChange={(e) => setSelectedHours(Number(e.target.value))}
                    className="w-full accent-indigo-500 bg-slate-900 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">Reservation Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">Time Slot</label>
                  <select 
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="10:00 - 13:00">Morning (10:00 AM - 1:00 PM)</option>
                    <option value="14:00 - 17:00">Afternoon (2:00 PM - 5:00 PM)</option>
                    <option value="18:00 - 22:00">Evening (6:00 PM - 10:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-semibold text-slate-300 block">Apply Dynamic Admin Promo Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Promo Code (e.g. WELCOME10)" 
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white uppercase focus:outline-none focus:border-indigo-500"
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyPromo}
                    className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold text-xs hover:bg-slate-800"
                  >
                    Apply Promo
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] font-bold ${discountPercent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Meeting Address / Venue Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="Public cafe, gala venue, or mall address..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Special Instructions / Preferences (Optional)</label>
                <textarea 
                  rows={3}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Dress code recommendations, venue instructions..."
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-sm hover:opacity-95 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Locking Escrow Funds...' : `Lock $${totalAmount}.00 in Bank Escrow & Request Booking`} <Lock className="w-4 h-4" />
              </button>

            </form>
          </div>

          {/* Dynamic Pricing & Escrow Invoice Column */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Dynamic Invoice Breakdown
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Companion Base Rate ({bookingType === 'hourly' ? `${selectedHours} hrs @ $${hourlyRate}/hr` : '1 Day'})</span>
                  <span className="text-white font-bold">${rawBaseAmount}.00</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Admin Promo Discount ({discountPercent}%)</span>
                    <span>-${rawBaseAmount - baseAmount}.00</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    Bank Escrow Protection ({config.escrowHoldingFeePercent}%) <Info className="w-3 h-3 text-slate-500" />
                  </span>
                  <span className="text-white font-bold">${escrowFee}.00</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Platform Operations ({config.platformFeePercent}%)</span>
                  <span className="text-white font-bold">${platformFee}.00</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>GST / Tax Compliance ({config.gstTaxPercent}%)</span>
                  <span className="text-white font-bold">${gstTax}.00</span>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Total Payable</span>
                    <span className="text-[10px] text-slate-500">Refundable until completion</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-400">${totalAmount}.00</span>
                </div>
              </div>

              {/* Payment Gateway Provider Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-300 block">Payment Processor</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    type="button"
                    onClick={() => setPaymentProvider('STRIPE')}
                    className={`py-2 px-3 rounded-xl border text-[11px] font-bold text-center transition-all ${paymentProvider === 'STRIPE' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    Stripe
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentProvider('RAZORPAY')}
                    className={`py-2 px-3 rounded-xl border text-[11px] font-bold text-center transition-all ${paymentProvider === 'RAZORPAY' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    Razorpay
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentProvider('WALLET')}
                    className={`py-2 px-3 rounded-xl border text-[11px] font-bold text-center transition-all ${paymentProvider === 'WALLET' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    Wallet
                  </button>
                </div>
              </div>

              {/* Safety Guarantee Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Companion Guarantee
                </div>
                <p className="leading-relaxed">
                  Your payment remains strictly in escrow. Companion is paid only after you approve task fulfillment. Cancel anytime 2 hours prior for 100% full refund.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
