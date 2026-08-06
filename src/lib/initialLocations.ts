import { LocationItem } from './types';

export const INITIAL_LOCATIONS: LocationItem[] = [
  {
    id: 'loc-1',
    name: 'San Francisco',
    state: 'CA',
    country: 'United States',
    countryCode: 'US',
    tier: 'TIER_1_METRO',
    riskTier: 'LOW',
    surgePricingMultiplier: 1.25,
    isActive: true,
    companionCount: 48,
    coordinates: { lat: 37.7749, lng: -122.4194 },
    coverImageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
    geofencedZones: [
      { id: 'gz-101', name: 'Downtown Financial Hub', radiusKm: 3.5, safetyScore: 96, venueTypes: ['Boutique Hotels', 'Fine Dining', 'Tech Summits'] },
      { id: 'gz-102', name: 'Fisherman Wharf Promenade', radiusKm: 2.0, safetyScore: 92, venueTypes: ['Public Pier', 'Sightseeing', 'Seafood Bistros'] },
      { id: 'gz-103', name: 'SoMa Innovation District', radiusKm: 4.0, safetyScore: 88, venueTypes: ['Art Galleries', 'Co-working Lounges'] }
    ],
    popularVenues: [
      { id: 'pv-1', name: 'The Fairmont San Francisco', address: '950 Mason St, San Francisco, CA', category: 'Luxury Hotel & Lounge', safetyRating: 4.9, isPartnerVenue: true },
      { id: 'pv-2', name: 'Palace of Fine Arts', address: '3301 Lyon St, San Francisco, CA', category: 'Cultural Landmark', safetyRating: 4.8, isPartnerVenue: true },
      { id: 'pv-3', name: 'Salesforce Transit Sky Park', address: '425 Mission St, San Francisco, CA', category: 'Public Urban Park', safetyRating: 4.7, isPartnerVenue: false }
    ],
    emergencyContactPhone: '+1 (415) 553-0123',
    policeHelpline: '911 / SFPD Security Central',
    safetyProtocolNotes: 'Public venue mandate active. 24/7 Live GPS tracking required for all meetup sessions.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'loc-2',
    name: 'New York City',
    state: 'NY',
    country: 'United States',
    countryCode: 'US',
    tier: 'TIER_1_METRO',
    riskTier: 'MEDIUM',
    surgePricingMultiplier: 1.5,
    isActive: true,
    companionCount: 84,
    coordinates: { lat: 40.7128, lng: -74.0060 },
    coverImageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80',
    geofencedZones: [
      { id: 'gz-201', name: 'Midtown Manhattan Gala Zone', radiusKm: 5.0, safetyScore: 94, venueTypes: ['Broadway Theatres', 'Rooftop Lounges', 'Gala Halls'] },
      { id: 'gz-202', name: 'Hudson Yards Promenade', radiusKm: 2.5, safetyScore: 95, venueTypes: ['High-end Malls', 'Art Exhibitions'] }
    ],
    popularVenues: [
      { id: 'pv-4', name: 'The Plaza Hotel Fifth Avenue', address: '768 5th Ave, New York, NY', category: 'Luxury Hotel', safetyRating: 5.0, isPartnerVenue: true },
      { id: 'pv-5', name: 'Metropolitan Museum of Art', address: '1000 5th Ave, New York, NY', category: 'Museum', safetyRating: 4.9, isPartnerVenue: true }
    ],
    emergencyContactPhone: '+1 (212) 334-0611',
    policeHelpline: '911 / NYPD Midtown Precinct',
    safetyProtocolNotes: 'High-density zone. Mandatory companion check-in every 45 minutes via Sathi mobile app.',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-08-03T00:00:00Z'
  },
  {
    id: 'loc-3',
    name: 'Tokyo',
    state: 'Kanto',
    country: 'Japan',
    countryCode: 'JP',
    tier: 'TIER_1_METRO',
    riskTier: 'LOW',
    surgePricingMultiplier: 1.0,
    isActive: true,
    companionCount: 62,
    coordinates: { lat: 35.6762, lng: 139.6503 },
    coverImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    geofencedZones: [
      { id: 'gz-301', name: 'Ginza High-Street Luxury District', radiusKm: 3.0, safetyScore: 99, venueTypes: ['Fine Dining', 'Boutique Shopping'] },
      { id: 'gz-302', name: 'Roppongi Hills Cultural Complex', radiusKm: 2.5, safetyScore: 98, venueTypes: ['Observation Decks', 'Museums'] }
    ],
    popularVenues: [
      { id: 'pv-6', name: 'Park Hyatt Tokyo', address: '3-7-1-2 Nishi-Shinjuku, Tokyo', category: 'Hotel & Lounge', safetyRating: 4.9, isPartnerVenue: true },
      { id: 'pv-7', name: 'Mori Art Museum', address: '6-10-1 Roppongi, Minato City, Tokyo', category: 'Museum', safetyRating: 4.8, isPartnerVenue: true }
    ],
    emergencyContactPhone: '+81 3-3581-4321',
    policeHelpline: '110 / Tokyo Metropolitan Police',
    safetyProtocolNotes: 'Japanese multilingual companions available. Standard low-risk safety guidelines.',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-08-04T00:00:00Z'
  },
  {
    id: 'loc-4',
    name: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    countryCode: 'GB',
    tier: 'TIER_1_METRO',
    riskTier: 'LOW',
    surgePricingMultiplier: 1.2,
    isActive: true,
    companionCount: 55,
    coordinates: { lat: 51.5074, lng: -0.1278 },
    coverImageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80',
    geofencedZones: [
      { id: 'gz-401', name: 'Mayfair & West End Cultural Zone', radiusKm: 4.0, safetyScore: 96, venueTypes: ['West End Theatre', 'Private Clubs'] }
    ],
    popularVenues: [
      { id: 'pv-8', name: 'The Ritz London', address: '150 Piccadilly, London W1J 9BR', category: 'Luxury Hotel', safetyRating: 4.9, isPartnerVenue: true }
    ],
    emergencyContactPhone: '+44 20 7230 1212',
    policeHelpline: '999 / Metropolitan Police',
    safetyProtocolNotes: 'UK police clearance required for all registered companion hosts in London area.',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-08-02T00:00:00Z'
  },
  {
    id: 'loc-5',
    name: 'Paris',
    state: 'Île-de-France',
    country: 'France',
    countryCode: 'FR',
    tier: 'TIER_1_METRO',
    riskTier: 'MEDIUM',
    surgePricingMultiplier: 1.15,
    isActive: true,
    companionCount: 40,
    coordinates: { lat: 48.8566, lng: 2.3522 },
    coverImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
    geofencedZones: [
      { id: 'gz-501', name: 'Champs-Élysées Promenade', radiusKm: 3.0, safetyScore: 93, venueTypes: ['Fashion Outlets', 'Bistros'] }
    ],
    popularVenues: [
      { id: 'pv-9', name: 'Le Meurice', address: '228 Rue de Rivoli, 75001 Paris', category: 'Palace Hotel', safetyRating: 4.8, isPartnerVenue: true }
    ],
    emergencyContactPhone: '+33 1 40 57 57 57',
    policeHelpline: '17 / Police Nationale',
    safetyProtocolNotes: 'French language preference and guided tour authorization required for travel buddy companion bookings.',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'loc-6',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    countryCode: 'IN',
    tier: 'TIER_1_METRO',
    riskTier: 'MEDIUM',
    surgePricingMultiplier: 1.3,
    isActive: true,
    companionCount: 78,
    coordinates: { lat: 19.0760, lng: 72.8777 },
    coverImageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    geofencedZones: [
      { id: 'gz-601', name: 'South Mumbai Heritage Corridor', radiusKm: 6.0, safetyScore: 92, venueTypes: ['Art Galleries', 'Seafront Hotels'] },
      { id: 'gz-602', name: 'Bandra West Cultural District', radiusKm: 4.0, safetyScore: 90, venueTypes: ['Cafes', 'Shopping Hubs'] }
    ],
    popularVenues: [
      { id: 'pv-10', name: 'The Taj Mahal Palace', address: 'Apollo Bandar, Colaba, Mumbai', category: 'Heritage Hotel', safetyRating: 4.9, isPartnerVenue: true },
      { id: 'pv-11', name: 'National Centre for Performing Arts (NCPA)', address: 'Nariman Point, Mumbai', category: 'Performing Arts Venue', safetyRating: 4.8, isPartnerVenue: true }
    ],
    emergencyContactPhone: '+91 22 2262 1855',
    policeHelpline: '100 / 112 Mumbai Police SOS',
    safetyProtocolNotes: 'Aadhaar government verification required for both client and companion prior to meeting confirmation.',
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-08-05T00:00:00Z'
  }
];
