import { UserProfile, Booking, VerificationDocument, ChatMessage, PanicAlert, Review } from './types';

export const MOCK_COMPANIONS: UserProfile[] = [
  {
    id: "comp-101",
    name: "Sophia Chen",
    email: "sophia.chen@example.com",
    role: "VERIFIED_COMPANION",
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
    categories: ["Event Companion", "Shopping Partner", "Study & Co-Working"],
    skills: ["Multilingual", "Fine Dining Etiquette", "Concert Companion", "Tech Summits Guide"],
    languages: ["English", "Mandarin", "French"],
    hourlyRate: 45,
    dailyRate: 320,
    ratingAvg: 4.96,
    ratingCount: 84,
    completedBookings: 92,
    verificationBadge: true,
    kycStatus: "APPROVED",
    bio: "Software professional & cultural enthusiast based in SF. Experienced in hosting corporate dinners, attending tech conventions, accompanying guests to art galas, or library co-working.",
    isAvailableNow: true,
    responseTimeMin: 8,
    riskScore: 0.02,
    riskLevel: "LOW",
    experienceYears: 4,
    education: "B.S. Computer Science, UC Berkeley"
  },
  {
    id: "comp-102",
    name: "Alexander Wright",
    email: "alex.wright@example.com",
    role: "VERIFIED_COMPANION",
    age: 29,
    gender: "Male",
    city: "New York",
    country: "USA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80"
    ],
    categories: ["Elderly Support & Care", "Fitness & Outdoor", "Event Companion"],
    skills: ["CPR Certified", "Personal Trainer", "Mobility Assistance", "Chess Player"],
    languages: ["English", "Spanish"],
    hourlyRate: 50,
    dailyRate: 350,
    ratingAvg: 4.98,
    ratingCount: 112,
    completedBookings: 140,
    verificationBadge: true,
    kycStatus: "APPROVED",
    bio: "Certified fitness practitioner and patient companion. Dedicated to assisting elderly adults on errands, gym motivation, jogging, chess, and attending symphonies.",
    isAvailableNow: true,
    responseTimeMin: 5,
    riskScore: 0.01,
    riskLevel: "LOW",
    experienceYears: 6,
    education: "B.S. Kinesiology, NYU"
  },
  {
    id: "comp-103",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    role: "VERIFIED_COMPANION",
    age: 25,
    gender: "Female",
    city: "London",
    country: "UK",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80"
    ],
    categories: ["Travel & City Buddy", "Shopping & Styling", "Gaming Companion"],
    skills: ["London Tour Guide", "Luxury Styling", "Co-Op Gaming", "Photography"],
    languages: ["English", "Russian", "Italian"],
    hourlyRate: 60,
    dailyRate: 420,
    ratingAvg: 4.92,
    ratingCount: 56,
    completedBookings: 64,
    verificationBadge: true,
    kycStatus: "APPROVED",
    bio: "Fashion editor and gamer based in London. Perfect companion for exploring hidden coffee spots, high-end boutiques, museum walks, or multiplayer gaming sessions.",
    isAvailableNow: false,
    responseTimeMin: 12,
    riskScore: 0.03,
    riskLevel: "LOW",
    experienceYears: 3,
    education: "B.A. Fashion Design, Central Saint Martins"
  },
  {
    id: "comp-104",
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    role: "VERIFIED_COMPANION",
    age: 31,
    gender: "Male",
    city: "Chicago",
    country: "USA",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80"
    ],
    categories: ["Study & Co-Working", "Conversation Partner", "Event Companion"],
    skills: ["Debate & Logic", "Business Networking", "Public Speaking", "Financial Markets"],
    languages: ["English", "German"],
    hourlyRate: 40,
    dailyRate: 280,
    ratingAvg: 4.89,
    ratingCount: 38,
    completedBookings: 45,
    verificationBadge: true,
    kycStatus: "APPROVED",
    bio: "Economist and avid reader. Great for deep intellectual conversations, co-working accountability, business seminars, or chess matches.",
    isAvailableNow: true,
    responseTimeMin: 15,
    riskScore: 0.04,
    riskLevel: "LOW",
    experienceYears: 5,
    education: "M.S. Applied Economics, UChicago"
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "bk-9001",
    bookingNumber: "CC-2026-8812",
    userId: "usr-201",
    userName: "Michael Jordan",
    companionId: "comp-101",
    companionName: "Sophia Chen",
    companionAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    category: "Event Companion",
    startTime: "2026-08-10T18:00:00Z",
    endTime: "2026-08-10T22:00:00Z",
    durationHours: 4,
    locationAddress: "Palace of Fine Arts, San Francisco, CA",
    specialNotes: "Accompanying to the Annual Tech Gala dinner. Formal evening attire requested.",
    hourlyRate: 45,
    baseAmount: 180,
    escrowFee: 9,
    platformFee: 18,
    totalAmount: 207,
    status: "ESCROW_LOCKED",
    paymentMethod: "STRIPE",
    escrowStatus: "HELD",
    createdAt: "2026-08-03T10:30:00Z"
  },
  {
    id: "bk-9002",
    bookingNumber: "CC-2026-9043",
    userId: "usr-202",
    userName: "Sarah Jenkins",
    companionId: "comp-102",
    companionName: "Alexander Wright",
    companionAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    category: "Elderly Support & Care",
    startTime: "2026-08-05T10:00:00Z",
    endTime: "2026-08-05T14:00:00Z",
    durationHours: 4,
    locationAddress: "Central Park West, New York, NY",
    specialNotes: "Assisting elderly mother for park promenade and light grocery shopping.",
    hourlyRate: 50,
    baseAmount: 200,
    escrowFee: 10,
    platformFee: 20,
    totalAmount: 230,
    status: "ACCEPTED",
    paymentMethod: "WALLET",
    escrowStatus: "HELD",
    createdAt: "2026-08-04T08:15:00Z"
  }
];

export const MOCK_KYC_QUEUE: VerificationDocument[] = [
  {
    id: "doc-501",
    userId: "usr-305",
    type: "GOVERNMENT_ID",
    fileName: "passport_scan_john_doe.jpg",
    fileUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
    livenessScore: 0.98,
    selfieMatchScore: 0.96,
    status: "PENDING",
    submittedAt: "2026-08-04T09:12:00Z"
  },
  {
    id: "doc-502",
    userId: "usr-306",
    type: "DRIVING_LICENSE",
    fileName: "dl_scan_maria_v.jpg",
    fileUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    livenessScore: 0.94,
    selfieMatchScore: 0.91,
    status: "PENDING",
    submittedAt: "2026-08-04T11:05:00Z"
  }
];

export const MOCK_PANIC_ALERTS: PanicAlert[] = [
  {
    id: "alert-701",
    userId: "usr-902",
    userName: "Jessica Vance",
    latitude: 37.7749,
    longitude: -122.4194,
    address: "Market St & 4th St, San Francisco, CA",
    timestamp: "2026-08-04T12:05:00Z",
    resolved: false
  }
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "comp-101",
    receiverId: "curr-user",
    senderName: "Sophia Chen",
    content: "Hi there! Looking forward to helping out with your upcoming conference attendance.",
    timestamp: "12:30 PM",
    isRead: true,
    encrypted: true
  },
  {
    id: "msg-2",
    senderId: "curr-user",
    receiverId: "comp-101",
    senderName: "You",
    content: "Great! The event starts at 6 PM at the Palace of Fine Arts. Does that schedule work for you?",
    timestamp: "12:32 PM",
    isRead: true,
    encrypted: true
  },
  {
    id: "msg-3",
    senderId: "comp-101",
    receiverId: "curr-user",
    senderName: "Sophia Chen",
    content: "Perfect timing. I will arrive 15 minutes early near the main fountain entrance.",
    timestamp: "12:35 PM",
    isRead: false,
    encrypted: true
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    authorName: "David K.",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    companionId: "comp-101",
    rating: 5,
    category: "Event Companion",
    comment: "Sophia was fantastic at our company gala. Highly articulate, charming, and punctual. Made the evening seamless!",
    helpfulVotes: 14,
    date: "2 days ago",
    verifiedBooking: true,
    sentimentScore: 0.98
  },
  {
    id: "rev-2",
    authorName: "Margaret H.",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    companionId: "comp-102",
    rating: 5,
    category: "Elderly Support",
    comment: "Alexander helped my elderly father during his hospital visit and afternoon park walk. Very respectful and gentle.",
    helpfulVotes: 22,
    date: "1 week ago",
    verifiedBooking: true,
    sentimentScore: 0.99
  }
];
