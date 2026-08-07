import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      reports: [
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
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, reportType, fileFormat } = body;

    const newReport = {
      id: 'rpt-' + Date.now(),
      title: title || 'Executive Financial Summary',
      reportType: reportType || 'WEEKLY_BOARD_DECK',
      fileFormat: fileFormat || 'PDF',
      downloadUrl: '#',
      generatedBy: 'Alexander Vance (CFO)',
      periodCovered: `Period Ending ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      report: newReport,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}
