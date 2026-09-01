'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Users,
  User,
  UserCheck,
  ShieldCheck,

  Calendar,
  Sliders,

  Clock,
  DollarSign,
  MessageSquare,
  ShieldAlert,
  Scale,
  Star,
  MapPin,
  Bell,
  Mail,
  Tag,
  Ticket,
  Gift,
  TrendingUp,
  UserCog,
  Lock,

  FileText,
  Settings,
  Activity,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Pencil,
  RotateCcw,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  RefreshCw,
  Percent,
  CreditCard,
  Send,
  Zap,
  Eye,
  Server,
  Database,
  HardDrive,
  Wifi,
  Radio,
  Shield,
  Smartphone,
  Globe,
  UserX,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  Building2,
  SlidersHorizontal,
  Terminal,
  Sparkles,
  Layers,
  ArrowUpRight,
  ChevronDown,
  ExternalLink,
  Sun,
  Moon,
  LayoutGrid,
  List,
  Table as TableIcon
} from 'lucide-react';
import { ServiceCategoryHub } from '@/components/hub/ServiceCategoryHub';


import { useTheme } from '@/context/ThemeContext';
import { useAdminStore } from '@/lib/adminStore';
import { useCrudStore, DynamicCompanionItem } from '@/lib/crudStore';
import { MOCK_BOOKINGS, MOCK_KYC_QUEUE, MOCK_PANIC_ALERTS, MOCK_REVIEWS, MOCK_MESSAGES } from '@/lib/mockData';
import { SosAlertCard } from '@/components/safety/SosAlertCard';
import { IncidentReportCard } from '@/components/safety/IncidentReportCard';
import { SosDispatchModal } from '@/components/safety/SosDispatchModal';
import { IncidentAuditModal } from '@/components/safety/IncidentAuditModal';
import { SosAlertItem, IncidentReport, DisciplinaryAction, IncidentStatus } from '@/lib/types';

import { UserManagementModule } from '@/components/admin/UserManagementModule';
import { KycVerificationModule } from '@/components/admin/KycVerificationModule';
import { SmtpConfigModule } from '@/components/admin/SmtpConfigModule';
import { EmailTemplateModule } from '@/components/admin/EmailTemplateModule';
import { PageSizeOption, PaginationFooter } from '@/components/common/PaginationBar';
import { DisputeAuditModal } from '@/components/dispute/DisputeAuditModal';
import { DisputeThreadDrawer } from '@/components/dispute/DisputeThreadDrawer';
import { DisputeTicket, Review } from '@/lib/types';
import { ReviewAuditModal } from '@/components/review/ReviewAuditModal';
import { ReviewCard } from '@/components/review/ReviewCard';
import { CascadingLocationSelector } from '@/components/location/CascadingLocationSelector';




import { CompanionStatusBadge } from '@/components/companion/CompanionStatusBadge';
import { CompanionFormModal } from '@/components/companion/CompanionFormModal';
import { ImageLightboxModal } from '@/components/common/ImageLightboxModal';
import { CategoryCard } from '@/components/category/CategoryCard';
import { CategoryFormModal } from '@/components/category/CategoryFormModal';
import { CategoryDetailsModal } from '@/components/category/CategoryDetailsModal';
import { BookingCard } from '@/components/booking/BookingCard';
import { BookingDetailsModal } from '@/components/booking/BookingDetailsModal';
import { BookingFormModal } from '@/components/booking/BookingFormModal';
import { LocationCard } from '@/components/location/LocationCard';
import { LocationDetailsModal } from '@/components/location/LocationDetailsModal';
import { LocationFormModal } from '@/components/location/LocationFormModal';
import { TransactionTable } from '@/components/payment/TransactionTable';
import { PayoutModal } from '@/components/payment/PayoutModal';
import { PaymentConfigModal } from '@/components/payment/PaymentConfigModal';
import { FinancialLedgerModal } from '@/components/payment/FinancialLedgerModal';
import { PromoCard } from '@/components/promo/PromoCard';
import { PromoFormModal } from '@/components/promo/PromoFormModal';
import { PromoDetailsModal } from '@/components/promo/PromoDetailsModal';
import { ServiceCategory, SubCategoryItem, BookingDetails, BookingStatus, EscrowStatus, LocationItem, FinancialTransaction, PayoutRecord, PaymentGatewayConfig, PromoCodeItem, UserProfile, CompanionStatus } from '@/lib/types';

import Link from 'next/link';
import ExecutiveDashboardAdminPage from '@/app/admin/executive/page';
import AnalyticsAdminPage from '@/app/admin/analytics/page';
import AdminCommunicationPage from '@/app/admin/communication/page';
import AdminAuditLogsPage from '@/app/admin/audit/page';
import AdminSystemSettingsPage from '@/app/admin/settings/page';
import AdminSystemHealthPage from '@/app/admin/health/page';







export type ERPModuleTab =
  | 'overview'
  | 'executive'
  | 'users'
  | 'verification'
  | 'companions'
  | 'categories'
  | 'bookings'
  | 'payments'
  | 'communication'
  | 'safety'
  | 'disputes'
  | 'reviews'
  | 'location'
  | 'notifications'
  | 'promotions'
  | 'analytics'
  | 'staff'
  | 'security'
  | 'audit'
  | 'settings'
  | 'health'
  | 'email-config'
  | 'email-templates';

interface SidebarGroup {
  groupTitle: string;
  items: {
    id: ERPModuleTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[];
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const {
    config,
    updateConfig,
    promos,
    addPromoCode,
    updatePromoCode,
    togglePromoCode,
    deletePromoCode,

    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategory,
    toggleCategoryFeatured,
    bookings,
    addBooking,
    updateBookingStatus,
    releaseEscrow,
    refundBooking,
    cancelBooking,
    updateBookingDetails,
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    toggleLocationActive,
    updateLocationSurge,
    addGeofenceZone,
    addPopularVenue,
    transactions,
    payouts,
    gateways,
    addTransaction,
    processPayout,
    processRefund,
    toggleGateway,
    updateGatewayConfig,
    sosAlerts,
    incidentReports,
    dispatchResponders,
    resolveSosAlert,
    applySafetyDisciplinaryAction,
    updateIncidentStatus,
    triggerSosAlert,
    suspendedUserIds,
    toggleUserSuspension,
    disputes,
    reviews,
    approveReview,
    flagReview
  } = useAdminStore();

  // Review Modal State
  const [auditingReview, setAuditingReview] = useState<Review | null>(null);

  // Dispute Modal & Drawer States
  const [auditingDispute, setAuditingDispute] = useState<DisputeTicket | null>(null);
  const [drawerDispute, setDrawerDispute] = useState<DisputeTicket | null>(null);


  // Trust & Safety Modal States
  const [selectedSosAlert, setSelectedSosAlert] = useState<SosAlertItem | null>(null);

  const [isSosDispatchModalOpen, setIsSosDispatchModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [isIncidentAuditModalOpen, setIsIncidentAuditModalOpen] = useState(false);


  const {
    companions,
    addCompanion,
    updateCompanion,
    toggleCompanionActive,
    softDeleteCompanion,
    restoreCompanion,
    permanentDeleteCompanion,
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    importCompanionsFromCSV
  } = useCrudStore();

  const { theme, toggleTheme } = useTheme();

  const validTabs: ERPModuleTab[] = [
    'overview', 'executive', 'users', 'verification', 'companions',
    'categories', 'bookings', 'payments', 'communication', 'safety',
    'disputes', 'reviews', 'location', 'notifications', 'promotions',
    'analytics', 'staff', 'security', 'audit', 'settings', 'health',
    'email-config', 'email-templates'
  ];

  const [activeTabState, setActiveTabState] = useState<ERPModuleTab>('overview');

  const setActiveTab = (tab: ERPModuleTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sathi_admin_active_tab', tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState(null, '', url.pathname + url.search);
      } catch (e) {
        // Fallback
      }
    }
  };

  const activeTab = activeTabState;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlTab = searchParams.get('tab') as ERPModuleTab | null;
      const storedTab = localStorage.getItem('sathi_admin_active_tab') as ERPModuleTab | null;

      const targetTab = (urlTab && validTabs.includes(urlTab))
        ? urlTab
        : (storedTab && validTabs.includes(storedTab))
          ? storedTab
          : null;

      if (targetTab) {
        setActiveTabState(targetTab);
        const url = new URL(window.location.href);
        if (url.searchParams.get('tab') !== targetTab) {
          url.searchParams.set('tab', targetTab);
          window.history.replaceState(null, '', url.pathname + url.search);
        }
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  // Sync Categories & Sub-Services dynamically from Neon PostgreSQL DB API
  useEffect(() => {
    async function loadDbCategories() {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          useAdminStore.setState({ categories: json.data });
        }
      } catch (e) {
        console.warn('Failed to sync categories from Neon DB:', e);
      }
    }
    loadDbCategories();
  }, []);

  // Dynamic Companion Profiles State fetched from Database / API
  const [dbCompanions, setDbCompanions] = useState<UserProfile[]>([]);
  const [isLoadingCompanions, setIsLoadingCompanions] = useState(false);

  const loadDbCompanions = async () => {
    setIsLoadingCompanions(true);
    try {
      const res = await fetch('/api/companions?limit=100');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDbCompanions(json.data);
      }
    } catch (e) {
      console.warn('Failed to sync companions from DB:', e);
    } finally {
      setIsLoadingCompanions(false);
    }
  };

  useEffect(() => {
    loadDbCompanions();
  }, []);



  const [subFilter, setSubFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<PageSizeOption>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [notification, setNotification] = useState<string | null>(null);
  const [companionViewMode, setCompanionViewMode] = useState<'grid' | 'table'>('grid');
  const [bookingViewMode, setBookingViewMode] = useState<'grid' | 'table'>('grid');

  const filteredCategoriesList = useMemo(() => {
    return categories.filter((cat: ServiceCategory) => {
      const matchesSearch = !searchQuery ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (categoryFilter === 'low') return cat.riskLevel === 'LOW';
      if (categoryFilter === 'medium') return cat.riskLevel === 'MEDIUM';
      if (categoryFilter === 'high') return cat.riskLevel === 'HIGH' || cat.riskLevel === 'CRITICAL';
      if (categoryFilter === 'featured') return !!cat.isFeatured;
      if (categoryFilter === 'active') return !!cat.isActive;

      return true;
    });
  }, [categories, categoryFilter, searchQuery]);

  // Reset page number whenever filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, subFilter, searchQuery, pageSize]);

  // Flattened Sub-Services List
  const allSubServices = useMemo(() => {
    return categories.flatMap((cat: ServiceCategory) =>
      (cat.subcategories || []).map((sub: SubCategoryItem) => ({
        ...sub,
        categoryName: cat.name,
        categoryRisk: cat.riskLevel,
      }))
    );
  }, [categories]);

  const filteredSubServices = useMemo(() => {
    return allSubServices.filter((sub) => {
      const matchesSearch = !searchQuery ||
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (categoryFilter === 'low') return sub.categoryRisk === 'LOW';
      if (categoryFilter === 'medium') return sub.categoryRisk === 'MEDIUM';
      if (categoryFilter === 'high') return sub.categoryRisk === 'HIGH' || sub.categoryRisk === 'CRITICAL';

      return true;
    });
  }, [allSubServices, categoryFilter, searchQuery]);

  const paginatedCategoriesList = useMemo(() => {
    if (pageSize === 'All') return filteredCategoriesList;
    const start = (currentPage - 1) * pageSize;
    return filteredCategoriesList.slice(start, start + pageSize);
  }, [filteredCategoriesList, currentPage, pageSize]);

  const paginatedSubServices = useMemo(() => {
    if (pageSize === 'All') return filteredSubServices;
    const start = (currentPage - 1) * pageSize;
    return filteredSubServices.slice(start, start + pageSize);
  }, [filteredSubServices, currentPage, pageSize]);

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Category Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [viewingCategory, setViewingCategory] = useState<ServiceCategory | null>(null);

  // Booking Modal States
  const [viewingBooking, setViewingBooking] = useState<BookingDetails | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  // Location Modal States
  const [viewingLocation, setViewingLocation] = useState<LocationItem | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [isLocationFormOpen, setIsLocationFormOpen] = useState(false);

  // Payment & Finance Modal States
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<PaymentGatewayConfig | null>(null);
  const [auditingTransaction, setAuditingTransaction] = useState<FinancialTransaction | null>(null);

  // Promotion & Coupons Modal States
  const [isPromoFormOpen, setIsPromoFormOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCodeItem | null>(null);
  const [viewingPromo, setViewingPromo] = useState<PromoCodeItem | null>(null);





  // Admin User Session info & Security Guard
  const [adminUser, setAdminUser] = useState<{ email: string; fullName: string; role: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    const storedToken = localStorage.getItem('adminToken');

    if (!storedUser || !storedToken) {
      setIsAuthenticated(false);
      router.replace('/admin/login?secret=SATHI_SECURE_SUPERADMIN_KEY_2026');
      return;
    }

    try {
      setAdminUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } catch (e) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsAuthenticated(false);
      router.replace('/admin/login?secret=SATHI_SECURE_SUPERADMIN_KEY_2026');
    }
  }, [router]);

  // Reset sub-filter when active main module tab changes
  useEffect(() => {
    setSubFilter('all');
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  // View Trash state for Directory
  const [viewTrash, setViewTrash] = useState(false);

  // Create User Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCompanionModalData, setEditingCompanionModalData] = useState<UserProfile | null>(null);
  const [viewingCompanionProfile, setViewingCompanionProfile] = useState<UserProfile | null>(null);
  const [localStatusOverrides, setLocalStatusOverrides] = useState<Record<string, 'ACTIVE' | 'INACTIVE'>>({});

  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createCity, setCreateCity] = useState('');
  const [createRate, setCreateRate] = useState('75');

  // Edit User Modal State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRate, setEditRate] = useState('80');

  // New Promo Code Form state
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('10');

  // Broadcast Notification Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastChannel, setBroadcastChannel] = useState<'PUSH' | 'EMAIL' | 'SMS'>('PUSH');

  const triggerNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleCompanionStatus = async (id: string) => {
    const isDynamic = companions.some(c => c.id === id);
    if (isDynamic) {
      toggleCompanionActive(id);
    }
    const currentComp = combinedCompanionsList.find(c => c.id === id);
    const currentStatus = localStatusOverrides[id] || currentComp?.status || 'ACTIVE';
    const nextStatus: 'ACTIVE' | 'INACTIVE' = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setLocalStatusOverrides(prev => ({ ...prev, [id]: nextStatus }));
    triggerNotify(`Companion ${currentComp?.name || id} status switched to ${nextStatus}!`);

    // Async sync with database API
    const compInDb = dbCompanions.find(c => c.id === id);
    if (compInDb) {
      setDbCompanions(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus as any } : c));
      try {
        await fetch(`/api/companions/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus }),
        });
      } catch (e) { }
    }
  };

  // 100% Pure Dynamic Companion List for Admin Hub (from Onboarding Store + Live DB)
  const combinedCompanionsList = useMemo(() => {
    const dynamicMapped: UserProfile[] = companions.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone || '+1 415-555-0192',
      role: 'VERIFIED_COMPANION',
      city: c.city || 'New York',
      country: c.country || 'USA',
      state: c.state,
      pincode: c.pincode,
      age: c.age || 25,
      gender: c.gender || 'Female',
      avatar: c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      photos: c.photos && c.photos.length > 0 ? c.photos : [c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'],
      categories: c.categories && c.categories.length > 0 ? c.categories : [c.category || 'Event Companion'],
      skills: c.skills && c.skills.length > 0 ? c.skills : ['Multilingual', 'Event Hosting'],
      languages: c.languages && c.languages.length > 0 ? c.languages : ['English'],
      hourlyRate: c.hourlyRate || 50,
      dailyRate: c.dailyRate || ((c.hourlyRate || 50) * 7),
      weeklyRate: c.weeklyRate || ((c.hourlyRate || 50) * 40),
      ratingAvg: c.ratingAvg || 5.0,
      ratingCount: c.ratingCount || 1,
      completedBookings: c.completedBookings || 0,
      status: localStatusOverrides[c.id] || (c.status as CompanionStatus) || (c.isActive ? 'ACTIVE' : 'INACTIVE'),
      verificationBadge: true,
      isAvailableNow: true,
      bio: c.bio || 'Verified companion profile registered in Sathi ERP.',
      createdSource: c.createdSource || 'ADMIN',
      aadhaarNumber: c.aadhaarNumber,
      kycStatus: c.kycStatus || 'APPROVED',
      createdAt: c.createdAt || new Date().toISOString().split('T')[0]
    }));

    const dynamicIds = new Set(dynamicMapped.map(d => d.id));
    const liveDbCompanions = (dbCompanions || []).filter(db => !dynamicIds.has(db.id)).map(db => ({
      ...db,
      status: localStatusOverrides[db.id] || db.status || 'ACTIVE'
    }));

    return [...dynamicMapped, ...liveDbCompanions];
  }, [companions, dbCompanions, localStatusOverrides]);

  // Filtered Companion Directory based on Trash state & search query
  const activeCompanions = companions.filter((c: DynamicCompanionItem) => !c.isDeleted);
  const trashedCompanions = companions.filter((c: DynamicCompanionItem) => c.isDeleted);
  const rawList = viewTrash ? trashedCompanions : activeCompanions;

  const displayedCompanions = rawList.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName || !createEmail) return;

    addCompanion({
      name: createName,
      email: createEmail,
      city: createCity || 'New York',
      country: 'USA',
      age: 25,
      hourlyRate: Number(createRate) || 75,
      ratingAvg: 5.0,
      status: 'ACTIVE',
      category: 'Event Companion'
    });

    triggerNotify(`User ${createName} created successfully!`);
    setShowCreateModal(false);
    setCreateName('');
    setCreateEmail('');
    setCreateCity('');
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    updateCompanion(editingUserId, {
      name: editName,
      hourlyRate: Number(editRate) || 80
    });

    triggerNotify(`User #${editingUserId} updated dynamically!`);
    setEditingUserId(null);
  };

  // 20 Core Admin ERP Modules Grouped Logically in Sidebar
  const sidebarGroups: SidebarGroup[] = [
    {
      groupTitle: '📊 DASHBOARD & CORE',
      items: [
        { id: 'overview', label: '📊 Executive Dashboard', icon: BarChart3 },
        { id: 'analytics', label: '📈 Analytics & Reports', icon: TrendingUp },
      ]
    },
    {
      groupTitle: '👥 USER & COMPANION MANAGEMENT',
      items: [
        { id: 'users', label: '👥 User Management', icon: Users, badge: `${companions.length}`, badgeColor: 'bg-indigo-500/20 text-indigo-300' },
        { id: 'verification', label: '🪪 Verification & KYC', icon: UserCheck, badge: `${MOCK_KYC_QUEUE.length} Pending`, badgeColor: 'bg-amber-500/20 text-amber-300' },
        { id: 'companions', label: '🤝 Companion Management', icon: ShieldCheck },
      ]
    },
    {
      groupTitle: '🛎️ CATALOG & BOOKINGS',
      items: [
        { id: 'categories', label: '🛎️ Services & Categories', icon: Sliders },
        { id: 'bookings', label: '📅 Booking Management', icon: Clock, badge: `${MOCK_BOOKINGS.length}`, badgeColor: 'bg-blue-500/20 text-blue-300' },
        { id: 'location', label: '📍 Location Management', icon: MapPin },
      ]
    },
    {
      groupTitle: '💰 FINANCE & REVENUE',
      items: [
        { id: 'payments', label: '💰 Payments & Finance', icon: DollarSign, badge: '$14.8k', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
        { id: 'promotions', label: '🎁 Promotions & Coupons', icon: Tag, badge: `${promos.length}`, badgeColor: 'bg-purple-500/20 text-purple-300' },
      ]
    },
    {
      groupTitle: '🛡️ TRUST, SAFETY & MODERATION',
      items: [
        { id: 'safety', label: '🛡️ Trust & Safety', icon: ShieldAlert, badge: `${MOCK_PANIC_ALERTS.length} Alerts`, badgeColor: 'bg-rose-500/20 text-rose-300 animate-pulse' },
        { id: 'disputes', label: '⚖️ Disputes & Resolution', icon: Scale },
        { id: 'reviews', label: '⭐ Reviews & Moderation', icon: Star },
        { id: 'communication', label: '💬 Communication', icon: MessageSquare },
      ]
    },
    {
      groupTitle: '⚙️ ADMINISTRATION & GOVERNANCE',
      items: [
        { id: 'notifications', label: '🔔 Notifications Engine', icon: Bell },
        { id: 'email-config', label: '📧 SMTP Email Gateway', icon: Mail, badge: 'Active', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
        { id: 'email-templates', label: '📝 Dynamic Email Templates', icon: FileText },
        { id: 'staff', label: '👨‍💼 Staff & Access Control', icon: UserCog },
        { id: 'security', label: '🔐 Security Center', icon: Lock },
        { id: 'audit', label: '📝 Audit Logs', icon: FileText },
        { id: 'settings', label: '⚙️ System Settings', icon: Settings },
        { id: 'health', label: '🔧 System Health', icon: Activity, badge: 'Operational', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
      ]
    }
  ];

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4 font-sans">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl max-w-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Verifying Admin Authorization</h3>
            <p className="text-xs text-slate-400 mt-1">Securing enterprise session gate...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4 font-sans">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-rose-500/10 border border-rose-500/30 shadow-2xl backdrop-blur-xl max-w-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-300">Access Denied</h3>
            <p className="text-xs text-slate-400 mt-1">Unauthenticated request. Redirecting to Admin Login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen w-full bg-slate-950 text-slate-100 flex overflow-hidden font-sans">

      {/* ========================================== */}
      {/* 🟢 ENTERPRISE LEFT SIDEBAR (DESKTOP)       */}
      {/* ========================================== */}
      <aside
        className={`hidden lg:flex ${sidebarCollapsed ? 'w-14' : 'w-52'
          } h-screen sticky top-0 bg-slate-900/90 border-r border-slate-800/80 backdrop-blur-xl flex-col justify-between transition-all duration-300 relative z-30 shrink-0 select-none text-xs`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-11 px-3 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-sm shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-extrabold text-white tracking-tight">Sathi</span>
                    <span className="text-[8.5px] font-bold px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">ERP v3.0</span>
                  </div>
                  <p className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">Enterprise Hub</p>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className={`w-3 h-3 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Module Navigation List */}
          <div className="p-2 space-y-2.5 overflow-y-auto max-h-[calc(100vh-90px)] custom-scrollbar">
            {sidebarGroups.map((group, idx) => (
              <div key={idx} className="space-y-0.5">
                {!sidebarCollapsed && (
                  <h3 className="px-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    {group.groupTitle}
                  </h3>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] font-medium transition-all group ${isActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className={`w-3 h-3 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!sidebarCollapsed && item.badge && (
                        <span className={`text-[8px] font-mono px-1 py-0.2 rounded-full border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Admin Footer User Session */}
        <div className="p-2 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Admin Avatar"
                className="w-6 h-6 rounded-md object-cover border border-purple-500/50 shrink-0"
              />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate leading-tight">{adminUser?.fullName || 'Super Admin'}</p>
                  <p className="text-[8.5px] text-slate-400 truncate leading-tight">{adminUser?.email || 'admin@sathi.com'}</p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Logout Admin Session"
                className="p-1 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/50 hover:border-rose-500/30 transition-all shrink-0"
              >
                <LogOut className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* ========================================== */}
      {/* 📱 MOBILE SIDEBAR DRAWER OVERLAY          */}
      {/* ========================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex lg:hidden">
          <div className="w-80 bg-slate-900 border-r border-slate-800 h-full flex flex-col justify-between p-5 overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Sathi ERP</h3>
                    <p className="text-[10px] font-mono text-purple-400">Enterprise Mobile Menu</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-6">
                {sidebarGroups.map((group, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h3 className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                      {group.groupTitle}
                    </h3>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${isActive ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-300 font-bold">{adminUser?.fullName || 'Super Admin'}</div>
              <button onClick={handleLogout} className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* ========================================== */}
      {/* 🟦 MAIN ERP DASHBOARD CONTENT AREA        */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-950 custom-scrollbar">

        {/* Top ERP Header Navigation Bar */}
        <header className="h-11 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 sticky top-0 z-30">

          {/* Left: Mobile Menu Trigger & Breadcrumb */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <span className="hidden sm:inline">ERP Command</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-purple-400 font-bold uppercase tracking-wider">{activeTab}</span>
            </div>
            <span className="hidden sm:flex px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8.5px] font-bold items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>

          {/* Top Bar Actions & Search */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Search Bar + Limit Dropdown Right Side */}
            <div className="hidden md:flex items-center gap-1.5">
              <div className="relative">
                <Search className="w-3 h-3 text-slate-500 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search across all modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-36 lg:w-48 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-md py-0.5 pl-7 pr-2.5 text-[11px] text-white placeholder-slate-500 outline-none transition-all h-7"
                />
              </div>

              {/* Items limit dropdown right side of search */}
              <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-md px-1.5 py-0.5 text-[10px] h-7">
                <span className="text-[9.5px] text-slate-400 font-bold hidden lg:inline">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPageSize(val === 'All' ? 'All' : Number(val) as PageSizeOption);
                  }}
                  className="bg-transparent text-white font-bold outline-none cursor-pointer text-[10px]"
                >
                  <option value={10} className="bg-slate-900 text-white">10</option>
                  <option value={25} className="bg-slate-900 text-white">25</option>
                  <option value={50} className="bg-slate-900 text-white">50</option>
                  <option value={100} className="bg-slate-900 text-white">100</option>
                  <option value="All" className="bg-slate-900 text-white">All</option>
                </select>
              </div>
            </div>


            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1 rounded-md bg-slate-900 border border-slate-800 text-amber-400 hover:border-purple-500/40 hover:scale-105 transition-all shadow-sm h-7 w-7 flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3 h-3 text-amber-400" />
              ) : (
                <Moon className="w-3 h-3 text-indigo-400" />
              )}
            </button>

            {/* Sync Button */}
            <button
              onClick={() => triggerNotify('All 20 module parameters re-synced.')}
              className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10.5px] font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1 shadow-sm h-7"
            >
              <RefreshCw className="w-2.5 h-2.5 text-purple-400" />
              <span className="hidden sm:inline">Sync State</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-600 hover:text-white text-[10.5px] font-semibold transition-all flex items-center gap-1 h-7"
            >
              <LogOut className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </header>

        {/* Dynamic Notification Banner */}
        {notification && (
          <div className="mx-3 sm:mx-4 mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* ERP Main Content Workspace */}
        <div className="flex-1 p-2.5 sm:p-3.5 space-y-3">

          {/* ==================================================== */}
          {/* MODULE 1: 📊 DASHBOARD & ANALYTICS                    */}
          {/* ==================================================== */}
          {(activeTab === 'overview' || activeTab === 'executive') && (
            <ExecutiveDashboardAdminPage />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsAdminPage />
          )}


          {/* ==================================================== */}
          {/* MODULE 2: 👥 USER MANAGEMENT                        */}
          {/* ==================================================== */}
          {activeTab === 'users' && <UserManagementModule />}


          {/* ==================================================== */}
          {/* MODULE 3: 🪪 VERIFICATION & KYC                      */}
          {/* ==================================================== */}
          {activeTab === 'verification' && <KycVerificationModule />}

          {/* ==================================================== */}
          {/* MODULE 4: 🤝 COMPANION MANAGEMENT                    */}
          {/* ==================================================== */}
          {activeTab === 'companions' && (
            <div className="space-y-3">
              {/* Header Actions & View Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Companion Management Hub
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Manage live companion profiles, status toggles, rate caps, and verify KYC credentials.</p>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Grid vs Table View Mode Switcher */}
                  <div className="flex items-center bg-slate-950 p-0.5 rounded-md border border-slate-800 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setCompanionViewMode('grid');
                        setPageSize(12);
                        setCurrentPage(1);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${companionViewMode === 'grid'
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                          : 'text-slate-400 hover:text-white'
                        }`}
                      title="Grid View (12 items per page)"
                    >
                      <LayoutGrid className="w-2.5 h-2.5" />
                      <span className="hidden md:inline">Grid (12)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCompanionViewMode('table');
                        setPageSize(10);
                        setCurrentPage(1);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${companionViewMode === 'table'
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                          : 'text-slate-400 hover:text-white'
                        }`}
                      title="Table View (10 items per page)"
                    >
                      <List className="w-2.5 h-2.5" />
                      <span className="hidden md:inline">Table (10)</span>
                    </button>
                  </div>

                  <button
                    onClick={loadDbCompanions}
                    className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                    title="Refresh Companions List"
                  >
                    <RefreshCw className={`w-3 h-3 text-indigo-400 ${isLoadingCompanions ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCompanionModalData(null);
                      setShowCreateModal(true);
                    }}
                    className="px-2.5 py-1 rounded-md gradient-bg-primary text-white text-[11px] font-bold hover:opacity-90 transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3 h-3" /> Register New Companion
                  </button>
                </div>
              </div>

              {/* Sub-Filter Tabs without ugly horizontal scrollbars */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {[
                  { id: 'all', label: 'All Companions', count: combinedCompanionsList.length },
                  { id: 'companion-profiles', label: 'Profiles', count: combinedCompanionsList.length },
                  { id: 'pending-approval', label: 'Pending', count: combinedCompanionsList.filter(c => c.status === 'PENDING_VERIFICATION').length },
                  { id: 'active-companions', label: 'Active', count: combinedCompanionsList.filter(c => c.status === 'ACTIVE').length },
                  { id: 'inactive', label: 'Inactive', count: combinedCompanionsList.filter(c => c.status === 'INACTIVE').length },
                  { id: 'restricted', label: 'Restricted / Suspended', count: combinedCompanionsList.filter(c => c.status === 'SUSPENDED').length },
                  { id: 'performance', label: 'Top Rated', count: combinedCompanionsList.filter(c => c.ratingAvg >= 4.9).length },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSubFilter(s.id);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10.5px] font-medium transition-all flex items-center gap-1 shrink-0 ${subFilter === s.id
                        ? 'bg-purple-600 text-white shadow-sm font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                  >
                    <span>{s.label}</span>
                    <span className={`text-[8px] px-1 py-0 rounded-full ${subFilter === s.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {s.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Filtered Companion Content: Grid vs Table */}
              {isLoadingCompanions ? (
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1.5">
                  <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin mx-auto" />
                  <h4 className="font-bold text-white text-xs">Loading live companion profiles from database...</h4>
                </div>
              ) : (() => {
                const list = combinedCompanionsList.filter(c => {
                  if (subFilter === 'pending-approval') return c.status === 'PENDING_VERIFICATION';
                  if (subFilter === 'active-companions') return c.status === 'ACTIVE';
                  if (subFilter === 'inactive') return c.status === 'INACTIVE';
                  if (subFilter === 'restricted') return c.status === 'SUSPENDED';
                  if (subFilter === 'performance') return c.ratingAvg >= 4.9;
                  return true;
                }).filter(c => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || (c.categories && c.categories.some((cat: string) => cat.toLowerCase().includes(q)));
                });

                if (list.length === 0) {
                  return (
                    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1.5">
                      <Users className="w-6 h-6 text-slate-600 mx-auto" />
                      <h4 className="font-bold text-white text-xs">No companion profiles found in this category</h4>
                      <p className="text-[11px] text-slate-400">Fill the companion onboarding form to add new dynamic companions to the database.</p>
                      <button
                        onClick={() => {
                          setEditingCompanionModalData(null);
                          setShowCreateModal(true);
                        }}
                        className="px-2.5 py-1 rounded-md gradient-bg-primary text-white text-[11px] font-bold hover:opacity-90 transition-all flex items-center gap-1 mx-auto mt-1.5 shadow-sm"
                      >
                        <Plus className="w-3 h-3" /> Go to Companion Onboarding Form
                      </button>
                    </div>
                  );
                }

                const effectiveLimit = pageSize === 'All' ? list.length : (typeof pageSize === 'number' ? pageSize : (companionViewMode === 'grid' ? 12 : 10));
                const paginatedList = pageSize === 'All'
                  ? list
                  : list.slice((currentPage - 1) * effectiveLimit, currentPage * effectiveLimit);

                return (
                  <div className="space-y-3">
                    {/* TABLE VIEW */}
                    {companionViewMode === 'table' ? (
                      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 shadow-sm scrollbar-none [&::-webkit-scrollbar]:hidden">
                        <table className="w-full text-left text-[11px] text-slate-300">
                          <thead className="bg-slate-950 text-slate-400 uppercase text-[8.5px] font-mono tracking-wider border-b border-slate-800">
                            <tr>
                              <th className="py-2 px-2.5 font-bold">Companion Profile</th>
                              <th className="py-2 px-2.5 font-bold">Location</th>
                              <th className="py-2 px-2.5 font-bold">Categories</th>
                              <th className="py-2 px-2.5 font-bold">Hourly Rate</th>
                              <th className="py-2 px-2.5 font-bold">Bookings</th>
                              <th className="py-2 px-2.5 font-bold">Rating</th>
                              <th className="py-2 px-2.5 font-bold">Status</th>
                              <th className="py-2 px-2.5 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {paginatedList.map((comp) => (
                              <tr key={comp.id} className="hover:bg-slate-800/40 transition-colors">
                                {/* Profile */}
                                <td className="py-2 px-2.5">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={comp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                                      alt={comp.name}
                                      onClick={() => comp.avatar && setLightboxImage(comp.avatar)}
                                      className="w-7 h-7 rounded-md object-cover border border-purple-500/30 shrink-0 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                                      title="Click to view image popup"
                                    />
                                    <div className="min-w-0">
                                      <span className="font-bold text-white text-xs block truncate leading-tight">{comp.name}, {comp.age || 25}</span>
                                      <div className="mt-0.5">
                                        {comp.createdSource === 'ADMIN' ? (
                                          <span className="inline-flex items-center gap-0.5 px-1 py-0 rounded text-[7.5px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                            <ShieldCheck className="w-2 h-2 text-purple-400" /> ADMIN
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-0.5 px-1 py-0 rounded text-[7.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                            <User className="w-2 h-2 text-emerald-400" /> SELF
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Location */}
                                <td className="py-2 px-2.5">
                                  <span className="flex items-center gap-1 text-slate-300 font-medium text-[10.5px]">
                                    <MapPin className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                                    {comp.city || 'Mumbai'}, {comp.country || 'India'}
                                  </span>
                                </td>

                                {/* Categories */}
                                <td className="py-2 px-2.5">
                                  <div className="flex flex-wrap gap-0.5 max-w-[180px]">
                                    {(comp.categories || ['Companion']).slice(0, 2).map((cat: string, idx: number) => (
                                      <span key={idx} className="text-[8px] px-1.5 py-0.2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium">
                                        {cat}
                                      </span>
                                    ))}
                                    {(comp.categories || []).length > 2 && (
                                      <span className="text-[7.5px] text-slate-500 font-mono">+{comp.categories.length - 2}</span>
                                    )}
                                  </div>
                                </td>

                                {/* Hourly Rate */}
                                <td className="py-2 px-2.5 font-mono font-bold text-emerald-400 text-xs">
                                  ₹{comp.hourlyRate || 1000}/hr
                                </td>

                                {/* Bookings */}
                                <td className="py-2 px-2.5 font-mono text-slate-200 text-xs">
                                  <span className="font-bold">{comp.completedBookings || 0}</span> <span className="text-slate-500 text-[8.5px]">Done</span>
                                </td>

                                {/* Rating */}
                                <td className="py-2 px-2.5">
                                  <div className="flex items-center gap-0.5 text-amber-400 font-bold text-xs">
                                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                                    <span>{comp.ratingAvg || 5.0}</span>
                                    <span className="text-slate-500 text-[8.5px] font-normal font-mono">({comp.ratingCount || 0})</span>
                                  </div>
                                </td>

                                {/* Status */}
                                <td className="py-2 px-2.5">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCompanionStatus(comp.id)}
                                    className={`group relative inline-flex items-center h-5 rounded-full px-1.5 transition-all duration-300 focus:outline-none text-[8.5px] font-bold font-mono gap-1 border shadow-sm cursor-pointer ${comp.status === 'ACTIVE'
                                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/40'
                                        : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border-rose-500/40'
                                      }`}
                                    title={comp.status === 'ACTIVE' ? 'Status: Active (Click to Set Inactive)' : 'Status: Inactive (Click to Set Active)'}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full transition-all ${comp.status === 'ACTIVE' ? 'bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse' : 'bg-rose-400 shadow-sm shadow-rose-400'}`} />
                                    <span>{comp.status === 'ACTIVE' ? 'Active' : 'Inactive'}</span>
                                  </button>
                                </td>

                                {/* Actions */}
                                <td className="py-2 px-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setViewingCompanionProfile(comp)}
                                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition-all flex items-center gap-1 shadow-sm"
                                      title="View Companion Profile"
                                    >
                                      <Eye className="w-2.5 h-2.5 text-purple-400" />
                                      <span>View</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingCompanionModalData(comp)}
                                      className="p-1 rounded bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 text-[10px] font-bold transition-all shadow-sm flex items-center justify-center"
                                      title="Edit Companion Profile"
                                    >
                                      <Pencil className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* GRID CARD VIEW (4 COLUMNS ON XL SCREENS) */
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                        {paginatedList.map((comp) => (
                          <div key={comp.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all space-y-2 flex flex-col justify-between shadow-sm">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={comp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                                  alt={comp.name}
                                  onClick={() => comp.avatar && setLightboxImage(comp.avatar)}
                                  className="w-9 h-9 rounded-lg object-cover border border-purple-500/30 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                  title="Click to view image popup"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1">
                                    <h4 className="font-bold text-white text-xs truncate leading-tight">{comp.name}, {comp.age || 25}</h4>
                                  </div>
                                  <span className="text-[7.5px] font-mono font-bold text-purple-400 bg-purple-500/10 px-1 py-0 rounded border border-purple-500/20 inline-block mt-0.5">
                                    CREATED BY ADMIN
                                  </span>
                                  <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5 leading-none truncate">
                                    <MapPin className="w-2.5 h-2.5 text-purple-400 shrink-0" /> {comp.city || 'Mumbai'}, {comp.country || 'India'}
                                  </p>
                                </div>
                              </div>

                              {/* Status Badge & Interactive Active / Inactive Switch Toggle */}
                              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                                <div className="flex items-center gap-0.5 text-amber-400 font-bold">
                                  <Star className="w-2.5 h-2.5 fill-amber-400" /> {comp.ratingAvg || 5.0}
                                  <span className="text-slate-500 text-[8.5px] font-normal font-mono">({comp.ratingCount || 0})</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleToggleCompanionStatus(comp.id)}
                                  className={`group relative inline-flex items-center h-5 rounded-full p-0.5 transition-all duration-300 focus:outline-none cursor-pointer ${comp.status === 'ACTIVE'
                                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 pl-1.5 pr-5'
                                      : 'bg-rose-500/20 border border-rose-500/40 text-rose-300 pl-5 pr-1.5'
                                    }`}
                                  title={comp.status === 'ACTIVE' ? 'Status: Active (Click to Set Inactive)' : 'Status: Inactive (Click to Set Active)'}
                                >
                                  <span className="text-[8px] font-extrabold select-none font-mono tracking-tight">
                                    {comp.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                  </span>
                                  <span
                                    className={`absolute top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${comp.status === 'ACTIVE'
                                        ? 'right-0.5 bg-emerald-500 text-white shadow-emerald-500/50'
                                        : 'left-0.5 bg-rose-600 text-white shadow-rose-600/50'
                                      }`}
                                  >
                                    {comp.status === 'ACTIVE' ? (
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                    ) : (
                                      <X className="w-2.5 h-2.5" />
                                    )}
                                  </span>
                                </button>
                              </div>

                              {/* Pricing & Bookings */}
                              <div className="grid grid-cols-2 gap-1 p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[10px]">
                                <div>
                                  <span className="text-[8px] text-slate-500 block uppercase font-mono">Hourly Rate</span>
                                  <span className="font-mono font-bold text-emerald-400 text-[11px]">₹{comp.hourlyRate || 1000}/hr</span>
                                </div>
                                <div>
                                  <span className="text-[8px] text-slate-500 block uppercase font-mono">Bookings</span>
                                  <span className="font-bold text-white text-[11px]">{comp.completedBookings || 0} Done</span>
                                </div>
                              </div>

                              {/* Categories */}
                              <div className="flex flex-wrap gap-0.5">
                                {(comp.categories || []).slice(0, 2).map((cat: string, idx: number) => (
                                  <span key={idx} className="text-[8px] px-1.5 py-0.2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 pt-2 border-t border-slate-800/80 mt-auto">
                              <button
                                type="button"
                                onClick={() => setViewingCompanionProfile(comp)}
                                className="flex-1 py-1 px-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10.5px] font-bold text-center transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                              >
                                <Eye className="w-3 h-3 text-purple-400" />
                                <span>View Profile</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCompanionModalData(comp)}
                                className="p-1 rounded-md bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 text-[10.5px] font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer"
                                title="Edit Companion Profile"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <PaginationFooter
                      currentPage={currentPage}
                      totalItems={list.length}
                      pageSize={pageSize}
                      onPageChange={(page) => setCurrentPage(page)}
                      labelSingular="companion"
                      labelPlural="companions"
                    />
                  </div>
                );
              })()}
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 5: 🛎️ SERVICES & CATEGORIES                   */}
          {/* ==================================================== */}
          {activeTab === 'categories' && (
            <ServiceCategoryHub />
          )}


          {/* ==================================================== */}
          {/* MODULE 6: 📅 BOOKING & ESCROW MANAGEMENT              */}
          {/* ==================================================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Header Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Total Bookings Ticket Volume</span>
                    <Calendar className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{bookings.length}</div>
                  <p className="text-[10px] text-slate-500">Across all platform categories</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Bank Escrow Vault Held</span>
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    ${bookings.filter((b: BookingDetails) => b.escrowStatus === 'HELD').reduce((acc: number, b: BookingDetails) => acc + b.totalAmount, 0).toLocaleString()}.00
                  </div>

                  <p className="text-[10px] text-amber-400/80 font-bold">Secured in Partner Bank Escrow</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Active Live Meetups</span>
                    <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {bookings.filter((b: BookingDetails) => b.status === 'IN_PROGRESS').length}
                  </div>
                  <p className="text-[10px] text-emerald-400/80 font-bold">GPS Live Location Monitoring Active</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Platform Service Revenue</span>
                    <DollarSign className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-indigo-400 font-mono">
                    ${bookings.reduce((acc: number, b: BookingDetails) => acc + (b.platformFee || 0), 0).toLocaleString()}.00
                  </div>

                  <p className="text-[10px] text-slate-500">From 10% platform commission fee</p>
                </div>
              </div>

              {/* Sub-Filter Tabs & Search Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {[
                    { id: 'all-bookings', label: 'All Bookings' },
                    { id: 'pending', label: 'Pending' },
                    { id: 'escrow-locked', label: 'Escrow Locked' },
                    { id: 'in-progress', label: 'Active Live' },
                    { id: 'completed', label: 'Completed' },
                    { id: 'cancelled', label: 'Cancelled & Refunded' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSubFilter(tab.id);
                        setCurrentPage(1);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${subFilter === tab.id
                          ? 'gradient-bg-primary text-white font-bold shadow-md shadow-indigo-600/30'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-end">
                  {/* Grid vs Table View Mode Switcher */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingViewMode('grid');
                        setPageSize(12);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${bookingViewMode === 'grid'
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'text-slate-400 hover:text-white'
                        }`}
                      title="Grid View (12 items per page)"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Grid (12)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingViewMode('table');
                        setPageSize(10);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${bookingViewMode === 'table'
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'text-slate-400 hover:text-white'
                        }`}
                      title="Table View (10 items per page)"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Table (10)</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsBookingFormOpen(true)}
                    className="px-4 py-2 rounded-xl gradient-bg-primary text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 justify-center transition-all hover:scale-[1.02] shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Create Manual Booking
                  </button>
                </div>
              </div>

              {/* Booking Content: Grid vs Table */}
              {(() => {
                let filtered = [...bookings];

                if (subFilter === 'pending') {
                  filtered = filtered.filter((b: BookingDetails) => b.status === 'PENDING_APPROVAL');
                } else if (subFilter === 'escrow-locked') {
                  filtered = filtered.filter((b: BookingDetails) => b.status === 'ESCROW_LOCKED' || b.escrowStatus === 'HELD');
                } else if (subFilter === 'in-progress') {
                  filtered = filtered.filter((b: BookingDetails) => b.status === 'IN_PROGRESS');
                } else if (subFilter === 'completed') {
                  filtered = filtered.filter((b: BookingDetails) => b.status === 'COMPLETED');
                } else if (subFilter === 'cancelled') {
                  filtered = filtered.filter((b: BookingDetails) => b.status === 'CANCELLED');
                }

                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase();
                  filtered = filtered.filter((b: BookingDetails) =>
                    b.bookingNumber.toLowerCase().includes(q) ||
                    b.userName.toLowerCase().includes(q) ||
                    b.companionName.toLowerCase().includes(q) ||
                    b.category.toLowerCase().includes(q)
                  );
                }

                if (filtered.length === 0) {
                  return (
                    <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                      <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
                      <h4 className="text-base font-bold text-white">No Bookings Found</h4>
                      <p className="text-xs text-slate-400">There are no booking tickets matching your current sub-filter or search term.</p>
                    </div>
                  );
                }

                const effectiveLimit = pageSize === 'All' ? filtered.length : (typeof pageSize === 'number' ? pageSize : (bookingViewMode === 'grid' ? 12 : 10));
                const paginatedBookings = pageSize === 'All'
                  ? filtered
                  : filtered.slice((currentPage - 1) * effectiveLimit, currentPage * effectiveLimit);

                return (
                  <div className="space-y-6">
                    {bookingViewMode === 'table' ? (
                      /* TABLE VIEW (10 PER PAGE) */
                      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl scrollbar-none [&::-webkit-scrollbar]:hidden">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
                            <tr>
                              <th className="py-3.5 px-4 font-bold">Booking #</th>
                              <th className="py-3.5 px-4 font-bold">Client User</th>
                              <th className="py-3.5 px-4 font-bold">Companion</th>
                              <th className="py-3.5 px-4 font-bold">Category</th>
                              <th className="py-3.5 px-4 font-bold">Schedule</th>
                              <th className="py-3.5 px-4 font-bold">Amount & Escrow</th>
                              <th className="py-3.5 px-4 font-bold">Status</th>
                              <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {paginatedBookings.map((b: BookingDetails) => (
                              <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                                  {b.bookingNumber}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="font-bold text-white block">{b.userName}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">Client ID: {b.userId}</span>
                                </td>
                                <td className="py-3 px-4 font-bold text-slate-200">
                                  {b.companionName}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium">
                                    {b.category}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-300 text-[11px] font-mono">
                                  <div>{b.date || (b.createdAt ? b.createdAt.split('T')[0] : 'Scheduled')}</div>
                                  <div className="text-slate-500 text-[10px]">{b.startTime}{b.endTime ? ` - ${b.endTime}` : ''}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-mono font-bold text-white text-xs">${b.totalAmount}.00</div>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${b.escrowStatus === 'HELD'
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    }`}>
                                    {b.escrowStatus === 'HELD' ? '🔒 Escrow Held' : '✓ Released'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${b.status === 'COMPLETED'
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : b.status === 'IN_PROGRESS'
                                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse'
                                        : b.status === 'CANCELLED'
                                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                    {b.status.replace('_', ' ')}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setViewingBooking(b)}
                                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-all"
                                    >
                                      Details
                                    </button>
                                    {b.escrowStatus === 'HELD' && (
                                      <button
                                        onClick={() => {
                                          releaseEscrow(b.id);
                                          triggerNotify(`Escrow funds for Booking #${b.id} released.`);
                                        }}
                                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-[11px] font-bold transition-all"
                                      >
                                        Release
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* GRID VIEW (12 PER PAGE) */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paginatedBookings.map((b: BookingDetails) => (
                          <BookingCard
                            key={b.id}
                            booking={b}
                            onViewDetails={(selected) => setViewingBooking(selected)}
                            onReleaseEscrow={(id) => {
                              releaseEscrow(id);
                              triggerNotify(`Escrow funds for Booking #${id} successfully released to companion.`);
                            }}
                            onRefund={(id) => {
                              refundBooking(id);
                              triggerNotify(`Booking #${id} cancelled and escrow refunded to client.`);
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <PaginationFooter
                      currentPage={currentPage}
                      totalItems={filtered.length}
                      pageSize={pageSize}
                      onPageChange={(page) => setCurrentPage(page)}
                      labelSingular="booking"
                      labelPlural="bookings"
                    />
                  </div>
                );
              })()}
            </div>
          )}


          {/* ==================================================== */}
          {/* MODULE 7: 💰 PAYMENTS & FINANCE                       */}
          {/* ==================================================== */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Top Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Total Financial Volume</span>
                    <DollarSign className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    ${transactions.reduce((acc: number, t: FinancialTransaction) => acc + t.amount, 0).toLocaleString()}.00
                  </div>
                  <p className="text-[10px] text-slate-500">Gross ledger throughput</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Escrow Vault Holding Reserve</span>
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    ${transactions.filter((t: FinancialTransaction) => t.status === 'HELD_IN_ESCROW').reduce((acc: number, t: FinancialTransaction) => acc + t.amount, 0).toLocaleString()}.00
                  </div>
                  <p className="text-[10px] text-amber-400/80 font-bold">Secured in Partner Bank Vault</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Companion Payouts Dispatched</span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    ${payouts.filter((p: PayoutRecord) => p.status === 'PAID').reduce((acc: number, p: PayoutRecord) => acc + p.amount, 0).toLocaleString()}.00
                  </div>
                  <p className="text-[10px] text-emerald-400/80 font-bold">{payouts.length} Direct Bank Wires Executed</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Platform Commission Net Revenue</span>
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-indigo-400 font-mono">
                    ${transactions.reduce((acc: number, t: FinancialTransaction) => acc + t.platformFee, 0).toLocaleString()}.00
                  </div>

                  <p className="text-[10px] text-slate-500">From 10% platform fee policy</p>
                </div>
              </div>

              {/* Sub-Filter Tabs & Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {[
                    { id: 'all-transactions', label: 'All Transactions' },
                    { id: 'escrow-held', label: '🔒 Escrow Vault' },
                    { id: 'payouts', label: '↗ Companion Payouts' },
                    { id: 'refunds', label: '↩ Customer Refunds' },
                    { id: 'platform-fees', label: '💰 Platform Revenue' },
                    { id: 'wallet-topups', label: '💳 Wallet Top-ups' },
                    { id: 'gateways', label: '⚡ Payment Gateways' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSubFilter(filter.id)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${subFilter === filter.id || (subFilter === 'all' && filter.id === 'all-transactions')
                          ? 'gradient-bg-primary text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search ref, client or host..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={() => setIsPayoutModalOpen(true)}
                    className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Dispatch Payout
                  </button>
                </div>
              </div>

              {/* View 1: Payment Gateways Config View */}
              {subFilter === 'gateways' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Configured Payment Provider Engines ({gateways.length})</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gateways.map((gw: PaymentGatewayConfig) => (

                      <div key={gw.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-white text-sm">{gw.name}</span>
                            <button
                              onClick={() => {
                                toggleGateway(gw.id);
                                triggerNotify(`Gateway ${gw.provider} status toggled!`);
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${gw.isEnabled ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' : 'bg-slate-950 text-slate-500 border-slate-800'
                                }`}
                            >
                              {gw.isEnabled ? 'ONLINE' : 'DISABLED'}
                            </button>
                          </div>

                          <div className="text-xs space-y-1 text-slate-400 font-mono">
                            <p>Merchant ID: <strong className="text-indigo-300">{gw.merchantId}</strong></p>
                            <p>Fee Rate: <strong className="text-amber-400">{gw.transactionFeePercent}%</strong> per txn</p>
                            <p>Environment: <span className="px-2 py-0.5 rounded bg-slate-950 text-indigo-400 text-[10px] border border-slate-800">{gw.environment}</span></p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex justify-end">
                          <button
                            onClick={() => setEditingGateway(gw)}
                            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-indigo-300 font-bold text-xs border border-slate-800 flex items-center gap-1"
                          >
                            <Settings className="w-3.5 h-3.5" /> Configure Gateway
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* View 2: Transaction Table View */
                (() => {
                  const filteredTxns = transactions.filter((t: FinancialTransaction) => {

                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase();
                      const match = t.transactionRef.toLowerCase().includes(q) ||
                        t.userName.toLowerCase().includes(q) ||
                        (t.companionName && t.companionName.toLowerCase().includes(q)) ||
                        (t.gatewayRef && t.gatewayRef.toLowerCase().includes(q));
                      if (!match) return false;
                    }
                    if (subFilter === 'escrow-held') return t.status === 'HELD_IN_ESCROW';
                    if (subFilter === 'payouts') return t.type === 'COMPANION_PAYOUT';
                    if (subFilter === 'refunds') return t.type === 'CUSTOMER_REFUND' || t.status === 'REFUNDED';
                    if (subFilter === 'platform-fees') return t.type === 'PLATFORM_FEE_CREDIT';
                    if (subFilter === 'wallet-topups') return t.type === 'WALLET_TOPUP';
                    return true;
                  });

                  return (
                    <TransactionTable
                      transactions={filteredTxns}
                      onViewLedger={(t) => setAuditingTransaction(t)}
                      onRefundTxn={(t) => {
                        processRefund(t.id, 'Admin ERP manual refund');
                        triggerNotify(`Transaction #${t.transactionRef} refunded!`);
                      }}
                    />
                  );
                })()
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE: 🎟 PROMOTIONS & COUPONS                       */}
          {/* ==================================================== */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              {/* Top Metrics KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Total Active Campaigns</span>
                    <Ticket className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {promos.filter((p: PromoCodeItem) => p.isActive).length} / {promos.length}
                  </div>
                  <p className="text-[10px] text-slate-500">Live promo campaigns</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Total Coupon Redemptions</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {promos.reduce((acc: number, p: PromoCodeItem) => acc + p.usageCount, 0).toLocaleString()}
                  </div>
                  <p className="text-[10px] text-emerald-400/80 font-bold">Successful client uses</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Client Savings Granted</span>
                    <Gift className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-indigo-400 font-mono">
                    ${promos.reduce((acc: number, p: PromoCodeItem) => acc + (p.usageCount * (p.discountValue || p.discountPercent || p.flatDiscount || 15)), 0).toLocaleString()}.00
                  </div>
                  <p className="text-[10px] text-slate-500">Total customer discount value</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Driven Booking Volume</span>
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    ${(promos.reduce((acc: number, p: PromoCodeItem) => acc + p.usageCount, 0) * 280).toLocaleString()}.00
                  </div>
                  <p className="text-[10px] text-amber-400/80 font-bold">Attributed gross booking revenue</p>
                </div>

              </div>

              {/* Sub-Filter Tabs & Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {[
                    { id: 'all-promos', label: 'All Coupons' },
                    { id: 'active-live', label: '⚡ Active & Live' },
                    { id: 'percentage-off', label: '% Percentage Discount' },
                    { id: 'flat-discount', label: '$ Flat Savings' },
                    { id: 'expired-promos', label: '⏳ Expired & Paused' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSubFilter(filter.id)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${subFilter === filter.id || (subFilter === 'all' && filter.id === 'all-promos')
                          ? 'gradient-bg-primary text-white shadow-md shadow-purple-600/30'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search code, title or terms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setEditingPromo(null);
                      setIsPromoFormOpen(true);
                    }}
                    className="px-4 py-2 rounded-2xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 shrink-0 hover:scale-[1.02] transition-transform"
                  >
                    <Plus className="w-4 h-4" /> Create Promo Code
                  </button>
                </div>
              </div>

              {/* Promo Card Grid */}
              {(() => {
                const today = new Date().toISOString().split('T')[0];
                let filtered = promos.filter((p: PromoCodeItem) => {
                  if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    const match = p.code.toLowerCase().includes(q) ||
                      p.title.toLowerCase().includes(q) ||
                      (p.description && p.description.toLowerCase().includes(q));
                    if (!match) return false;
                  }

                  if (subFilter === 'active-live') return p.isActive && (!p.expiryDate || p.expiryDate >= today);
                  if (subFilter === 'percentage-off') return p.discountType === 'PERCENTAGE' || p.discountPercent;
                  if (subFilter === 'flat-discount') return p.discountType === 'FLAT_AMOUNT' || p.flatDiscount;
                  if (subFilter === 'expired-promos') return !p.isActive || (p.expiryDate && p.expiryDate < today);

                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                      <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
                      <h4 className="text-base font-bold text-white">No Promotions Found</h4>
                      <p className="text-xs text-slate-400">There are no promo codes matching your sub-filter or search query.</p>
                      <button
                        onClick={() => {
                          setEditingPromo(null);
                          setIsPromoFormOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Create Promo Code
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((p: PromoCodeItem) => (

                      <PromoCard
                        key={p.id}
                        promo={p}
                        onEdit={(p) => {
                          setEditingPromo(p);
                          setIsPromoFormOpen(true);
                        }}
                        onAudit={(p) => setViewingPromo(p)}
                        onToggleActive={(id) => {
                          togglePromoCode(id);
                          triggerNotify(`Promo code #${id} status toggled!`);
                        }}
                        onDelete={(id) => {
                          deletePromoCode(id);
                          triggerNotify(`Promo code #${id} deleted!`);
                        }}
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
          )}



          {/* ==================================================== */}
          {/* MODULE 8: 💬 COMMUNICATION                           */}
          {/* ==================================================== */}
          {activeTab === 'communication' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {['conversations', 'message-reports', 'flagged-messages', 'blocked-users'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" /> Monitored Live Encrypted Chat Streams
                </h3>
                <div className="space-y-3">
                  {MOCK_MESSAGES.map(m => (
                    <div key={m.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">{m.senderName}: <span className="font-normal text-slate-300">{m.content}</span></p>
                        <p className="text-[10px] text-slate-500 mt-1">Timestamp: {m.timestamp} • End-to-End Encrypted</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">VERIFIED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 9: 🛡️ TRUST & SAFETY                         */}
          {/* ==================================================== */}
          {activeTab === 'safety' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {['safety-dashboard', 'user-reports', 'safety-incidents', 'risk-alerts', 'fraud-detection', 'suspicious-accounts', 'emergency-events', 'safety-actions'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-4">
                <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" /> Active SOS Emergency Event Feed
                </h3>
                {MOCK_PANIC_ALERTS.map(a => (
                  <div key={a.id} className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">Panic Alert: {a.userName}</p>
                      <p className="text-xs text-rose-300">{a.address}</p>
                    </div>
                    <button onClick={() => triggerNotify(`SOS Dispatch Sent for Alert #${a.id}!`)} className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30">Dispatch Emergency Team</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 10: ⚖️ DISPUTES & RESOLUTION                  */}
          {/* ==================================================== */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {['open-disputes', 'under-review', 'resolved', 'refund-cases', 'evidence'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <Scale className="w-10 h-10 text-purple-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Dispute Desk (0 Active Disputes)</h3>
                <p className="text-xs text-slate-400">All escrow transactions are currently smooth and dispute-free.</p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 11: ⭐ REVIEWS & MODERATION                   */}
          {/* ==================================================== */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {['reviews', 'reported-reviews', 'flagged-content', 'moderation-queue'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {MOCK_REVIEWS.map(r => (
                  <div key={r.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{r.authorName}</span>
                        <span className="text-amber-400 font-bold">★ {r.rating}/5</span>
                      </div>
                      <p className="text-slate-300 mt-1">"{r.comment}"</p>
                    </div>
                    <button onClick={() => triggerNotify(`Review #${r.id} moderated.`)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white">Approve Review</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 12: 📍 LOCATION MANAGEMENT                   */}
          {/* ==================================================== */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              {/* Top Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Operational City Hubs</span>
                    <Globe className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{locations.length}</div>
                  <p className="text-[10px] text-slate-500">Global & regional coverage hubs</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Active Field Operations</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {locations.filter((l: LocationItem) => l.isActive).length} Hubs
                  </div>
                  <p className="text-[10px] text-emerald-400/80 font-bold">100% Monitored via GPS Geofencing</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Geofenced Safe Zones</span>
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-indigo-400 font-mono">
                    {locations.reduce((acc: number, l: LocationItem) => acc + (l.geofencedZones?.length || 0), 0)}
                  </div>
                  <p className="text-[10px] text-slate-500">High-security meeting perimeters</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>High Surge Multipliers</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {locations.filter((l: LocationItem) => l.surgePricingMultiplier > 1.0).length} Cities
                  </div>

                  <p className="text-[10px] text-amber-400/80 font-bold">Peak demand surge activated</p>
                </div>
              </div>

              {/* Dynamic Cascading Location Selector */}
              <CascadingLocationSelector />

              {/* Sub-Filter Bar & Action Toolbar */}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {[
                    { id: 'all-cities', label: 'All Cities' },
                    { id: 'active-hubs', label: 'Active Operational' },
                    { id: 'high-surge', label: '⚡ Surge Pricing' },
                    { id: 'tier-1', label: 'Tier 1 Metros' },
                    { id: 'risk-low', label: 'Low Risk' },
                    { id: 'risk-medium', label: 'Medium Risk' },
                    { id: 'risk-high', label: 'High Risk Alert' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSubFilter(filter.id)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${subFilter === filter.id || (subFilter === 'all' && filter.id === 'all-cities')
                          ? 'gradient-bg-primary text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search city, country or state..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setEditingLocation(null);
                      setIsLocationFormOpen(true);
                    }}
                    className="px-4 py-2 rounded-2xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 hover:opacity-90 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Operational City
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              {(() => {
                const filteredLocations = locations.filter((loc: LocationItem) => {
                  if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    const matchName = loc.name.toLowerCase().includes(q) || loc.country.toLowerCase().includes(q) || (loc.state && loc.state.toLowerCase().includes(q));
                    if (!matchName) return false;
                  }
                  if (subFilter === 'active-hubs') return loc.isActive;
                  if (subFilter === 'high-surge') return loc.surgePricingMultiplier > 1.0;
                  if (subFilter === 'tier-1') return loc.tier === 'TIER_1_METRO';
                  if (subFilter === 'risk-low') return loc.riskTier === 'LOW';
                  if (subFilter === 'risk-medium') return loc.riskTier === 'MEDIUM';
                  if (subFilter === 'risk-high') return loc.riskTier === 'HIGH' || loc.riskTier === 'CRITICAL';
                  return true;
                });

                if (filteredLocations.length === 0) {
                  return (
                    <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                      <MapPin className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
                      <h4 className="text-base font-bold text-white">No Operational Cities Found</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        No locations match the selected filter query. Try selecting "All Cities" or adding a new operational hub.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLocations.map((loc: LocationItem) => (

                      <LocationCard
                        key={loc.id}
                        location={loc}
                        onViewDetails={(item) => setViewingLocation(item)}
                        onToggleActive={(id) => {
                          toggleLocationActive(id);
                          triggerNotify(`Location status toggled for operational hub!`);
                        }}
                        onEditLocation={(item) => {
                          setEditingLocation(item);
                          setIsLocationFormOpen(true);
                        }}
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE: 🛡️ TRUST & SAFETY MANAGEMENT               */}
          {/* ==================================================== */}
          {activeTab === 'safety' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top 4 KPI Metrics Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-slate-900 border border-rose-500/40 space-y-2 shadow-lg shadow-rose-500/5">
                  <div className="flex items-center justify-between text-xs text-rose-400 font-bold">
                    <span>Active Live SOS Panic Alerts</span>
                    <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                  </div>
                  <div className="text-3xl font-black text-white font-mono flex items-center gap-2">
                    {sosAlerts.filter((a: SosAlertItem) => a.status === 'ACTIVE_DISPATCH' || a.status === 'RESPONDER_EN_ROUTE' || a.status === 'POLICE_NOTIFIED').length}
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
                  </div>
                  <p className="text-[10px] text-slate-400">Live GPS tracking & audio stream</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>Resolved Safe Alerts</span>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">
                    {sosAlerts.filter((a: SosAlertItem) => a.status === 'RESOLVED_SAFE').length}
                  </div>
                  <p className="text-[10px] text-emerald-400/80 font-bold">Verified zero casualties</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>Pending Safety Tickets</span>
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-amber-400 font-mono">
                    {incidentReports.filter((i: IncidentReport) => i.status === 'PENDING_AUDIT' || i.status === 'INVESTIGATING').length}
                  </div>
                  <p className="text-[10px] text-amber-400/80 font-bold">Under active investigation</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>Blacklisted Offenders</span>
                    <UserX className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-purple-400 font-mono">
                    {suspendedUserIds.length + incidentReports.filter((i: IncidentReport) => i.disciplinaryAction === 'PERMANENT_BAN').length}
                  </div>
                  <p className="text-[10px] text-purple-300 font-bold">Network ban enforced</p>
                </div>
              </div>

              {/* Toolbar & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                  {[
                    { id: 'all-alerts', label: '🚨 Live SOS Feeds' },
                    { id: 'open-incidents', label: '⚠️ Safety Incident Tickets' },
                    { id: 'resolved-safe', label: '🛡️ Verified Safe' },
                    { id: 'banned-offenders', label: '⛔ Banned & Suspended' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSubFilter(filter.id)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${subFilter === filter.id || (subFilter === 'all' && filter.id === 'all-alerts')
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-extrabold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search alerts, reference or user..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>

                  <button
                    onClick={() => {
                      triggerSosAlert({
                        userId: 'u-admin-test',
                        userName: 'Test Simulation Client',
                        locationName: 'Connaught Place, New Delhi',
                        coordinates: { lat: 28.6315, lng: 77.2167 },
                        severity: 'CRITICAL_EMERGENCY',
                        notes: 'Simulated admin test SOS trigger'
                      });
                      triggerNotify('Simulated Emergency SOS Triggered!');
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 shrink-0 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Trigger Test SOS
                  </button>
                </div>
              </div>

              {/* SOS Alert Grid View */}
              {(subFilter === 'all' || subFilter === 'all-alerts' || subFilter === 'resolved-safe') && (
                <div className="space-y-4">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-rose-500 animate-pulse" /> Emergency SOS Panic Monitor
                  </h3>

                  {(() => {
                    const filtered = sosAlerts.filter((a: SosAlertItem) => {
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase();
                        const matchRef = a.alertRef.toLowerCase().includes(q) || a.userName.toLowerCase().includes(q) || (a.companionName && a.companionName.toLowerCase().includes(q));
                        if (!matchRef) return false;
                      }
                      if (subFilter === 'resolved-safe') return a.status === 'RESOLVED_SAFE' || a.status === 'FALSE_ALARM';
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="p-10 text-center rounded-3xl bg-slate-900 border border-slate-800">
                          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                          <h4 className="text-sm font-bold text-white">All Clear — Zero Active Emergencies</h4>
                          <p className="text-xs text-slate-400">All companion GPS perimeters are safe.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((alert: SosAlertItem) => (
                          <SosAlertCard
                            key={alert.id}
                            alert={alert}
                            onDispatch={(item) => {
                              setSelectedSosAlert(item);
                              setIsSosDispatchModalOpen(true);
                            }}
                            onResolve={(item) => {
                              resolveSosAlert(item.id, 'Resolved via Admin Dashboard Control', false);
                              triggerNotify(`SOS Alert ${item.alertRef} marked as Resolved Safe.`);
                            }}
                          />
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Safety Incident Tickets Grid View */}
              {(subFilter === 'open-incidents' || subFilter === 'banned-offenders') && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" /> Trust & Safety Incident Audit Tickets
                  </h3>

                  {(() => {
                    const filteredIncidents = incidentReports.filter((inc: IncidentReport) => {
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase();
                        const matchRef = inc.incidentRef.toLowerCase().includes(q) || inc.reporterName.toLowerCase().includes(q) || inc.targetName.toLowerCase().includes(q);
                        if (!matchRef) return false;
                      }
                      if (subFilter === 'banned-offenders') return inc.disciplinaryAction === 'PERMANENT_BAN' || inc.disciplinaryAction === 'TEMPORARY_SUSPENSION';
                      return true;
                    });

                    if (filteredIncidents.length === 0) {
                      return (
                        <div className="p-10 text-center rounded-3xl bg-slate-900 border border-slate-800">
                          <CheckCircle2 className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                          <h4 className="text-sm font-bold text-white">No Incident Tickets Found</h4>
                          <p className="text-xs text-slate-400">No safety tickets match the selected query.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredIncidents.map((inc: IncidentReport) => (
                          <IncidentReportCard
                            key={inc.id}
                            incident={inc}
                            onAudit={(item) => {
                              setSelectedIncident(item);
                              setIsIncidentAuditModalOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}




          {/* ==================================================== */}
          {/* MODULE 13: 🔔 NOTIFICATIONS                          */}
          {/* ==================================================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['push-notifications', 'email', 'sms', 'notification-templates', 'notification-logs'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-w-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-400" /> Broadcast System Notification
                </h3>
                <input type="text" placeholder="Title" value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-purple-500" />
                <textarea placeholder="Message body..." value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-purple-500 h-24" />
                <button onClick={() => { triggerNotify(`Broadcast sent via ${broadcastChannel}!`); setBroadcastTitle(''); setBroadcastMessage(''); }} className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-600/25">Send Broadcast Notification</button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 14.5: ⚖️ DISPUTES & RESOLUTION COMMAND CENTER */}
          {/* ==================================================== */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <div>
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-400" /> Dispute & Arbitration Command Center
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Arbitrate booking conflicts, review evidence logs, lock/release escrow funds, and issue partial or full refunds.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/disputes"
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-slate-700"
                  >
                    Public Dispute Hub <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Dispute Cases</span>
                  <div className="text-xl font-bold text-white">{disputes.length} Cases</div>
                  <span className="text-[10px] text-purple-400 font-medium">All Time Tickets</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Pending Arbitration</span>
                  <div className="text-xl font-bold text-amber-400">
                    {disputes.filter(d => d.status === 'OPEN_LODGED' || d.status === 'UNDER_ARBITRATION').length} Active
                  </div>
                  <span className="text-[10px] text-amber-500 font-medium">Escrow Locked</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Escrow Funds Frozen</span>
                  <div className="text-xl font-mono font-bold text-emerald-400">
                    ${disputes.reduce((acc, d) => (d.escrowStatus === 'FROZEN' || d.escrowStatus === 'HELD' ? acc + d.disputedAmount : acc), 0)}
                  </div>
                  <span className="text-[10px] text-slate-500">Held in Vault</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Resolved & Settled</span>
                  <div className="text-xl font-bold text-indigo-400">
                    {disputes.filter(d => d.status.startsWith('RESOLVED')).length} Resolved
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">Customer/Companion Settled</span>
                </div>
              </div>

              {/* Sub-Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['all', 'open', 'arbitration', 'resolved', 'escalated'].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSubFilter(s); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${subFilter === s || (subFilter === 'all' && s === 'all')
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Toolbar & Data Table */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">

                {/* Search & Limit Selector Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by dispute ref, customer, companion, reason..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* SHOW SELECTOR (RIGHT SIDE OF SEARCH) */}
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 shrink-0 text-xs">
                      <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">Show:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPageSize(val === 'All' ? 'All' : Number(val) as PageSizeOption);
                          setCurrentPage(1);
                        }}
                        className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
                      >
                        <option value={10} className="bg-slate-900 text-white">10</option>
                        <option value={25} className="bg-slate-900 text-white">25</option>
                        <option value={50} className="bg-slate-900 text-white">50</option>
                        <option value={100} className="bg-slate-900 text-white">100</option>
                        <option value="All" className="bg-slate-900 text-white">All</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
                    <button
                      onClick={() => triggerNotify('Dispute CSV summary generated.')}
                      className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold"
                    >
                      Export Disputes CSV
                    </button>
                  </div>
                </div>

                {/* Table */}
                {(() => {
                  const filtered = disputes.filter(d => {
                    if (subFilter === 'open') return d.status === 'OPEN_LODGED';
                    if (subFilter === 'arbitration') return d.status === 'UNDER_ARBITRATION';
                    if (subFilter === 'resolved') return d.status.startsWith('RESOLVED');
                    if (subFilter === 'escalated') return d.status === 'ESCALATED_MANAGEMENT';
                    return true;
                  }).filter(d => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      d.disputeRef.toLowerCase().includes(q) ||
                      d.customerName.toLowerCase().includes(q) ||
                      d.companionName.toLowerCase().includes(q) ||
                      d.bookingNumber.toLowerCase().includes(q) ||
                      d.reason.toLowerCase().includes(q)
                    );
                  });

                  const paginated = pageSize === 'All' ? filtered : filtered.slice((currentPage - 1) * (pageSize as number), (currentPage - 1) * (pageSize as number) + (pageSize as number));

                  if (filtered.length === 0) {
                    return (
                      <div className="p-12 text-center text-slate-500 space-y-2">
                        <Scale className="w-10 h-10 text-slate-700 mx-auto" />
                        <p className="font-bold text-white text-base">No disputes match your current filter</p>
                        <p className="text-xs">Adjust search term or switch sub-filter tab.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <div className="overflow-x-auto rounded-2xl border border-slate-800">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 bg-slate-950 text-[10px] font-mono text-slate-400 uppercase">
                              <th className="py-3 px-4">Dispute Ref</th>
                              <th className="py-3 px-4">Booking Ref</th>
                              <th className="py-3 px-4">Customer vs Companion</th>
                              <th className="py-3 px-4">Category & Reason</th>
                              <th className="py-3 px-4">Disputed ($)</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {paginated.map((d) => (
                              <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold text-purple-400">{d.disputeRef}</td>
                                <td className="py-3.5 px-4 font-mono text-slate-300">{d.bookingNumber}</td>
                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-white">{d.customerName}</div>
                                  <div className="text-[10px] text-slate-400">vs {d.companionName}</div>
                                </td>
                                <td className="py-3.5 px-4 max-w-xs">
                                  <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 font-bold block w-max mb-1">
                                    {d.category.replace('_', ' ')}
                                  </span>
                                  <p className="text-slate-400 truncate">{d.reason}</p>
                                </td>
                                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">${d.disputedAmount}</td>
                                <td className="py-3.5 px-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${d.status.startsWith('RESOLVED')
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                      : d.status === 'UNDER_ARBITRATION'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                    }`}>
                                    {d.status.replace('_', ' ')}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setDrawerDispute(d)}
                                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all text-xs"
                                    >
                                      Chat Thread ({d.messages.length})
                                    </button>
                                    <button
                                      onClick={() => setAuditingDispute(d)}
                                      className="px-3 py-1.5 rounded-xl gradient-bg-primary text-white font-bold transition-all text-xs shadow"
                                    >
                                      Audit & Resolve
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <PaginationFooter
                        currentPage={currentPage}
                        totalItems={filtered.length}
                        pageSize={pageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                        labelSingular="dispute"
                        labelPlural="disputes"
                      />
                    </div>
                  );
                })()}

              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 14.8: ⭐ REVIEWS & MODERATION COMMAND CENTER  */}
          {/* ==================================================== */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <div>
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Review & Content Moderation Hub
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Audit user feedback, run automated spam checks, moderate flagged reviews, and manage companion ratings.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/reviews"
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-slate-700"
                  >
                    Public Review Feed <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Reviews</span>
                  <div className="text-xl font-bold text-white">{reviews.length} Reviews</div>
                  <span className="text-[10px] text-purple-400 font-medium">Platform Feedback</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Average Platform Score</span>
                  <div className="text-xl font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)} / 5.0
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">High Satisfaction</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Pending Moderation</span>
                  <div className="text-xl font-bold text-indigo-400">
                    {reviews.filter(r => r.status === 'PENDING_APPROVAL').length} Pending
                  </div>
                  <span className="text-[10px] text-slate-500">Awaiting Admin Review</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Flagged / Suspicious</span>
                  <div className="text-xl font-bold text-rose-400">
                    {reviews.filter(r => r.status === 'FLAGGED' || r.sentiment === 'SUSPICIOUS').length} Flagged
                  </div>
                  <span className="text-[10px] text-rose-500 font-medium">Spam / Toxic Content</span>
                </div>
              </div>

              {/* Sub-Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['all', 'pending', 'flagged', 'approved', 'rejected', '5-star', '1-star'].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSubFilter(s); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${subFilter === s || (subFilter === 'all' && s === 'all')
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Toolbar & Grid View */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">

                {/* Search & Page Limit Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search author, companion, review text..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* SHOW SELECTOR (RIGHT SIDE OF SEARCH) */}
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 shrink-0 text-xs">
                      <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">Show:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPageSize(val === 'All' ? 'All' : Number(val) as PageSizeOption);
                          setCurrentPage(1);
                        }}
                        className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
                      >
                        <option value={10} className="bg-slate-900 text-white">10</option>
                        <option value={25} className="bg-slate-900 text-white">25</option>
                        <option value={50} className="bg-slate-900 text-white">50</option>
                        <option value={100} className="bg-slate-900 text-white">100</option>
                        <option value="All" className="bg-slate-900 text-white">All</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
                    <button
                      onClick={() => triggerNotify('Review moderation report exported.')}
                      className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold"
                    >
                      Export Reviews CSV
                    </button>
                  </div>
                </div>

                {/* Grid */}
                {(() => {
                  const filtered = reviews.filter(r => {
                    if (subFilter === 'pending') return r.status === 'PENDING_APPROVAL';
                    if (subFilter === 'flagged') return r.status === 'FLAGGED' || r.sentiment === 'SUSPICIOUS';
                    if (subFilter === 'approved') return r.status === 'APPROVED';
                    if (subFilter === 'rejected') return r.status === 'REJECTED';
                    if (subFilter === '5-star') return r.rating === 5;
                    if (subFilter === '1-star') return r.rating === 1;
                    return true;
                  }).filter(r => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      r.authorName.toLowerCase().includes(q) ||
                      (r.companionName && r.companionName.toLowerCase().includes(q)) ||
                      r.comment.toLowerCase().includes(q)
                    );
                  });

                  const paginated = pageSize === 'All' ? filtered : filtered.slice((currentPage - 1) * (pageSize as number), (currentPage - 1) * (pageSize as number) + (pageSize as number));

                  if (filtered.length === 0) {
                    return (
                      <div className="p-12 text-center text-slate-500 space-y-2">
                        <Star className="w-10 h-10 text-slate-700 mx-auto" />
                        <p className="font-bold text-white text-base">No reviews match your current filter</p>
                        <p className="text-xs">Adjust search term or switch sub-filter tab.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginated.map((rev) => (
                          <ReviewCard
                            key={rev.id}
                            review={rev}
                            isAdminView={true}
                            onAudit={(r) => setAuditingReview(r)}
                            onApprove={(id) => {
                              approveReview(id);
                              triggerNotify(`Review approved!`);
                            }}
                          />
                        ))}
                      </div>

                      <PaginationFooter
                        currentPage={currentPage}
                        totalItems={filtered.length}
                        pageSize={pageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                        labelSingular="review"
                        labelPlural="reviews"
                      />
                    </div>
                  );
                })()}

              </div>
            </div>
          )}




          {/* ==================================================== */}
          {/* MODULE 15: 📈 ANALYTICS & REPORTS                     */}
          {/* ==================================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['users-analytics', 'booking-analytics', 'revenue', 'companion-analytics', 'cancellation-analytics', 'safety-analytics', 'custom-reports'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <BarChart3 className="w-10 h-10 text-purple-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Executive BI Analytics Engine</h3>
                <p className="text-xs text-slate-400">Generating real-time cohorts, user retention curves & companion performance analytics.</p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 16: 👨‍💼 STAFF & ACCESS CONTROL                */}
          {/* ==================================================== */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['admin-users', 'roles', 'permissions', 'teams', 'login-sessions'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-purple-400" /> Admin Staff Roles & RBAC Matrix
                </h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">Executive Super Admin</p>
                      <p className="text-slate-400">admin@sathi.com</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">SUPER_ADMIN</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 17: 🔐 SECURITY                               */}
          {/* ==================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['security-events', 'login-attempts', 'suspicious-devices', 'api-activity', 'security-audit'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-400" /> Security Controls & 2FA Enforcement
                </h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <span>Enforce 2FA Mandatory for Admin Login</span>
                  <input type="checkbox" checked={config.require2FAForAdmin} onChange={e => updateConfig({ require2FAForAdmin: e.target.checked })} className="w-4 h-4 rounded text-purple-600" />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 14: 💬 COMMUNICATION                           */}
          {/* ==================================================== */}
          {activeTab === 'communication' && (
            <AdminCommunicationPage />
          )}

          {/* ==================================================== */}
          {/* MODULE 18: 📝 AUDIT LOGS                             */}
          {/* ==================================================== */}
          {activeTab === 'audit' && (
            <AdminAuditLogsPage />
          )}

          {/* ==================================================== */}
          {/* MODULE 19: ⚙️ SYSTEM SETTINGS                        */}
          {/* ==================================================== */}
          {activeTab === 'settings' && (
            <AdminSystemSettingsPage />
          )}

          {/* ==================================================== */}
          {/* MODULE 20: 🔧 SYSTEM HEALTH                          */}
          {/* ==================================================== */}
          {activeTab === 'health' && (
            <AdminSystemHealthPage />
          )}

          {/* ==================================================== */}
          {/* MODULE 21: 📧 SMTP EMAIL CONFIGURATION               */}
          {/* ==================================================== */}
          {activeTab === 'email-config' && (
            <SmtpConfigModule />
          )}

          {/* ==================================================== */}
          {/* MODULE 22: 📝 DYNAMIC EMAIL TEMPLATES BUILDER        */}
          {/* ==================================================== */}
          {activeTab === 'email-templates' && (
            <EmailTemplateModule />
          )}


        </div>
      </main>

      {/* CREATE COMPANION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Companion Profile</h3>
            <form onSubmit={handleCreateUserSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="e.g. Jessica Miller"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="jessica@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">City / Location</label>
                <input
                  type="text"
                  value={createCity}
                  onChange={(e) => setCreateCity(e.target.value)}
                  placeholder="San Francisco, USA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={createRate}
                  onChange={(e) => setCreateRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-xs font-semibold text-white hover:bg-purple-500 shadow-lg shadow-purple-600/25"
                >
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COMPANION MODAL */}
      {editingUserId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Edit Companion #{editingUserId}</h3>
            <form onSubmit={handleEditUserSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={editRate}
                  onChange={(e) => setEditRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUserId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-xs font-semibold text-white hover:bg-purple-500 shadow-lg shadow-purple-600/25"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={!!lightboxImage}
        imageUrl={lightboxImage}
        title="Enlarged Image Preview"
        onClose={() => setLightboxImage(null)}
      />

      {/* Category Form Modal (Add / Edit) */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={async (catData) => {
          if (catData.id) {
            updateCategory(catData.id, catData);
            try {
              await fetch(`/api/categories/${catData.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(catData)
              });
            } catch (e) {
              console.warn('Neon DB update error:', e);
            }
            setNotification(`Category "${catData.name}" updated successfully.`);
          } else {
            addCategory(catData);
            try {
              const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(catData)
              });
              const json = await res.json();
              if (json.data && json.data.id) {
                updateCategory(json.data.id, json.data);
              }
            } catch (e) {
              console.warn('Neon DB create error:', e);
            }
            setNotification(`Category "${catData.name}" created successfully.`);
          }
        }}
      />

      {/* Category Details Modal */}
      <CategoryDetailsModal
        isOpen={!!viewingCategory}
        category={viewingCategory}
        onClose={() => setViewingCategory(null)}
      />

      {/* Booking Details Audit Modal */}
      <BookingDetailsModal
        isOpen={!!viewingBooking}
        booking={viewingBooking}
        onClose={() => setViewingBooking(null)}
        onUpdateStatus={(id, status, escrowStatus) => {
          updateBookingStatus(id, status, escrowStatus);
          if (viewingBooking && viewingBooking.id === id) {
            setViewingBooking({ ...viewingBooking, status, ...(escrowStatus ? { escrowStatus } : {}) });
          }
          triggerNotify(`Booking #${id} status updated to ${status}.`);
        }}
        onReleaseEscrow={(id) => {
          releaseEscrow(id);
          if (viewingBooking && viewingBooking.id === id) {
            setViewingBooking({ ...viewingBooking, status: 'COMPLETED', escrowStatus: 'RELEASED_TO_COMPANION' });
          }
          triggerNotify(`Escrow funds for Booking #${id} released to companion.`);
        }}
        onRefund={(id) => {
          refundBooking(id);
          if (viewingBooking && viewingBooking.id === id) {
            setViewingBooking({ ...viewingBooking, status: 'CANCELLED', escrowStatus: 'REFUNDED_TO_USER' });
          }
          triggerNotify(`Booking #${id} refunded to client.`);
        }}
      />

      {/* Booking Manual Dispatch Form Modal */}
      <BookingFormModal
        isOpen={isBookingFormOpen}
        onClose={() => setIsBookingFormOpen(false)}
        onSubmit={(data) => {
          const created = addBooking(data);
          triggerNotify(`Booking ticket #${created.bookingNumber} created and $${created.totalAmount} locked in bank escrow.`);
        }}
      />

      {/* Location Audit & Geofence Modal */}
      <LocationDetailsModal
        location={viewingLocation}
        isOpen={!!viewingLocation}
        onClose={() => setViewingLocation(null)}
        onUpdateSurge={(id, surge) => {
          updateLocationSurge(id, surge);
          if (viewingLocation && viewingLocation.id === id) {
            setViewingLocation({ ...viewingLocation, surgePricingMultiplier: surge });
          }
          triggerNotify(`Surge multiplier for ${viewingLocation?.name} set to ${surge}x!`);
        }}
        onAddZone={(id, zone) => {
          addGeofenceZone(id, zone);
          triggerNotify(`New geofenced safe zone added to ${viewingLocation?.name}!`);
        }}
        onAddVenue={(id, venue) => {
          addPopularVenue(id, venue);
          triggerNotify(`Verified safe meeting venue added to ${viewingLocation?.name}!`);
        }}
      />

      {/* Location Form Modal (Add / Edit) */}
      <LocationFormModal
        isOpen={isLocationFormOpen}
        location={editingLocation}
        onClose={() => {
          setIsLocationFormOpen(false);
          setEditingLocation(null);
        }}
        onSave={(locData) => {
          if ('id' in locData && locData.id) {
            updateLocation(locData.id, locData);
            triggerNotify(`Operational hub "${locData.name}" updated successfully.`);
          } else {
            addLocation(locData);
            triggerNotify(`Operational hub "${locData.name}" created successfully.`);
          }
          setIsLocationFormOpen(false);
          setEditingLocation(null);
        }}
      />

      {/* Payout Dispatch Modal */}
      <PayoutModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        onDispatch={(data) => {
          processPayout(data.companionId, data.companionName, data.bankName, data.accountNumberMasked, data.amount);
          triggerNotify(`Direct wire payout of $${data.amount} dispatched to ${data.companionName}!`);
        }}
      />

      {/* Payment Gateway Config Modal */}
      <PaymentConfigModal
        isOpen={!!editingGateway}
        gateway={editingGateway}
        onClose={() => setEditingGateway(null)}
        onSave={(id, updates) => {
          updateGatewayConfig(id, updates);
          triggerNotify(`Gateway ${editingGateway?.name} config saved!`);
        }}
      />

      {/* Financial Audit Ledger Modal */}
      <FinancialLedgerModal
        isOpen={!!auditingTransaction}
        transaction={auditingTransaction}
        onClose={() => setAuditingTransaction(null)}
        onRefund={(id) => {
          processRefund(id, 'Auditor requested refund');
          triggerNotify(`Escrow refunded for transaction #${auditingTransaction?.transactionRef}!`);
        }}
      />

      {/* Promo Code Form Modal */}
      <PromoFormModal
        isOpen={isPromoFormOpen}
        promo={editingPromo}
        onClose={() => {
          setIsPromoFormOpen(false);
          setEditingPromo(null);
        }}
        onSave={(data) => {
          if ('id' in data && data.id) {
            updatePromoCode(data.id, data);
            triggerNotify(`Promo code "${data.code}" updated successfully!`);
          } else {
            addPromoCode(data);
            triggerNotify(`New promo code "${data.code}" created successfully!`);
          }
          setIsPromoFormOpen(false);
          setEditingPromo(null);
        }}
      />

      {/* Promo Details Audit Modal */}
      <PromoDetailsModal
        isOpen={!!viewingPromo}
        promo={viewingPromo}
        onClose={() => setViewingPromo(null)}
      />

      {/* SOS Dispatch Modal */}
      <SosDispatchModal
        isOpen={isSosDispatchModalOpen}
        alert={selectedSosAlert}
        onClose={() => {
          setIsSosDispatchModalOpen(false);
          setSelectedSosAlert(null);
        }}
        onConfirmDispatch={(id, responderName, policeRef) => {
          dispatchResponders(id, responderName, policeRef);
          triggerNotify(`Emergency Responders (${responderName}) dispatched to SOS location!`);
          setIsSosDispatchModalOpen(false);
          setSelectedSosAlert(null);
        }}
      />

      {/* Incident Audit & Disciplinary Modal */}
      <IncidentAuditModal
        isOpen={isIncidentAuditModalOpen}
        incident={selectedIncident}
        onClose={() => {
          setIsIncidentAuditModalOpen(false);
          setSelectedIncident(null);
        }}
        onApplyAction={(id, action, notes) => {
          applySafetyDisciplinaryAction(id, action, notes);
          triggerNotify(`Disciplinary Action "${action.replace('_', ' ')}" enforced!`);
          setIsIncidentAuditModalOpen(false);
          setSelectedIncident(null);
        }}
        onUpdateStatus={(id, status, notes) => {
          updateIncidentStatus(id, status, notes);
          triggerNotify(`Incident ticket status updated to ${status}!`);
          setIsIncidentAuditModalOpen(false);
          setSelectedIncident(null);
        }}
      />

      {/* Dispute Audit & Financial Settlement Modal */}
      {auditingDispute && (
        <DisputeAuditModal
          dispute={auditingDispute}
          onClose={() => setAuditingDispute(null)}
          onSuccessNotification={(msg) => triggerNotify(msg)}
        />
      )}

      {/* Dispute Live Arbitration Drawer */}
      {drawerDispute && (
        <DisputeThreadDrawer
          dispute={drawerDispute}
          onClose={() => setDrawerDispute(null)}
        />
      )}

      {/* Review Audit & Content Moderation Modal */}
      {auditingReview && (
        <ReviewAuditModal
          review={auditingReview}
          onClose={() => setAuditingReview(null)}
          onSuccessNotification={(msg) => triggerNotify(msg)}
        />
      )}

      {/* Companion Form Modal (Create & Edit Full Features) */}
      <CompanionFormModal
        isOpen={showCreateModal || !!editingCompanionModalData}
        initialData={editingCompanionModalData}
        onClose={() => {
          setShowCreateModal(false);
          setEditingCompanionModalData(null);
        }}
        onSubmit={(data) => {
          if (editingCompanionModalData && editingCompanionModalData.id) {
            updateCompanion(editingCompanionModalData.id, {
              name: data.name,
              email: data.email,
              phone: data.phone,
              city: data.city,
              country: data.country,
              state: (data as any).state,
              pincode: (data as any).pincode,
              age: data.age,
              gender: data.gender,
              avatar: data.avatar,
              photos: data.photos,
              hourlyRate: data.hourlyRate,
              dailyRate: data.dailyRate,
              weeklyRate: data.weeklyRate,
              status: (data.status as any) || 'ACTIVE',
              category: data.categories?.[0] || 'Event Companion',
              categories: data.categories,
              skills: data.skills,
              languages: data.languages,
              bio: data.bio,
              createdSource: data.createdSource || 'ADMIN',
              aadhaarNumber: (data as any).aadhaarNumber,
              kycStatus: data.kycStatus || 'APPROVED'
            });
            triggerNotify(`Companion profile "${data.name}" updated successfully!`);
          } else {
            addCompanion({
              name: data.name || 'New Companion',
              email: data.email || 'companion@example.com',
              phone: data.phone || '+1 415-555-0192',
              city: data.city || 'New York',
              country: data.country || 'USA',
              state: (data as any).state || '',
              pincode: (data as any).pincode || '',
              age: data.age || 25,
              gender: data.gender || 'Female',
              avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
              photos: data.photos || ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'],
              hourlyRate: data.hourlyRate || 75,
              dailyRate: data.dailyRate || 350,
              weeklyRate: data.weeklyRate || 2000,
              ratingAvg: 5.0,
              ratingCount: 0,
              completedBookings: 0,
              status: (data.status as any) || 'ACTIVE',
              category: data.categories?.[0] || 'Event Companion',
              categories: data.categories || ['Event Companion'],
              skills: data.skills || ['Multilingual'],
              languages: data.languages || ['English'],
              bio: data.bio || 'Registered Companion Profile',
              createdSource: 'ADMIN',
              aadhaarNumber: (data as any).aadhaarNumber || '',
              kycStatus: data.kycStatus || 'APPROVED'
            });
            triggerNotify(`New companion profile for "${data.name}" created successfully by Admin!`);
          }
          setShowCreateModal(false);
          setEditingCompanionModalData(null);
        }}

      />

      {/* 👤 COMPANION PROFILE VIEW DETAILS MODAL */}
      {viewingCompanionProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-3 animate-fade-in font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-3 sm:p-4 space-y-2.5 shadow-2xl overflow-y-auto max-h-[92vh] custom-scrollbar">

            {/* Modal Header & Avatar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={viewingCompanionProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                  alt={viewingCompanionProfile.name}
                  onClick={() => viewingCompanionProfile.avatar && setLightboxImage(viewingCompanionProfile.avatar)}
                  className="w-10 h-10 rounded-lg object-cover border border-purple-500/40 shadow-sm cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                  title="Click to zoom image"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">
                      {viewingCompanionProfile.name}, {viewingCompanionProfile.age || 25}
                    </h3>
                    <span className="px-1.5 py-0.2 rounded-full text-[8.5px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {viewingCompanionProfile.gender || 'Female'}
                    </span>
                    {viewingCompanionProfile.createdSource === 'ADMIN' ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        <ShieldCheck className="w-2 h-2 text-purple-400" /> ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <User className="w-2 h-2 text-emerald-400" /> SELF
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-medium mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                    {viewingCompanionProfile.city || 'Mumbai'}, {viewingCompanionProfile.country || 'India'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setViewingCompanionProfile(null)}
                className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Metrics Bar: 4 columns */}
            <div className="grid grid-cols-4 gap-1.5">
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-[8px] text-slate-500 uppercase font-mono block">Hourly</span>
                <span className="text-[11px] sm:text-xs font-extrabold text-emerald-400 font-mono">₹{viewingCompanionProfile.hourlyRate || 1000}/hr</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-[8px] text-slate-500 uppercase font-mono block">Bookings</span>
                <span className="text-[11px] sm:text-xs font-extrabold text-white font-mono">{viewingCompanionProfile.completedBookings || 0} Done</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-[8px] text-slate-500 uppercase font-mono block">Rating</span>
                <span className="text-[11px] sm:text-xs font-extrabold text-amber-400 flex items-center justify-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-400" /> {viewingCompanionProfile.ratingAvg || 5.0}
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center flex flex-col justify-center items-center">
                <span className="text-[8px] text-slate-500 uppercase font-mono block">Status</span>
                <button
                  type="button"
                  onClick={() => handleToggleCompanionStatus(viewingCompanionProfile.id)}
                  className={`mt-0.5 px-1.5 py-0.2 rounded-full text-[8.5px] font-bold font-mono border transition-all cursor-pointer ${viewingCompanionProfile.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                    }`}
                >
                  {viewingCompanionProfile.status === 'ACTIVE' ? '✓ Active' : '✕ Inactive'}
                </button>
              </div>
            </div>

            {/* Middle 2-Column Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Left Column: Bio & Categories */}
              <div className="space-y-2">
                {viewingCompanionProfile.bio && (
                  <div className="space-y-0.5">
                    <h4 className="text-[9.5px] font-bold text-slate-400 uppercase font-mono">About / Bio</h4>
                    <p className="text-[10.5px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80 leading-relaxed max-h-20 overflow-y-auto custom-scrollbar">
                      {viewingCompanionProfile.bio}
                    </p>
                  </div>
                )}

                <div className="space-y-0.5">
                  <h4 className="text-[9.5px] font-bold text-slate-400 uppercase font-mono">Categories</h4>
                  <div className="flex flex-wrap gap-1">
                    {(viewingCompanionProfile.categories || ['Event Companion']).map((cat: string, idx: number) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[9.5px] font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Languages & Photo Gallery */}
              <div className="space-y-2">
                <div className="space-y-0.5">
                  <h4 className="text-[9.5px] font-bold text-slate-400 uppercase font-mono">Languages</h4>
                  <div className="flex flex-wrap gap-1">
                    {(viewingCompanionProfile.languages || ['English', 'Hindi']).map((lang: string, idx: number) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[9.5px] font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {viewingCompanionProfile.photos && viewingCompanionProfile.photos.length > 0 && (
                  <div className="space-y-0.5">
                    <h4 className="text-[9.5px] font-bold text-slate-400 uppercase font-mono">Photo Gallery ({viewingCompanionProfile.photos.length})</h4>
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5 custom-scrollbar">
                      {viewingCompanionProfile.photos.map((photo: string, idx: number) => (
                        <img
                          key={idx}
                          src={photo}
                          alt={`Photo ${idx + 1}`}
                          onClick={() => setLightboxImage(photo)}
                          className="w-9 h-9 rounded-md object-cover border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all shrink-0 hover:scale-105"
                          title="Click to preview full size"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-800 flex-wrap">
              <Link
                href={`/companion/${viewingCompanionProfile.id}`}
                target="_blank"
                className="px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 text-indigo-400 hover:text-white border border-slate-800 text-[10.5px] font-bold transition-all flex items-center gap-1"
              >
                <span>Open Public Page</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const compToEdit = viewingCompanionProfile;
                    setViewingCompanionProfile(null);
                    setEditingCompanionModalData(compToEdit);
                  }}
                  className="px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-[10.5px] font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Pencil className="w-2.5 h-2.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingCompanionProfile(null)}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10.5px] font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}







