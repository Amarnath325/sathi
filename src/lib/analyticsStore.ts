import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AnalyticsDomainTab = 'OVERVIEW' | 'FINANCIAL' | 'USER_GROWTH' | 'OPERATIONS' | 'SAFETY';
export type AnalyticsTimeframe = '7D' | '30D' | '90D' | '1Y' | 'CUSTOM';
export type CompareMode = 'PREVIOUS_PERIOD' | 'PREVIOUS_YEAR' | 'NONE';

export interface AnalyticsKpiMetric {
  key: string;
  label: string;
  value: string;
  numericValue: number;
  changePct: number;
  isPositiveGood: boolean;
  unit: 'CURRENCY' | 'PERCENT' | 'NUMBER' | 'SCORE' | 'HOURS';
  subtitle: string;
}

export interface AnalyticsSeriesPoint {
  label: string;
  primaryValue: number;
  comparisonValue: number;
  secondaryValue?: number;
}

export interface CategoryDistribution {
  category: string;
  bookings: number;
  revenue: number;
  percentage: number;
  color: string;
}

export interface RetentionCohortRow {
  cohortMonth: string;
  userCount: number;
  m1: number;
  m2: number;
  m3: number;
  m6: number;
}

export interface SavedReportRecord {
  id: string;
  title: string;
  domain: AnalyticsDomainTab;
  metrics: string[];
  groupBy: 'DATE' | 'CATEGORY' | 'REGION' | 'TIER';
  timeframe: AnalyticsTimeframe;
  recurrence: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  outputFormat: 'PDF' | 'CSV' | 'XLSX';
  lastRunAt: string;
  createdBy: string;
}

export interface ExportHistoryLog {
  id: string;
  title: string;
  format: 'PDF' | 'CSV' | 'XLSX';
  recordCount: number;
  fileSize: string;
  createdAt: string;
  downloadUrl: string;
}

interface AnalyticsStore {
  // State
  domain: AnalyticsDomainTab;
  timeframe: AnalyticsTimeframe;
  compareMode: CompareMode;
  searchFilter: string;

  savedReports: SavedReportRecord[];
  exportHistory: ExportHistoryLog[];
  isExporting: boolean;

  // Actions
  setDomain: (domain: AnalyticsDomainTab) => void;
  setTimeframe: (tf: AnalyticsTimeframe) => void;
  setCompareMode: (cm: CompareMode) => void;
  setSearchFilter: (query: string) => void;

  saveReportTemplate: (report: Omit<SavedReportRecord, 'id' | 'lastRunAt'>) => void;
  deleteReportTemplate: (id: string) => void;

  triggerExport: (title: string, format: 'PDF' | 'CSV' | 'XLSX') => Promise<ExportHistoryLog>;

  // Computed data selectors
  getDomainKpis: () => AnalyticsKpiMetric[];
  getTimeSeriesData: () => AnalyticsSeriesPoint[];
  getCategoryBreakdown: () => CategoryDistribution[];
  getCohortData: () => RetentionCohortRow[];
}

const INITIAL_SAVED_REPORTS: SavedReportRecord[] = [
  {
    id: 'rpt-template-1',
    title: 'Monthly Financial & Escrow Reconciliation Deck',
    domain: 'FINANCIAL',
    metrics: ['gmv', 'net_revenue', 'escrow_holding'],
    groupBy: 'DATE',
    timeframe: '30D',
    recurrence: 'MONTHLY',
    outputFormat: 'PDF',
    lastRunAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdBy: 'Alexander Vance (CFO)',
  },
  {
    id: 'rpt-template-2',
    title: 'Weekly Trust & Safety Incident Audit Summary',
    domain: 'SAFETY',
    metrics: ['sos_alerts', 'disciplinary_actions', 'dispute_rate'],
    groupBy: 'REGION',
    timeframe: '7D',
    recurrence: 'WEEKLY',
    outputFormat: 'CSV',
    lastRunAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdBy: 'Sarah Jenkins (VP Trust)',
  },
  {
    id: 'rpt-template-3',
    title: 'Companion Onboarding & KYC Funnel Analytics',
    domain: 'USER_GROWTH',
    metrics: ['new_companions', 'kyc_approval_rate', 'retention_cohort'],
    groupBy: 'TIER',
    timeframe: '90D',
    recurrence: 'NONE',
    outputFormat: 'XLSX',
    lastRunAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    createdBy: 'Marcus Brody (Head of Growth)',
  },
];

const INITIAL_EXPORTS: ExportHistoryLog[] = [
  {
    id: 'exp-log-1',
    title: 'Q3 Financial Analytics Master Audit.pdf',
    format: 'PDF',
    recordCount: 1420,
    fileSize: '4.8 MB',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    downloadUrl: '#',
  },
  {
    id: 'exp-log-2',
    title: 'Jul 2026 Booking Operations Matrix.csv',
    format: 'CSV',
    recordCount: 840,
    fileSize: '1.2 MB',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    downloadUrl: '#',
  },
];

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      domain: 'OVERVIEW',
      timeframe: '30D',
      compareMode: 'PREVIOUS_PERIOD',
      searchFilter: '',

      savedReports: INITIAL_SAVED_REPORTS,
      exportHistory: INITIAL_EXPORTS,
      isExporting: false,

      setDomain: (domain) => set({ domain }),
      setTimeframe: (timeframe) => set({ timeframe }),
      setCompareMode: (compareMode) => set({ compareMode }),
      setSearchFilter: (searchFilter) => set({ searchFilter }),

      saveReportTemplate: (report) =>
        set((state) => ({
          savedReports: [
            {
              ...report,
              id: 'rpt-template-' + Date.now(),
              lastRunAt: new Date().toISOString(),
            },
            ...state.savedReports,
          ],
        })),

      deleteReportTemplate: (id) =>
        set((state) => ({
          savedReports: state.savedReports.filter((r) => r.id !== id),
        })),

      triggerExport: async (title, format) => {
        set({ isExporting: true });
        await new Promise((res) => setTimeout(res, 1400));

        const newLog: ExportHistoryLog = {
          id: 'exp-log-' + Date.now(),
          title: `${title}.${format.toLowerCase()}`,
          format,
          recordCount: Math.floor(Math.random() * 800) + 400,
          fileSize: (Math.random() * 3 + 1.2).toFixed(1) + ' MB',
          createdAt: new Date().toISOString(),
          downloadUrl: '#',
        };

        set((state) => ({
          exportHistory: [newLog, ...state.exportHistory],
          isExporting: false,
        }));

        return newLog;
      },

      getDomainKpis: () => {
        const { domain, timeframe, compareMode } = get();

        let tfMult = 1.0;
        if (timeframe === '7D') tfMult = 0.25;
        if (timeframe === '90D') tfMult = 2.8;
        if (timeframe === '1Y') tfMult = 11.2;

        if (domain === 'FINANCIAL') {
          return [
            {
              key: 'gmv',
              label: 'Gross Merchandise Value',
              value: `$${Math.round(1248000 * tfMult).toLocaleString()}`,
              numericValue: 1248000 * tfMult,
              changePct: compareMode === 'PREVIOUS_YEAR' ? 24.5 : 14.8,
              isPositiveGood: true,
              unit: 'CURRENCY',
              subtitle: 'Total volume processed across companion bookings',
            },
            {
              key: 'net_revenue',
              label: 'Platform Net Margin',
              value: `$${Math.round(230880 * tfMult).toLocaleString()}`,
              numericValue: 230880 * tfMult,
              changePct: 18.2,
              isPositiveGood: true,
              unit: 'CURRENCY',
              subtitle: '18.5% platform fee net yield',
            },
            {
              key: 'escrow_holding',
              label: 'Escrow Vault Reserves',
              value: `$${Math.round(923520 * tfMult).toLocaleString()}`,
              numericValue: 923520 * tfMult,
              changePct: 11.4,
              isPositiveGood: true,
              unit: 'CURRENCY',
              subtitle: 'Protected trust funds held before payout',
            },
            {
              key: 'aov',
              label: 'Average Order Value (AOV)',
              value: '$345',
              numericValue: 345,
              changePct: 6.2,
              isPositiveGood: true,
              unit: 'CURRENCY',
              subtitle: 'Average spend per companion booking session',
            },
          ];
        }

        if (domain === 'USER_GROWTH') {
          return [
            {
              key: 'active_users',
              label: 'Active Platform Users',
              value: Math.round(12450 * tfMult).toLocaleString(),
              numericValue: 12450 * tfMult,
              changePct: 19.4,
              isPositiveGood: true,
              unit: 'NUMBER',
              subtitle: 'Monthly active booking clients & companions',
            },
            {
              key: 'kyc_throughput',
              label: 'KYC Verification Rate',
              value: '96.2%',
              numericValue: 96.2,
              changePct: 4.1,
              isPositiveGood: true,
              unit: 'PERCENT',
              subtitle: 'Automated biometric identity verification rate',
            },
            {
              key: 'companion_retention',
              label: 'Companion 90D Retention',
              value: '94.6%',
              numericValue: 94.6,
              changePct: 2.8,
              isPositiveGood: true,
              unit: 'PERCENT',
              subtitle: 'Percentage of companions remaining active past 90 days',
            },
            {
              key: 'cac_clv',
              label: 'Client Lifetime Value (CLV)',
              value: '$1,840',
              numericValue: 1840,
              changePct: 12.5,
              isPositiveGood: true,
              unit: 'CURRENCY',
              subtitle: 'Average gross profit contribution per active user',
            },
          ];
        }

        if (domain === 'OPERATIONS') {
          return [
            {
              key: 'completed_bookings',
              label: 'Completed Sessions',
              value: Math.round(3620 * tfMult).toLocaleString(),
              numericValue: 3620 * tfMult,
              changePct: 16.1,
              isPositiveGood: true,
              unit: 'NUMBER',
              subtitle: 'Successfully fulfilled companion bookings',
            },
            {
              key: 'completion_rate',
              label: 'Booking Fulfillment Rate',
              value: '98.4%',
              numericValue: 98.4,
              changePct: 1.5,
              isPositiveGood: true,
              unit: 'PERCENT',
              subtitle: 'Ratio of confirmed bookings to completed sessions',
            },
            {
              key: 'cancellation_rate',
              label: 'Cancellation Rate',
              value: '1.6%',
              numericValue: 1.6,
              changePct: -0.8,
              isPositiveGood: true,
              unit: 'PERCENT',
              subtitle: 'Percentage of bookings cancelled prior to fulfillment',
            },
            {
              key: 'avg_response_time',
              label: 'Avg Companion Response',
              value: '4.2 min',
              numericValue: 4.2,
              changePct: -14.2,
              isPositiveGood: true,
              unit: 'HOURS',
              subtitle: 'Time from client request to companion acceptance',
            },
          ];
        }

        if (domain === 'SAFETY') {
          return [
            {
              key: 'safety_score',
              label: 'Trust & Safety Index',
              value: '99.2 / 100',
              numericValue: 99.2,
              changePct: 0.8,
              isPositiveGood: true,
              unit: 'SCORE',
              subtitle: 'Combined metric across SOS alerts, reviews & disputes',
            },
            {
              key: 'sos_response',
              label: 'Emergency Response Velocity',
              value: '42 sec',
              numericValue: 42,
              changePct: -18.5,
              isPositiveGood: true,
              unit: 'HOURS',
              subtitle: 'Average dispatcher assignment speed for SOS alerts',
            },
            {
              key: 'dispute_rate',
              label: 'Escrow Dispute Rate',
              value: '0.24%',
              numericValue: 0.24,
              changePct: -0.12,
              isPositiveGood: true,
              unit: 'PERCENT',
              subtitle: 'Bookings resulting in formal chargeback or dispute',
            },
            {
              key: 'disciplinary_actions',
              label: 'Resolved Fraud Flags',
              value: '18',
              numericValue: 18,
              changePct: -22.0,
              isPositiveGood: true,
              unit: 'NUMBER',
              subtitle: 'Accounts restricted or suspended via AI Fraud Guard',
            },
          ];
        }

        // OVERVIEW default
        return [
          {
            key: 'gmv',
            label: 'Total Platform GMV',
            value: `$${Math.round(1248000 * tfMult).toLocaleString()}`,
            numericValue: 1248000 * tfMult,
            changePct: 14.8,
            isPositiveGood: true,
            unit: 'CURRENCY',
            subtitle: 'Gross merchandise volume across companion bookings',
          },
          {
            key: 'net_revenue',
            label: 'Net Platform Revenue',
            value: `$${Math.round(230880 * tfMult).toLocaleString()}`,
            numericValue: 230880 * tfMult,
            changePct: 18.2,
            isPositiveGood: true,
            unit: 'CURRENCY',
            subtitle: '18.5% platform take-rate margin',
          },
          {
            key: 'active_companions',
            label: 'Verified Companions',
            value: Math.round(840 * (tfMult > 1 ? 1.2 : 1)).toLocaleString(),
            numericValue: 840,
            changePct: 8.7,
            isPositiveGood: true,
            unit: 'NUMBER',
            subtitle: 'Active companions with passing biometrics',
          },
          {
            key: 'safety_index',
            label: 'Safety Score',
            value: '99.2 / 100',
            numericValue: 99.2,
            changePct: 0.8,
            isPositiveGood: true,
            unit: 'SCORE',
            subtitle: 'Zero critical security breaches',
          },
        ];
      },

      getTimeSeriesData: () => {
        const { timeframe, compareMode } = get();
        const count = timeframe === '7D' ? 7 : timeframe === '30D' ? 10 : 12;

        return Array.from({ length: count }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (count - 1 - i) * (timeframe === '90D' ? 7 : timeframe === '1Y' ? 30 : 3));
          const label = d.toLocaleDateString([], { month: 'short', day: 'numeric' });

          const factor = 0.8 + (i / count) * 0.4 + Math.sin(i) * 0.06;
          const compFactor = compareMode === 'PREVIOUS_YEAR' ? factor * 0.82 : factor * 0.9;

          return {
            label,
            primaryValue: Math.round(120000 * factor),
            comparisonValue: Math.round(120000 * compFactor),
            secondaryValue: Math.round(22200 * factor),
          };
        });
      },

      getCategoryBreakdown: () => [
        {
          category: 'VIP High-End Escort',
          bookings: 1420,
          revenue: 624000,
          percentage: 50,
          color: '#6366f1',
        },
        {
          category: 'Executive Concierge',
          bookings: 940,
          revenue: 312000,
          percentage: 25,
          color: '#10b981',
        },
        {
          category: 'Event & Gala Escort',
          bookings: 680,
          revenue: 187200,
          percentage: 15,
          color: '#f59e0b',
        },
        {
          category: 'Luxury Travel Companion',
          bookings: 380,
          revenue: 124800,
          percentage: 10,
          color: '#ec4899',
        },
      ],

      getCohortData: () => [
        { cohortMonth: 'Mar 2026', userCount: 420, m1: 94, m2: 88, m3: 84, m6: 78 },
        { cohortMonth: 'Apr 2026', userCount: 480, m1: 95, m2: 89, m3: 86, m6: 81 },
        { cohortMonth: 'May 2026', userCount: 540, m1: 96, m2: 91, m3: 88, m6: 83 },
        { cohortMonth: 'Jun 2026', userCount: 610, m1: 97, m2: 92, m3: 89, m6: 85 },
        { cohortMonth: 'Jul 2026', userCount: 730, m1: 98, m2: 94, m3: 91, m6: 87 },
      ],
    }),
    {
      name: 'sathi-analytics-store',
    }
  )
);
