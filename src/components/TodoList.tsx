import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

const TodoList = () => {
  const { todos, addTodo, toggleTodo } = useApp();
  const [text, setText] = useState('');
  const activeTodos = todos.filter(t => !t.completed);

  const handleAdd = () => {
    if (!text.trim()) return;
    addTodo(text.trim());
    setText('');
  };

  return (
    <div className="glass rounded-xl p-4">
      <h2 className="font-display text-lg font-semibold mb-4">To-Do</h2>
      <div className="flex gap-2 mb-3">
        <Input placeholder="Add a to-do..." value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()} className="bg-muted border-border text-sm" />
        <button onClick={handleAdd} className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <AnimatePresence>
        {activeTodos.map((todo, i) => (
          <motion.div key={todo.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }} transition={{ duration: 0.2 }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 mb-1 cursor-pointer"
            onClick={() => toggleTodo(todo.id)}>
            <CheckCircle className="w-4 h-4 text-muted-foreground hover:text-accent transition-colors" />
            <span className="text-sm">{todo.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
      {activeTodos.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">All done! ✨</p>}
    </div>
  );
};

export default TodoList;
