import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { format, subDays, eachDayOfInterval, startOfWeek } from 'date-fns';

const HeatmapPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, habits } = useApp();
  const path = window.location.pathname;
  const isHabit = path.includes('/habit/');
  const item = isHabit ? habits.find(h => h.id === id) : tasks.find(t => t.id === id);

  if (!item) return null;

  // Build heatmap data for last 365 days
  const today = new Date();
  const startDate = subDays(today, 364);
  const days = eachDayOfInterval({ start: startDate, end: today });

  const getActivity = (date: Date): number => {
    const ds = format(date, 'yyyy-MM-dd');
    if (isHabit) {
      return (item as any).completedDates.includes(ds) ? 3 : 0;
    }
    const totalSecs = item.timerLog.filter(e => e.date === ds).reduce((a, e) => a + e.seconds, 0);
    if (totalSecs === 0) return 0;
    if (totalSecs < 1800) return 1;
    if (totalSecs < 3600) return 2;
    return 3;
  };

  // Calculate streak
  let streak = 0;
  const d = new Date();
  while (true) {
    if (getActivity(d) > 0) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  days.forEach((day, i) => {
    const dow = day.getDay();
    if (i === 0) {
      for (let j = 0; j < dow; j++) currentWeek.push(null as any);
    }
    currentWeek.push(day);
    if (dow === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length) weeks.push(currentWeek);

  const levelColors = [
    'hsl(220 14% 14%)',
    `hsl(${item.color} / 0.3)`,
    `hsl(${item.color} / 0.6)`,
    `hsl(${item.color})`,
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: `hsl(${item.color})` }}>{item.title} — Heatmap</h1>
          <p className="text-muted-foreground text-sm mb-6">🔥 {streak} day streak</p>

          <div className="glass rounded-xl p-4 overflow-x-auto">
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => {
                    if (!day) return <div key={di} className="w-3 h-3" />;
                    const level = getActivity(day);
                    return (
                      <motion.div
                        key={di}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: wi * 0.005 }}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: levelColors[level] }}
                        title={`${format(day, 'MMM d, yyyy')}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              {levelColors.map((c, i) => <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />)}
              <span>More</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeatmapPage;
