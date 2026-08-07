import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      alerts: [
        {
          id: 'exec-alt-1',
          title: 'Surge Escrow Volume Anomaly Detected',
          category: 'FINANCIAL',
          description: 'High-value booking spikes in North America region ($45,000+ total in past 2 hours).',
          severity: 'WARNING',
          status: 'OPEN',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          actionRequired: 'Verify platform liquidity buffer allocation',
        },
        {
          id: 'exec-alt-2',
          title: 'EU GDPR Escrow Data Audit Certificate Ready',
          category: 'COMPLIANCE',
          description: 'Annual Independent Escrow Data Sovereignty Audit successfully passed.',
          severity: 'INFO',
          status: 'ACKNOWLEDGED',
          timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
          actionRequired: 'Download and archive board audit deck',
        },
        {
          id: 'exec-alt-3',
          title: 'Security Firewall Rule Escalation (Brute Force Defense)',
          category: 'SECURITY',
          description: 'Automated 2FA System blocked 1,420 unauthorized API ping attempts.',
          severity: 'CRITICAL',
          status: 'OPEN',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          actionRequired: 'Initiate Deep Threat Inspection Audit',
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { alertId, action } = body; // action: 'ACKNOWLEDGE' | 'RESOLVE'

    if (!alertId || !action) {
      return NextResponse.json({ success: false, error: 'alertId and action are required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      alertId,
      action,
      updatedStatus: action === 'ACKNOWLEDGE' ? 'ACKNOWLEDGED' : 'RESOLVED',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update alert' },
      { status: 500 }
    );
  }
}
