'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { PricingProfile, PricingType } from '@/lib/types/serviceHub';
import { PricingEngine } from '@/lib/serviceHubEngines';
import {
  DollarSign,
  Calculator,
  Plus,
  Edit2,
  Search,
  X,
  Copy,
  Trash2,
  Clock,
  Car,
  TrendingUp,
  Percent,
  Tag,
  ShieldCheck,
  Calendar,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight
} from 'lucide-react';

type ModalTab = 'basic' | 'rate_duration' | 'travel' | 'dynamic' | 'fees' | 'discounts' | 'advanced';

export function PricingTab() {
  const {
    pricingProfiles,
    categories,
    services,
    addPricingProfile,
    updatePricingProfile,
    searchQuery
  } = useServiceHubStore();

  // Search & Filter State
  const [localSearch, setLocalSearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Calculator State
  const [calcProfileId, setCalcProfileId] = useState<string>(pricingProfiles[0]?.id || '');
  const [calcDuration, setCalcDuration] = useState<number>(3);
  const [calcTravelKm, setCalcTravelKm] = useState<number>(15);
  const [calcWaitingHours, setCalcWaitingHours] = useState<number>(1);
  const [isWeekend, setIsWeekend] = useState<boolean>(true);
  const [isHoliday, setIsHoliday] = useState<boolean>(false);
  const [isPeakHours, setIsPeakHours] = useState<boolean>(true);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<ModalTab>('basic');
  const [editingProfile, setEditingProfile] = useState<PricingProfile | null>(null);

  // Modal Form Fields (1. Basic)
  const [name, setName] = useState('');
  const [pricingType, setPricingType] = useState<PricingType>('Hourly');
  const [currency, setCurrency] = useState('INR');
  const [categoryId, setCategoryId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'DRAFT'>('ACTIVE');

  // Modal Form Fields (2. Rate & Duration)
  const [basePrice, setBasePrice] = useState<number>(500);
  const [extraHourPrice, setExtraHourPrice] = useState<number>(450);
  const [minDuration, setMinDuration] = useState<number>(1);
  const [maxDuration, setMaxDuration] = useState<number>(12);

  // Modal Form Fields (3. Travel & Extra Charges)
  const [travelEnabled, setTravelEnabled] = useState<boolean>(true);
  const [travelPricingType, setTravelPricingType] = useState<'Per KM' | 'Fixed' | 'Zone'>('Per KM');
  const [travelCharge, setTravelCharge] = useState<number>(15);
  const [freeDistanceKm, setFreeDistanceKm] = useState<number>(5);
  const [maxTravelCharge, setMaxTravelCharge] = useState<number>(500);
  const [waitingChargePerHr, setWaitingChargePerHr] = useState<number>(100);
  const [parkingCharge, setParkingCharge] = useState<number>(0);
  const [tollCharge, setTollCharge] = useState<number>(0);
  const [otherCharges, setOtherCharges] = useState<number>(0);

  // Modal Form Fields (4. Dynamic Pricing)
  const [weekendMultiplier, setWeekendMultiplier] = useState<number>(1.15);
  const [holidayMultiplier, setHolidayMultiplier] = useState<number>(1.25);
  const [surgeEnabled, setSurgeEnabled] = useState<boolean>(true);
  const [surgeMultiplier, setSurgeMultiplier] = useState<number>(1.2);
  const [peakHoursStart, setPeakHoursStart] = useState<string>('18:00');
  const [peakHoursEnd, setPeakHoursEnd] = useState<string>('23:00');
  const [demandMultiplier, setDemandMultiplier] = useState<number>(1.1);

  // Modal Form Fields (5. Fees, Tax & Earnings)
  const [platformFee, setPlatformFee] = useState<number>(15);
  const [gatewayFee, setGatewayFee] = useState<number>(2);
  const [tax, setTax] = useState<number>(18);
  const [companionCommission, setCompanionCommission] = useState<number>(20);
  const [companionPayoutRate, setCompanionPayoutRate] = useState<number>(80);

  // Modal Form Fields (6. Discounts)
  const [discountEnabled, setDiscountEnabled] = useState<boolean>(true);
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed Amount'>('Percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [discountCap, setDiscountCap] = useState<number>(300);
  const [longDurationDiscount, setLongDurationDiscount] = useState<number>(5);

  // Modal Form Fields (7. Advanced & Versioning)
  const [priceMinLimit, setPriceMinLimit] = useState<number>(200);
  const [priceMaxLimit, setPriceMaxLimit] = useState<number>(15000);
  const [roundingRule, setRoundingRule] = useState<'NO_ROUNDING' | 'ROUND_NEAREST_10' | 'ROUND_NEAREST_50' | 'ROUND_NEAREST_100'>('ROUND_NEAREST_10');
  const [versionTag, setVersionTag] = useState<string>('v1.0');
  const [effectiveFrom, setEffectiveFrom] = useState<string>('2026-01-01');
  const [effectiveUntil, setEffectiveUntil] = useState<string>('');
  const [historicalLock, setHistoricalLock] = useState<boolean>(true);

  // Filter logic
  const searchTerm = localSearch || searchQuery;
  const filteredProfiles = useMemo(() => {
    return pricingProfiles.filter(p => {
      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.pricing_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedTypeFilter === 'ALL' || p.pricing_type === selectedTypeFilter;
      const matchesStatus = selectedStatusFilter === 'ALL' || p.status === selectedStatusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [pricingProfiles, searchTerm, selectedTypeFilter, selectedStatusFilter]);

  // Selected Profile for Calculator
  const activeProfile = pricingProfiles.find(p => p.id === calcProfileId) || pricingProfiles[0];
  const breakdown = useMemo(() => {
    if (!activeProfile) return null;
    return PricingEngine.calculatePrice(activeProfile, calcDuration, calcTravelKm, {
      isWeekend,
      isHoliday,
      isPeakHours,
      waitingHours: calcWaitingHours,
      promoDiscount
    });
  }, [activeProfile, calcDuration, calcTravelKm, calcWaitingHours, isWeekend, isHoliday, isPeakHours, promoDiscount]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProfile(null);
    setActiveModalTab('basic');
    setName('');
    setPricingType('Hourly');
    setCurrency('INR');
    setCategoryId('');
    setServiceId('');
    setStatus('ACTIVE');

    setBasePrice(500);
    setExtraHourPrice(450);
    setMinDuration(1);
    setMaxDuration(12);

    setTravelEnabled(true);
    setTravelPricingType('Per KM');
    setTravelCharge(15);
    setFreeDistanceKm(5);
    setMaxTravelCharge(500);
    setWaitingChargePerHr(100);
    setParkingCharge(0);
    setTollCharge(0);
    setOtherCharges(0);

    setWeekendMultiplier(1.15);
    setHolidayMultiplier(1.25);
    setSurgeEnabled(true);
    setSurgeMultiplier(1.2);
    setPeakHoursStart('18:00');
    setPeakHoursEnd('23:00');
    setDemandMultiplier(1.1);

    setPlatformFee(15);
    setGatewayFee(2);
    setTax(18);
    setCompanionCommission(20);
    setCompanionPayoutRate(80);

    setDiscountEnabled(true);
    setDiscountType('Percentage');
    setDiscountValue(10);
    setDiscountCap(300);
    setLongDurationDiscount(5);

    setPriceMinLimit(200);
    setPriceMaxLimit(15000);
    setRoundingRule('ROUND_NEAREST_10');
    setVersionTag('v1.0');
    setEffectiveFrom(new Date().toISOString().split('T')[0]);
    setEffectiveUntil('');
    setHistoricalLock(true);

    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (prof: PricingProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProfile(prof);
    setActiveModalTab('basic');

    setName(prof.name);
    setPricingType(prof.pricing_type);
    setCurrency(prof.currency || 'INR');
    setCategoryId(prof.category_id || '');
    setServiceId(prof.service_id || '');
    setStatus(prof.status || 'ACTIVE');

    setBasePrice(prof.base_price || 0);
    setExtraHourPrice(prof.extra_hour_price || 0);
    setMinDuration(prof.minimum_duration || 1);
    setMaxDuration(prof.maximum_duration || 12);

    setTravelEnabled(prof.travel_enabled !== false);
    setTravelPricingType(prof.travel_pricing_type || 'Per KM');
    setTravelCharge(prof.travel_charge || 0);
    setFreeDistanceKm(prof.free_distance_km || 0);
    setMaxTravelCharge(prof.max_travel_charge || 500);
    setWaitingChargePerHr(prof.waiting_charge_per_hr || 0);
    setParkingCharge(prof.parking_charge || 0);
    setTollCharge(prof.toll_charge || 0);
    setOtherCharges(prof.other_charges || 0);

    setWeekendMultiplier(prof.weekend_multiplier || 1.0);
    setHolidayMultiplier(prof.holiday_multiplier || 1.0);
    setSurgeEnabled(prof.surge_enabled || false);
    setSurgeMultiplier(prof.surge_multiplier || 1.2);
    setPeakHoursStart(prof.peak_hours_start || '18:00');
    setPeakHoursEnd(prof.peak_hours_end || '23:00');
    setDemandMultiplier(prof.demand_pricing_multiplier || 1.0);

    setPlatformFee(prof.platform_fee || 15);
    setGatewayFee(prof.payment_gateway_fee || 2);
    setTax(prof.tax || 18);
    setCompanionCommission(prof.companion_commission || 20);
    setCompanionPayoutRate(prof.companion_payout_rate || 80);

    setDiscountEnabled(prof.discount_enabled || false);
    setDiscountType(prof.discount_type || 'Percentage');
    setDiscountValue(prof.discount_value || 0);
    setDiscountCap(prof.discount_cap || 0);
    setLongDurationDiscount(prof.long_duration_discount || 0);

    setPriceMinLimit(prof.price_min_limit || 100);
    setPriceMaxLimit(prof.price_max_limit || 20000);
    setRoundingRule(prof.rounding_rule || 'ROUND_NEAREST_10');
    setVersionTag(prof.version || 'v1.0');
    setEffectiveFrom(prof.effective_from || new Date().toISOString().split('T')[0]);
    setEffectiveUntil(prof.effective_until || '');
    setHistoricalLock(prof.historical_price_lock !== false);

    setIsModalOpen(true);
  };

  // Save Form
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const catObj = categories.find(c => c.id === categoryId);
    const srvObj = services.find(s => s.id === serviceId);

    const payload: Omit<PricingProfile, 'id'> = {
      name: name.trim(),
      pricing_type: pricingType,
      currency,
      category_id: categoryId || undefined,
      category_name: catObj?.name || undefined,
      service_id: serviceId || undefined,
      service_name: srvObj?.name || undefined,

      base_price: Number(basePrice),
      extra_hour_price: Number(extraHourPrice),
      minimum_duration: Number(minDuration),
      maximum_duration: Number(maxDuration),

      travel_enabled: travelEnabled,
      travel_pricing_type: travelPricingType,
      travel_charge: Number(travelCharge),
      free_distance_km: Number(freeDistanceKm),
      max_travel_charge: Number(maxTravelCharge),
      waiting_charge_per_hr: Number(waitingChargePerHr),
      parking_charge: Number(parkingCharge),
      toll_charge: Number(tollCharge),
      other_charges: Number(otherCharges),

      weekend_multiplier: Number(weekendMultiplier),
      holiday_multiplier: Number(holidayMultiplier),
      surge_enabled: surgeEnabled,
      surge_multiplier: Number(surgeMultiplier),
      peak_hours_start: peakHoursStart,
      peak_hours_end: peakHoursEnd,
      demand_pricing_multiplier: Number(demandMultiplier),

      platform_fee: Number(platformFee),
      payment_gateway_fee: Number(gatewayFee),
      tax: Number(tax),
      companion_commission: Number(companionCommission),
      companion_payout_rate: Number(companionPayoutRate),

      discount_enabled: discountEnabled,
      discount_type: discountType,
      discount_value: Number(discountValue),
      discount_cap: Number(discountCap),
      long_duration_discount: Number(longDurationDiscount),

      price_min_limit: priceMinLimit ? Number(priceMinLimit) : undefined,
      price_max_limit: priceMaxLimit ? Number(priceMaxLimit) : undefined,
      rounding_rule: roundingRule,
      version: versionTag || 'v1.0',
      effective_from: effectiveFrom || new Date().toISOString().split('T')[0],
      effective_until: effectiveUntil || undefined,
      pricing_snapshot_code: `SNAP-${versionTag.toUpperCase()}-${Date.now().toString(36).slice(-4)}`,
      historical_price_lock: historicalLock,
      cancellation_fee: 100,
      no_show_fee: 500,
      status
    };

    if (editingProfile) {
      updatePricingProfile(editingProfile.id, payload);
    } else {
      addPricingProfile(payload);
    }

    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Type', 'Currency', 'Base Price', 'Extra/hr', 'Min Duration', 'Max Duration', 'Platform Fee', 'Payout %', 'Version', 'Status'];
    const rows = filteredProfiles.map(p => [
      p.id, p.name, p.pricing_type, p.currency, p.base_price, p.extra_hour_price, p.minimum_duration, p.maximum_duration, `${p.platform_fee}%`, `${p.companion_payout_rate}%`, p.version, p.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pricing_profiles_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 w-full text-xs">
      {/* Search, Filter & Actions Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search by profile name, type, or category..."
              className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Pricing Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={e => setSelectedTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-purple-500"
          >
            <option value="ALL">All Pricing Types</option>
            <option value="Hourly">Hourly</option>
            <option value="Half Day">Half Day</option>
            <option value="Full Day">Full Day</option>
            <option value="Per Event">Per Event</option>
            <option value="Fixed Price">Fixed Price</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-purple-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/90">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                viewMode === 'table' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                viewMode === 'cards' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Grid View
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] border border-slate-200/90 flex items-center gap-1 transition-all"
            title="Export to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] shadow-2xs flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Create Pricing Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main Pricing Profiles Display */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Configured Enterprise Pricing Rules
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold">
                {filteredProfiles.length} Profiles
              </span>
            </h4>
          </div>

          {filteredProfiles.length > 0 ? (
            viewMode === 'table' ? (
              /* Full Enterprise Data Table */
              <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-50/90 border-b border-slate-200/90 text-slate-500 font-extrabold uppercase text-[9px] tracking-wider">
                        <th className="py-2.5 px-3">Profile Name & Identity</th>
                        <th className="py-2.5 px-3">Type / Currency</th>
                        <th className="py-2.5 px-3">Base & Extra Rate</th>
                        <th className="py-2.5 px-3">Duration Limits</th>
                        <th className="py-2.5 px-3">Travel Rules</th>
                        <th className="py-2.5 px-3">Dynamic Multipliers</th>
                        <th className="py-2.5 px-3">Fees & Tax</th>
                        <th className="py-2.5 px-3">Companion Payout</th>
                        <th className="py-2.5 px-3">Discounts & Limits</th>
                        <th className="py-2.5 px-3">Version & Effective</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProfiles.map((prof) => {
                        const isSelected = calcProfileId === prof.id;

                        return (
                          <tr
                            key={prof.id}
                            onClick={() => setCalcProfileId(prof.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-purple-50/40' : 'hover:bg-slate-50/60'
                            }`}
                          >
                            {/* Column 1: Name & Identity */}
                            <td className="py-3 px-3">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-slate-900 text-xs">{prof.name}</span>
                                  {isSelected && (
                                    <span className="px-1.5 py-0.2 rounded bg-purple-600 text-white text-[8px] font-black">
                                      CALCULATING
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px]">
                                  <span className="text-slate-500 font-mono text-[9px]">{prof.id}</span>
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                                    prof.status === 'ACTIVE'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : prof.status === 'DRAFT'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                                  }`}>
                                    {prof.status}
                                  </span>
                                  {prof.category_name && (
                                    <span className="text-purple-600 font-bold truncate max-w-[120px]">
                                      • {prof.category_name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Column 2: Type / Currency */}
                            <td className="py-3 px-3">
                              <div className="space-y-0.5">
                                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold">
                                  {prof.pricing_type}
                                </span>
                                <p className="text-[9px] text-slate-400 font-mono font-bold">{prof.currency || 'INR'}</p>
                              </div>
                            </td>

                            {/* Column 3: Base & Extra Rate */}
                            <td className="py-3 px-3 font-mono">
                              <div className="space-y-0.5">
                                <p className="font-extrabold text-slate-900 text-xs">₹{prof.base_price}</p>
                                <p className="text-[10px] text-slate-500">+₹{prof.extra_hour_price}/hr</p>
                              </div>
                            </td>

                            {/* Column 4: Duration Limits */}
                            <td className="py-3 px-3 font-mono">
                              <div className="space-y-0.5 text-[10px]">
                                <span className="text-slate-600 font-bold">Min: {prof.minimum_duration || 1}h</span>
                                <span className="text-slate-400"> | </span>
                                <span className="text-slate-600 font-bold">Max: {prof.maximum_duration || 12}h</span>
                              </div>
                            </td>

                            {/* Column 5: Travel Rules */}
                            <td className="py-3 px-3">
                              {prof.travel_enabled !== false ? (
                                <div className="space-y-0.5 text-[10px] font-mono">
                                  <p className="text-slate-900 font-bold">
                                    {prof.travel_pricing_type === 'Fixed' ? `Fixed ₹${prof.travel_charge}` : `₹${prof.travel_charge}/km`}
                                  </p>
                                  <p className="text-[9px] text-slate-400">Free: {prof.free_distance_km || 0}km | Cap: ₹{prof.max_travel_charge || 500}</p>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Travel Disabled</span>
                              )}
                            </td>

                            {/* Column 6: Dynamic Multipliers */}
                            <td className="py-3 px-3 text-[10px]">
                              <div className="space-y-0.5 font-mono">
                                <p className="text-slate-700">Wknd: <strong className="text-slate-900">{prof.weekend_multiplier || 1.0}x</strong></p>
                                <p className="text-slate-700">Surge: <strong className={prof.surge_enabled ? 'text-amber-600 font-extrabold' : 'text-slate-400'}>
                                  {prof.surge_enabled ? `${prof.surge_multiplier || 1.2}x` : 'Off'}
                                </strong></p>
                              </div>
                            </td>

                            {/* Column 7: Fees & Tax */}
                            <td className="py-3 px-3 text-[10px]">
                              <div className="space-y-0.5 font-mono">
                                <p className="text-blue-600 font-bold">Plat: {prof.platform_fee}%</p>
                                <p className="text-amber-600 font-bold">GST: {prof.tax}% (Gtw: {prof.payment_gateway_fee || 2}%)</p>
                              </div>
                            </td>

                            {/* Column 8: Companion Payout */}
                            <td className="py-3 px-3 text-[10px]">
                              <div className="space-y-0.5 font-mono">
                                <p className="text-emerald-600 font-extrabold">Payout: {prof.companion_payout_rate || 80}%</p>
                                <p className="text-slate-400 text-[9px]">Comm: {prof.companion_commission || 20}%</p>
                              </div>
                            </td>

                            {/* Column 9: Discounts & Limits */}
                            <td className="py-3 px-3 text-[10px]">
                              {prof.discount_enabled ? (
                                <div className="space-y-0.5 font-mono">
                                  <p className="text-emerald-700 font-bold">{prof.discount_value}{prof.discount_type === 'Percentage' ? '%' : '₹'} Off</p>
                                  <p className="text-[9px] text-slate-400">Cap: ₹{prof.discount_cap || 'No Cap'}</p>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400">None</span>
                              )}
                            </td>

                            {/* Column 10: Version & Effective */}
                            <td className="py-3 px-3 text-[10px]">
                              <div className="space-y-0.5">
                                <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-extrabold text-[9px]">
                                  {prof.version || 'v1.0'}
                                </span>
                                <p className="text-[9px] text-slate-400 font-mono">{prof.effective_from || 'Immediate'}</p>
                              </div>
                            </td>

                            {/* Column 11: Actions */}
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={(e) => handleOpenEdit(prof, e)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                                  title="Edit Pricing Profile"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredProfiles.map((prof) => {
                  const isSelected = calcProfileId === prof.id;

                  return (
                    <div
                      key={prof.id}
                      onClick={() => setCalcProfileId(prof.id)}
                      className={`p-3.5 rounded-2xl transition-all cursor-pointer space-y-3 ${
                        isSelected
                          ? 'bg-white border-2 border-purple-500 shadow-sm ring-2 ring-purple-500/10'
                          : 'bg-white border border-slate-200/90 shadow-2xs hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-extrabold text-slate-900 text-xs">{prof.name}</h5>
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[9px] font-black">
                            {prof.version || 'v1.0'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold">
                            {prof.pricing_type}
                          </span>
                          <button
                            onClick={(e) => handleOpenEdit(prof, e)}
                            className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 font-mono text-[10px] bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase font-extrabold">Base Rate</p>
                          <p className="font-extrabold text-slate-900 text-xs">₹{prof.base_price}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase font-extrabold">Extra /hr</p>
                          <p className="font-extrabold text-slate-900 text-xs">₹{prof.extra_hour_price}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase font-extrabold">Platform</p>
                          <p className="font-extrabold text-blue-600 text-xs">{prof.platform_fee}%</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase font-extrabold">Payout</p>
                          <p className="font-extrabold text-emerald-600 text-xs">{prof.companion_payout_rate || 80}%</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                        <span className="text-slate-600">Travel: <strong className="text-slate-900">{prof.travel_enabled !== false ? `₹${prof.travel_charge}/km` : 'Off'}</strong></span>
                        <span className="text-slate-600">Weekend: <strong className="text-slate-900">{prof.weekend_multiplier}x</strong></span>
                        <span className="text-slate-600">Min/Max: <strong className="text-slate-900">{prof.minimum_duration}-{prof.maximum_duration}h</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              No pricing profiles found matching your search.
            </div>
          )}
        </div>

        {/* Dynamic Price Calculator & Breakdown Widget */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-4 h-fit shadow-2xs sticky top-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-purple-600" />
              Live Pricing Calculation Engine
            </h4>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-extrabold text-[9px]">
              REAL-TIME
            </span>
          </div>

          <div className="space-y-3 text-[11px]">
            {/* Select Profile */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Testing Pricing Profile</label>
              <select
                value={calcProfileId}
                onChange={e => setCalcProfileId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/90 rounded-xl p-2 text-[11px] text-slate-900 font-extrabold outline-none focus:border-purple-500 shadow-2xs"
              >
                {pricingProfiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.pricing_type})</option>
                ))}
              </select>
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-bold">Booking Duration:</label>
                <span className="font-mono font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">{calcDuration} Hours</span>
              </div>
              <input
                type="range"
                min={activeProfile?.minimum_duration || 1}
                max={activeProfile?.maximum_duration || 12}
                value={calcDuration}
                onChange={e => setCalcDuration(Number(e.target.value))}
                className="w-full accent-purple-600 h-1.5 rounded-full bg-slate-200 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                <span>Min: {activeProfile?.minimum_duration || 1}h</span>
                <span>Max: {activeProfile?.maximum_duration || 12}h</span>
              </div>
            </div>

            {/* Distance Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-bold">Travel Distance:</label>
                <span className="font-mono font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">{calcTravelKm} KM</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={calcTravelKm}
                onChange={e => setCalcTravelKm(Number(e.target.value))}
                className="w-full accent-purple-600 h-1.5 rounded-full bg-slate-200 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                <span>0 KM</span>
                <span>Free: {activeProfile?.free_distance_km || 0}km</span>
                <span>50 KM</span>
              </div>
            </div>

            {/* Waiting Hours */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-bold">Waiting Hours:</label>
                <span className="font-mono font-bold text-slate-800">{calcWaitingHours} h</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={calcWaitingHours}
                onChange={e => setCalcWaitingHours(Number(e.target.value))}
                className="w-full accent-purple-600 h-1.5 rounded-full bg-slate-200 cursor-pointer"
              />
            </div>

            {/* Condition Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-purple-300">
                <input type="checkbox" checked={isWeekend} onChange={e => setIsWeekend(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                <span className="text-slate-800 font-bold text-[10px]">Weekend</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-purple-300">
                <input type="checkbox" checked={isHoliday} onChange={e => setIsHoliday(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                <span className="text-slate-800 font-bold text-[10px]">Holiday</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-purple-300 col-span-2">
                <input type="checkbox" checked={isPeakHours} onChange={e => setIsPeakHours(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                <span className="text-slate-800 font-bold text-[10px]">Peak Hours (Surge Multiplier)</span>
              </label>
            </div>
          </div>

          {/* Granular Breakdown Box */}
          {breakdown && (
            <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] space-y-2 border border-slate-800 shadow-inner">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pb-1 border-b border-slate-800 flex justify-between">
                <span>Calculation Output</span>
                <span className="text-purple-400">{breakdown.pricingVersion}</span>
              </div>

              <div className="space-y-1 text-[10.5px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Base Rate:</span>
                  <span className="text-white">₹{breakdown.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Duration Charge ({breakdown.durationHours}h):</span>
                  <span className="text-white">₹{breakdown.durationCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Travel Fee ({breakdown.billableTravelKm}km billable):</span>
                  <span className="text-white">₹{breakdown.travelCharge}</span>
                </div>
                {breakdown.waitingCharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Waiting Fee:</span>
                    <span className="text-white">₹{breakdown.waitingCharge}</span>
                  </div>
                )}
                {breakdown.multiplierCharge > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span className="font-sans">Surge/Weekend Multiplier ({breakdown.weekendHolidaySurgeMultiplier}x):</span>
                    <span>+₹{breakdown.multiplierCharge}</span>
                  </div>
                )}
                <div className="flex justify-between text-blue-400">
                  <span className="font-sans">Platform Fee:</span>
                  <span>+₹{breakdown.platformFee}</span>
                </div>
                <div className="flex justify-between text-indigo-300">
                  <span className="font-sans">Gateway Fee:</span>
                  <span>+₹{breakdown.gatewayFee}</span>
                </div>
                <div className="flex justify-between text-amber-300">
                  <span className="font-sans">GST Tax:</span>
                  <span>+₹{breakdown.taxAmount}</span>
                </div>
                {breakdown.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span className="font-sans">Applied Discount:</span>
                    <span>-₹{breakdown.discountAmount}</span>
                  </div>
                )}
              </div>

              {/* Payout Split Box */}
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[10px]">
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span className="font-sans">Companion Payout ({activeProfile?.companion_payout_rate || 80}%):</span>
                  <span>₹{breakdown.companionPayoutAmount}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="font-sans">Platform Commission ({activeProfile?.companion_commission || 20}%):</span>
                  <span>₹{breakdown.companionCommissionAmount}</span>
                </div>
              </div>

              {/* Final Price */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-sans">
                <span className="font-extrabold text-white text-xs">Total Rounded Price:</span>
                <span className="text-emerald-400 text-base font-black font-mono">₹{breakdown.roundedPrice}</span>
              </div>

              <div className="text-[8.5px] text-slate-500 flex items-center gap-1 font-mono pt-1">
                <Lock className="w-3 h-3 text-purple-400" />
                <span>Snapshot: {breakdown.snapshotCode}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7-Tab Organized Enterprise Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-4 sm:p-6 space-y-4 shadow-2xl my-auto text-xs text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-white text-base">
                  {editingProfile ? `Edit Pricing Profile: ${editingProfile.name}` : 'Create Enterprise Pricing Profile'}
                </h4>
                <p className="text-[11px] text-slate-400">Configure multi-tier pricing, travel rules, gateway fees, and payout logic.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 7 Tab Navigation Headers */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800 no-scrollbar">
              {[
                { id: 'basic', label: '1. Basic Pricing', icon: Tag },
                { id: 'rate_duration', label: '2. Rate & Duration', icon: Clock },
                { id: 'travel', label: '3. Travel & Extras', icon: Car },
                { id: 'dynamic', label: '4. Dynamic Multipliers', icon: TrendingUp },
                { id: 'fees', label: '5. Fees & Payout', icon: Percent },
                { id: 'discounts', label: '6. Discounts', icon: DollarSign },
                { id: 'advanced', label: '7. Advanced & Version', icon: ShieldCheck }
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = activeModalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveModalTab(tab.id as ModalTab)}
                    className={`px-3 py-2 rounded-xl text-[10.5px] font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
              {/* TAB 1: BASIC PRICING */}
              {activeModalTab === 'basic' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Pricing Profile Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Standard Companion Hourly Profile"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Pricing Type</label>
                      <select
                        value={pricingType}
                        onChange={e => setPricingType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      >
                        <option value="Hourly">Hourly</option>
                        <option value="Half Day">Half Day (4h)</option>
                        <option value="Full Day">Full Day (8h)</option>
                        <option value="Per Session">Per Session</option>
                        <option value="Per Event">Per Event</option>
                        <option value="Per KM">Per KM</option>
                        <option value="Fixed Price">Fixed Price</option>
                        <option value="Custom Quote">Custom Quote</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Currency</label>
                      <select
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="AED">AED (AED)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Linked Category (Optional)</label>
                      <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Linked Service (Optional)</label>
                      <select
                        value={serviceId}
                        onChange={e => setServiceId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      >
                        <option value="">All Services</option>
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Status</label>
                      <select
                        value={status}
                        onChange={e => setStatus(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RATE & DURATION */}
              {activeModalTab === 'rate_duration' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Base Rate (₹) *</label>
                      <input
                        type="number"
                        required
                        value={basePrice}
                        onChange={e => setBasePrice(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Starting base charge for 1st hour or fixed session.</p>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Extra Hour Rate (₹)</label>
                      <input
                        type="number"
                        value={extraHourPrice}
                        onChange={e => setExtraHourPrice(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Fee for each additional hour beyond 1st hour.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Minimum Duration (Hours)</label>
                      <input
                        type="number"
                        min={1}
                        max={24}
                        value={minDuration}
                        onChange={e => setMinDuration(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Maximum Duration (Hours)</label>
                      <input
                        type="number"
                        min={1}
                        max={24}
                        value={maxDuration}
                        onChange={e => setMaxDuration(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TRAVEL & EXTRA CHARGES */}
              {activeModalTab === 'travel' && (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="checkbox"
                      checked={travelEnabled}
                      onChange={e => setTravelEnabled(e.target.checked)}
                      className="accent-purple-600 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-white font-bold text-xs">Enable Travel Charges</span>
                      <p className="text-[10px] text-slate-400">Calculate distance-based travel reimbursement for companions.</p>
                    </div>
                  </label>

                  {travelEnabled && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Travel Pricing Type</label>
                          <select
                            value={travelPricingType}
                            onChange={e => setTravelPricingType(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                          >
                            <option value="Per KM">Per KM Rate</option>
                            <option value="Fixed">Fixed Travel Fee</option>
                            <option value="Zone">Zone Based</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Per KM / Travel Rate (₹)</label>
                          <input
                            type="number"
                            value={travelCharge}
                            onChange={e => setTravelCharge(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Free Distance (KM)</label>
                          <input
                            type="number"
                            value={freeDistanceKm}
                            onChange={e => setFreeDistanceKm(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Max Travel Charge Cap (₹)</label>
                          <input
                            type="number"
                            value={maxTravelCharge}
                            onChange={e => setMaxTravelCharge(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Waiting Charge (₹/hr)</label>
                          <input
                            type="number"
                            value={waitingChargePerHr}
                            onChange={e => setWaitingChargePerHr(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Parking / Toll (₹)</label>
                          <input
                            type="number"
                            value={parkingCharge}
                            onChange={e => setParkingCharge(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: DYNAMIC MULTIPLIERS */}
              {activeModalTab === 'dynamic' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Weekend Multiplier (x)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={weekendMultiplier}
                        onChange={e => setWeekendMultiplier(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">e.g. 1.15 = 15% surge on Sat/Sun</p>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Holiday Multiplier (x)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={holidayMultiplier}
                        onChange={e => setHolidayMultiplier(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">e.g. 1.25 = 25% surge on official holidays</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <input
                        type="checkbox"
                        checked={surgeEnabled}
                        onChange={e => setSurgeEnabled(e.target.checked)}
                        className="accent-purple-600 w-4 h-4 rounded"
                      />
                      <div>
                        <span className="text-white font-bold text-xs">Enable Peak Hours Surge Pricing</span>
                        <p className="text-[10px] text-slate-400">Apply automatic surge during high demand night hours.</p>
                      </div>
                    </label>

                    {surgeEnabled && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Surge Multiplier (x)</label>
                          <input
                            type="number"
                            step="0.05"
                            value={surgeMultiplier}
                            onChange={e => setSurgeMultiplier(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Peak Start Time</label>
                          <input
                            type="time"
                            value={peakHoursStart}
                            onChange={e => setPeakHoursStart(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Peak End Time</label>
                          <input
                            type="time"
                            value={peakHoursEnd}
                            onChange={e => setPeakHoursEnd(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: FEES, TAX & EARNINGS */}
              {activeModalTab === 'fees' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Platform Fee (%)</label>
                      <input
                        type="number"
                        value={platformFee}
                        onChange={e => setPlatformFee(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Payment Gateway Fee (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={gatewayFee}
                        onChange={e => setGatewayFee(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">GST / Tax Rate (%)</label>
                      <input
                        type="number"
                        value={tax}
                        onChange={e => setTax(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-3 pt-3">
                    <h5 className="font-extrabold text-emerald-400 text-xs flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      Companion Payout & Escrow Split
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Companion Payout Rate (%)</label>
                        <input
                          type="number"
                          value={companionPayoutRate}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setCompanionPayoutRate(val);
                            setCompanionCommission(100 - val);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 text-xs font-mono font-bold"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Percentage directly transferred to companion bank wallet.</p>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Admin Commission (%)</label>
                        <input
                          type="number"
                          value={companionCommission}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setCompanionCommission(val);
                            setCompanionPayoutRate(100 - val);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 text-xs font-mono font-bold"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Platform gross margin retained by Sathi.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: DISCOUNTS */}
              {activeModalTab === 'discounts' && (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="checkbox"
                      checked={discountEnabled}
                      onChange={e => setDiscountEnabled(e.target.checked)}
                      className="accent-purple-600 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-white font-bold text-xs">Enable Automatic Profile Discounts</span>
                      <p className="text-[10px] text-slate-400">Apply introductory or bulk promo discounts automatically.</p>
                    </div>
                  </label>

                  {discountEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Discount Type</label>
                        <select
                          value={discountType}
                          onChange={e => setDiscountType(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                        >
                          <option value="Percentage">Percentage (%)</option>
                          <option value="Fixed Amount">Fixed Amount (₹)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Discount Value</label>
                        <input
                          type="number"
                          value={discountValue}
                          onChange={e => setDiscountValue(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Discount Cap Limit (₹)</label>
                        <input
                          type="number"
                          value={discountCap}
                          onChange={e => setDiscountCap(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-3 pt-2 border-t border-slate-800">
                        <label className="block text-slate-300 font-bold mb-1">Long Duration Bonus Discount (%)</label>
                        <input
                          type="number"
                          value={longDurationDiscount}
                          onChange={e => setLongDurationDiscount(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Extra discount automatically applied for bookings exceeding 4 hours.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: ADVANCED & VERSIONING */}
              {activeModalTab === 'advanced' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Min Price Threshold (₹)</label>
                      <input
                        type="number"
                        value={priceMinLimit}
                        onChange={e => setPriceMinLimit(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Max Price Cap (₹)</label>
                      <input
                        type="number"
                        value={priceMaxLimit}
                        onChange={e => setPriceMaxLimit(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Rounding Functionality</label>
                      <select
                        value={roundingRule}
                        onChange={e => setRoundingRule(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      >
                        <option value="ROUND_NEAREST_10">Round to Nearest ₹10</option>
                        <option value="ROUND_NEAREST_50">Round to Nearest ₹50</option>
                        <option value="ROUND_NEAREST_100">Round to Nearest ₹100</option>
                        <option value="NO_ROUNDING">No Rounding (Exact Decimal)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Pricing Version Tag</label>
                      <input
                        type="text"
                        value={versionTag}
                        onChange={e => setVersionTag(e.target.value)}
                        placeholder="v1.0"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Effective From Date</label>
                      <input
                        type="date"
                        value={effectiveFrom}
                        onChange={e => setEffectiveFrom(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Effective Until Date</label>
                      <input
                        type="date"
                        value={effectiveUntil}
                        onChange={e => setEffectiveUntil(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="checkbox"
                      checked={historicalLock}
                      onChange={e => setHistoricalLock(e.target.checked)}
                      className="accent-purple-600 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-white font-bold text-xs">Enable Historical Price Snapshot Locking</span>
                      <p className="text-[10px] text-slate-400">Lock immutable pricing snapshot hash into booking record upon checkout.</p>
                    </div>
                  </label>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">Step {['basic', 'rate_duration', 'travel', 'dynamic', 'fees', 'discounts', 'advanced'].indexOf(activeModalTab) + 1} of 7</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1"
                  >
                    {editingProfile ? 'Save Pricing Changes' : 'Create Pricing Profile'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
