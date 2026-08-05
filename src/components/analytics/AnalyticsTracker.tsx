'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackAnalytics } from '@/lib/actions';

const getVisitorId = () => {
  if (typeof window === 'undefined') return 'server';
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

export function AnalyticsTracker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const startTimeRef = useRef(Date.now());
  const visitorIdRef = useRef<string>('');

  useEffect(() => {
    visitorIdRef.current = getVisitorId();
  }, []);

  useEffect(() => {
    const trackPageView = async () => {
      if (!visitorIdRef.current) return;
      await trackAnalytics({
        event_type: 'page_view',
        page: pathname,
        visitor_id: visitorIdRef.current,
        metadata: {
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          timestamp: new Date().toISOString()
        }
      });
    };

    trackPageView();
    startTimeRef.current = Date.now();

    return () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (duration > 0 && visitorIdRef.current) {
        trackAnalytics({
          event_type: 'time_spent',
          page: pathname,
          duration,
          visitor_id: visitorIdRef.current
        }).catch(() => {});
      }
    };
  }, [pathname]);

  // Click tracking
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const elementDesc = target.innerText?.substring(0, 50) || target.tagName;
      if (visitorIdRef.current) {
        trackAnalytics({
          event_type: 'click',
          page: pathname,
          element: elementDesc,
          visitor_id: visitorIdRef.current
        }).catch(() => {});
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [pathname]);

  return <>{children}</>;
}
