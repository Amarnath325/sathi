import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      currentMetric: {
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
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
