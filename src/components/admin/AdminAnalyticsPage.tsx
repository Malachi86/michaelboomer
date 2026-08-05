'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, MousePointer, Clock, FileText, TrendingUp, 
  Users, Loader2, Calendar
} from 'lucide-react';
import { getAnalytics } from '@/app/admin/actions';
import type { Analytics } from '@/lib/types';
import { format, subDays, isAfter } from 'date-fns';

export function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true);
      const data = await getAnalytics();
      setAnalytics(data || []);
      setIsLoading(false);
    }
    fetchAnalytics();
  }, []);

  const stats = useMemo(() => {
    if (!analytics.length) return null;
    const now = new Date();
    const last7Days = subDays(now, 7);
    
    const recentAnalytics = analytics.filter(a => a.createdAt && isAfter(new Date(a.createdAt), last7Days));
    const pageViews = analytics.filter(a => a.event_type === 'page_view');
    const clicks = analytics.filter(a => a.event_type === 'click');
    const timeSpent = analytics.filter(a => a.event_type === 'time_spent');
    const uniqueVisitors = new Set(analytics.map(a => a.visitor_id)).size;

    const avgTimeSpent = timeSpent.length > 0
      ? Math.round(timeSpent.reduce((sum, a) => sum + (a.duration || 0), 0) / timeSpent.length)
      : 0;

    const pageBreakdown: Record<string, number> = {};
    pageViews.forEach(a => {
      const page = a.page || 'Unknown';
      pageBreakdown[page] = (pageBreakdown[page] || 0) + 1;
    });

    const topPages = Object.entries(pageBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const dailyViews: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(now, i), 'MMM dd');
      dailyViews[date] = 0;
    }
    recentAnalytics.forEach(a => {
      if (a.event_type === 'page_view' && a.createdAt) {
        const date = format(new Date(a.createdAt), 'MMM dd');
        if (dailyViews[date] !== undefined) dailyViews[date]++;
      }
    });

    return {
      totalPageViews: pageViews.length,
      totalClicks: clicks.length,
      uniqueVisitors,
      avgTimeSpent,
      topPages,
      dailyViews,
      last7DaysViews: recentAnalytics.filter(a => a.event_type === 'page_view').length
    };
  }, [analytics]);

  if (isLoading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <>
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Analytics Dashboard
        </motion.h1>
        <p className="text-muted-foreground">Track visitor engagement and behavior</p>
      </div>

      {stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Eye, label: 'Total Page Views', value: stats.totalPageViews, subtext: `${stats.last7DaysViews} in last 7 days` },
              { icon: Users, label: 'Unique Visitors', value: stats.uniqueVisitors },
              { icon: MousePointer, label: 'Total Clicks', value: stats.totalClicks },
              { icon: Clock, label: 'Avg Time (seconds)', value: stats.avgTimeSpent },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="bg-card border-border/50">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    {stat.subtext && <p className="text-muted-foreground text-xs mt-1">{stat.subtext}</p>}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border/50">
              <CardHeader><CardTitle className="text-white">Top Pages</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {stats.topPages.map(([page, views], i) => (
                  <div key={page}>
                    <div className="flex justify-between text-sm mb-1 text-muted-foreground"><span>{page}</span><span>{views} views</span></div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(views / stats.totalPageViews) * 100}%` }} className="h-full bg-gradient-to-r from-primary to-accent" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50">
              <CardHeader><CardTitle className="text-white">Last 7 Days</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(stats.dailyViews).map(([date, views]) => (
                  <div key={date} className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs w-16">{date}</span>
                    <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden relative border border-white/5">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(views / Math.max(...Object.values(stats.dailyViews), 1)) * 100}%` }} className="h-full bg-gradient-to-r from-accent to-primary" />
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">{views}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="bg-card border-border/50 p-20 text-center text-muted-foreground">No analytics data yet.</Card>
      )}
    </>
  );
}
