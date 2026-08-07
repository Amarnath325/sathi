import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      reports: [
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
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch saved report templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, domain, metrics, groupBy, timeframe, recurrence, outputFormat, createdBy } = body;

    const newReport = {
      id: 'rpt-template-' + Date.now(),
      title: title || 'Custom Analytics Report',
      domain: domain || 'OVERVIEW',
      metrics: metrics || ['gmv', 'net_revenue'],
      groupBy: groupBy || 'DATE',
      timeframe: timeframe || '30D',
      recurrence: recurrence || 'NONE',
      outputFormat: outputFormat || 'PDF',
      lastRunAt: new Date().toISOString(),
      createdBy: createdBy || 'Analytics Super Admin',
    };

    return NextResponse.json({
      success: true,
      report: newReport,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create report template' },
      { status: 500 }
    );
  }
}
