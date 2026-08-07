import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimeframeFilter = 'TODAY' | '7D' | '30D' | '90D' | 'YTD';
export type RegionFilter = 'ALL' | 'NORTH_AMERICA' | 'EUROPE' | 'ASIA_PACIFIC' | 'LATIN_AMERICA';
export type CompanionTierFilter = 'ALL' | 'VIP_ESCORT' | 'CONCIERGE' | 'EVENT_COMPANION' | 'LUXURY_TRAVEL';

export interface ExecutiveKpiData {
  gmvAmount: number;
  gmvGrowthPct: number;
  netRevenue: number;
  netRevenueGrowthPct: number;
  escrowReserve: number;
  escrowReserveGrowthPct: number;
  activeCompanions: number;
  activeCompanionsGrowthPct: number;
  companionRetentionPct: number;
  systemSecurityScore: number; // 0 - 100
  clvToCacRatio: number;
}

export interface RevenueTimeSeriesPoint {
  date: string;
  gmv: number;
  netRevenue: number;
  escrowCashflow: number;
  bookingsCount: number;
}

export interface RegionalPerformance {
  regionCode: string;
  regionName: string;
  gmvSharePct: number;
  revenue: number;
  activeCompanions: number;
  growthPct: number;
}

export interface CompanionTierShare {
  tierKey: string;
  tierLabel: string;
  percentage: number;
  gmvContribution: number;
  color: string;
}

export interface ExecutiveAlertItem {
  id: string;
  title: string;
  category: 'FINANCIAL' | 'SECURITY' | 'OPERATIONAL' | 'COMPLIANCE';
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
  timestamp: string;
  actionRequired?: string;
}

export interface ExecutiveReportItem {
  id: string;
  title: string;
  reportType: 'WEEKLY_BOARD_DECK' | 'MONTHLY_FINANCIAL_AUDIT' | 'SECURITY_COMPLIANCE_SUMMARY' | 'QUARTERLY_TAX_RESERVE';
  fileFormat: 'PDF' | 'CSV' | 'XLSX';
  downloadUrl: string;
  generatedBy: string;
  periodCovered: string;
  createdAt: string;
}

interface ExecutiveStore {
  // Filters
  timeframe: TimeframeFilter;
  region: RegionFilter;
  tier: CompanionTierFilter;
  escrowCommissionRate: number; // percentage, default 18.5%

  // Executive Data
  alerts: ExecutiveAlertItem[];
  reports: ExecutiveReportItem[];
  isGeneratingReport: boolean;
  lastRefreshedAt: string;

  // Actions
  setTimeframe: (t: TimeframeFilter) => void;
  setRegion: (r: RegionFilter) => void;
  setTier: (t: CompanionTierFilter) => void;
  setEscrowCommissionRate: (rate: number) => void;
  refreshData: () => void;

  // Alert Actions
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;

  // Report & Audit Actions
  generateReport: (title: string, type: ExecutiveReportItem['reportType'], format: ExecutiveReportItem['fileFormat']) => Promise<ExecutiveReportItem>;
  triggerSecurityLockdownAudit: () => Promise<void>;

  // Calculated Selectors
  getKpis: () => ExecutiveKpiData;
  getTimeSeries: () => RevenueTimeSeriesPoint[];
  getRegionalData: () => RegionalPerformance[];
  getTierShares: () => CompanionTierShare[];
}

const INITIAL_ALERTS: ExecutiveAlertItem[] = [
  {
    id: 'exec-alt-1',
    title: 'Surge Escrow Volume Anomaly Detected',
    category: 'FINANCIAL',
    description: 'High-value booking spikes in North America region ($45,000+ total in past 2 hours). Automated Fraud Radar flagged zero chargeback risks.',
    severity: 'WARNING',
    status: 'OPEN',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actionRequired: 'Verify platform liquidity buffer allocation',
  },
  {
    id: 'exec-alt-2',
    title: 'EU GDPR Escrow Data Audit Certificate Ready',
    category: 'COMPLIANCE',
    description: 'Annual Independent Escrow Data Sovereignty Audit successfully passed with 99.98% compliance score.',
    severity: 'INFO',
    status: 'ACKNOWLEDGED',
    timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
    actionRequired: 'Download and archive board audit deck',
  },
  {
    id: 'exec-alt-3',
    title: 'Security Firewall Rule Escalation (Brute Force Defense)',
    category: 'SECURITY',
    description: 'Automated 2FA System blocked 1,420 unauthorized API ping attempts from flagged proxy ranges.',
    severity: 'CRITICAL',
    status: 'OPEN',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    actionRequired: 'Initiate Deep Threat Inspection Audit',
  },
];

const INITIAL_REPORTS: ExecutiveReportItem[] = [
  {
    id: 'rpt-101',
    title: 'Q3 Executive Board Deck & Financial Forecast',
    reportType: 'WEEKLY_BOARD_DECK',
    fileFormat: 'PDF',
    downloadUrl: '#',
    generatedBy: 'Alexander Vance (CEO)',
    periodCovered: 'Q3 2026',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'rpt-102',
    title: 'July Monthly Escrow & Revenue Audit',
    reportType: 'MONTHLY_FINANCIAL_AUDIT',
    fileFormat: 'CSV',
    downloadUrl: '#',
    generatedBy: 'System Automated Scheduler',
    periodCovered: 'Jul 01 - Jul 31, 2026',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export const useExecutiveStore = create<ExecutiveStore>()(
  persist(
    (set, get) => ({
      timeframe: '30D',
      region: 'ALL',
      tier: 'ALL',
      escrowCommissionRate: 18.5,
      alerts: INITIAL_ALERTS,
      reports: INITIAL_REPORTS,
      isGeneratingReport: false,
      lastRefreshedAt: new Date().toISOString(),

      setTimeframe: (timeframe) => set({ timeframe }),
      setRegion: (region) => set({ region }),
      setTier: (tier) => set({ tier }),
      setEscrowCommissionRate: (rate) => set({ escrowCommissionRate: Math.max(1, Math.min(50, rate)) }),

      refreshData: () => set({ lastRefreshedAt: new Date().toISOString() }),

      acknowledgeAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a)),
        })),

      resolveAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, status: 'RESOLVED' } : a)),
        })),

      generateReport: async (title, reportType, fileFormat) => {
        set({ isGeneratingReport: true });
        await new Promise((res) => setTimeout(res, 1200));

        const newReport: ExecutiveReportItem = {
          id: 'rpt-' + Date.now(),
          title,
          reportType,
          fileFormat,
          downloadUrl: '#',
          generatedBy: 'Alexander Vance (CFO)',
          periodCovered: `Period Ending ${new Date().toLocaleDateString()}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          reports: [newReport, ...state.reports],
          isGeneratingReport: false,
        }));

        return newReport;
      },

      triggerSecurityLockdownAudit: async () => {
        await new Promise((res) => setTimeout(res, 1500));
        set((state) => ({
          alerts: [
            {
              id: 'exec-alt-' + Date.now(),
              title: 'C-Suite Emergency System Threat Audit Triggered',
              category: 'SECURITY',
              description: 'Comprehensive system vulnerability & API key integrity audit completed successfully.',
              severity: 'INFO',
              status: 'OPEN',
              timestamp: new Date().toISOString(),
              actionRequired: 'Review automated threat log output',
            },
            ...state.alerts,
          ],
        }));
      },

      getKpis: () => {
        const { timeframe, region, tier, escrowCommissionRate } = get();

        // Multipliers based on timeframe selection
        let mult = 1;
        if (timeframe === 'TODAY') mult = 0.04;
        if (timeframe === '7D') mult = 0.25;
        if (timeframe === '30D') mult = 1.0;
        if (timeframe === '90D') mult = 2.85;
        if (timeframe === 'YTD') mult = 6.4;

        // Region multiplier
        let regMult = 1.0;
        if (region === 'NORTH_AMERICA') regMult = 0.45;
        if (region === 'EUROPE') regMult = 0.30;
        if (region === 'ASIA_PACIFIC') regMult = 0.18;
        if (region === 'LATIN_AMERICA') regMult = 0.07;

        // Tier multiplier
        let tierMult = 1.0;
        if (tier === 'VIP_ESCORT') tierMult = 0.50;
        if (tier === 'CONCIERGE') tierMult = 0.25;
        if (tier === 'EVENT_COMPANION') tierMult = 0.15;
        if (tier === 'LUXURY_TRAVEL') tierMult = 0.10;

        const baseGmv = 1248000 * mult * regMult * tierMult;
        const netRev = baseGmv * (escrowCommissionRate / 100);
        const escrowBuffer = baseGmv * 0.74;

        return {
          gmvAmount: Math.round(baseGmv),
          gmvGrowthPct: 14.8,
          netRevenue: Math.round(netRev),
          netRevenueGrowthPct: 18.2,
          escrowReserve: Math.round(escrowBuffer),
          escrowReserveGrowthPct: 11.4,
          activeCompanions: Math.round(840 * (mult > 1 ? 1.2 : mult < 0.5 ? 0.9 : 1.0) * regMult * tierMult),
          activeCompanionsGrowthPct: 8.7,
          companionRetentionPct: 94.6,
          systemSecurityScore: 98,
          clvToCacRatio: 4.8,
        };
      },

      getTimeSeries: () => {
        const { timeframe, escrowCommissionRate } = get();

        const count = timeframe === 'TODAY' ? 12 : timeframe === '7D' ? 7 : timeframe === '30D' ? 10 : 12;

        const baseDates = Array.from({ length: count }, (_, i) => {
          const d = new Date();
          if (timeframe === 'TODAY') {
            d.setHours(d.getHours() - (count - 1 - i) * 2);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          d.setDate(d.getDate() - (count - 1 - i) * (timeframe === '90D' ? 7 : timeframe === 'YTD' ? 25 : 3));
          return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        });

        return baseDates.map((date, idx) => {
          const factor = 0.75 + (idx / count) * 0.5 + Math.sin(idx) * 0.08;
          const gmv = Math.round(120000 * factor);
          const netRevenue = Math.round(gmv * (escrowCommissionRate / 100));
          const escrowCashflow = Math.round(gmv * 0.72);
          const bookingsCount = Math.round(28 * factor);

          return {
            date,
            gmv,
            netRevenue,
            escrowCashflow,
            bookingsCount,
          };
        });
      },

      getRegionalData: () => [
        {
          regionCode: 'NA',
          regionName: 'North America',
          gmvSharePct: 45,
          revenue: 561600,
          activeCompanions: 378,
          growthPct: 16.4,
        },
        {
          regionCode: 'EU',
          regionName: 'Europe & UK',
          gmvSharePct: 30,
          revenue: 374400,
          activeCompanions: 252,
          growthPct: 14.1,
        },
        {
          regionCode: 'APAC',
          regionName: 'Asia Pacific',
          gmvSharePct: 18,
          revenue: 224640,
          activeCompanions: 151,
          growthPct: 22.8,
        },
        {
          regionCode: 'LATAM',
          regionName: 'Latin America',
          gmvSharePct: 7,
          revenue: 87360,
          activeCompanions: 59,
          growthPct: 19.3,
        },
      ],

      getTierShares: () => [
        {
          tierKey: 'VIP_ESCORT',
          tierLabel: 'VIP High-End Companion',
          percentage: 50,
          gmvContribution: 624000,
          color: '#6366f1', // indigo
        },
        {
          tierKey: 'CONCIERGE',
          tierLabel: 'Executive Concierge Service',
          percentage: 25,
          gmvContribution: 312000,
          color: '#10b981', // emerald
        },
        {
          tierKey: 'EVENT_COMPANION',
          tierLabel: 'Event & Gala Escort',
          percentage: 15,
          gmvContribution: 187200,
          color: '#f59e0b', // amber
        },
        {
          tierKey: 'LUXURY_TRAVEL',
          tierLabel: 'Luxury Travel Companion',
          percentage: 10,
          gmvContribution: 124800,
          color: '#ec4899', // pink
        },
      ],
    }),
    {
      name: 'sathi-executive-store',
    }
  )
);
