import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const DayCalendar = () => {
  const { tasks } = useApp();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayTasks = tasks.filter(t => t.date === today);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTaskPosition = (task: typeof tasks[0]) => {
    const [sh, sm] = task.startTime.split(':').map(Number);
    const [eh, em] = task.endTime.split(':').map(Number);
    const top = (sh + sm / 60) * 60; // 60px per hour
    const height = ((eh + em / 60) - (sh + sm / 60)) * 60;
    return { top, height: Math.max(height, 20) };
  };

  return (
    <div className="glass rounded-xl p-4">
      <h2 className="font-display text-lg font-semibold mb-2">Today's Schedule</h2>
      <p className="text-sm text-muted-foreground mb-4">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      <div className="relative overflow-y-auto max-h-[500px] rounded-lg">
        <div className="relative" style={{ height: 24 * 60 }}>
          {hours.map(h => (
            <div key={h} className="absolute left-0 right-0 border-t border-border/30 flex" style={{ top: h * 60, height: 60 }}>
              <span className="text-[10px] text-muted-foreground w-12 flex-shrink-0 pt-1 pl-1">
                {h.toString().padStart(2, '0')}:00
              </span>
            </div>
          ))}
          {todayTasks.map(task => {
            const pos = getTaskPosition(task);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                className="absolute left-14 right-2 rounded-md px-2 py-1 text-xs font-medium overflow-hidden"
                style={{
                  top: pos.top,
                  height: pos.height,
                  backgroundColor: `hsl(${task.color} / 0.2)`,
                  borderLeft: `3px solid hsl(${task.color})`,
                  color: `hsl(${task.color})`,
                }}
              >
                <div className="truncate">{task.title}</div>
                <div className="text-[10px] opacity-70">{task.startTime} - {task.endTime}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayCalendar;
