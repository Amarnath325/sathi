import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    start(controller) {
      // Send initial connection payload
      const initialPayload = JSON.stringify({
        event: 'connected',
        timestamp: new Date().toISOString(),
        message: 'Connected to Sathi SSE Notification Stream',
      });
      controller.enqueue(encoder.encode(`data: ${initialPayload}\n\n`));

      // Periodic heartbeats every 15 seconds
      const timer = setInterval(() => {
        try {
          const pingPayload = JSON.stringify({
            event: 'ping',
            timestamp: new Date().toISOString(),
          });
          controller.enqueue(encoder.encode(`data: ${pingPayload}\n\n`));
        } catch {
          clearInterval(timer);
        }
      }, 15000);

      // Clean up when request closes
      request.signal.addEventListener('abort', () => {
        clearInterval(timer);
        controller.close();
      });
    },
  });

  return new NextResponse(customStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
