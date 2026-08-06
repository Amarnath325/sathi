import { ServiceCategory } from './types';

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'c-1',
    name: 'Event Companion',
    slug: 'event-companion',
    description: 'Gala dinners, corporate expos, networking events & weddings',
    iconName: 'Users',
    bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'LOW',
    baseRateMultiplier: 1.2,
    minAgeLimit: 21,
    isFeatured: true,
    isActive: true,
    companionCount: 42,
    safetyPolicy: 'Public venues only. Mandatory emergency check-in every 2 hours.',
    createdAt: '2026-01-10',
    subcategories: [
      { id: 'sub-101', name: 'Corporate Gala & Award Dinners', description: 'Professional social presence for business events', basePrice: 85, requiredVerification: true },
      { id: 'sub-102', name: 'Wedding & Family Celebrations', description: 'Polite, well-mannered companion for social gatherings', basePrice: 75, requiredVerification: true },
      { id: 'sub-103', name: 'Concerts & Music Festivals', description: 'Vibrant companion for live shows and music events', basePrice: 70, requiredVerification: true }
    ]
  },
  {
    id: 'c-2',
    name: 'Travel & City Guide',
    slug: 'travel-city-guide',
    description: 'Explore new cities safely with trusted local guides & translators',
    iconName: 'Compass',
    bannerUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'MEDIUM',
    baseRateMultiplier: 1.15,
    minAgeLimit: 21,
    isFeatured: true,
    isActive: true,
    companionCount: 38,
    safetyPolicy: 'GPS live tracking enabled during city tours. Emergency SOS button active.',
    createdAt: '2026-01-15',
    subcategories: [
      { id: 'sub-201', name: 'Historical & Cultural Walking Tour', description: 'In-depth sightseeing and local culture', basePrice: 65, requiredVerification: true },
      { id: 'sub-202', name: 'Night Market & Foodie Crawl', description: 'Discover authentic local food hot spots safely', basePrice: 80, requiredVerification: true },
      { id: 'sub-203', name: 'Multilingual Translator & Escort', description: 'Assistance for non-native language speakers', basePrice: 90, requiredVerification: true }
    ]
  },
  {
    id: 'c-3',
    name: 'Elderly Assistance',
    slug: 'elderly-assistance',
    description: 'Gentle companionship, hospital visits & daily errand support',
    iconName: 'Heart',
    bannerUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'LOW',
    baseRateMultiplier: 1.0,
    minAgeLimit: 25,
    isFeatured: true,
    isActive: true,
    companionCount: 26,
    safetyPolicy: 'Police verification & medical background check mandatory.',
    createdAt: '2026-02-01',
    subcategories: [
      { id: 'sub-301', name: 'Doctor Visit & Hospital Escort', description: 'Assistance with appointments & navigation', basePrice: 50, requiredVerification: true },
      { id: 'sub-302', name: 'Parks & Walk Companion', description: 'Outdoor walking & friendly conversation', basePrice: 45, requiredVerification: false },
      { id: 'sub-303', name: 'Grocery & Medicine Shopping', description: 'Practical help with daily errands', basePrice: 40, requiredVerification: false }
    ]
  },
  {
    id: 'c-4',
    name: 'Study & Work Buddy',
    slug: 'study-work-buddy',
    description: 'Productivity partner, cafe co-working & accountability companion',
    iconName: 'BookOpen',
    bannerUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'LOW',
    baseRateMultiplier: 0.9,
    minAgeLimit: 18,
    isFeatured: false,
    isActive: true,
    companionCount: 31,
    safetyPolicy: 'Public cafe / library co-working environments only.',
    createdAt: '2026-02-12',
    subcategories: [
      { id: 'sub-401', name: 'Library & Quiet Study Partner', description: 'Focused study companion for exam prep', basePrice: 35, requiredVerification: false },
      { id: 'sub-402', name: 'Coworking & Startup Discussion', description: 'Brainstorming & accountability for remote workers', basePrice: 55, requiredVerification: true }
    ]
  },
  {
    id: 'c-5',
    name: 'Fitness & Outdoor Sports',
    slug: 'fitness-sports',
    description: 'Running partner, gym workout buddy, tennis & hiking companion',
    iconName: 'Activity',
    bannerUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'MEDIUM',
    baseRateMultiplier: 1.05,
    minAgeLimit: 20,
    isFeatured: false,
    isActive: true,
    companionCount: 22,
    safetyPolicy: 'Verified outdoor trails or registered gym facilities.',
    createdAt: '2026-03-01',
    subcategories: [
      { id: 'sub-501', name: 'Morning Jogging & Park Running', description: 'Pacing partner for 5k/10k training', basePrice: 50, requiredVerification: false },
      { id: 'sub-502', name: 'Gym & Weightlifting Spotter', description: 'Motivation & spotting during workouts', basePrice: 60, requiredVerification: true },
      { id: 'sub-503', name: 'Weekend Mountain Hiking', description: 'Outdoor trail exploration buddy', basePrice: 70, requiredVerification: true }
    ]
  },
  {
    id: 'c-6',
    name: 'Gaming & Esport Buddy',
    slug: 'gaming-esport',
    description: 'Co-op online gaming, Discord voice chat & team coaching',
    iconName: 'Gamepad',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    riskLevel: 'LOW',
    baseRateMultiplier: 0.85,
    minAgeLimit: 18,
    isFeatured: false,
    isActive: true,
    companionCount: 54,
    safetyPolicy: 'Online platform monitoring & chat moderation filters enabled.',
    createdAt: '2026-03-10',
    subcategories: [
      { id: 'sub-601', name: 'Valorant / FPS Ranked Duo', description: 'Competitive gaming partner & voice comms', basePrice: 30, requiredVerification: false },
      { id: 'sub-602', name: 'Co-op RPG & Casual Gaming', description: 'Relaxing gameplay & friendly banter', basePrice: 25, requiredVerification: false }
    ]
  }
];
