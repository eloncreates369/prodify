import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer, Grid3X3, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { type } = useParams<{ type: string }>() || {};
  const navigate = useNavigate();
  const { tasks, habits } = useApp();

  const path = window.location.pathname;
  const isHabit = path.includes('/habit/');
  const item = isHabit ? habits.find(h => h.id === id) : tasks.find(t => t.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Item not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const features = [
    { icon: Timer, label: 'Start Timer', desc: 'Focus mode timer', path: `timer` },
    { icon: Grid3X3, label: 'Heatmap', desc: 'Streak & consistency', path: `heatmap` },
    { icon: Calendar, label: 'Calendar', desc: 'Schedule view', path: `calendar` },
    { icon: BarChart3, label: 'Analytics', desc: 'Performance charts', path: `analytics` },
  ];

  const prefix = isHabit ? 'habit' : 'task';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${item.color})` }} />
            <h1 className="font-display text-2xl font-bold">{item.title}</h1>
          </div>
          {'startTime' in item && (
            <p className="text-sm text-muted-foreground mb-6">{(item as any).startTime} - {(item as any).endTime} · {(item as any).date}</p>
          )}
          {isHabit && (
            <p className="text-sm text-muted-foreground mb-6">
              {(item as any).completedDates.length} days completed · {(item.timerSeconds / 3600).toFixed(1)}h total
            </p>
          )}

          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.button
                key={f.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/${prefix}/${id}/${f.path}`)}
                className="w-full flex items-center gap-4 p-4 rounded-xl glass hover:bg-muted/60 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `hsl(${item.color} / 0.15)` }}>
                  <f.icon className="w-5 h-5" style={{ color: `hsl(${item.color})` }} />
                </div>
                <div>
                  <div className="font-medium">{f.label}</div>
                  <div className="text-xs text-muted-foreground">{f.desc}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemDetail;
