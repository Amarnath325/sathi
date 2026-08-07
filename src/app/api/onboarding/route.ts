import { NextResponse } from 'next/server';
import { CompanionOnboardingPipeline } from '@/lib/onboardingPipeline';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'user-default-101';
  const status = searchParams.get('status') as any || 'IN_PROGRESS';

  const onboardingState = CompanionOnboardingPipeline.getOnboardingState(userId, status);
  const sanitizedState = CompanionOnboardingPipeline.sanitizePublicCompanionProfile(onboardingState, 'USER');

  return NextResponse.json({
    success: true,
    data: sanitizedState
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, stepKey, metadata } = body;

    if (!userId || !stepKey) {
      return NextResponse.json({ success: false, error: 'userId and stepKey are required.' }, { status: 400 });
    }

    const currentState = CompanionOnboardingPipeline.getOnboardingState(userId, 'IN_PROGRESS');
    const updatedState = CompanionOnboardingPipeline.advanceStep(currentState, stepKey, metadata);

    return NextResponse.json({
      success: true,
      data: updatedState
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
