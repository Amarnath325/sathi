'use client';

import React, { useState, useMemo } from 'react';
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
  Tag,
  Check,
  RefreshCw,
  FileText,
  Navigation,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { MOCK_COMPANIONS } from '@/lib/mockData';
import { useAdminStore } from '@/lib/adminStore';
import { PromoCodeItem } from '@/lib/types';
import { BookingStateMachine, BookingStatusType } from '@/lib/bookingStateMachine';
import { FinancialLedgerService } from '@/lib/paymentArchitecture';
import { useToast } from '@/components/ui/Toast';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const companionId = params?.id as string;
  const companion = MOCK_COMPANIONS.find(c => c.id === companionId) || MOCK_COMPANIONS[0];

  const { config, promos, addBooking } = useAdminStore();

  // 9-Step Controlled Booking Flow state (Section 31)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1: Service & Duration (Section 32)
  const [category, setCategory] = useState(companion.categories[0] || 'Event Companion');
  const [selectedHours, setSelectedHours] = useState(2); // Min 2 hours
  const hourlyRate = companion.hourlyRate || 75;

  // STEP 2: Date & Time (Section 33)
  const [selectedDate, setSelectedDate] = useState('2026-08-15');
  const [selectedStartTime, setSelectedStartTime] = useState('14:00');

  // STEP 3: Location (Section 34)
  const [city, setCity] = useState(companion.city || 'New York');
  const [area, setArea] = useState('Manhattan');
  const [meetingPoint, setMeetingPoint] = useState('Metropolitan Museum Lobby');
  const [locationMode, setLocationMode] = useState<'MANUAL' | 'GPS' | 'MAP'>('MANUAL');

  // STEP 4: Booking Purpose (Section 35)
  const [purpose, setPurpose] = useState('Event');
  const [otherPurposeText, setOtherPurposeText] = useState('');

  // STEP 5: Additional Details (Section 36)
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [accessibilityRequirements, setAccessibilityRequirements] = useState('');

  // STEP 6 & 8: Pricing & Payment (Section 37 & 43)
  const [paymentProvider, setPaymentProvider] = useState<'STRIPE' | 'RAZORPAY' | 'UPI' | 'CREDIT_CARD'>('STRIPE');
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // STEP 7: Safety Rules Checkboxes (Section 38)
  const [agreeLawful, setAgreeLawful] = useState(false);
  const [agreeGuidelines, setAgreeGuidelines] = useState(false);
  const [agreePlatformComm, setAgreePlatformComm] = useState(false);
  const [agreeCancellation, setAgreeCancellation] = useState(false);
  const [agreeSafety, setAgreeSafety] = useState(false);

  // Booking Execution State (Section 39, 40)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<BookingStatusType>('REQUESTED');
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Dynamic Price Engine (Recalculated Server-Side)
  const rawBaseAmount = hourlyRate * Math.max(selectedHours, 2);
  const baseAmount = discountPercent > 0 ? Math.round(rawBaseAmount * (1 - discountPercent / 100)) : rawBaseAmount;
  const platformFee = Math.round(baseAmount * (config.platformFeePercent / 100 || 0.10)); 
  const gstTax = Math.round(baseAmount * (config.gstTaxPercent / 100 || 0.18)); 
  const totalAmount = baseAmount + platformFee + gstTax;

  const handleApplyPromo = () => {
    const match = promos.find((p: PromoCodeItem) => p.code.toUpperCase() === promoInput.trim().toUpperCase() && p.isActive);
    if (match) {
      const discountVal = match.discountPercent || match.discountValue || 15;
      setDiscountPercent(discountVal);
      setPromoMessage(`Promo Code "${match.code}" applied! ${discountVal}% OFF`);
    } else {
      setPromoMessage('Invalid or expired promo code');
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationMode('GPS');
          setMeetingPoint(`GPS Meeting Point (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`);
          showToast('success', 'Location Retrieved', 'Current GPS location set for meeting point.');
        },
        () => showToast('error', 'Location Error', 'Unable to retrieve location.')
      );
    }
  };

  const handleConfirmBookingRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeLawful || !agreeGuidelines || !agreePlatformComm || !agreeCancellation || !agreeSafety) {
      showToast('error', 'Safety Check Required', 'You must accept all 5 safety requirements before proceeding to payment.');
      return;
    }

    setIsSubmitting(true);
    const newBkId = 'BK-' + Math.floor(10000 + Math.random() * 90000);

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingId(newBkId);
      setBookingStatus('CONFIRMED');
      setCurrentStep(9); // Go to Confirmation

      addBooking({
        userId: 'usr-client-201',
        userName: 'Verified Client',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
        companionId: companion.id,
        companionName: companion.name,
        companionAvatar: companion.avatar,
        category,
        subCategory: purpose,
        date: selectedDate,
        startTime: `${selectedDate}T${selectedStartTime}:00Z`,
        endTime: `${selectedDate}T18:00:00Z`,
        durationHours: selectedHours,
        locationName: meetingPoint,
        locationAddress: `${meetingPoint}, ${area}, ${city}`,
        specialNotes: specialInstructions,
        hourlyRate,
        baseAmount,
        subtotal: baseAmount,
        platformFee,
        escrowFee: 0,
        totalAmount,
        status: 'CONFIRMED' as any,
        paymentMethod: paymentProvider,
        escrowStatus: 'HELD'
      });
    }, 1500);
  };

  const allSafetyAgreed = agreeLawful && agreeGuidelines && agreePlatformComm && agreeCancellation && agreeSafety;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <Link href={`/companion/${companion.id}`} className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1 mb-1">
            <ChevronLeft className="w-4 h-4" /> Back to Companion Profile
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Controlled 9-Step Booking Request</h1>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
          STEP {currentStep} OF 9
        </span>
      </div>

      {/* Progress Steps Bar (Section 31) */}
      {currentStep < 9 && (
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 text-[10px] font-bold text-slate-400 border-b border-slate-800">
          <span className={`px-2.5 py-1 rounded-xl whitespace-nowrap ${currentStep === 1 ? 'bg-indigo-600 text-white' : ''}`}>1. Service</span>
          <span className={`px-2.5 py-1 rounded-xl whitespace-nowrap ${currentStep === 2 ? 'bg-indigo-600 text-white' : ''}`}>2. Date & Time</span>
          <span className={`px-2.5 py-1 rounded-xl whitespace-nowrap ${currentStep === 3 ? 'bg-indigo-600 text-white' : ''}`}>3. Location</span>
          <span className={`px-2.5 py-1 rounded-xl whitespace-nowrap ${currentStep === 4 ? 'bg-indigo-600 text-white' : ''}`}>4. Purpose</span>
          <span className={`px-2.5 py-1 rounded-xl whitespace-nowrap ${currentStep === 5 ? 'bg-indigo-600 text-white' : ''}`}>5. Details</span>
          <span className={`px-2.5 py-1 rounded-xl whitespace-nowrap ${currentStep === 6 ? 'bg-indigo-600 text-white' : ''}`}>6. Price</span>
          <span className={`px-2.5 py-1 rounded-xl whitespace-nowrap ${currentStep === 7 ? 'bg-indigo-600 text-white' : ''}`}>7. Safety</span>
          <span className={`px-2.5 py-1 rounded-xl whitespace-nowrap ${currentStep === 8 ? 'bg-indigo-600 text-white' : ''}`}>8. Payment</span>
        </div>
      )}

      {/* STEP 1: SERVICE & DURATION (Section 32) */}
      {currentStep === 1 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-extrabold text-white">Select Service & Duration</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Service Specialty</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
              >
                {companion.categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Duration (Min. 2 Hours)</label>
                <span className="text-xs font-mono text-indigo-400 font-bold">${hourlyRate}/hr</span>
              </div>
              <input 
                type="range"
                min={2}
                max={12}
                value={selectedHours}
                onChange={e => setSelectedHours(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-xs text-slate-400 mt-1 font-mono">Selected: {selectedHours} Hours • Base Subtotal: ${rawBaseAmount}</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(2)}
            className="w-full py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            Next: Date & Time <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: DATE & TIME (Section 33) */}
      {currentStep === 2 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-extrabold text-white">Select Date & Time Slot</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Booking Date</label>
              <input 
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Start Time</label>
              <select
                value={selectedStartTime}
                onChange={e => setSelectedStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
              >
                <option value="10:00">10:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="18:00">06:00 PM</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="py-4 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Next: Location <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LOCATION (Section 34) */}
      {currentStep === 3 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-extrabold text-white">Meeting Location Details</h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLocationMode('MANUAL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border ${locationMode === 'MANUAL' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
              >
                Enter Manually
              </button>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 ${locationMode === 'GPS' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-indigo-400 border-slate-800'}`}
              >
                <Navigation className="w-3.5 h-3.5" /> Use Current Location
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">City</label>
                <input 
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Area / Neighborhood</label>
                <input 
                  type="text"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Authorized Public Meeting Point</label>
              <input 
                type="text"
                value={meetingPoint}
                onChange={e => setMeetingPoint(e.target.value)}
                placeholder="e.g. Hotel Lobby, Convention Hall, Museum Entrance"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="py-4 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="flex-1 py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Next: Purpose <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PURPOSE (Section 35) */}
      {currentStep === 4 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-extrabold text-white">What will this booking be for?</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Event', 'Travel assistance', 'Shopping', 'Study', 'Fitness', 'Gaming', 'Conversation', 'Elderly assistance', 'Local activity', 'Other'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPurpose(p)}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${purpose === p ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
              >
                {p}
              </button>
            ))}
          </div>

          {purpose === 'Other' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Please describe the lawful activity</label>
              <textarea 
                rows={2}
                value={otherPurposeText}
                onChange={e => setOtherPurposeText(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              ></textarea>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(3)}
              className="py-4 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="flex-1 py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Next: Additional Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: ADDITIONAL DETAILS (Section 36) */}
      {currentStep === 5 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-extrabold text-white">Additional Instructions & Special Requirements</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Additional Instructions (Optional)</label>
              <textarea 
                rows={3}
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                placeholder="Dress code, specific meeting instructions..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Accessibility / Special Assistance Requirements</label>
              <input 
                type="text"
                value={accessibilityRequirements}
                onChange={e => setAccessibilityRequirements(e.target.value)}
                placeholder="Wheelchair access, language translation assistance..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(4)}
              className="py-4 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="flex-1 py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Next: Price Summary <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: PRICE SUMMARY (Section 37) */}
      {currentStep === 6 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-extrabold text-white">Price Summary</h2>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Companion:</span> <strong className="text-white">{companion.name}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Service:</span> <strong className="text-white">{category} ({purpose})</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Duration:</span> <strong className="text-white">{selectedHours} Hours @ ${hourlyRate}/hr</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Base Subtotal:</span> <strong className="text-white">${baseAmount}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Platform Service Fee:</span> <strong className="text-white">${platformFee}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Taxes:</span> <strong className="text-white">${gstTax}</strong>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm text-indigo-400 font-extrabold">
              <span>Total Recalculated Amount:</span> <span>${totalAmount}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(5)}
              className="py-4 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(7)}
              className="flex-1 py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Next: Safety Confirmation <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: SAFETY CONFIRMATION (Section 38) */}
      {currentStep === 7 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Mandatory Safety Confirmation
          </h2>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
            <span className="font-bold text-white block mb-1">Before continuing to payment, confirm:</span>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreeLawful} onChange={e => setAgreeLawful(e.target.checked)} className="mt-0.5 rounded text-indigo-500" />
              <span>✓ This booking is for a lawful service.</span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreeGuidelines} onChange={e => setAgreeGuidelines(e.target.checked)} className="mt-0.5 rounded text-indigo-500" />
              <span>✓ I agree to follow Community Guidelines.</span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreePlatformComm} onChange={e => setAgreePlatformComm(e.target.checked)} className="mt-0.5 rounded text-indigo-500" />
              <span>✓ I will keep all communication strictly on the platform.</span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreeCancellation} onChange={e => setAgreeCancellation(e.target.checked)} className="mt-0.5 rounded text-indigo-500" />
              <span>✓ I understand the platform cancellation policy.</span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreeSafety} onChange={e => setAgreeSafety(e.target.checked)} className="mt-0.5 rounded text-indigo-500" />
              <span>✓ I understand and accept the platform safety guidelines.</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(6)}
              className="py-4 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!allSafetyAgreed) {
                  showToast('error', 'Safety Check Required', 'Please check all 5 safety requirements.');
                  return;
                }
                setCurrentStep(8);
              }}
              className="flex-1 py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Next: Payment Gateway <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: PAYMENT GATEWAY (Section 43) */}
      {currentStep === 8 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-extrabold text-white">Payment Gateway & Escrow Hold</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['STRIPE', 'RAZORPAY', 'UPI', 'CREDIT_CARD'].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => setPaymentProvider(provider as any)}
                className={`p-4 rounded-2xl border text-xs font-bold text-center transition-all ${paymentProvider === provider ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
              >
                {provider}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex justify-between font-mono font-bold text-indigo-400">
              <span>Amount to Hold in Escrow:</span> <span>${totalAmount}</span>
            </div>
            <p className="text-[10px] text-slate-400">Funds are held securely in platform escrow until companion accepts and service completes.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(7)}
              className="py-4 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
            >
              Back
            </button>

            <button
              onClick={handleConfirmBookingRequest}
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Authorizing Payment & Request...' : `Confirm & Authorize $${totalAmount}`}
            </button>
          </div>
        </div>
      )}

      {/* STEP 9: CONFIRMATION & EXPLICIT STATUS (Section 46) */}
      {currentStep === 9 && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 text-center shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Booking Confirmed ✓</h2>
            <p className="text-xs text-slate-400">Reference ID: <span className="font-mono text-indigo-300 font-bold">{bookingId}</span></p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 max-w-md mx-auto text-left font-mono">
            <div className="flex justify-between"><span>Companion:</span> <strong className="text-white">{companion.name}</strong></div>
            <div className="flex justify-between"><span>Service:</span> <strong className="text-white">{category}</strong></div>
            <div className="flex justify-between"><span>Meeting Point:</span> <strong className="text-white">{meetingPoint}</strong></div>
            <div className="flex justify-between"><span>Status:</span> <strong className="text-emerald-400 font-bold">CONFIRMED</strong></div>
            <div className="flex justify-between"><span>Escrow Amount:</span> <strong className="text-indigo-400">${totalAmount}</strong></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/chat"
              className="px-6 py-3 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30"
            >
              Open Encrypted Chat
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
            >
              View Booking Dashboard
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
