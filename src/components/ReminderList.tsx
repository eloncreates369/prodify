import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Bell, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const ReminderList = () => {
  const { reminders, addReminder, deleteReminder } = useApp();
  const [text, setText] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleAdd = () => {
    if (!text.trim() || !dateTime) return;
    addReminder(text.trim(), dateTime);
    setText('');
    setDateTime('');
  };

  const activeReminders = reminders.filter(r => !r.notified).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <div className="glass rounded-xl p-4">
      <h2 className="font-display text-lg font-semibold mb-4">Reminders</h2>
      <div className="space-y-2 mb-3">
        <Input placeholder="Reminder text..." value={text} onChange={e => setText(e.target.value)} className="bg-muted border-border text-sm" />
        <div className="flex gap-2">
          <Input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} className="bg-muted border-border text-sm flex-1" />
          <button onClick={handleAdd} className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {activeReminders.map(r => (
          <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 mb-1 group">
            <Bell className="w-4 h-4 text-warning flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate">{r.text}</div>
              <div className="text-xs text-muted-foreground">{format(new Date(r.dateTime), 'MMM d, h:mm a')}</div>
            </div>
            <button onClick={() => deleteReminder(r.id)} className="p-1 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {activeReminders.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No reminders set.</p>}
    </div>
  );
};

export default ReminderList;
