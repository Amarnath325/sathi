'use client';

import { useEffect, useState } from 'react';
import { useNotificationEngineStore, NotificationRecord } from '@/lib/notificationEngineStore';

export function useNotificationStream() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEventTime, setLastEventTime] = useState<string | null>(null);
  const [liveToast, setLiveToast] = useState<NotificationRecord | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/notifications/stream');

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastEventTime(data.timestamp || new Date().toISOString());

          if (data.event === 'notification' && data.payload) {
            // Add notification to store automatically
            const notif: NotificationRecord = data.payload;
            useNotificationEngineStore.getState().sendNotification({
              userId: notif.userId,
              userName: notif.userName,
              title: notif.title,
              body: notif.body,
              category: notif.category,
              priority: notif.priority,
              channels: notif.channels,
              actionUrl: notif.actionUrl,
              actionLabel: notif.actionLabel,
            });

            // Trigger live toast banner
            setLiveToast(notif);
            setTimeout(() => setLiveToast(null), 5000);
          }
        } catch {
          // Ignore non-JSON heartbeat
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
      };
    } catch {
      setIsConnected(false);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return { isConnected, lastEventTime, liveToast, dismissToast: () => setLiveToast(null) };
}
