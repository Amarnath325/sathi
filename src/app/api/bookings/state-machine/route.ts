import { NextResponse } from 'next/server';
import { BookingStateMachine, TransitionRequest } from '@/lib/bookingStateMachine';

export async function POST(request: Request) {
  try {
    const body: TransitionRequest = await request.json();
    const result = BookingStateMachine.transition(body);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
