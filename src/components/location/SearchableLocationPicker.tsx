'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Globe, Building2, MapPin, Mail, Search, ChevronDown, Check, X, RefreshCw } from 'lucide-react';
import { CountryData, StateData, CityData, PincodeData } from '@/lib/locationService';

export interface LocationSelection {
  country: string;
  state: string;
  city: string;
  pincode: string;
  postOffice?: string;
  district?: string;
}

interface Props {
  initialCountry?: string;
  initialState?: string;
  initialCity?: string;
  initialPincode?: string;
  onChange: (loc: LocationSelection) => void;
  showPincode?: boolean;
  className?: string;
}

export function SearchableLocationPicker({
  initialCountry = '',
  initialState = '',
  initialCity = '',
  initialPincode = '',
  onChange,
  showPincode = true,
  className = ''
}: Props) {
  // Data lists
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [states, setStates] = useState<StateData[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [pincodes, setPincodes] = useState<PincodeData[]>([]);

  // Selected object/values
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [selectedPincode, setSelectedPincode] = useState<PincodeData | null>(null);

  // Text values for display & fallback
  const [countryText, setCountryText] = useState(initialCountry);
  const [stateText, setStateText] = useState(initialState);
  const [cityText, setCityText] = useState(initialCity);
  const [pincodeText, setPincodeText] = useState(initialPincode);

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<'country' | 'state' | 'city' | 'pincode' | null>(null);

  // Loaders
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPincodes, setLoadingPincodes] = useState(false);

  // Search queries for dropdowns
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [pincodeSearch, setPincodeSearch] = useState('');

  // Refs for click outside
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initial props if they change
  useEffect(() => {
    if (initialCountry) setCountryText(initialCountry);
    if (initialState) setStateText(initialState);
    if (initialCity) setCityText(initialCity);
    if (initialPincode) setPincodeText(initialPincode);
  }, [initialCountry, initialState, initialCity, initialPincode]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Countries on initial load
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

        // Pre-select initial country or default to India (101)
        let match = null;
        if (initialCountry) {
          match = data.data.find((c: CountryData) => c.name.toLowerCase() === initialCountry.toLowerCase() || c.sortname.toLowerCase() === initialCountry.toLowerCase());
        }
        if (!match) {
          match = data.data.find((c: CountryData) => c.id === 101 || c.name.toLowerCase() === 'india');
        }
        if (match) {
          setSelectedCountry(match);
          setCountryText(match.name);
          fetchStates(match.id);
        }
      }
    } catch (e) {
      console.error('Failed to load countries', e);
    } finally {
      setLoadingCountries(false);
    }
  };

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
        if (initialState) {
          const matchState = data.data.find((s: StateData) => s.name.toLowerCase() === initialState.toLowerCase());
          if (matchState) {
            setSelectedState(matchState);
            setStateText(matchState.name);
            fetchCities(matchState.id);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load states', e);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (stateId: number) => {
    setLoadingCities(true);
    setCities([]);
    setPincodes([]);
    try {
      const res = await fetch(`/api/location/cities?stateId=${stateId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCities(data.data);
        if (initialCity) {
          const matchCity = data.data.find((c: CityData) => c.name.toLowerCase() === initialCity.toLowerCase());
          if (matchCity) {
            setSelectedCity(matchCity);
            setCityText(matchCity.name);
            fetchPincodes(matchCity.name, selectedState?.name);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load cities', e);
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchPincodes = async (cityName: string, stateName?: string) => {
    setLoadingPincodes(true);
    setPincodes([]);
    try {
      const q = new URLSearchParams();
      if (cityName) q.append('city', cityName);
      if (stateName) q.append('state', stateName);

      const res = await fetch(`/api/location/pincodes?${q.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPincodes(data.data);
      }
    } catch (e) {
      console.error('Failed to load pincodes', e);
    } finally {
      setLoadingPincodes(false);
    }
  };

  // Handlers for user selections
  const handleSelectCountry = (country: CountryData) => {
    setSelectedCountry(country);
    setCountryText(country.name);
    setSelectedState(null);
    setStateText('');
    setSelectedCity(null);
    setCityText('');
    setSelectedPincode(null);
    setPincodeText('');
    setOpenDropdown(null);
    setCountrySearch('');

    fetchStates(country.id);
    emitChange(country.name, '', '', '');
  };

  const handleSelectState = (state: StateData) => {
    setSelectedState(state);
    setStateText(state.name);
    setSelectedCity(null);
    setCityText('');
    setSelectedPincode(null);
    setPincodeText('');
    setOpenDropdown(null);
    setStateSearch('');

    fetchCities(state.id);
    emitChange(countryText, state.name, '', '');
  };

  const handleSelectCity = (city: CityData) => {
    setSelectedCity(city);
    setCityText(city.name);
    setSelectedPincode(null);
    setPincodeText('');
    setOpenDropdown(null);
    setCitySearch('');

    if (selectedState) {
      fetchPincodes(city.name, selectedState.name);
    } else {
      fetchPincodes(city.name);
    }
    emitChange(countryText, stateText, city.name, '');
  };

  const handleSelectPincode = (pincodeItem: PincodeData) => {
    setSelectedPincode(pincodeItem);
    const pinStr = `${pincodeItem.postOfficeName} (${pincodeItem.pincode})`;
    setPincodeText(pinStr);
    setOpenDropdown(null);
    setPincodeSearch('');

    emitChange(countryText, stateText, cityText, pinStr, pincodeItem.postOfficeName, pincodeItem.district);
  };

  const emitChange = (
    c: string,
    s: string,
    ct: string,
    p: string,
    postOffice?: string,
    district?: string
  ) => {
    onChange({
      country: c,
      state: s,
      city: ct,
      pincode: p,
      postOffice,
      district
    });
  };

  // Filter lists
  const filteredCountries = countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.sortname.toLowerCase().includes(countrySearch.toLowerCase()));
  const filteredStates = states.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()));
  const filteredCities = cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()));
  const filteredPincodes = pincodes.filter(p =>
    p.postOfficeName.toLowerCase().includes(pincodeSearch.toLowerCase()) ||
    p.pincode.toString().includes(pincodeSearch) ||
    p.district.toLowerCase().includes(pincodeSearch.toLowerCase())
  );

  return (
    <div className={`space-y-4 ${className}`} ref={containerRef}>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* 1. COUNTRY DROPDOWN */}
        <div className="relative">
          <label className="block text-xs font-extrabold text-purple-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-purple-600" /> Country <span className="text-rose-500">*</span>
            </span>
            {loadingCountries && <RefreshCw className="w-3.5 h-3.5 text-purple-600 animate-spin" />}
          </label>

          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'country' ? null : 'country')}
            className={`w-full px-3.5 py-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
              countryText
                ? 'bg-white border-2 border-purple-500 shadow-sm'
                : 'bg-white border border-slate-300'
            } hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
          >
            <span className={`truncate text-sm ${countryText ? '!text-slate-900 font-extrabold' : '!text-slate-500 font-medium'}`} style={{ color: countryText ? '#0f172a' : '#64748b' }}>
              {countryText || 'Search Country...'}
            </span>
            <ChevronDown className={`w-4 h-4 text-purple-600 shrink-0 transition-transform ${openDropdown === 'country' ? 'rotate-180' : ''}`} />
          </button>

          {/* Popover */}
          {openDropdown === 'country' && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-[100] rounded-2xl bg-slate-950 border-2 border-purple-500 shadow-2xl p-2.5 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              <div className="relative sticky top-0 bg-slate-950 z-10 pb-2 pt-0.5">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type to search country..."
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs !text-white placeholder:!text-slate-400 focus:outline-none focus:border-purple-500 font-bold shadow-inner"
                  style={{ color: '#ffffff', backgroundColor: '#0f172a' }}
                />
              </div>

              <div className="space-y-1">
                {filteredCountries.length === 0 ? (
                  <p className="text-xs !text-slate-400 p-3 text-center font-bold">No matching countries</p>
                ) : (
                  filteredCountries.map(c => {
                    const isSelected = selectedCountry?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCountry(c)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all group ${
                          isSelected
                            ? 'bg-purple-600 !text-white font-black shadow-md border border-purple-400'
                            : 'bg-slate-900 hover:bg-purple-600 !text-white font-extrabold border border-slate-800'
                        }`}
                        style={{ color: '#ffffff', backgroundColor: isSelected ? '#9333ea' : '#0f172a' }}
                      >
                        <span className="truncate font-extrabold" style={{ color: '#ffffff' }}>{c.name}</span>
                        <span className="font-mono text-[10px] font-bold text-purple-300">+{c.phonecode}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. STATE DROPDOWN */}
        <div className="relative">
          <label className="block text-xs font-extrabold text-purple-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-purple-600" /> State / Province
            </span>
            {loadingStates && <RefreshCw className="w-3.5 h-3.5 text-purple-600 animate-spin" />}
          </label>

          <button
            type="button"
            disabled={!selectedCountry}
            onClick={() => setOpenDropdown(openDropdown === 'state' ? null : 'state')}
            className={`w-full px-3.5 py-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
              stateText
                ? 'bg-white border-2 border-purple-500 shadow-sm'
                : 'bg-white border border-slate-300'
            } hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className={`truncate text-sm ${stateText ? '!text-slate-900 font-extrabold' : '!text-slate-500 font-medium'}`} style={{ color: stateText ? '#0f172a' : '#64748b' }}>
              {stateText || (selectedCountry ? 'Search State...' : 'Select Country first')}
            </span>
            <ChevronDown className={`w-4 h-4 text-purple-600 shrink-0 transition-transform ${openDropdown === 'state' ? 'rotate-180' : ''}`} />
          </button>

          {/* Popover */}
          {openDropdown === 'state' && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-[100] rounded-2xl bg-slate-950 border-2 border-purple-500 shadow-2xl p-2.5 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              <div className="relative sticky top-0 bg-slate-950 z-10 pb-2 pt-0.5">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type to search state..."
                  value={stateSearch}
                  onChange={e => setStateSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs !text-white placeholder:!text-slate-400 focus:outline-none focus:border-purple-500 font-bold shadow-inner"
                  style={{ color: '#ffffff', backgroundColor: '#0f172a' }}
                />
              </div>

              <div className="space-y-1">
                {filteredStates.length === 0 ? (
                  <p className="text-xs !text-slate-400 p-3 text-center font-bold">No matching states</p>
                ) : (
                  filteredStates.map(s => {
                    const isSelected = selectedState?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectState(s)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all group ${
                          isSelected
                            ? 'bg-purple-600 !text-white font-black shadow-md border border-purple-400'
                            : 'bg-slate-900 hover:bg-purple-600 !text-white font-extrabold border border-slate-800'
                        }`}
                        style={{ color: '#ffffff', backgroundColor: isSelected ? '#9333ea' : '#0f172a' }}
                      >
                        <span className="truncate font-extrabold" style={{ color: '#ffffff' }}>{s.name}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. CITY DROPDOWN */}
        <div className="relative">
          <label className="block text-xs font-extrabold text-purple-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-purple-600" /> City / Hub <span className="text-rose-500">*</span>
            </span>
            {loadingCities && <RefreshCw className="w-3.5 h-3.5 text-purple-600 animate-spin" />}
          </label>

          <button
            type="button"
            disabled={!selectedState}
            onClick={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}
            className={`w-full px-3.5 py-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
              cityText
                ? 'bg-white border-2 border-purple-500 shadow-sm'
                : 'bg-white border border-slate-300'
            } hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className={`truncate text-sm ${cityText ? '!text-slate-900 font-extrabold' : '!text-slate-500 font-medium'}`} style={{ color: cityText ? '#0f172a' : '#64748b' }}>
              {cityText || (selectedState ? 'Search City...' : 'Select State first')}
            </span>
            <ChevronDown className={`w-4 h-4 text-purple-600 shrink-0 transition-transform ${openDropdown === 'city' ? 'rotate-180' : ''}`} />
          </button>

          {/* Popover */}
          {openDropdown === 'city' && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-[100] rounded-2xl bg-slate-950 border-2 border-purple-500 shadow-2xl p-2.5 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              <div className="relative sticky top-0 bg-slate-950 z-10 pb-2 pt-0.5">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type to search city..."
                  value={citySearch}
                  onChange={e => setCitySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs !text-white placeholder:!text-slate-400 focus:outline-none focus:border-purple-500 font-bold shadow-inner"
                  style={{ color: '#ffffff', backgroundColor: '#0f172a' }}
                />
              </div>

              <div className="space-y-1">
                {filteredCities.length === 0 ? (
                  <p className="text-xs !text-slate-400 p-3 text-center font-bold">No matching cities</p>
                ) : (
                  filteredCities.map(c => {
                    const isSelected = selectedCity?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCity(c)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all group ${
                          isSelected
                            ? 'bg-purple-600 !text-white font-black shadow-md border border-purple-400'
                            : 'bg-slate-900 hover:bg-purple-600 !text-white font-extrabold border border-slate-800'
                        }`}
                        style={{ color: '#ffffff', backgroundColor: isSelected ? '#9333ea' : '#0f172a' }}
                      >
                        <span className="truncate font-extrabold" style={{ color: '#ffffff' }}>{c.name}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. PINCODE / AREA DROPDOWN */}
        {showPincode && (
          <div className="relative">
            <label className="block text-xs font-extrabold text-emerald-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-600" /> Area Pincode
              </span>
              {loadingPincodes && <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />}
            </label>

            <button
              type="button"
              disabled={!selectedCity}
              onClick={() => setOpenDropdown(openDropdown === 'pincode' ? null : 'pincode')}
              className={`w-full px-3.5 py-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                pincodeText
                  ? 'bg-white border-2 border-emerald-500 shadow-sm'
                  : 'bg-white border border-slate-300'
              } hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className={`truncate text-sm ${pincodeText ? '!text-emerald-700 font-extrabold' : '!text-slate-500 font-medium'}`} style={{ color: pincodeText ? '#047857' : '#64748b' }}>
                {pincodeText || (selectedCity ? 'Search Area Pincode...' : 'Select City first')}
              </span>
              <ChevronDown className={`w-4 h-4 text-emerald-600 shrink-0 transition-transform ${openDropdown === 'pincode' ? 'rotate-180' : ''}`} />
            </button>

            {/* Popover */}
            {openDropdown === 'pincode' && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-[100] rounded-2xl bg-slate-950 border-2 border-emerald-500 shadow-2xl p-2.5 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                <div className="relative sticky top-0 bg-slate-950 z-10 pb-2 pt-0.5">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Type pincode or post office..."
                    value={pincodeSearch}
                    onChange={e => setPincodeSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs !text-white placeholder:!text-slate-400 focus:outline-none focus:border-emerald-500 font-bold shadow-inner"
                    style={{ color: '#ffffff', backgroundColor: '#0f172a' }}
                  />
                </div>

                <div className="space-y-1">
                  {filteredPincodes.length === 0 ? (
                    <p className="text-xs !text-slate-400 p-3 text-center font-bold">No matching pincodes</p>
                  ) : (
                    filteredPincodes.map((p, idx) => {
                      const isSelected = selectedPincode?.pincode === p.pincode;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPincode(p)}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all group ${
                            isSelected
                              ? 'bg-emerald-600 !text-white font-black shadow-md border border-emerald-400'
                              : 'bg-slate-900 hover:bg-emerald-600 !text-white font-extrabold border border-slate-800'
                          }`}
                          style={{ color: '#ffffff', backgroundColor: isSelected ? '#059669' : '#0f172a' }}
                        >
                          <span className="truncate font-extrabold" style={{ color: '#ffffff' }}>{p.postOfficeName}</span>
                          <span className="font-mono text-[10px] font-bold text-emerald-400">{p.pincode}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );

}
