import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { TASK_COLORS } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const HabitTracker = () => {
  const { habits, addHabit, toggleHabitDay, deleteHabit } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(TASK_COLORS[1]);
  const today = format(new Date(), 'yyyy-MM-dd');

  const handleCreate = () => {
    if (!title.trim()) return;
    addHabit({ title: title.trim(), color });
    setTitle('');
    setOpen(false);
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold">Habits</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary" className="gap-1"><Plus className="w-4 h-4" /> Add</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="font-display">New Habit</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Habit name" value={title} onChange={e => setTitle(e.target.value)} className="bg-muted border-border" />
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {TASK_COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-foreground' : ''}`}
                      style={{ backgroundColor: `hsl(${c})` }} />
                  ))}
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full">Create Habit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <AnimatePresence>
        {habits.length === 0 && <p className="text-muted-foreground text-sm text-center py-6">No habits yet.</p>}
        {habits.map((habit, i) => {
          const doneToday = habit.completedDates.includes(today);
          const streak = (() => {
            let count = 0;
            const d = new Date();
            while (true) {
              const ds = format(d, 'yyyy-MM-dd');
              if (habit.completedDates.includes(ds)) { count++; d.setDate(d.getDate() - 1); }
              else break;
            }
            return count;
          })();
          return (
            <motion.div
  key={habit.id}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 20 }}
  transition={{ delay: i * 0.05 }}
  className="p-3 rounded-lg bg-muted/40 mb-2 transition-colors"
>

  {/* TOP ROW */}
  <div className="flex items-center gap-3">

    {/* COLOR DOT */}
    <div
      className="w-3 h-3 rounded-full flex-shrink-0"
      style={{ backgroundColor: `hsl(${habit.color})` }}
    />

    {/* HABIT TEXT */}
    <div className="flex-1 min-w-0">

      <div className="font-medium text-sm truncate">
        {habit.title}
      </div>

      <div className="text-xs text-muted-foreground">
        Daily Habit
      </div>

    </div>

    {/* OPEN HABIT PAGE */}
    <button
      onClick={() => navigate(`/habit/${habit.id}`)}
      className="p-1 rounded hover:bg-blue-500/20 text-blue-400 transition"
    >
      <ArrowRight className="w-4 h-4" />
    </button>

  </div>


  {/* ACTION BUTTONS BELOW */}
  <div className="flex gap-3 mt-3 pl-6">

    {/* COMPLETE HABIT */}
    <button
      onClick={() => completeHabit(habit.id)}
      className="flex items-center gap-1 text-green-500 hover:scale-105 transition"
    >
      <Check className="w-4 h-4" />
      <span className="text-xs">Done</span>
    </button>

    {/* DELETE HABIT */}
    <button
      onClick={() => deleteHabit(habit.id)}
      className="flex items-center gap-1 text-red-500 hover:scale-105 transition"
    >
      <Trash2 className="w-4 h-4" />
      <span className="text-xs">Delete</span>
    </button>

  </div>

</motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default HabitTracker;
