import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Zap, Clock, TrendingUp, Target } from 'lucide-react';

const DayScore = () => {
  const { tasks } = useApp();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayTasks = tasks.filter(t => t.date === today);
  const doneTasks = todayTasks.filter(t => t.completed);

  const totalPlannedHrs = todayTasks.reduce((acc, t) => {
    const [sh, sm] = t.startTime.split(':').map(Number);
    const [eh, em] = t.endTime.split(':').map(Number);
    return acc + (eh + em / 60) - (sh + sm / 60);
  }, 0);

  const totalWorkedHrs = todayTasks.reduce((acc, t) => {
    const todayEntries = t.timerLog.filter(e => e.date === today);
    return acc + todayEntries.reduce((a, e) => a + e.seconds, 0) / 3600;
  }, 0);

  const score = todayTasks.length > 0 ? Math.round((doneTasks.length / todayTasks.length) * 100) : 0;
  const dayUtilised = Math.round((totalWorkedHrs / 24) * 100);
  const dayRemaining = Math.round(((24 - new Date().getHours()) / 24) * 100);

  const stats = [
    { icon: Zap, label: 'Score', value: `${score}%`, color: 'text-primary' },
    { icon: Target, label: 'Tasks Done', value: `${doneTasks.length}/${todayTasks.length}`, color: 'text-accent' },
    { icon: Clock, label: 'Hrs Worked', value: `${totalWorkedHrs.toFixed(1)}h`, color: 'text-info' },
    { icon: TrendingUp, label: 'Day Left', value: `${dayRemaining}%`, color: 'text-secondary-foreground' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 mb-6"
    >
      <h2 className="font-display text-sm text-muted-foreground mb-3 uppercase tracking-wider">Today's Performance</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-muted/50 rounded-lg p-3 text-center"
          >
            <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
            <div className={`font-display text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DayScore;
