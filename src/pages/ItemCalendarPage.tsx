import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { useState } from 'react';

const ItemCalendarPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, habits } = useApp();
  const path = window.location.pathname;
  const isHabit = path.includes('/habit/');
  const item = isHabit ? habits.find(h => h.id === id) : tasks.find(t => t.id === id);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!item) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDow = getDay(monthStart);

  const isActive = (day: Date) => {
    const ds = format(day, 'yyyy-MM-dd');
    if (isHabit) return (item as any).completedDates.includes(ds);
    return (item as any).date === ds || item.timerLog.some(e => e.date === ds);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold mb-6" style={{ color: `hsl(${item.color})` }}>{item.title} — Calendar</h1>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-muted rounded"><ChevronLeft className="w-5 h-5" /></button>
              <span className="font-display font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-muted rounded"><ChevronRight className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-xs text-muted-foreground py-1">{d}</div>
              ))}
              {Array.from({ length: startDow }).map((_, i) => <div key={`e${i}`} />)}
              {days.map(day => {
                const active = isActive(day);
                return (
                  <div key={day.toISOString()}
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${active ? 'font-bold' : 'text-muted-foreground'}`}
                    style={active ? { backgroundColor: `hsl(${item.color} / 0.2)`, color: `hsl(${item.color})` } : {}}>
                    {format(day, 'd')}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemCalendarPage;
