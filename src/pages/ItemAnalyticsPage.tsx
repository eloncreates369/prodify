import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { format, subDays, subWeeks, subMonths, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useState } from 'react';

type ZoomLevel = 'yearly' | 'monthly' | 'weekly' | 'daily';
const ZOOM_ORDER: ZoomLevel[] = ['yearly', 'monthly', 'weekly', 'daily'];

const ItemAnalyticsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, habits } = useApp();
  const path = window.location.pathname;
  const isHabit = path.includes('/habit/');
  const item = isHabit ? habits.find(h => h.id === id) : tasks.find(t => t.id === id);
  const [zoomIdx, setZoomIdx] = useState(0);

  if (!item) return null;

  const zoom = ZOOM_ORDER[zoomIdx];
  const now = new Date();

  const getData = () => {
    const log = item.timerLog;
    if (zoom === 'daily') {
      return Array.from({ length: 7 }, (_, i) => {
        const d = subDays(now, 6 - i);
        const ds = format(d, 'yyyy-MM-dd');
        const hrs = log.filter(e => e.date === ds).reduce((a, e) => a + e.seconds, 0) / 3600;
        return { label: format(d, 'EEE'), hours: +hrs.toFixed(1) };
      });
    }
    if (zoom === 'weekly') {
      return Array.from({ length: 8 }, (_, i) => {
        const weekStart = startOfWeek(subWeeks(now, 7 - i));
        const weekEnd = endOfWeek(weekStart);
        const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
        const hrs = days.reduce((acc, d) => {
          const ds = format(d, 'yyyy-MM-dd');
          return acc + log.filter(e => e.date === ds).reduce((a, e) => a + e.seconds, 0) / 3600;
        }, 0);
        return { label: format(weekStart, 'MMM d'), hours: +hrs.toFixed(1) };
      });
    }
    if (zoom === 'monthly') {
      return Array.from({ length: 12 }, (_, i) => {
        const monthStart = startOfMonth(subMonths(now, 11 - i));
        const monthEnd = endOfMonth(monthStart);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const hrs = days.reduce((acc, d) => {
          const ds = format(d, 'yyyy-MM-dd');
          return acc + log.filter(e => e.date === ds).reduce((a, e) => a + e.seconds, 0) / 3600;
        }, 0);
        return { label: format(monthStart, 'MMM'), hours: +hrs.toFixed(1) };
      });
    }
    // yearly - show by month for all time
    return Array.from({ length: 12 }, (_, i) => {
      const monthStart = startOfMonth(subMonths(now, 11 - i));
      const monthEnd = endOfMonth(monthStart);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      const hrs = days.reduce((acc, d) => {
        const ds = format(d, 'yyyy-MM-dd');
        return acc + log.filter(e => e.date === ds).reduce((a, e) => a + e.seconds, 0) / 3600;
      }, 0);
      return { label: format(monthStart, 'MMM yy'), hours: +hrs.toFixed(1) };
    });
  };

  const data = getData();
  const totalHrs = (item.timerSeconds / 3600).toFixed(1);
  const totalDays = new Set(item.timerLog.map(e => e.date)).size;

  // Streak
  let streak = 0;
  const d = new Date();
  while (true) {
    const ds = format(d, 'yyyy-MM-dd');
    if (isHabit) {
      if ((item as any).completedDates.includes(ds)) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    } else {
      if (item.timerLog.some(e => e.date === ds)) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: `hsl(${item.color})` }}>{item.title} — Analytics</h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="glass rounded-lg p-3 text-center">
              <div className="font-display text-xl font-bold" style={{ color: `hsl(${item.color})` }}>{totalHrs}h</div>
              <div className="text-xs text-muted-foreground">Total Hours</div>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <div className="font-display text-xl font-bold" style={{ color: `hsl(${item.color})` }}>{totalDays}</div>
              <div className="text-xs text-muted-foreground">Active Days</div>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <div className="font-display text-xl font-bold" style={{ color: `hsl(${item.color})` }}>{streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium capitalize">{zoom} View</span>
            <div className="flex gap-2">
              <button onClick={() => setZoomIdx(Math.min(zoomIdx + 1, 3))}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors" title="Zoom In">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={() => setZoomIdx(Math.max(zoomIdx - 1, 0))}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors" title="Zoom Out">
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Line Chart */}
          <div className="glass rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Progress (Line)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="hours" stroke={`hsl(${item.color})`} strokeWidth={2} dot={{ r: 3, fill: `hsl(${item.color})` }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Progress (Bar)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="hours" fill={`hsl(${item.color})`} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemAnalyticsPage;
