import fs from 'fs';
import path from 'path';

// Seed dataset generator for Companion Connect
const seedData = {
  companions: [
    {
      id: "comp-101",
      name: "Sophia Chen",
      age: 26,
      gender: "Female",
      city: "San Francisco",
      country: "USA",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      photos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80"
      ],
      categories: ["Event Companion", "Shopping Partner", "Language & Study"],
      skills: ["Multilingual", "Fine Dining Etiquette", "Concert Companion", "Tech Tech Conference Guide"],
      languages: ["English", "Mandarin", "French"],
      hourlyRate: 45,
      dailyRate: 320,
      ratingAvg: 4.96,
      ratingCount: 84,
      completedBookings: 92,
      verificationBadge: true,
      bio: "Software professional and avid traveler. Passionate about arts, technology summits, fine dining, and meaningful social conversations. Happy to accompany you to formal galas, corporate dinners, or museum tours.",
      isAvailableNow: true,
      responseTimeMin: 8,
      riskScore: 0.02
    },
    {
      id: "comp-102",
      name: "Alexander Wright",
      age: 29,
      gender: "Male",
      city: "New York",
      country: "USA",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
      photos: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80"
      ],
      categories: ["Elderly Support", "Fitness Partner", "Event Companion"],
      skills: ["Certified CPR", "Personal Fitness Coach", "Drive Support", "Board Games"],
      languages: ["English", "Spanish"],
      hourlyRate: 50,
      dailyRate: 350,
      ratingAvg: 4.98,
      ratingCount: 112,
      completedBookings: 140,
      verificationBadge: true,
      bio: "Former physical therapist and fitness advocate. I specialize in mobility support, outdoor walks, gym motivation, and attending classical music concerts. Safety and trust are my top priorities.",
      isAvailableNow: true,
      responseTimeMin: 5,
      riskScore: 0.01
    },
    {
      id: "comp-103",
      name: "Elena Rostova",
      age: 25,
      gender: "Female",
      city: "London",
      country: "UK",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
      photos: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80"
      ],
      categories: ["Travel Partner", "Shopping Partner", "Gaming Partner"],
      skills: ["City Guide", "Esports Gaming", "Luxury Shopping", "Photography"],
      languages: ["English", "Russian", "Italian"],
      hourlyRate: 60,
      dailyRate: 420,
      ratingAvg: 4.92,
      ratingCount: 56,
      completedBookings: 64,
      verificationBadge: true,
      bio: "London fashion enthusiast and gaming hobbyist. Available for airport meetups, museum hops, high-end shopping tours, and co-op gaming sessions.",
      isAvailableNow: false,
      responseTimeMin: 12,
      riskScore: 0.04
    },
    {
      id: "comp-104",
      name: "Marcus Vance",
      age: 31,
      gender: "Male",
      city: "Chicago",
      country: "USA",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
      photos: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80"
      ],
      categories: ["Study Partner", "Conversation Partner", "Event Companion"],
      skills: ["Academic Research", "Public Speaking", "Chess Master", "Executive Presence"],
      languages: ["English", "German"],
      hourlyRate: 40,
      dailyRate: 280,
      ratingAvg: 4.89,
      ratingCount: 38,
      completedBookings: 45,
      verificationBadge: true,
      bio: "Postgrad researcher in Economics. Great for intellectual debates, study sessions, library companions, or business networking summits.",
      isAvailableNow: true,
      responseTimeMin: 15,
      riskScore: 0.03
    }
  ],
  categories: [
    { id: "event", title: "Event Companion", desc: "Weddings, galas, tech summits, or business networking", icon: "PartyPopper" },
    { id: "elderly", title: "Elderly Support & Care", desc: "Companionship, walk assistance, groceries & reading", icon: "HeartHandshake" },
    { id: "travel", title: "Travel & City Buddy", desc: "Local exploration, airport navigation, sightseeing", icon: "Compass" },
    { id: "fitness", title: "Fitness & Outdoor", desc: "Gym accountability, jogging partner, tennis & hiking", icon: "Dumbbell" },
    { id: "shopping", title: "Shopping & Styling", desc: "Personal stylist, fashion shopping, gift selection", icon: "ShoppingBag" },
    { id: "study", title: "Study & Co-Working", desc: "Library study sessions, focus accountability, language practice", icon: "BookOpen" },
    { id: "gaming", title: "Gaming Companion", desc: "Co-op gaming partner, esports practice, casual play", icon: "Gamepad2" },
    { id: "conversation", title: "Conversation Partner", desc: "Coffee chats, active listening, deep discussions", icon: "MessageSquareQuote" }
  ],
  reviews: [
    {
      id: "rev-1",
      author: "David K.",
      rating: 5,
      date: "2 days ago",
      comment: "Sophia was fantastic at our company gala. Highly articulate, charming, and punctual. Made the evening seamless!",
      category: "Event Companion"
    },
    {
      id: "rev-2",
      author: "Margaret H.",
      rating: 5,
      date: "1 week ago",
      comment: "Alexander helped my elderly father during his hospital visit and afternoon park walk. Very respectful and gentle.",
      category: "Elderly Support"
    }
  ]
};

console.log("Mock data template initialized successfully.");
