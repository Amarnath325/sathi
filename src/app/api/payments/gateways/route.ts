import { NextResponse } from 'next/server';
import { INITIAL_GATEWAYS } from '@/lib/initialPayments';
import { PaymentGatewayConfig } from '@/lib/types';

let inMemoryGateways: PaymentGatewayConfig[] = [...INITIAL_GATEWAYS];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      count: inMemoryGateways.length,
      data: inMemoryGateways
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gateway configs', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isEnabled, environment, transactionFeePercent, merchantId } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing gateway ID parameter' },
        { status: 400 }
      );
    }

    const index = inMemoryGateways.findIndex(g => g.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: `Gateway config #${id} not found` },
        { status: 404 }
      );
    }

    inMemoryGateways[index] = {
      ...inMemoryGateways[index],
      ...(isEnabled !== undefined ? { isEnabled } : {}),
      ...(environment ? { environment } : {}),
      ...(transactionFeePercent !== undefined ? { transactionFeePercent: Number(transactionFeePercent) } : {}),
      ...(merchantId ? { merchantId } : {})
    };

    return NextResponse.json({
      success: true,
      message: `Gateway ${inMemoryGateways[index].name} updated successfully`,
      data: inMemoryGateways[index]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to update gateway config', details: error.message },
      { status: 500 }
    );
  }
}
