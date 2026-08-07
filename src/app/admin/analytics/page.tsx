'use client';

import React, { useState } from 'react';
import AnalyticsHeaderControls from '@/components/analytics/AnalyticsHeaderControls';
import AnalyticsMetricCards from '@/components/analytics/AnalyticsMetricCards';
import AnalyticsChartsSuite from '@/components/analytics/AnalyticsChartsSuite';
import ReportBuilderModal from '@/components/analytics/ReportBuilderModal';
import SavedReportsTable from '@/components/analytics/SavedReportsTable';
import { useAnalyticsStore } from '@/lib/analyticsStore';

export default function AnalyticsAdminPage() {
  const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);
  const { triggerExport } = useAnalyticsStore();

  const handleExportModal = async () => {
    const title = 'Platform Analytics & Audit Data Export';
    await triggerExport(title, 'PDF');
    alert('Export triggered! Download file added to Export History.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header Controls & Filter Tabs */}
      <AnalyticsHeaderControls
        onOpenReportBuilder={() => setIsReportBuilderOpen(true)}
        onOpenExportModal={handleExportModal}
      />

      {/* KPI Cards Grid tailored to active domain */}
      <AnalyticsMetricCards />

      {/* Multi-Chart Visualization Suite */}
      <AnalyticsChartsSuite />

      {/* Saved Reports Templates Library & Download History */}
      <SavedReportsTable />

      {/* Report Builder Modal */}
      <ReportBuilderModal
        isOpen={isReportBuilderOpen}
        onClose={() => setIsReportBuilderOpen(false)}
      />
    </div>
  );
}
