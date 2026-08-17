import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_PRICING_PROFILES = [
  {
    id: 'pr-hourly-std',
    name: 'Standard Hourly Profile',
    pricing_type: 'Hourly',
    base_price: 500,
    currency: 'INR',
    minimum_duration: 1,
    maximum_duration: 12,
    extra_hour_price: 450,
    travel_charge: 100,
    platform_fee: 15,
    companion_commission: 85,
    tax: 18,
    weekend_multiplier: 1.15,
    holiday_multiplier: 1.25,
    surge_enabled: true,
    cancellation_fee: 100,
    no_show_fee: 500,
    status: 'ACTIVE'
  },
  {
    id: 'pr-event-pro',
    name: 'Premium Event Package Profile',
    pricing_type: 'Per Event',
    base_price: 3500,
    currency: 'INR',
    minimum_duration: 4,
    maximum_duration: 10,
    extra_hour_price: 600,
    travel_charge: 250,
    platform_fee: 15,
    companion_commission: 85,
    tax: 18,
    weekend_multiplier: 1.2,
    holiday_multiplier: 1.3,
    surge_enabled: false,
    cancellation_fee: 500,
    no_show_fee: 1500,
    status: 'ACTIVE'
  },
  {
    id: 'pr-fixed-budget',
    name: 'Budget Fixed Profile',
    pricing_type: 'Fixed Price',
    base_price: 350,
    currency: 'INR',
    minimum_duration: 1,
    maximum_duration: 4,
    extra_hour_price: 300,
    travel_charge: 50,
    platform_fee: 10,
    companion_commission: 90,
    tax: 18,
    weekend_multiplier: 1.0,
    holiday_multiplier: 1.1,
    surge_enabled: false,
    cancellation_fee: 50,
    no_show_fee: 200,
    status: 'ACTIVE'
  }
];

const DEFAULT_RISK_LEVELS = [
  { id: 'rk-low', name: 'Low Risk', code: 'LOW', score: 10, description: 'Basic verification and safety controls required.', color: 'emerald', verification_level: 'Basic', monitoring_level: 'Standard', manual_approval_required: false, live_location_required: true, emergency_contact_required: true, sos_required: true, maximum_booking_duration: 12, status: 'ACTIVE' },
  { id: 'rk-med', name: 'Medium Risk', code: 'MEDIUM', score: 35, description: 'Additional verification and periodic check-in monitoring.', color: 'amber', verification_level: 'Standard', monitoring_level: 'Enhanced', manual_approval_required: false, live_location_required: true, emergency_contact_required: true, sos_required: true, maximum_booking_duration: 8, status: 'ACTIVE' },
  { id: 'rk-high', name: 'High Risk', code: 'HIGH', score: 65, description: 'Enhanced background verification and manual admin approval.', color: 'rose', verification_level: 'Enhanced', monitoring_level: 'Strict', manual_approval_required: true, live_location_required: true, emergency_contact_required: true, sos_required: true, maximum_booking_duration: 6, status: 'ACTIVE' },
  { id: 'rk-crit', name: 'Critical Risk', code: 'CRITICAL', score: 90, description: 'Restricted service requiring strict admin sign-off and continuous monitoring.', color: 'purple', verification_level: 'Restricted', monitoring_level: 'Continuous', manual_approval_required: true, live_location_required: true, emergency_contact_required: true, sos_required: true, maximum_booking_duration: 4, status: 'ACTIVE' }
];

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Events & Social', slug: 'events-social', description: 'Corporate galas, weddings, networking expos & social gatherings', icon: 'Users', banner_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80', display_order: 1, status: 'ACTIVE', is_featured: true, minimum_age: 21 },
  { id: 'cat-2', name: 'Travel & Exploration', slug: 'travel-exploration', description: 'Local city guides, road trips, food crawls & sightseeing', icon: 'Compass', banner_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80', display_order: 2, status: 'ACTIVE', is_featured: true, minimum_age: 21 },
  { id: 'cat-3', name: 'Care & Assistance', slug: 'care-assistance', description: 'Compassionate assistance for senior citizens & medical visits (Companionship only)', icon: 'Heart', banner_image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80', display_order: 3, status: 'ACTIVE', is_featured: true, minimum_age: 25 },
  { id: 'cat-4', name: 'Study, Career & Work', slug: 'study-career-work', description: 'Productivity partner, library buddy & cafe co-working', icon: 'BookOpen', banner_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80', display_order: 4, status: 'ACTIVE', is_featured: false, minimum_age: 18 },
  { id: 'cat-5', name: 'Fitness, Sports & Outdoor', slug: 'fitness-sports-outdoor', description: 'Workout spotting, running, cycling & sports partner', icon: 'Activity', banner_image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', display_order: 5, status: 'ACTIVE', is_featured: false, minimum_age: 20 },
  { id: 'cat-6', name: 'Gaming & Entertainment', slug: 'gaming-entertainment', description: 'Co-op gaming, esports, movie companions & Discord voice', icon: 'Gamepad', banner_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80', display_order: 6, status: 'ACTIVE', is_featured: false, minimum_age: 18 },
  { id: 'cat-7', name: 'Social & Lifestyle', slug: 'social-lifestyle', description: 'Coffee conversations, dining partners & shopping assistance', icon: 'Coffee', banner_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80', display_order: 7, status: 'ACTIVE', is_featured: false, minimum_age: 21 },
  { id: 'cat-8', name: 'Pets & Hobbies', slug: 'pets-hobbies', description: 'Dog walking, photography companion, art & crafting buddy', icon: 'Dog', banner_image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80', display_order: 8, status: 'ACTIVE', is_featured: false, minimum_age: 18 },
  { id: 'cat-9', name: 'Technology & Digital', slug: 'technology-digital', description: 'Tech setup support, digital literacy & gadget tutoring', icon: 'Laptop', banner_image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80', display_order: 9, status: 'ACTIVE', is_featured: false, minimum_age: 18 },
  { id: 'cat-10', name: 'Wellness & Mindfulness', slug: 'wellness-mindfulness', description: 'Meditation partner, nature walk companion & relaxation', icon: 'Sun', banner_image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80', display_order: 10, status: 'ACTIVE', is_featured: false, minimum_age: 20 },
  { id: 'cat-11', name: 'Home & Personal Assistance', slug: 'home-personal-assistance', description: 'Help with daily life tasks, administrative queues, home organizing', icon: 'Home', banner_image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80', display_order: 11, status: 'ACTIVE', is_featured: false, minimum_age: 21 },
  { id: 'cat-12', name: 'Community & Volunteering', slug: 'community-volunteering', description: 'Social causes, beach cleanups & shelter volunteering', icon: 'Globe', banner_image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80', display_order: 12, status: 'ACTIVE', is_featured: false, minimum_age: 18 }
];

function makeSrv(id, catId, name, desc, order) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    id,
    category_id: catId,
    name,
    slug,
    short_description: desc,
    description: `${name} — Professional companion support and assistance under full escrow and safety protection.`,
    icon: 'Sparkles',
    display_order: order,
    status: 'PUBLISHED',
    is_featured: false,
    minimum_age: 18,
    maximum_age: 75,
    online_allowed: true,
    offline_allowed: true,
    location_required: true,
    duration_required: true,
    risk_level_id: 'rk-low',
    pricing_profile_id: 'pr-hourly-std'
  };
}

const INITIAL_SERVICES = [
  makeSrv('srv-101', 'cat-1', 'Event Companion', 'General event companion for social functions and galas', 1),
  makeSrv('srv-102', 'cat-1', 'Wedding Companion', 'Friendly, well-groomed guest for family weddings', 2),
  makeSrv('srv-103', 'cat-1', 'Party Companion', 'Lively companion for private parties and celebrations', 3),
  makeSrv('srv-104', 'cat-1', 'Birthday/Celebration Companion', 'Celebration partner for birthdays and anniversaries', 4),
  makeSrv('srv-105', 'cat-1', 'Corporate Event Companion', 'Professional presence at business summits and dinners', 5),
  makeSrv('srv-106', 'cat-1', 'Conference Companion', 'Companion for multi-day conventions and expos', 6),
  makeSrv('srv-107', 'cat-1', 'Exhibition Companion', 'Art, tech, and trade fair exhibition companion', 7),
  makeSrv('srv-108', 'cat-1', 'Cultural Event Companion', 'Companion for theater, dance, and heritage programs', 8),
  makeSrv('srv-109', 'cat-1', 'Festival Companion', 'Music and cultural festival companion', 9),
  makeSrv('srv-110', 'cat-1', 'Networking Event Companion', 'Business networking assistant and intro buddy', 10),
  makeSrv('srv-111', 'cat-1', 'Award/Business Event Companion', 'Formal companion for award ceremonies and galas', 11),

  makeSrv('srv-201', 'cat-2', 'Travel Companion', 'Long distance and city travel buddy', 1),
  makeSrv('srv-202', 'cat-2', 'City Guide', 'Local expert city walking guide', 2),
  makeSrv('srv-203', 'cat-2', 'Local Experience', 'Curated local hidden gems and neighborhood tours', 3),
  makeSrv('srv-204', 'cat-2', 'Sightseeing Companion', 'Monument, museum, and park tour guide', 4),
  makeSrv('srv-205', 'cat-2', 'Road Trip Companion', 'Outstation driving and highway travel buddy', 5),
  makeSrv('srv-206', 'cat-2', 'Shopping Tour', 'Bazaar, handicraft, and mall shopping guide', 6),
  makeSrv('srv-207', 'cat-2', 'Food Tour', 'Street food crawl and culinary tasting guide', 7),
  makeSrv('srv-208', 'cat-2', 'Tourist Assistance', 'Navigation, language translation, and currency guidance', 8),
  makeSrv('srv-209', 'cat-2', 'Public Transport Assistance', 'Metro, bus, and local train navigation escort', 9),
  makeSrv('srv-210', 'cat-2', 'Airport Assistance', 'Terminal check-in, luggage, and gate escort', 10),
  makeSrv('srv-211', 'cat-2', 'Train/Bus Travel Companion', 'Railway station escort and train journey companion', 11),
  makeSrv('srv-212', 'cat-2', 'Photography Tour Companion', 'Camera helper and photo shoot location guide', 12),
  makeSrv('srv-213', 'cat-2', 'Adventure Trip Companion', 'Camping, kayaking, and outdoor excursion buddy', 13),

  makeSrv('srv-301', 'cat-3', 'Elderly Companion', 'Friendly conversation and companionship for seniors', 1),
  makeSrv('srv-302', 'cat-3', 'Hospital Companion', 'Non-medical escort for hospital waiting rooms and registrations', 2),
  makeSrv('srv-303', 'cat-3', 'Doctor Appointment Companion', 'Navigation and waiting room companion for clinic visits', 3),
  makeSrv('srv-304', 'cat-3', 'Medical Appointment Escort', 'Safe accompaniment to scheduled health checkups', 4),
  makeSrv('srv-305', 'cat-3', 'Pharmacy Visit Assistance', 'Accompaniment to chemist shops to fetch prescriptions', 5),
  makeSrv('srv-306', 'cat-3', 'Grocery Assistance', 'Shopping escort for vegetables and household items', 6),
  makeSrv('srv-307', 'cat-3', 'Daily Errand Assistance', 'Help with day-to-day outside tasks', 7),
  makeSrv('srv-308', 'cat-3', 'Accessibility Assistance', 'Walking and wheelchair assistance in public venues', 8),
  makeSrv('srv-309', 'cat-3', 'Walking Companion', 'Gentle morning/evening park walking buddy', 9),
  makeSrv('srv-310', 'cat-3', 'Reading/Conversation for Elderly', 'Book reading, newspaper summary, and storytelling', 10),
  makeSrv('srv-311', 'cat-3', 'Hospital Discharge Assistance', 'Taxi hailing and luggage help upon hospital exit', 11),
  makeSrv('srv-312', 'cat-3', 'Government/Office Visit Assistance', 'Escort for senior citizens visiting administrative offices', 12),

  makeSrv('srv-401', 'cat-4', 'Study Buddy', 'Focus and accountability partner for studies', 1),
  makeSrv('srv-402', 'cat-4', 'Library Companion', 'Silent study partner in libraries', 2),
  makeSrv('srv-403', 'cat-4', 'Co-working Buddy', 'Cafe and co-working space laptop work companion', 3),
  makeSrv('srv-404', 'cat-4', 'Online Study Partner', 'Virtual study room timer and goal checker', 4),
  makeSrv('srv-405', 'cat-4', 'Exam Preparation Buddy', 'Mock test timer and flashcard partner', 5),
  makeSrv('srv-406', 'cat-4', 'Interview Practice Buddy', 'Mock job interview practice partner', 6),
  makeSrv('srv-407', 'cat-4', 'Career Discussion', 'Peer feedback on job paths and goals', 7),
  makeSrv('srv-408', 'cat-4', 'Resume Discussion', 'CV formatting and feedback discussion', 8),
  makeSrv('srv-409', 'cat-4', 'Professional Networking', 'Business expo networking companion', 9),
  makeSrv('srv-410', 'cat-4', 'Conference/Business Meeting Companion', 'Professional presence at business meets', 10),
  makeSrv('srv-411', 'cat-4', 'Project Discussion Buddy', 'Brainstorming and project planning partner', 11),
  makeSrv('srv-412', 'cat-4', 'Skill Practice Partner', 'Coding, language, or public speaking practice', 12),

  makeSrv('srv-501', 'cat-5', 'Walking Buddy', 'Regular morning/evening brisk walk partner', 1),
  makeSrv('srv-502', 'cat-5', 'Running Partner', '5K/10K marathon pacing partner', 2),
  makeSrv('srv-503', 'cat-5', 'Jogging Partner', 'Park jogging and cardio partner', 3),
  makeSrv('srv-504', 'cat-5', 'Cycling Partner', 'City and highway cycling buddy', 4),
  makeSrv('srv-505', 'cat-5', 'Gym Buddy', 'Weightlifting spotter and workout partner', 5),
  makeSrv('srv-506', 'cat-5', 'Yoga Partner', 'Park or studio yoga session buddy', 6),
  makeSrv('srv-507', 'cat-5', 'Badminton Partner', 'Racket court opponent and sparring partner', 7),
  makeSrv('srv-508', 'cat-5', 'Cricket Partner', 'Turf cricket box match player', 8),
  makeSrv('srv-509', 'cat-5', 'Football Partner', '5-a-side turf football player', 9),
  makeSrv('srv-510', 'cat-5', 'Basketball Partner', 'Court pickup game player', 10),
  makeSrv('srv-511', 'cat-5', 'Swimming Companion', 'Pool lap swimming buddy', 11),
  makeSrv('srv-512', 'cat-5', 'Hiking Partner', 'Day trail hiking buddy', 12),
  makeSrv('srv-513', 'cat-5', 'Trekking Companion', 'Mountain and hill trek companion', 13),
  makeSrv('srv-514', 'cat-5', 'Outdoor Activity Partner', 'Frisbee, obstacle course, or park games', 14),

  makeSrv('srv-601', 'cat-6', 'Gaming Buddy', 'Console and PC co-op gaming partner', 1),
  makeSrv('srv-602', 'cat-6', 'Multiplayer Gaming', 'Online duo queue partner (Valorant, BGMI, GTA)', 2),
  makeSrv('srv-603', 'cat-6', 'Esports Partner', 'Competitive ranked gaming teammate', 3),
  makeSrv('srv-604', 'cat-6', 'Esports Practice', 'Scrims and aim practice partner', 4),
  makeSrv('srv-605', 'cat-6', 'Gaming Event Companion', 'Comic-Con and LAN tournament companion', 5),
  makeSrv('srv-606', 'cat-6', 'Movie Companion', 'Cinema theater movie watching buddy', 6),
  makeSrv('srv-607', 'cat-6', 'Theatre Companion', 'Stage play and drama audience companion', 7),
  makeSrv('srv-608', 'cat-6', 'Concert Companion', 'Live music gig and band concert buddy', 8),
  makeSrv('srv-609', 'cat-6', 'Music Event Companion', 'Classical, jazz, or EDM night companion', 9),
  makeSrv('srv-610', 'cat-6', 'Karaoke Companion', 'Sing-along karaoke bar partner', 10),
  makeSrv('srv-611', 'cat-6', 'Live Show Companion', 'Stand-up comedy show companion', 11),
  makeSrv('srv-612', 'cat-6', 'Cultural Program Companion', 'Dance and folk show audience buddy', 12),

  makeSrv('srv-701', 'cat-7', 'Conversation Buddy', 'Engaging, friendly chat companion over coffee', 1),
  makeSrv('srv-702', 'cat-7', 'Coffee Companion', 'Casual cafe coffee catch-up partner', 2),
  makeSrv('srv-703', 'cat-7', 'Dining Companion', 'Fine dining and restaurant companion', 3),
  makeSrv('srv-704', 'cat-7', 'Restaurant Companion', 'Lunch or dinner companion', 4),
  makeSrv('srv-705', 'cat-7', 'Shopping Companion', 'Apparel and outfit feedback shopping buddy', 5),
  makeSrv('srv-706', 'cat-7', 'Mall Companion', 'Mall strolling and window shopping companion', 6),
  makeSrv('srv-707', 'cat-7', 'Book Discussion', 'Literary chat and book exchange partner', 7),
  makeSrv('srv-708', 'cat-7', 'Reading Buddy', 'Quiet cafe or park reading companion', 8),
  makeSrv('srv-709', 'cat-7', 'Hobby Partner', 'Sharing common creative or lifestyle interests', 9),
  makeSrv('srv-710', 'cat-7', 'Social Meetup', 'Accompaniment to public social meetups', 10),
  makeSrv('srv-711', 'cat-7', 'Local Social Activity', 'Neighborhood fair and flea market companion', 11),
  makeSrv('srv-712', 'cat-7', 'Language Practice Partner', 'English, French, or regional language conversation', 12),

  makeSrv('srv-801', 'cat-8', 'Pet Walking', 'Dog park walking and exercise buddy', 1),
  makeSrv('srv-802', 'cat-8', 'Pet Companion', 'Playtime companion for pets', 2),
  makeSrv('srv-803', 'cat-8', 'Vet Visit Companion', 'Pet clinic waiting room companion', 3),
  makeSrv('srv-804', 'cat-8', 'Pet Activity Partner', 'Pet grooming or agility park escort', 4),
  makeSrv('srv-805', 'cat-8', 'Photography Companion', 'Outdoor camera helper and lighting buddy', 5),
  makeSrv('srv-806', 'cat-8', 'Photography Walk', 'Street photography and heritage walk buddy', 6),
  makeSrv('srv-807', 'cat-8', 'Art Partner', 'Gallery visit or museum sketching buddy', 7),
  makeSrv('srv-808', 'cat-8', 'Drawing Partner', 'Pencil, watercolor, or digital art partner', 8),
  makeSrv('srv-809', 'cat-8', 'Music Practice Partner', 'Vocal or instrumental jam practice buddy', 9),
  makeSrv('srv-810', 'cat-8', 'Instrument Practice Partner', 'Guitar, keyboard, or violin duet partner', 10),
  makeSrv('srv-811', 'cat-8', 'Cooking Hobby Partner', 'Baking or recipe testing companion', 11),
  makeSrv('srv-812', 'cat-8', 'Gardening Partner', 'Plant nursery visit and potting buddy', 12),
  makeSrv('srv-813', 'cat-8', 'Craft Partner', 'DIY, pottery, or knitting companion', 13),

  makeSrv('srv-901', 'cat-9', 'Smartphone Assistance', 'Helping learn smartphone settings, camera, & apps', 1),
  makeSrv('srv-902', 'cat-9', 'Computer Assistance', 'Basic laptop software guidance & typing', 2),
  makeSrv('srv-903', 'cat-9', 'Basic Digital Help', 'General tech setup and troubleshooting help', 3),
  makeSrv('srv-904', 'cat-9', 'Online Form Assistance', 'Guiding through online applications & forms', 4),
  makeSrv('srv-905', 'cat-9', 'Digital Service Assistance', 'Online services setup and usage guide', 5),
  makeSrv('srv-906', 'cat-9', 'App/Website Guidance', 'Teaching how to navigate specific mobile apps', 6),
  makeSrv('srv-907', 'cat-9', 'Video Call Assistance', 'Setting up Zoom/WhatsApp video calls for family', 7),
  makeSrv('srv-908', 'cat-9', 'Digital Payment Guidance', 'Teaching safe UPI and NetBanking practices', 8),
  makeSrv('srv-909', 'cat-9', 'Online Booking Assistance', 'Helping book train tickets, cabs, or hotel stays', 9),
  makeSrv('srv-910', 'cat-9', 'Basic Tech Learning', 'Step-by-step digital literacy companion', 10),

  makeSrv('srv-1001', 'cat-10', 'Meditation Buddy', 'Silent park or studio meditation companion', 1),
  makeSrv('srv-1002', 'cat-10', 'Yoga Buddy', 'Hatha/Vinyasa yoga practice partner', 2),
  makeSrv('srv-1003', 'cat-10', 'Nature Walk', 'Calming forest or botanical garden walk', 3),
  makeSrv('srv-1004', 'cat-10', 'Mindfulness Partner', 'Mindful listening and presence partner', 4),
  makeSrv('srv-1005', 'cat-10', 'Relaxation Companion', 'Peaceful, low-stress park relaxation buddy', 5),
  makeSrv('srv-1006', 'cat-10', 'Breathing Practice Partner', 'Pranayama and deep breathing practice partner', 6),
  makeSrv('srv-1007', 'cat-10', 'Wellness Activity Partner', 'Sound bath or wellness retreat companion', 7),
  makeSrv('srv-1008', 'cat-10', 'Healthy Lifestyle Buddy', 'Organic market and healthy habit partner', 8),
  makeSrv('srv-1009', 'cat-10', 'Outdoor Relaxation', 'Sunset or lakeside quiet companion', 9),
  makeSrv('srv-1010', 'cat-10', 'Personal Development Discussion', 'Goal setting and self-improvement chat', 10),

  makeSrv('srv-1101', 'cat-11', 'Home Errand Companion', 'Helper for home tasks and outstation errands', 1),
  makeSrv('srv-1102', 'cat-11', 'Grocery Assistance', 'Supermarket and local mandi shopping companion', 2),
  makeSrv('srv-1103', 'cat-11', 'Shopping Assistance', 'General retail and household shopping companion', 3),
  makeSrv('srv-1104', 'cat-11', 'Bank/Post Office Visit Companion', 'Escort and waiting room buddy for bank visits', 4),
  makeSrv('srv-1105', 'cat-11', 'Government Office Visit Companion', 'Accompaniment to civic offices and passport centers', 5),
  makeSrv('srv-1106', 'cat-11', 'Document Submission Assistance', 'Physical document delivery and submission escort', 6),
  makeSrv('srv-1107', 'cat-11', 'Queue/Appointment Assistance', 'Standing in token lines or appointment waiting', 7),
  makeSrv('srv-1108', 'cat-11', 'Moving/Relocation Assistance', 'Accompaniment during packing and house move day', 8),
  makeSrv('srv-1109', 'cat-11', 'Furniture/Appliance Shopping Companion', 'Showroom visiting and selection helper', 9),
  makeSrv('srv-1110', 'cat-11', 'Home Service Appointment Companion', 'Presence during electrician/plumber repair visits', 10),
  makeSrv('srv-1111', 'cat-11', 'Utility/Service Center Visit', 'Electricity bill/mobile service center visit escort', 11),
  makeSrv('srv-1112', 'cat-11', 'Local Errand Companion', 'Quick neighborhood errands and pickup tasks', 12),

  makeSrv('srv-1201', 'cat-12', 'Community Outreach Companion', 'Social service and community drive companion', 1),
  makeSrv('srv-1202', 'cat-12', 'Beach/Park Cleanup Buddy', 'Environmental cleanup drive partner', 2),
  makeSrv('srv-1203', 'cat-12', 'Animal Shelter Volunteer Companion', 'Stray feeding and animal shelter helper', 3),
  makeSrv('srv-1204', 'cat-12', 'Environmental Cause Partner', 'Tree plantation and green initiative buddy', 4),
  makeSrv('srv-1205', 'cat-12', 'Charity Event Companion', 'Fundraiser walk and donation drive companion', 5),
  makeSrv('srv-1206', 'cat-12', 'NGO Activity Partner', 'Volunteer activity partner for local non-profits', 6)
];

async function main() {
  console.log('Bulk seeding Neon PostgreSQL Database...');

  await prisma.hubService.createMany({
    data: INITIAL_SERVICES,
    skipDuplicates: true
  });

  console.log(`🎉 SUCCESS: ${INITIAL_SERVICES.length} Services bulk inserted into Neon PostgreSQL DB!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
