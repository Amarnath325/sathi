import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RiskLevel } from './types';

export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';
export type HealthAlertType = 'CPU_SPIKE' | 'MEMORY_EXHAUSTION' | 'DB_POOL_EXHAUSTION' | 'HIGH_LATENCY' | 'SERVICE_DOWN';

export interface SystemHealthMetricRecord {
  id: string;
  nodeName: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  diskUsagePercent: number;
  dbPoolActive: number;
  dbPoolIdle: number;
  redisHitRatePercent: number;
  activeWebsockets: number;
  responseLatencyMs: number;
  timestamp: string;
}

export interface MicroserviceStatusRecord {
  id: string;
  serviceName: string;
  displayName: string;
  category: 'DATABASE' | 'CACHE' | 'GATEWAY' | 'PAYMENT' | 'COMMUNICATION' | 'STORAGE';
  endpointUrl: string;
  status: HealthStatus;
  uptimePercent: number;
  lastPingMs: number;
  lastCheckedAt: string;
}

export interface SystemHealthAlertRecord {
  id: string;
  serviceName: string;
  alertType: HealthAlertType;
  severity: RiskLevel;
  message: string;
  isResolved: boolean;
  triggeredAt: string;
  resolvedAt: string | null;
}

interface SystemHealthStore {
  // State
  currentMetric: SystemHealthMetricRecord;
  historicalMetrics: SystemHealthMetricRecord[];
  services: MicroserviceStatusRecord[];
  alerts: SystemHealthAlertRecord[];
  isChaosTesting: boolean;

  // Actions
  pingServices: () => void;
  resolveAlert: (alertId: string) => void;
  triggerChaosLoad: (type: 'CPU' | 'DB_POOL' | 'LATENCY') => void;
  stopChaosLoad: () => void;
}

const INITIAL_METRIC: SystemHealthMetricRecord = {
  id: 'met-live',
  nodeName: 'sathi-prod-uswest2-node-01',
  cpuUsagePercent: 34.2,
  memoryUsagePercent: 58.7,
  diskUsagePercent: 41.0,
  dbPoolActive: 14,
  dbPoolIdle: 36,
  redisHitRatePercent: 99.4,
  activeWebsockets: 1420,
  responseLatencyMs: 38,
  timestamp: new Date().toISOString(),
};

const INITIAL_SERVICES: MicroserviceStatusRecord[] = [
  {
    id: 'svc-1',
    serviceName: 'DATABASE_POSTGRES',
    displayName: 'PostgreSQL Primary Cluster (us-west-2)',
    category: 'DATABASE',
    endpointUrl: 'db.prod.sathi.io:5432',
    status: 'HEALTHY',
    uptimePercent: 99.99,
    lastPingMs: 8,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'svc-2',
    serviceName: 'REDIS_CACHE',
    displayName: 'Redis Enterprise Cluster (In-Memory)',
    category: 'CACHE',
    endpointUrl: 'cache.prod.sathi.io:6379',
    status: 'HEALTHY',
    uptimePercent: 99.98,
    lastPingMs: 2,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'svc-3',
    serviceName: 'WEBSOCKET_GATEWAY',
    displayName: 'WebSocket Realtime Gateway',
    category: 'GATEWAY',
    endpointUrl: 'wss://stream.sathi.io',
    status: 'HEALTHY',
    uptimePercent: 99.95,
    lastPingMs: 14,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'svc-4',
    serviceName: 'PAYMENT_STRIPE',
    displayName: 'Stripe Escrow & Card Gateway',
    category: 'PAYMENT',
    endpointUrl: 'https://api.stripe.com',
    status: 'HEALTHY',
    uptimePercent: 100.0,
    lastPingMs: 120,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'svc-5',
    serviceName: 'SMS_TWILIO',
    displayName: 'Twilio Telephony & Carrier SMS',
    category: 'COMMUNICATION',
    endpointUrl: 'https://api.twilio.com',
    status: 'HEALTHY',
    uptimePercent: 99.92,
    lastPingMs: 85,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'svc-6',
    serviceName: 'EMAIL_SENDGRID',
    displayName: 'SendGrid Transactional SMTP',
    category: 'COMMUNICATION',
    endpointUrl: 'smtp.sendgrid.net:587',
    status: 'HEALTHY',
    uptimePercent: 99.89,
    lastPingMs: 95,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'svc-7',
    serviceName: 'STORAGE_S3',
    displayName: 'AWS S3 Asset Bucket & CDN',
    category: 'STORAGE',
    endpointUrl: 's3.us-west-2.amazonaws.com',
    status: 'HEALTHY',
    uptimePercent: 99.99,
    lastPingMs: 44,
    lastCheckedAt: new Date().toISOString(),
  },
];

const INITIAL_ALERTS: SystemHealthAlertRecord[] = [
  {
    id: 'alt-101',
    serviceName: 'DATABASE_POSTGRES',
    alertType: 'DB_POOL_EXHAUSTION',
    severity: 'HIGH',
    message: 'Active PostgreSQL pool connections reached 88% capacity during peak companion search',
    isResolved: false,
    triggeredAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    resolvedAt: null,
  },
  {
    id: 'alt-102',
    serviceName: 'SMS_TWILIO',
    alertType: 'HIGH_LATENCY',
    severity: 'MEDIUM',
    message: 'Carrier SMS dispatch latency spiked above 400ms threshold for EU Region',
    isResolved: true,
    triggeredAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    resolvedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

export const useSystemHealthStore = create<SystemHealthStore>()(
  persist(
    (set, get) => ({
      currentMetric: INITIAL_METRIC,
      historicalMetrics: [INITIAL_METRIC],
      services: INITIAL_SERVICES,
      alerts: INITIAL_ALERTS,
      isChaosTesting: false,

      pingServices: () => {
        set((state) => ({
          services: state.services.map((svc) => ({
            ...svc,
            lastPingMs: Math.max(2, Math.floor(svc.lastPingMs + (Math.random() * 10 - 5))),
            lastCheckedAt: new Date().toISOString(),
          })),
          currentMetric: {
            ...state.currentMetric,
            cpuUsagePercent: Number((Math.min(95, Math.max(15, state.currentMetric.cpuUsagePercent + (Math.random() * 4 - 2)))).toFixed(1)),
            memoryUsagePercent: Number((Math.min(90, Math.max(30, state.currentMetric.memoryUsagePercent + (Math.random() * 2 - 1)))).toFixed(1)),
            responseLatencyMs: Math.max(15, Math.floor(state.currentMetric.responseLatencyMs + (Math.random() * 6 - 3))),
            timestamp: new Date().toISOString(),
          },
        }));
      },

      resolveAlert: (alertId) => {
        set((state) => ({
          alerts: state.alerts.map((alt) =>
            alt.id === alertId ? { ...alt, isResolved: true, resolvedAt: new Date().toISOString() } : alt
          ),
        }));
      },

      triggerChaosLoad: (type) => {
        const id = 'alt-' + Date.now();
        let alertType: HealthAlertType = 'CPU_SPIKE';
        let msg = 'Chaos Simulator: High CPU utilization spike triggered on primary node';

        if (type === 'DB_POOL') {
          alertType = 'DB_POOL_EXHAUSTION';
          msg = 'Chaos Simulator: DB Connection Pool saturated to 98% capacity';
        } else if (type === 'LATENCY') {
          alertType = 'HIGH_LATENCY';
          msg = 'Chaos Simulator: API response latency exceeded 800ms threshold';
        }

        const newAlert: SystemHealthAlertRecord = {
          id,
          serviceName: type === 'DB_POOL' ? 'DATABASE_POSTGRES' : 'WEBSOCKET_GATEWAY',
          alertType,
          severity: 'CRITICAL',
          message: msg,
          isResolved: false,
          triggeredAt: new Date().toISOString(),
          resolvedAt: null,
        };

        set((state) => ({
          isChaosTesting: true,
          alerts: [newAlert, ...state.alerts],
          currentMetric: {
            ...state.currentMetric,
            cpuUsagePercent: type === 'CPU' ? 94.8 : state.currentMetric.cpuUsagePercent,
            dbPoolActive: type === 'DB_POOL' ? 48 : state.currentMetric.dbPoolActive,
            dbPoolIdle: type === 'DB_POOL' ? 2 : state.currentMetric.dbPoolIdle,
            responseLatencyMs: type === 'LATENCY' ? 840 : state.currentMetric.responseLatencyMs,
          },
        }));
      },

      stopChaosLoad: () => {
        set({
          isChaosTesting: false,
          currentMetric: INITIAL_METRIC,
        });
      },
    }),
    {
      name: 'companion-system-health-store',
    }
  )
);
