'use client';

import React, { useState } from 'react';
import ExecutiveHeaderControls from '@/components/executive/ExecutiveHeaderControls';
import ExecutiveKpiCardGrid from '@/components/executive/ExecutiveKpiCardGrid';
import ExecutiveRevenueChart from '@/components/executive/ExecutiveRevenueChart';
import ExecutiveRegionalBreakdown from '@/components/executive/ExecutiveRegionalBreakdown';
import ExecutiveStrategicAlerts from '@/components/executive/ExecutiveStrategicAlerts';
import ExecutiveActionModal from '@/components/executive/ExecutiveActionModal';

import { AdminAuthGuard } from '@/components/auth/AdminAuthGuard';

export default function ExecutiveDashboardAdminPage() {
  const [modalType, setModalType] = useState<'COMMISSION' | 'AUDIT' | 'REPORT' | null>(null);

  return (
    <AdminAuthGuard>
    <div className="w-full bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-20">
      {/* Executive Header Controls */}
      <ExecutiveHeaderControls
        onOpenActionModal={(type) => setModalType(type)}
      />

      {/* High-Impact C-Suite Metric Cards Grid */}
      <ExecutiveKpiCardGrid />

      {/* Interactive Revenue & Cashflow Trajectory Chart */}
      <ExecutiveRevenueChart />

      {/* Regional Penetration & Companion Tier Shares */}
      <ExecutiveRegionalBreakdown />

      {/* Strategic Live Alerts Desk & Exported Board Decks */}
      <ExecutiveStrategicAlerts />

      {/* Executive Action Modal */}
      <ExecutiveActionModal
        isOpen={modalType !== null}
        modalType={modalType}
        onClose={() => setModalType(null)}
      />
    </div>
    </AdminAuthGuard>
  );
}
