import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, Square } from 'lucide-react';
import { format } from 'date-fns';

const TimerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, habits, addTimerEntry } = useApp();
  const path = window.location.pathname;
  const isHabit = path.includes('/habit/');
  const item = isHabit ? habits.find(h => h.id === id) : tasks.find(t => t.id === id);

  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const handleStop = () => {
    setRunning(false);
    if (seconds > 0 && id) {
      addTimerEntry(id, isHabit ? 'habit' : 'task', { date: format(new Date(), 'yyyy-MM-dd'), seconds });
    }
    setSeconds(0);
  };

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50"
    >
      <button onClick={() => { handleStop(); navigate(-1); }}
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="text-center">
        <h2 className="font-display text-lg text-muted-foreground mb-2">{item.title}</h2>
        <motion.div
          className="font-display text-8xl md:text-9xl font-bold tracking-tight mb-12"
          style={{ color: `hsl(${item.color})` }}
          animate={running ? { opacity: [1, 0.8, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {hrs.toString().padStart(2, '0')}:{mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </motion.div>

        <div className="flex gap-4 justify-center">
          {!running ? (
            <button onClick={() => setRunning(true)}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: `hsl(${item.color})` }}>
              <Play className="w-8 h-8 text-primary-foreground ml-1" />
            </button>
          ) : (
            <>
              <button onClick={() => setRunning(false)}
                className="w-16 h-16 rounded-full bg-muted flex items-center justify-center hover:scale-110 transition-transform">
                <Pause className="w-6 h-6" />
              </button>
              <button onClick={handleStop}
                className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center hover:scale-110 transition-transform">
                <Square className="w-6 h-6 text-destructive-foreground" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TimerPage;
