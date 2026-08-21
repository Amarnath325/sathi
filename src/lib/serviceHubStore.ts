import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CategoryItem,
  ServiceItem,
  PricingProfile,
  RulesProfile,
  RuleItem,
  RuleAuditLog,
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
  softDeleteCategory: (id: string) => { success: boolean; message?: string };
  restoreCategory: (id: string) => { success: boolean; message?: string };
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
  deletePricingProfile: (id: string) => void;
  assignPricingProfileToCategories: (profileId: string, categoryIds: string[]) => void;
  addRuleToProfile: (profileId: string, rule: Omit<RuleItem, 'id'>) => RuleItem;
  updateRuleInProfile: (profileId: string, ruleId: string, updates: Partial<RuleItem>) => void;
  deleteRuleFromProfile: (profileId: string, ruleId: string) => void;
  toggleRuleActive: (profileId: string, ruleId: string) => void;
  duplicateRuleInProfile: (profileId: string, ruleId: string) => RuleItem | null;
  addPolicy: (pol: Omit<PolicyItem, 'id' | 'version' | 'effective_from'>) => PolicyItem;
  updatePolicy: (id: string, updates: Partial<PolicyItem>) => void;
  publishNewPolicyVersion: (policyId: string, versionDesc: string) => void;
  deletePolicy: (id: string) => void;
  togglePolicyStatus: (id: string) => void;
  duplicatePolicy: (id: string) => PolicyItem | null;
  addRiskLevel: (risk: Omit<RiskLevelItem, 'id' | 'createdAt' | 'updatedAt'>) => RiskLevelItem;
  updateRiskLevel: (id: string, updates: Partial<RiskLevelItem>) => void;
  deleteRiskLevel: (id: string) => void;
  toggleRiskLevelStatus: (id: string) => void;
  duplicateRiskLevel: (id: string) => RiskLevelItem | null;
  addVerificationProfile: (prof: Omit<VerificationProfileItem, 'id' | 'createdAt' | 'updatedAt'>) => VerificationProfileItem;
  updateVerificationProfile: (id: string, updates: Partial<VerificationProfileItem>) => void;
  deleteVerificationProfile: (id: string) => void;
  toggleVerificationProfileStatus: (id: string) => void;
  duplicateVerificationProfile: (id: string) => VerificationProfileItem | null;
  addSafetyProfile: (prof: Omit<SafetyProfileItem, 'id' | 'createdAt' | 'updatedAt'>) => SafetyProfileItem;
  updateSafetyProfile: (id: string, updates: Partial<SafetyProfileItem>) => void;
  deleteSafetyProfile: (id: string) => void;
  toggleSafetyProfileStatus: (id: string) => void;
  duplicateSafetyProfile: (id: string) => SafetyProfileItem | null;
  addBookingRule: (rule: Omit<BookingRuleItem, 'id' | 'createdAt' | 'updatedAt'>) => BookingRuleItem;
  updateBookingRule: (id: string, updates: Partial<BookingRuleItem>) => void;
  deleteBookingRule: (id: string) => void;
  toggleBookingRuleStatus: (id: string) => void;
  duplicateBookingRule: (id: string) => BookingRuleItem | null;
  addEligibilityProfile: (prof: Omit<EligibilityProfileItem, 'id' | 'createdAt' | 'updatedAt'>) => EligibilityProfileItem;
  updateEligibilityProfile: (id: string, updates: Partial<EligibilityProfileItem>) => void;
  deleteEligibilityProfile: (id: string) => void;
  toggleEligibilityProfileStatus: (id: string) => void;
  duplicateEligibilityProfile: (id: string) => EligibilityProfileItem | null;

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

      softDeleteCategory: (id) => {
        const oldCat = get().categories.find(c => c.id === id);
        if (!oldCat) return { success: false, message: 'Category not found' };

        set(state => ({
          categories: state.categories.map(c =>
            c.id === id ? { ...c, status: 'ARCHIVED', deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() } : c
          )
        }));
        get().addAuditLog('Categories', id, 'SOFT_DELETE', oldCat, { status: 'ARCHIVED', deleted_at: new Date().toISOString() });
        return { success: true, message: `Category "${oldCat.name}" has been soft-deleted (archived).` };
      },

      restoreCategory: (id) => {
        const oldCat = get().categories.find(c => c.id === id);
        if (!oldCat) return { success: false, message: 'Category not found' };

        set(state => ({
          categories: state.categories.map(c =>
            c.id === id ? { ...c, status: 'ACTIVE', deleted_at: null, updated_at: new Date().toISOString() } : c
          )
        }));
        get().addAuditLog('Categories', id, 'RESTORE', oldCat, { status: 'ACTIVE', deleted_at: null });
        return { success: true, message: `Category "${oldCat.name}" has been restored to Active status.` };
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

      deletePricingProfile: (id) => {
        set(state => ({
          pricingProfiles: state.pricingProfiles.filter(p => p.id !== id),
          categories: state.categories.map(c => c.default_pricing_profile_id === id ? { ...c, default_pricing_profile_id: undefined } : c)
        }));
        get().addAuditLog('Pricing', id, 'DELETE', null, { id });
      },

      assignPricingProfileToCategories: (profileId, categoryIds) => {
        set(state => ({
          categories: state.categories.map(c => {
            if (categoryIds.includes(c.id)) {
              return { ...c, default_pricing_profile_id: profileId };
            } else if (c.default_pricing_profile_id === profileId) {
              return { ...c, default_pricing_profile_id: undefined };
            }
            return c;
          })
        }));
        get().addAuditLog('Pricing', profileId, 'UPDATE_LINKED_CATEGORIES', null, { profileId, categoryIds });
      },

      addRuleToProfile: (profileId, rule) => {
        const newRuleItem: RuleItem = {
          id: 'r-' + Date.now(),
          code: rule.code || `RULE-${Date.now().toString().slice(-4)}`,
          name: rule.name,
          rule_type: rule.rule_type,
          priority: rule.priority || 5,
          scope_type: rule.scope_type || 'GLOBAL',
          category_id: rule.category_id,
          category_name: rule.category_name,
          service_id: rule.service_id,
          service_name: rule.service_name,
          condition_group_operator: rule.condition_group_operator || 'AND',
          conditions: rule.conditions || [{ id: 'c-1', field: rule.condition, operator: rule.operator, value: rule.value }],
          condition: rule.condition,
          operator: rule.operator,
          value: rule.value,
          action: rule.action,
          additional_requirements: rule.additional_requirements || [],
          approval_level: rule.approval_level || 'SYSTEM_AUTO',
          restriction_message: rule.restriction_message || '',
          risk_level_required: rule.risk_level_required || 'MEDIUM',
          verification_required: rule.verification_required ?? true,
          allow_override: rule.allow_override ?? true,
          override_role: rule.override_role || 'OPERATIONS_MANAGER',
          validity_start: rule.validity_start || new Date().toISOString().split('T')[0],
          validity_end: rule.validity_end,
          escalation_action: rule.escalation_action,
          version: rule.version || 'v1.0',
          severity: rule.severity || 'MEDIUM',
          description: rule.description,
          status: rule.status || 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          audit_history: [
            { timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16), action: 'CREATE', author: 'Admin User', note: 'Created new operational rule' }
          ]
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
        get().addAuditLog('Rules', profileId, 'ADD_RULE', null, newRuleItem);
        return newRuleItem;
      },

      updateRuleInProfile: (profileId, ruleId, updates) => {
        set(state => ({
          rulesProfiles: state.rulesProfiles.map(rp => {
            if (rp.id !== profileId) return rp;
            return {
              ...rp,
              rules: rp.rules.map(r => {
                if (r.id !== ruleId) return r;
                const newAudit: RuleAuditLog = {
                  timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  action: 'UPDATE',
                  author: 'Admin User',
                  note: 'Updated rule configuration'
                };
                return {
                  ...r,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                  audit_history: [...(r.audit_history || []), newAudit]
                };
              })
            };
          })
        }));
        get().addAuditLog('Rules', profileId, 'UPDATE_RULE', { ruleId }, updates);
      },

      toggleRuleActive: (profileId, ruleId) => {
        set(state => ({
          rulesProfiles: state.rulesProfiles.map(rp => {
            if (rp.id !== profileId) return rp;
            return {
              ...rp,
              rules: rp.rules.map(r => {
                if (r.id !== ruleId) return r;
                const nextStatus = r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
                return { ...r, status: nextStatus, updatedAt: new Date().toISOString() };
              })
            };
          })
        }));
        get().addAuditLog('Rules', profileId, 'TOGGLE_RULE_STATUS', { ruleId }, {});
      },

      duplicateRuleInProfile: (profileId, ruleId) => {
        const profile = get().rulesProfiles.find(p => p.id === profileId);
        const sourceRule = profile?.rules.find(r => r.id === ruleId);
        if (!sourceRule) return null;

        const duplicated: RuleItem = {
          ...sourceRule,
          id: 'r-' + Date.now(),
          code: `${sourceRule.code}-COPY`,
          name: `${sourceRule.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          audit_history: [
            { timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16), action: 'CREATE', author: 'Admin User', note: `Duplicated from ${sourceRule.code}` }
          ]
        };

        set(state => ({
          rulesProfiles: state.rulesProfiles.map(rp => {
            if (rp.id !== profileId) return rp;
            return {
              ...rp,
              rules: [...rp.rules, duplicated]
            };
          })
        }));
        get().addAuditLog('Rules', profileId, 'DUPLICATE_RULE', { sourceRuleId: ruleId }, duplicated);
        return duplicated;
      },

      deleteRuleFromProfile: (profileId, ruleId) => {
        set(state => ({
          rulesProfiles: state.rulesProfiles.map(rp => {
            if (rp.id !== profileId) return rp;
            return {
              ...rp,
              rules: rp.rules.filter(r => r.id !== ruleId)
            };
          })
        }));
        get().addAuditLog('Rules', profileId, 'DELETE_RULE', { ruleId }, null);
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

      deletePolicy: (id) => {
        set(state => ({ policies: state.policies.filter(p => p.id !== id) }));
        get().addAuditLog('Policies', id, 'DELETE', null, { id });
      },

      togglePolicyStatus: (id) => {
        set(state => ({
          policies: state.policies.map(p => {
            if (p.id !== id) return p;
            const nextStatus = p.status === 'PUBLISHED' ? 'DEACTIVATED' : 'PUBLISHED';
            return { ...p, status: nextStatus, updatedAt: new Date().toISOString() };
          })
        }));
        get().addAuditLog('Policies', id, 'TOGGLE_STATUS', {}, {});
      },

      duplicatePolicy: (id) => {
        const source = get().policies.find(p => p.id === id);
        if (!source) return null;

        const duplicated: PolicyItem = {
          ...source,
          id: 'pol-' + Date.now(),
          code: `${source.code || 'POL'}-COPY`,
          name: `${source.name} (Copy)`,
          status: 'DRAFT',
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          versions: [
            {
              version: 1,
              effective_from: new Date().toISOString(),
              description: `Duplicated from ${source.name}`,
              published_by: 'Admin User'
            }
          ]
        };

        set(state => ({ policies: [...state.policies, duplicated] }));
        get().addAuditLog('Policies', id, 'DUPLICATE', { sourceId: id }, duplicated);
        return duplicated;
      },

      addRiskLevel: (risk) => {
        const newRisk: RiskLevelItem = {
          ...risk,
          id: 'rk-' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set(state => ({ riskLevels: [...state.riskLevels, newRisk] }));
        get().addAuditLog('Risk Levels', newRisk.id, 'CREATE', null, newRisk);
        return newRisk;
      },

      updateRiskLevel: (id, updates) => {
        set(state => ({
          riskLevels: state.riskLevels.map(r => r.id === id ? { ...r, ...updates } : r)
        }));
        get().addAuditLog('Risk Levels', id, 'UPDATE', null, updates);
      },

      deleteRiskLevel: (id) => {
        set(state => ({ riskLevels: state.riskLevels.filter(r => r.id !== id) }));
        get().addAuditLog('Risk Levels', id, 'DELETE');
      },

      toggleRiskLevelStatus: (id) => {
        set(state => ({
          riskLevels: state.riskLevels.map(r => {
            if (r.id !== id) return r;
            const nextStatus = r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            return { ...r, status: nextStatus, updatedAt: new Date().toISOString() };
          })
        }));
        get().addAuditLog('Risk Levels', id, 'TOGGLE_STATUS', {}, {});
      },

      duplicateRiskLevel: (id) => {
        const source = get().riskLevels.find(r => r.id === id);
        if (!source) return null;

        const duplicated: RiskLevelItem = {
          ...source,
          id: 'rk-' + Date.now(),
          code: source.code,
          name: `${source.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({ riskLevels: [...state.riskLevels, duplicated] }));
        get().addAuditLog('Risk Levels', id, 'DUPLICATE', { sourceId: id }, duplicated);
        return duplicated;
      },

      addVerificationProfile: (prof) => {
        const newProf: VerificationProfileItem = {
          ...prof,
          id: 'ver-' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set(state => ({ verificationProfiles: [...state.verificationProfiles, newProf] }));
        get().addAuditLog('Verification Requirements', newProf.id, 'CREATE', null, newProf);
        return newProf;
      },

      updateVerificationProfile: (id, updates) => {
        set(state => ({
          verificationProfiles: state.verificationProfiles.map(v => v.id === id ? { ...v, ...updates } : v)
        }));
        get().addAuditLog('Verification Requirements', id, 'UPDATE', null, updates);
      },

      deleteVerificationProfile: (id) => {
        set(state => ({ verificationProfiles: state.verificationProfiles.filter(v => v.id !== id) }));
        get().addAuditLog('Verification Requirements', id, 'DELETE');
      },

      toggleVerificationProfileStatus: (id) => {
        set(state => ({
          verificationProfiles: state.verificationProfiles.map(v => {
            if (v.id !== id) return v;
            const nextStatus = v.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            return { ...v, status: nextStatus, updatedAt: new Date().toISOString() };
          })
        }));
        get().addAuditLog('Verification Requirements', id, 'TOGGLE_STATUS', {}, {});
      },

      duplicateVerificationProfile: (id) => {
        const source = get().verificationProfiles.find(v => v.id === id);
        if (!source) return null;

        const duplicated: VerificationProfileItem = {
          ...source,
          id: 'ver-' + Date.now(),
          code: `${source.code || 'VER'}-COPY`,
          name: `${source.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({ verificationProfiles: [...state.verificationProfiles, duplicated] }));
        get().addAuditLog('Verification Requirements', id, 'DUPLICATE', { sourceId: id }, duplicated);
        return duplicated;
      },

      addSafetyProfile: (prof) => {
        const newProf: SafetyProfileItem = {
          ...prof,
          id: 'saf-' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set(state => ({ safetyProfiles: [...state.safetyProfiles, newProf] }));
        get().addAuditLog('Safety & Trust', newProf.id, 'CREATE', null, newProf);
        return newProf;
      },

      updateSafetyProfile: (id, updates) => {
        set(state => ({
          safetyProfiles: state.safetyProfiles.map(s => s.id === id ? { ...s, ...updates } : s)
        }));
        get().addAuditLog('Safety & Trust', id, 'UPDATE', null, updates);
      },

      deleteSafetyProfile: (id) => {
        set(state => ({ safetyProfiles: state.safetyProfiles.filter(s => s.id !== id) }));
        get().addAuditLog('Safety & Trust', id, 'DELETE');
      },

      toggleSafetyProfileStatus: (id) => {
        set(state => ({
          safetyProfiles: state.safetyProfiles.map(s => {
            if (s.id !== id) return s;
            const nextStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            return { ...s, status: nextStatus, updatedAt: new Date().toISOString() };
          })
        }));
        get().addAuditLog('Safety & Trust', id, 'TOGGLE_STATUS', {}, {});
      },

      duplicateSafetyProfile: (id) => {
        const source = get().safetyProfiles.find(s => s.id === id);
        if (!source) return null;

        const duplicated: SafetyProfileItem = {
          ...source,
          id: 'saf-' + Date.now(),
          code: `${source.code || 'SAF'}-COPY`,
          name: `${source.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({ safetyProfiles: [...state.safetyProfiles, duplicated] }));
        get().addAuditLog('Safety & Trust', id, 'DUPLICATE', { sourceId: id }, duplicated);
        return duplicated;
      },

      addBookingRule: (rule) => {
        const newRule: BookingRuleItem = {
          ...rule,
          id: 'bk-' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set(state => ({ bookingRules: [...state.bookingRules, newRule] }));
        get().addAuditLog('Booking & Cancellation', newRule.id, 'CREATE', null, newRule);
        return newRule;
      },

      updateBookingRule: (id, updates) => {
        set(state => ({
          bookingRules: state.bookingRules.map(b => b.id === id ? { ...b, ...updates } : b)
        }));
        get().addAuditLog('Booking & Cancellation', id, 'UPDATE', null, updates);
      },

      deleteBookingRule: (id) => {
        set(state => ({ bookingRules: state.bookingRules.filter(b => b.id !== id) }));
        get().addAuditLog('Booking & Cancellation', id, 'DELETE');
      },

      toggleBookingRuleStatus: (id) => {
        set(state => ({
          bookingRules: state.bookingRules.map(b => {
            if (b.id !== id) return b;
            const nextStatus = b.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            return { ...b, status: nextStatus, updatedAt: new Date().toISOString() };
          })
        }));
        get().addAuditLog('Booking & Cancellation', id, 'TOGGLE_STATUS', {}, {});
      },

      duplicateBookingRule: (id) => {
        const source = get().bookingRules.find(b => b.id === id);
        if (!source) return null;

        const duplicated: BookingRuleItem = {
          ...source,
          id: 'bk-' + Date.now(),
          code: `${source.code || 'BKG'}-COPY`,
          name: `${source.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({ bookingRules: [...state.bookingRules, duplicated] }));
        get().addAuditLog('Booking & Cancellation', id, 'DUPLICATE', { sourceId: id }, duplicated);
        return duplicated;
      },

      addEligibilityProfile: (prof) => {
        const newProf: EligibilityProfileItem = {
          ...prof,
          id: 'el-' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set(state => ({ eligibilityProfiles: [...state.eligibilityProfiles, newProf] }));
        get().addAuditLog('Service Eligibility', newProf.id, 'CREATE', null, newProf);
        return newProf;
      },

      updateEligibilityProfile: (id, updates) => {
        set(state => ({
          eligibilityProfiles: state.eligibilityProfiles.map(e => e.id === id ? { ...e, ...updates } : e)
        }));
        get().addAuditLog('Service Eligibility', id, 'UPDATE', null, updates);
      },

      deleteEligibilityProfile: (id) => {
        set(state => ({ eligibilityProfiles: state.eligibilityProfiles.filter(e => e.id !== id) }));
        get().addAuditLog('Service Eligibility', id, 'DELETE');
      },

      toggleEligibilityProfileStatus: (id) => {
        set(state => ({
          eligibilityProfiles: state.eligibilityProfiles.map(e => {
            if (e.id !== id) return e;
            const nextStatus = e.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            return { ...e, status: nextStatus, updatedAt: new Date().toISOString() };
          })
        }));
        get().addAuditLog('Service Eligibility', id, 'TOGGLE_STATUS', {}, {});
      },

      duplicateEligibilityProfile: (id) => {
        const source = get().eligibilityProfiles.find(e => e.id === id);
        if (!source) return null;

        const duplicated: EligibilityProfileItem = {
          ...source,
          id: 'el-' + Date.now(),
          code: `${source.code || 'ELG'}-COPY`,
          name: `${source.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({ eligibilityProfiles: [...state.eligibilityProfiles, duplicated] }));
        get().addAuditLog('Service Eligibility', id, 'DUPLICATE', { sourceId: id }, duplicated);
        return duplicated;
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
