import fs from 'fs';
import path from 'path';

export interface CountryData {
  id: number;
  sortname: string;
  name: string;
  phonecode: number;
}

export interface StateData {
  id: number;
  name: string;
  country_id: number;
}

export interface CityData {
  id: number;
  name: string;
  state_id: number;
}

export interface PincodeData {
  postOfficeName: string;
  pincode: number;
  city: string;
  district: string;
  state: string;
}

// In-memory cache for parsed location data
let cachedCountries: CountryData[] | null = null;
let cachedStates: StateData[] | null = null;
let cachedCities: CityData[] | null = null;
let cachedPincodes: PincodeData[] | null = null;

const CITY_STATE_DIR = path.join(process.cwd(), 'city_state');

/**
 * Parse countries.sql
 */
export function getCountries(): CountryData[] {
  if (cachedCountries) return cachedCountries;

  try {
    const filePath = path.join(CITY_STATE_DIR, 'countries.sql');
    if (!fs.existsSync(filePath)) return getDefaultCountries();

    const sqlContent = fs.readFileSync(filePath, 'utf-8');
    const insertMatches = sqlContent.matchAll(/\((\d+),\s*'([^']*)',\s*'([^']*)',\s*(\d+)\)/g);
    const result: CountryData[] = [];

    for (const match of insertMatches) {
      result.push({
        id: parseInt(match[1], 10),
        sortname: match[2],
        name: match[3],
        phonecode: parseInt(match[4], 10)
      });
    }

    if (result.length > 0) {
      cachedCountries = result;
      return result;
    }
  } catch (err) {
    console.error('Error parsing countries.sql:', err);
  }

  return getDefaultCountries();
}

/**
 * Parse states.sql
 */
export function getStatesByCountry(countryId: number): StateData[] {
  const allStates = getAllStates();
  return allStates.filter(s => s.country_id === countryId);
}

export function getAllStates(): StateData[] {
  if (cachedStates) return cachedStates;

  try {
    const filePath = path.join(CITY_STATE_DIR, 'states.sql');
    if (!fs.existsSync(filePath)) return getDefaultStates();

    const sqlContent = fs.readFileSync(filePath, 'utf-8');
    const insertMatches = sqlContent.matchAll(/\((\d+),\s*('([^'\\]*(?:\\.[^'\\]*)*)'|'''''|'[^']*'),\s*(\d+)\)/g);
    const result: StateData[] = [];

    for (const match of insertMatches) {
      let stateName = match[2];
      if (stateName.startsWith("'") && stateName.endsWith("'")) {
        stateName = stateName.slice(1, -1).replace(/''/g, "'");
      }
      result.push({
        id: parseInt(match[1], 10),
        name: stateName,
        country_id: parseInt(match[4], 10)
      });
    }

    if (result.length > 0) {
      cachedStates = result;
      return result;
    }
  } catch (err) {
    console.error('Error parsing states.sql:', err);
  }

  return getDefaultStates();
}

/**
 * Parse cities.sql
 */
export function getCitiesByState(stateId: number): CityData[] {
  const allCities = getAllCities();
  return allCities.filter(c => c.state_id === stateId);
}

export function getAllCities(): CityData[] {
  if (cachedCities) return cachedCities;

  try {
    const filePath = path.join(CITY_STATE_DIR, 'cities.sql');
    if (!fs.existsSync(filePath)) return getDefaultCities();

    const sqlContent = fs.readFileSync(filePath, 'utf-8');
    const insertMatches = sqlContent.matchAll(/\((\d+),\s*'([^']*)',\s*(\d+)\)/g);
    const result: CityData[] = [];

    for (const match of insertMatches) {
      result.push({
        id: parseInt(match[1], 10),
        name: match[2],
        state_id: parseInt(match[3], 10)
      });
    }

    if (result.length > 0) {
      cachedCities = result;
      return result;
    }
  } catch (err) {
    console.error('Error parsing cities.sql:', err);
  }

  return getDefaultCities();
}

/**
 * Parse pincode.sql
 */
export function getPincodes(city?: string, state?: string, search?: string): PincodeData[] {
  const allPincodes = getAllPincodes();
  let filtered = allPincodes;

  if (city) {
    const cLower = city.toLowerCase();
    filtered = filtered.filter(p => p.city.toLowerCase().includes(cLower) || cLower.includes(p.city.toLowerCase()));
  }

  if (state) {
    const sLower = state.toLowerCase();
    filtered = filtered.filter(p => p.state.toLowerCase().includes(sLower) || sLower.includes(p.state.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.postOfficeName.toLowerCase().includes(q) ||
      p.pincode.toString().includes(q) ||
      p.district.toLowerCase().includes(q)
    );
  }

  return filtered.slice(0, 100); // Limit to top 100 results for speed
}

export function getAllPincodes(): PincodeData[] {
  if (cachedPincodes) return cachedPincodes;

  try {
    const filePath = path.join(CITY_STATE_DIR, 'pincode.sql');
    if (!fs.existsSync(filePath)) return getDefaultPincodes();

    const sqlContent = fs.readFileSync(filePath, 'utf-8');
    const matches = sqlContent.matchAll(/\(\s*'([^']*)',\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'\s*\)/g);
    const result: PincodeData[] = [];

    for (const match of matches) {
      result.push({
        postOfficeName: match[1],
        pincode: parseInt(match[2], 10),
        city: match[3],
        district: match[4],
        state: match[5]
      });
    }

    if (result.length > 0) {
      cachedPincodes = result;
      return result;
    }
  } catch (err) {
    console.error('Error parsing pincode.sql:', err);
  }

  return getDefaultPincodes();
}

// Fallbacks if SQL reading fails
function getDefaultCountries(): CountryData[] {
  return [
    { id: 101, sortname: 'IN', name: 'India', phonecode: 91 },
    { id: 231, sortname: 'US', name: 'United States', phonecode: 1 },
    { id: 230, sortname: 'GB', name: 'United Kingdom', phonecode: 44 },
    { id: 13, sortname: 'AU', name: 'Australia', phonecode: 61 },
    { id: 38, sortname: 'CA', name: 'Canada', phonecode: 1 },
    { id: 229, sortname: 'AE', name: 'United Arab Emirates', phonecode: 971 }
  ];
}

function getDefaultStates(): StateData[] {
  return [
    { id: 22, name: 'Maharashtra', country_id: 101 },
    { id: 10, name: 'Delhi', country_id: 101 },
    { id: 17, name: 'Karnataka', country_id: 101 },
    { id: 35, name: 'Tamil Nadu', country_id: 101 },
    { id: 38, name: 'Uttar Pradesh', country_id: 101 },
    { id: 12, name: 'Gujarat', country_id: 101 },
    { id: 41, name: 'West Bengal', country_id: 101 },
    { id: 36, name: 'Telangana', country_id: 101 },
    { id: 33, name: 'Rajasthan', country_id: 101 },
    { id: 19, name: 'Kerala', country_id: 101 }
  ];
}

function getDefaultCities(): CityData[] {
  return [
    { id: 1, name: 'Mumbai', state_id: 22 },
    { id: 2, name: 'Pune', state_id: 22 },
    { id: 3, name: 'Nagpur', state_id: 22 },
    { id: 4, name: 'New Delhi', state_id: 10 },
    { id: 5, name: 'Bengaluru', state_id: 17 },
    { id: 6, name: 'Chennai', state_id: 35 },
    { id: 7, name: 'Noida', state_id: 38 },
    { id: 8, name: 'Ahmedabad', state_id: 12 },
    { id: 9, name: 'Kolkata', state_id: 41 },
    { id: 10, name: 'Hyderabad', state_id: 36 }
  ];
}

function getDefaultPincodes(): PincodeData[] {
  return [
    { postOfficeName: 'Connaught Place', pincode: 110001, city: 'New Delhi', district: 'New Delhi', state: 'Delhi' },
    { postOfficeName: 'Nariman Point', pincode: 400021, city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra' },
    { postOfficeName: 'Bandra West', pincode: 400050, city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra' },
    { postOfficeName: 'Koramanagala', pincode: 560034, city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' },
    { postOfficeName: 'T Nagar', pincode: 600017, city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' }
  ];
}
