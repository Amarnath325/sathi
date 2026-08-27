'use client';

import React, { useState, useEffect } from 'react';
import { CountryData, StateData, CityData, PincodeData } from '@/lib/locationService';
import { MapPin, Globe, Compass, Building2, Mail, Check, RefreshCw, Search } from 'lucide-react';

export interface SelectedLocationResult {
  country: CountryData | null;
  state: StateData | null;
  city: CityData | null;
  pincode: PincodeData | null;
  fullAddressString: string;
}

interface Props {
  onLocationSelect?: (result: SelectedLocationResult) => void;
  className?: string;
}

export function CascadingLocationSelector({ onLocationSelect, className = '' }: Props) {
  // Lists
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [states, setStates] = useState<StateData[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [pincodes, setPincodes] = useState<PincodeData[]>([]);

  // Selected Values
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [selectedPincode, setSelectedPincode] = useState<PincodeData | null>(null);

  // Loaders
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPincodes, setLoadingPincodes] = useState(false);

  // Search Filters
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [pincodeSearch, setPincodeSearch] = useState('');

  // Initial Load - Fetch Countries
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const res = await fetch('/api/location/countries');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCountries(data.data);
        // Default to India (id: 101) if available
        const india = data.data.find((c: CountryData) => c.id === 101 || c.name.toLowerCase() === 'india');
        if (india) {
          handleSelectCountry(india);
        }
      }
    } catch (e) {
      console.error('Failed to fetch countries', e);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Fetch States when Country changes
  const fetchStates = async (countryId: number) => {
    setLoadingStates(true);
    setStates([]);
    setCities([]);
    setPincodes([]);
    try {
      const res = await fetch(`/api/location/states?countryId=${countryId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setStates(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch states', e);
    } finally {
      setLoadingStates(false);
    }
  };

  // Fetch Cities when State changes
  const fetchCities = async (stateId: number) => {
    setLoadingCities(true);
    setCities([]);
    setPincodes([]);
    try {
      const res = await fetch(`/api/location/cities?stateId=${stateId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCities(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch cities', e);
    } finally {
      setLoadingCities(false);
    }
  };

  // Fetch Pincodes when City/State changes
  const fetchPincodes = async (cityName: string, stateName?: string) => {
    setLoadingPincodes(true);
    setPincodes([]);
    try {
      const query = new URLSearchParams();
      if (cityName) query.append('city', cityName);
      if (stateName) query.append('state', stateName);
      
      const res = await fetch(`/api/location/pincodes?${query.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPincodes(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch pincodes', e);
    } finally {
      setLoadingPincodes(false);
    }
  };

  // Handlers
  const handleSelectCountry = (country: CountryData) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedPincode(null);
    fetchStates(country.id);
    notifyParent(country, null, null, null);
  };

  const handleSelectState = (state: StateData) => {
    setSelectedState(state);
    setSelectedCity(null);
    setSelectedPincode(null);
    fetchCities(state.id);
    notifyParent(selectedCountry, state, null, null);
  };

  const handleSelectCity = (city: CityData) => {
    setSelectedCity(city);
    setSelectedPincode(null);
    if (selectedState) {
      fetchPincodes(city.name, selectedState.name);
    } else {
      fetchPincodes(city.name);
    }
    notifyParent(selectedCountry, selectedState, city, null);
  };

  const handleSelectPincode = (pincode: PincodeData) => {
    setSelectedPincode(pincode);
    notifyParent(selectedCountry, selectedState, selectedCity, pincode);
  };

  const notifyParent = (
    country: CountryData | null,
    state: StateData | null,
    city: CityData | null,
    pincode: PincodeData | null
  ) => {
    const parts = [];
    if (pincode) parts.push(`${pincode.postOfficeName} (${pincode.pincode})`);
    if (city) parts.push(city.name);
    if (state) parts.push(state.name);
    if (country) parts.push(country.name);

    if (onLocationSelect) {
      onLocationSelect({
        country,
        state,
        city,
        pincode,
        fullAddressString: parts.join(', ')
      });
    }
  };

  // Filtered dropdown lists
  const filteredCountries = countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
  const filteredStates = states.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()));
  const filteredCities = cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()));
  const filteredPincodes = pincodes.filter(p =>
    p.postOfficeName.toLowerCase().includes(pincodeSearch.toLowerCase()) ||
    p.pincode.toString().includes(pincodeSearch) ||
    p.district.toLowerCase().includes(pincodeSearch.toLowerCase())
  );

  return (
    <div className={`p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400 animate-spin-slow" />
            Dynamic Cascading Location Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select Country → State → City → Area Pincode with real-time API lookup.
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 w-fit">
          4-Stage Dynamic API
        </span>
      </div>

      {/* Grid of 4 Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* STAGE 1: COUNTRY */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" /> 1. Country
            </span>
            {loadingCountries && <RefreshCw className="w-3 h-3 text-purple-400 animate-spin" />}
          </label>

          <div className="relative">
            <select
              value={selectedCountry?.id || ''}
              onChange={e => {
                const found = countries.find(c => c.id === parseInt(e.target.value, 10));
                if (found) handleSelectCountry(found);
              }}
              disabled={loadingCountries}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold focus:border-purple-500 focus:outline-none transition-all disabled:opacity-50"
            >
              <option value="">-- Select Country --</option>
              {filteredCountries.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.sortname})
                </option>
              ))}
            </select>
          </div>
          {selectedCountry && (
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Selected: {selectedCountry.name} (+{selectedCountry.phonecode})
            </p>
          )}
        </div>

        {/* STAGE 2: STATE */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-400" /> 2. State / Province
            </span>
            {loadingStates && <RefreshCw className="w-3 h-3 text-purple-400 animate-spin" />}
          </label>

          <div className="relative">
            <select
              value={selectedState?.id || ''}
              onChange={e => {
                const found = states.find(s => s.id === parseInt(e.target.value, 10));
                if (found) handleSelectState(found);
              }}
              disabled={!selectedCountry || loadingStates}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold focus:border-purple-500 focus:outline-none transition-all disabled:opacity-50"
            >
              <option value="">-- Select State ({states.length}) --</option>
              {filteredStates.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          {selectedState ? (
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Selected State: {selectedState.name}
            </p>
          ) : (
            <p className="text-[10px] text-slate-500 italic">Select country first</p>
          )}
        </div>

        {/* STAGE 3: CITY */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-pink-400" /> 3. City / Hub
            </span>
            {loadingCities && <RefreshCw className="w-3 h-3 text-purple-400 animate-spin" />}
          </label>

          <div className="relative">
            <select
              value={selectedCity?.id || ''}
              onChange={e => {
                const found = cities.find(c => c.id === parseInt(e.target.value, 10));
                if (found) handleSelectCity(found);
              }}
              disabled={!selectedState || loadingCities}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold focus:border-purple-500 focus:outline-none transition-all disabled:opacity-50"
            >
              <option value="">-- Select City ({cities.length}) --</option>
              {filteredCities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCity ? (
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Selected City: {selectedCity.name}
            </p>
          ) : (
            <p className="text-[10px] text-slate-500 italic">Select state first</p>
          )}
        </div>

        {/* STAGE 4: PINCODE / AREA */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" /> 4. Area Pincode
            </span>
            {loadingPincodes && <RefreshCw className="w-3 h-3 text-purple-400 animate-spin" />}
          </label>

          <div className="relative">
            <select
              value={selectedPincode ? `${selectedPincode.pincode}-${selectedPincode.postOfficeName}` : ''}
              onChange={e => {
                const val = e.target.value;
                const found = pincodes.find(p => `${p.pincode}-${p.postOfficeName}` === val);
                if (found) handleSelectPincode(found);
              }}
              disabled={!selectedCity || loadingPincodes}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold focus:border-purple-500 focus:outline-none transition-all disabled:opacity-50"
            >
              <option value="">-- Select Area Pincode ({pincodes.length}) --</option>
              {filteredPincodes.map((p, idx) => (
                <option key={idx} value={`${p.pincode}-${p.postOfficeName}`}>
                  {p.pincode} - {p.postOfficeName} ({p.district})
                </option>
              ))}
            </select>
          </div>
          {selectedPincode ? (
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Pincode: {selectedPincode.pincode} ({selectedPincode.postOfficeName})
            </p>
          ) : (
            <p className="text-[10px] text-slate-500 italic">Select city first</p>
          )}
        </div>
      </div>

      {/* RESULT BREADCRUMB CARD */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
          Active Location Cascade Resolution
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 flex items-center gap-1">
            <Globe className="w-3 h-3" /> {selectedCountry ? selectedCountry.name : 'Country'}
          </span>
          <span className="text-slate-600 font-bold">→</span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1">
            <Building2 className="w-3 h-3" /> {selectedState ? selectedState.name : 'State'}
          </span>
          <span className="text-slate-600 font-bold">→</span>
          <span className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {selectedCity ? selectedCity.name : 'City'}
          </span>
          <span className="text-slate-600 font-bold">→</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
            <Mail className="w-3 h-3" /> {selectedPincode ? `${selectedPincode.postOfficeName} - ${selectedPincode.pincode}` : 'Pincode'}
          </span>
        </div>
      </div>

    </div>
  );
}
