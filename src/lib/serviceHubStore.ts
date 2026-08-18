import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CategoryItem,
  ServiceItem,
  PricingProfile,
  RulesProfile,
  RuleItem,
  PolicyItem,
  RiskLevelItem,
  VerificationProfileItem,
  SafetyProfileItem,
  BookingRuleItem,
  EligibilityProfileItem,
  ServicePublishStatus,
  ServiceHubAuditEntry
} from './types/serviceHub';
import {
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  DEFAULT_PRICING_PROFILES,
  DEFAULT_RULES_PROFILES,
  DEFAULT_POLICIES,
  DEFAULT_RISK_LEVELS,
  DEFAULT_VERIFICATION_PROFILES,
  DEFAULT_SAFETY_PROFILES,
  DEFAULT_BOOKING_RULES,
  DEFAULT_ELIGIBILITY_PROFILES
} from './initialHubData';

export type HubTabId = 
  | 'categories'
  | 'services'
  | 'pricing'
  | 'rules'
  | 'policies'
  | 'risk'
  | 'verification'
  | 'safety'
  | 'booking'
  | 'eligibility';

interface ServiceHubStore {
  // Tab State
  activeTab: HubTabId;
  setActiveTab: (tab: HubTabId) => void;

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (catId: string) => void;
  selectedRiskFilter: string;
  setSelectedRiskFilter: (riskId: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (status: string) => void;

  // 10 Centralized Modules State
  categories: CategoryItem[];
  services: ServiceItem[];
  pricingProfiles: PricingProfile[];
  rulesProfiles: RulesProfile[];
  policies: PolicyItem[];
  riskLevels: RiskLevelItem[];
  verificationProfiles: VerificationProfileItem[];
  safetyProfiles: SafetyProfileItem[];
  bookingRules: BookingRuleItem[];
  eligibilityProfiles: EligibilityProfileItem[];
  auditLogs: ServiceHubAuditEntry[];

  isCategoryFormOpen: boolean;
  setCategoryFormOpen: (open: boolean) => void;
  isServiceWizardOpen: boolean;
  setServiceWizardOpen: (open: boolean) => void;

  // Selected Service for Configuration Drawer
  selectedServiceForConfig: ServiceItem | null;
  setSelectedServiceForConfig: (service: ServiceItem | null) => void;

  // Category Actions
  addCategory: (cat: Omit<CategoryItem, 'id' | 'created_at' | 'updated_at'>) => CategoryItem;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => { success: boolean; error?: string };
  duplicateCategory: (id: string) => CategoryItem | null;
  toggleCategoryActive: (id: string) => void;
  toggleCategoryFeatured: (id: string) => void;
  reorderCategories: (orderedIds: string[]) => void;

  // Service Actions
  addService: (srv: Omit<ServiceItem, 'id' | 'created_at' | 'updated_at'>) => ServiceItem;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  publishService: (id: string) => { success: boolean; readinessMissing?: string[] };
  suspendService: (id: string) => void;
  duplicateService: (id: string) => ServiceItem | null;

  // Configuration Profile Actions
  addPricingProfile: (prof: Omit<PricingProfile, 'id'>) => PricingProfile;
  updatePricingProfile: (id: string, updates: Partial<PricingProfile>) => void;
  addRuleToProfile: (profileId: string, rule: Omit<RuleItem, 'id' | 'status'>) => void;
  updateRuleInProfile: (profileId: string, ruleId: string, updates: Partial<RuleItem>) => void;
  addPolicy: (pol: Omit<PolicyItem, 'id' | 'version' | 'effective_from'>) => PolicyItem;
  updatePolicy: (id: string, updates: Partial<PolicyItem>) => void;
  publishNewPolicyVersion: (policyId: string, versionDesc: string) => void;
  updateRiskLevel: (id: string, updates: Partial<RiskLevelItem>) => void;
  updateVerificationProfile: (id: string, updates: Partial<VerificationProfileItem>) => void;
  updateSafetyProfile: (id: string, updates: Partial<SafetyProfileItem>) => void;
  updateBookingRule: (id: string, updates: Partial<BookingRuleItem>) => void;
  updateEligibilityProfile: (id: string, updates: Partial<EligibilityProfileItem>) => void;

  // Bulk Actions
  bulkUpdateServiceStatus: (ids: string[], status: ServicePublishStatus) => void;
  bulkAssignRiskLevel: (ids: string[], riskId: string) => void;
  bulkAssignPolicy: (ids: string[], policyId: string) => void;
  syncFromNeonDB: () => Promise<void>;
  resetAllData: () => void;

  // Audit Logging
  addAuditLog: (module: string, entityId: string, action: string, oldValue?: any, newValue?: any) => void;
}

export const useServiceHubStore = create<ServiceHubStore>()(
  persist(
    (set, get) => ({
      activeTab: 'categories',
      setActiveTab: (tab) => set({ activeTab: tab }),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategoryFilter: 'ALL',
      setSelectedCategoryFilter: (catId) => set({ selectedCategoryFilter: catId }),
      selectedRiskFilter: 'ALL',
      setSelectedRiskFilter: (riskId) => set({ selectedRiskFilter: riskId }),
      selectedStatusFilter: 'ALL',
      setSelectedStatusFilter: (status) => set({ selectedStatusFilter: status }),

      isCategoryFormOpen: false,
      setCategoryFormOpen: (open) => set({ isCategoryFormOpen: open }),
      isServiceWizardOpen: false,
      setServiceWizardOpen: (open) => set({ isServiceWizardOpen: open }),

      categories: INITIAL_CATEGORIES,
      services: INITIAL_SERVICES,
      pricingProfiles: DEFAULT_PRICING_PROFILES,
      rulesProfiles: DEFAULT_RULES_PROFILES,
      policies: DEFAULT_POLICIES,
      riskLevels: DEFAULT_RISK_LEVELS,
      verificationProfiles: DEFAULT_VERIFICATION_PROFILES,
      safetyProfiles: DEFAULT_SAFETY_PROFILES,
      bookingRules: DEFAULT_BOOKING_RULES,
      eligibilityProfiles: DEFAULT_ELIGIBILITY_PROFILES,
      auditLogs: [],

      selectedServiceForConfig: null,
      setSelectedServiceForConfig: (service) => set({ selectedServiceForConfig: service }),

      // Category Actions
      addCategory: (cat) => {
        const newCat: CategoryItem = {
          ...cat,
          id: 'cat-' + Date.now(),
          slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
          display_order: get().categories.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        set(state => ({ categories: [...state.categories, newCat] }));
        get().addAuditLog('Categories', newCat.id, 'CREATE', null, newCat);
        return newCat;
      },

      updateCategory: (id, updates) => {
        const oldCat = get().categories.find(c => c.id === id);
        set(state => ({
          categories: state.categories.map(c =>
            c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
          )
        }));
        get().addAuditLog('Categories', id, 'UPDATE', oldCat, updates);
      },

      deleteCategory: (id) => {
        const activeSubServices = get().services.filter(s => s.category_id === id && s.status !== 'ARCHIVED');
        if (activeSubServices.length > 0) {
          return {
            success: false,
            error: `Cannot delete category containing ${activeSubServices.length} active service offerings. Please reassign or archive services first.`
          };
        }

        const oldCat = get().categories.find(c => c.id === id);
        set(state => ({
          categories: state.categories.filter(c => c.id !== id)
        }));
        get().addAuditLog('Categories', id, 'DELETE', oldCat, null);
        return { success: true };
      },

      duplicateCategory: (id) => {
        const target = get().categories.find(c => c.id === id);
        if (!target) return null;

        const duplicated: CategoryItem = {
          ...target,
          id: 'cat-' + Date.now(),
          name: `${target.name} (Copy)`,
          slug: `${target.slug}-copy-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        set(state => ({ categories: [...state.categories, duplicated] }));
        get().addAuditLog('Categories', duplicated.id, 'DUPLICATE', { sourceId: id }, duplicated);
        return duplicated;
      },

      toggleCategoryActive: (id) => {
        set(state => ({
          categories: state.categories.map(c =>
            c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE', updated_at: new Date().toISOString() } : c
          )
        }));
        get().addAuditLog('Categories', id, 'TOGGLE_STATUS');
      },

      toggleCategoryFeatured: (id) => {
        set(state => ({
          categories: state.categories.map(c =>
            c.id === id ? { ...c, is_featured: !c.is_featured, updated_at: new Date().toISOString() } : c
          )
        }));
        get().addAuditLog('Categories', id, 'TOGGLE_FEATURED');
      },

      reorderCategories: (orderedIds) => {
        set(state => ({
          categories: state.categories.map(c => {
            const idx = orderedIds.indexOf(c.id);
            return idx !== -1 ? { ...c, display_order: idx + 1 } : c;
          }).sort((a, b) => a.display_order - b.display_order)
        }));
        get().addAuditLog('Categories', 'all', 'REORDER', null, orderedIds);
      },

      // Service Actions
      addService: (srv) => {
        const category = get().categories.find(c => c.id === srv.category_id);
        const newSrv: ServiceItem = {
          ...srv,
          id: 'srv-' + Date.now(),
          category_name: category?.name || 'Unassigned',
          slug: srv.slug || srv.name.toLowerCase().replace(/\s+/g, '-'),
          pricing_profile_id: srv.pricing_profile_id || category?.default_pricing_profile_id,
          rules_profile_id: srv.rules_profile_id || category?.default_rules_id,
          policy_id: srv.policy_id || category?.default_policy_id,
          risk_level_id: srv.risk_level_id || category?.default_risk_level_id,
          verification_profile_id: srv.verification_profile_id || category?.default_verification_profile_id,
          safety_profile_id: srv.safety_profile_id || category?.default_safety_profile_id,
          booking_rule_id: srv.booking_rule_id || category?.default_booking_rule_id,
          eligibility_profile_id: srv.eligibility_profile_id || category?.default_eligibility_profile_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        set(state => ({ services: [newSrv, ...state.services] }));
        get().addAuditLog('Services', newSrv.id, 'CREATE', null, newSrv);
        return newSrv;
      },

      updateService: (id, updates) => {
        const oldSrv = get().services.find(s => s.id === id);
        set(state => ({
          services: state.services.map(s =>
            s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
          ),
          selectedServiceForConfig: state.selectedServiceForConfig?.id === id
            ? { ...state.selectedServiceForConfig, ...updates, updated_at: new Date().toISOString() }
            : state.selectedServiceForConfig
        }));
        get().addAuditLog('Services', id, 'UPDATE', oldSrv, updates);
      },

      deleteService: (id) => {
        const oldSrv = get().services.find(s => s.id === id);
        set(state => ({
          services: state.services.filter(s => s.id !== id),
          selectedServiceForConfig: state.selectedServiceForConfig?.id === id ? null : state.selectedServiceForConfig
        }));
        get().addAuditLog('Services', id, 'DELETE', oldSrv, null);
      },

      publishService: (id) => {
        const target = get().services.find(s => s.id === id);
        if (!target) return { success: false, readinessMissing: ['Service not found'] };

        const category = get().categories.find(c => c.id === target.category_id);
        const missing: string[] = [];

        if (!target.category_id || !category) missing.push('Category Assignment');
        if (!target.pricing_profile_id && !category?.default_pricing_profile_id) missing.push('Pricing Profile');
        if (!target.rules_profile_id && !category?.default_rules_id) missing.push('Rules Profile');
        if (!target.policy_id && !category?.default_policy_id) missing.push('Usage Policy');
        if (!target.risk_level_id && !category?.default_risk_level_id) missing.push('Risk Level Assignment');
        if (!target.verification_profile_id && !category?.default_verification_profile_id) missing.push('Verification Requirements');
        if (!target.safety_profile_id && !category?.default_safety_profile_id) missing.push('Safety Controls');
        if (!target.booking_rule_id && !category?.default_booking_rule_id) missing.push('Booking Rules');
        if (!target.eligibility_profile_id && !category?.default_eligibility_profile_id) missing.push('Eligibility Profile');

        if (missing.length > 0) {
          return { success: false, readinessMissing: missing };
        }

        get().updateService(id, { status: 'PUBLISHED' });
        get().addAuditLog('Services', id, 'PUBLISH', { previousStatus: target.status }, { status: 'PUBLISHED' });
        return { success: true };
      },

      suspendService: (id) => {
        get().updateService(id, { status: 'SUSPENDED' });
        get().addAuditLog('Services', id, 'SUSPEND', null, { status: 'SUSPENDED' });
      },

      duplicateService: (id) => {
        const target = get().services.find(s => s.id === id);
        if (!target) return null;

        const duplicated: ServiceItem = {
          ...target,
          id: 'srv-' + Date.now(),
          name: `${target.name} (Copy)`,
          slug: `${target.slug}-copy-${Date.now()}`,
          status: 'DRAFT',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        set(state => ({ services: [duplicated, ...state.services] }));
        get().addAuditLog('Services', duplicated.id, 'DUPLICATE', { sourceId: id }, duplicated);
        return duplicated;
      },

      // Profile Actions
      addPricingProfile: (prof) => {
        const newProf: PricingProfile = {
          ...prof,
          id: 'pr-' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set(state => ({ pricingProfiles: [...state.pricingProfiles, newProf] }));
        get().addAuditLog('Pricing', newProf.id, 'CREATE', null, newProf);
        return newProf;
      },

      updatePricingProfile: (id, updates) => {
        set(state => ({
          pricingProfiles: state.pricingProfiles.map(p => p.id === id ? { ...p, ...updates } : p)
        }));
        get().addAuditLog('Pricing', id, 'UPDATE', null, updates);
      },

      addRuleToProfile: (profileId, rule) => {
        const newRuleItem: RuleItem = {
          id: 'r-' + Date.now(),
          name: rule.name,
          rule_type: rule.rule_type,
          condition: rule.condition,
          operator: rule.operator,
          value: rule.value,
          action: rule.action,
          severity: rule.severity || 'MEDIUM',
          description: rule.description,
          status: 'ACTIVE'
        };
        set(state => ({
          rulesProfiles: state.rulesProfiles.map(rp => {
            if (rp.id !== profileId) return rp;
            return {
              ...rp,
              rules: [...rp.rules, newRuleItem]
            };
          })
        }));
        get().addAuditLog('Rules', profileId, 'ADD_RULE', null, rule);
      },

      updateRuleInProfile: (profileId, ruleId, updates) => {
        set(state => ({
          rulesProfiles: state.rulesProfiles.map(rp => {
            if (rp.id !== profileId) return rp;
            return {
              ...rp,
              rules: rp.rules.map(r => r.id === ruleId ? { ...r, ...updates } : r)
            };
          })
        }));
        get().addAuditLog('Rules', ruleId, 'UPDATE_RULE', null, updates);
      },

      addPolicy: (pol) => {
        const newPol: PolicyItem = {
          ...pol,
          id: 'pol-' + Date.now(),
          version: 1,
          effective_from: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set(state => ({ policies: [...state.policies, newPol] }));
        get().addAuditLog('Policies', newPol.id, 'CREATE', null, newPol);
        return newPol;
      },

      updatePolicy: (id, updates) => {
        set(state => ({
          policies: state.policies.map(p => p.id === id ? { ...p, ...updates } : p)
        }));
        get().addAuditLog('Policies', id, 'UPDATE', null, updates);
      },

      publishNewPolicyVersion: (policyId, versionDesc) => {
        set(state => ({
          policies: state.policies.map(p => {
            if (p.id !== policyId) return p;
            const newVerNum = p.version + 1;
            const newVerEntry = {
              version: newVerNum,
              effective_from: new Date().toISOString(),
              description: versionDesc || `Policy Version ${newVerNum}`
            };
            return {
              ...p,
              version: newVerNum,
              effective_from: new Date().toISOString(),
              versions: [...(p.versions || []), newVerEntry],
              updatedAt: new Date().toISOString()
            };
          })
        }));
        get().addAuditLog('Policies', policyId, 'NEW_VERSION', null, versionDesc);
      },

      updateRiskLevel: (id, updates) => {
        set(state => ({
          riskLevels: state.riskLevels.map(r => r.id === id ? { ...r, ...updates } : r)
        }));
        get().addAuditLog('Risk Levels', id, 'UPDATE', null, updates);
      },

      updateVerificationProfile: (id, updates) => {
        set(state => ({
          verificationProfiles: state.verificationProfiles.map(v => v.id === id ? { ...v, ...updates } : v)
        }));
        get().addAuditLog('Verification Requirements', id, 'UPDATE', null, updates);
      },

      updateSafetyProfile: (id, updates) => {
        set(state => ({
          safetyProfiles: state.safetyProfiles.map(s => s.id === id ? { ...s, ...updates } : s)
        }));
        get().addAuditLog('Safety & Trust', id, 'UPDATE', null, updates);
      },

      updateBookingRule: (id, updates) => {
        set(state => ({
          bookingRules: state.bookingRules.map(b => b.id === id ? { ...b, ...updates } : b)
        }));
        get().addAuditLog('Booking & Cancellation', id, 'UPDATE', null, updates);
      },

      updateEligibilityProfile: (id, updates) => {
        set(state => ({
          eligibilityProfiles: state.eligibilityProfiles.map(e => e.id === id ? { ...e, ...updates } : e)
        }));
        get().addAuditLog('Service Eligibility', id, 'UPDATE', null, updates);
      },

      // Bulk Actions
      bulkUpdateServiceStatus: (ids, status) => {
        set(state => ({
          services: state.services.map(s => ids.includes(s.id) ? { ...s, status, updated_at: new Date().toISOString() } : s)
        }));
        get().addAuditLog('Services', 'bulk', 'BULK_STATUS_UPDATE', { ids }, { status });
      },

      bulkAssignRiskLevel: (ids, riskId) => {
        set(state => ({
          services: state.services.map(s => ids.includes(s.id) ? { ...s, risk_level_id: riskId, updated_at: new Date().toISOString() } : s)
        }));
        get().addAuditLog('Services', 'bulk', 'BULK_ASSIGN_RISK', { ids }, { riskId });
      },

      bulkAssignPolicy: (ids, policyId) => {
        set(state => ({
          services: state.services.map(s => ids.includes(s.id) ? { ...s, policy_id: policyId, updated_at: new Date().toISOString() } : s)
        }));
        get().addAuditLog('Services', 'bulk', 'BULK_ASSIGN_POLICY', { ids }, { policyId });
      },

      syncFromNeonDB: async () => {
        try {
          const res = await fetch('/api/hub/services');
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            set({ services: data.data });
          } else {
            set({ services: INITIAL_SERVICES });
          }
        } catch (e) {
          set({ services: INITIAL_SERVICES });
        }
      },

      resetAllData: () => {
        set({
          categories: INITIAL_CATEGORIES,
          services: INITIAL_SERVICES,
          pricingProfiles: DEFAULT_PRICING_PROFILES,
          rulesProfiles: DEFAULT_RULES_PROFILES,
          policies: DEFAULT_POLICIES,
          riskLevels: DEFAULT_RISK_LEVELS,
          verificationProfiles: DEFAULT_VERIFICATION_PROFILES,
          safetyProfiles: DEFAULT_SAFETY_PROFILES,
          bookingRules: DEFAULT_BOOKING_RULES,
          eligibilityProfiles: DEFAULT_ELIGIBILITY_PROFILES
        });
      },

      // Audit Logging
      addAuditLog: (module, entityId, action, oldValue, newValue) => {
        const entry: ServiceHubAuditEntry = {
          id: 'aud-' + Date.now(),
          admin_id: 'SUPER_ADMIN',
          module,
          entity_id: entityId,
          action,
          old_value: oldValue,
          new_value: newValue,
          ip_address: '127.0.0.1',
          timestamp: new Date().toISOString()
        };
        set(state => ({ auditLogs: [entry, ...state.auditLogs].slice(0, 100) }));
      }
    }),
    {
      name: 'sathi-service-hub-store-v2'
    }
  )
);
