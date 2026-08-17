import { ServiceCategory } from './types';

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'c-1',
    name: 'Event & Hospitality',
    slug: 'event-hospitality',
    description: 'Professional support for events, gatherings and hospitality needs.',
    iconName: 'Users',
    bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'LOW',
    baseRateMultiplier: 1.2,
    minAgeLimit: 21,
    isFeatured: true,
    isActive: true,
    companionCount: 24,
    safetyPolicy: 'Public venues only. Mandatory emergency check-in every 2 hours.',
    createdAt: '2026-01-10',
    subcategories: [
      { id: 'sub-101', name: 'Event Setup', description: 'Professional setup & venue assistance', basePrice: 80, requiredVerification: true },
      { id: 'sub-102', name: 'Guest Relations', description: 'Polite guest welcoming and social presence', basePrice: 73, requiredVerification: true }
    ]
  },
  {
    id: 'c-2',
    name: 'Travel & Exploration',
    slug: 'travel-exploration',
    description: 'Assistance for trips, tours and exploration experiences.',
    iconName: 'MapPin',
    bannerUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'MEDIUM',
    baseRateMultiplier: 1.15,
    minAgeLimit: 21,
    isFeatured: true,
    isActive: true,
    companionCount: 15,
    safetyPolicy: 'GPS live tracking enabled during city tours. Emergency SOS button active.',
    createdAt: '2026-01-15',
    subcategories: [
      { id: 'sub-201', name: 'Local Guidance', description: 'In-depth local sightseeing and neighborhood tours', basePrice: 77, requiredVerification: true },
      { id: 'sub-202', name: 'Trip Planning', description: 'Itinerary assistance & route guidance', basePrice: 86, requiredVerification: true }
    ]
  },
  {
    id: 'c-3',
    name: 'Elderly Care',
    slug: 'elderly-care',
    description: 'Compassionate care and support senior citizens.',
    iconName: 'Heart',
    bannerUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'LOW',
    baseRateMultiplier: 1.0,
    minAgeLimit: 25,
    isFeatured: true,
    isActive: true,
    companionCount: 16,
    safetyPolicy: 'Police verification & medical background check mandatory.',
    createdAt: '2026-02-01',
    subcategories: [
      { id: 'sub-301', name: 'Personal Care', description: 'Doctor visit escort and practical assistance', basePrice: 86, requiredVerification: true },
      { id: 'sub-302', name: 'Companionship', description: 'Outdoor walking & friendly conversation', basePrice: 66, requiredVerification: false }
    ]
  },
  {
    id: 'c-4',
    name: 'Education Support',
    slug: 'education-support',
    description: 'Academic help, tutoring and assistance.',
    iconName: 'GraduationCap',
    bannerUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'MEDIUM',
    baseRateMultiplier: 0.9,
    minAgeLimit: 18,
    isFeatured: true,
    isActive: true,
    companionCount: 22,
    safetyPolicy: 'Public cafe / library co-working environments only.',
    createdAt: '2026-02-12',
    subcategories: [
      { id: 'sub-401', name: 'Homework Help', description: 'Academic subject tutoring & problem solving', basePrice: 60, requiredVerification: false },
      { id: 'sub-402', name: 'Exam Prep', description: 'Test preparation and quiet study partner', basePrice: 80, requiredVerification: true }
    ]
  },
  {
    id: 'c-5',
    name: 'Fitness & Wellness',
    slug: 'fitness-wellness',
    description: 'Health, fitness and wellness support services.',
    iconName: 'Dumbbell',
    bannerUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'LOW',
    baseRateMultiplier: 1.05,
    minAgeLimit: 20,
    isFeatured: true,
    isActive: true,
    companionCount: 20,
    safetyPolicy: 'Verified outdoor trails or registered gym facilities.',
    createdAt: '2026-03-01',
    subcategories: [
      { id: 'sub-501', name: 'Personal Training', description: 'Workout spotting & pacing partner', basePrice: 93, requiredVerification: true },
      { id: 'sub-502', name: 'Yoga Session', description: 'Outdoor yoga & stretching companion', basePrice: 73, requiredVerification: false }
    ]
  },
  {
    id: 'c-6',
    name: 'Gaming & Entertainment',
    slug: 'gaming-entertainment',
    description: 'Gaming assistance and entertainment support.',
    iconName: 'Gamepad2',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'MEDIUM',
    baseRateMultiplier: 0.85,
    minAgeLimit: 18,
    isFeatured: true,
    isActive: true,
    companionCount: 15,
    safetyPolicy: 'Online platform monitoring & chat moderation filters enabled.',
    createdAt: '2026-03-10',
    subcategories: [
      { id: 'sub-601', name: 'Game Coaching', description: 'Ranked FPS gaming buddy & strategy coaching', basePrice: 83, requiredVerification: false },
      { id: 'sub-602', name: 'Live Streaming', description: 'Co-op gaming & streaming partner', basePrice: 90, requiredVerification: false }
    ]
  }
];
