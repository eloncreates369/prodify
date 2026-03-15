import { useState } from 'react'; 
import { useApp } from '@/contexts/AppContext'; 
import { useNavigate } from 'react-router-dom'; 
import { TASK_COLORS } from '@/types'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { Plus, Clock, Check, Trash2, ArrowRight } from 'lucide-react'; 
import { format } from 'date-fns'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
 
import { createTask } from "@/api"; 
 
const TaskList = () => { 
 
  const { tasks, addTask, completeTask, deleteTask } = useApp(); 
  const navigate = useNavigate(); 
 
  const [open, setOpen] = useState(false); 
  const [title, setTitle] = useState(''); 
  const [startTime, setStartTime] = useState('09:00'); 
  const [endTime, setEndTime] = useState('10:00'); 
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd')); 
  const [color, setColor] = useState(TASK_COLORS[0]); 
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium'); 
 
  const activeTasks = tasks.filter(t => !t.completed); 
 
  const handleCreate = async () => { 
 
    if (!title.trim()) return; 
 
    const task = { 
      title: title.trim(), 
      color, 
      startTime, 
      endTime, 
      date, 
      priority 
    }; 
 
    await createTask(task); 
 
    addTask(task); 
 
    setTitle(''); 
    setOpen(false); 
  }; 
 
  return ( 
    <div className="glass rounded-xl p-4"> 
 
      {/* HEADER */} 
      <div className="flex items-center justify-between mb-4"> 
        <h2 className="font-display text-lg font-semibold">Tasks</h2> 
 
        <Dialog open={open} onOpenChange={setOpen}> 
          <DialogTrigger asChild> 
            <Button size="sm" className="gap-1"> 
              <Plus className="w-4 h-4" /> Create 
            </Button> 
          </DialogTrigger> 
 
          <DialogContent className="bg-card border-border"> 
            <DialogHeader> 
              <DialogTitle className="font-display">New Task</DialogTitle> 
            </DialogHeader> 
 
            <div className="space-y-3"> 
 
              <Input 
                placeholder="Task title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="bg-muted border-border" 
              /> 
 
              <div className="grid grid-cols-2 gap-2"> 
 
                <div> 
                  <label className="text-xs text-muted-foreground">Start</label> 
                  <Input 
                    type="time" 
                    value={startTime} 
                    onChange={e => setStartTime(e.target.value)} 
                    className="bg-muted border-border" 
                  /> 
                </div> 
 
                <div> 
                  <label className="text-xs text-muted-foreground">End</label> 
                  <Input 
                    type="time" 
                    value={endTime} 
                    onChange={e => setEndTime(e.target.value)} 
                    className="bg-muted border-border" 
                  /> 
                </div> 
 
              </div> 
 
              <Input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                className="bg-muted border-border" 
              /> 
 
              <Select value={priority} onValueChange={v => setPriority(v as 'low' | 'medium' | 'high')}> 
                <SelectTrigger className="bg-muted border-border"> 
                  <SelectValue /> 
                </SelectTrigger> 
 
                <SelectContent> 
                  <SelectItem value="low">Low Priority</SelectItem> 
                  <SelectItem value="medium">Medium Priority</SelectItem> 
                  <SelectItem value="high">High Priority</SelectItem> 
                </SelectContent> 
 
              </Select> 
 
              <div> 
 
                <label className="text-xs text-muted-foreground mb-1 block"> 
                  Color 
                </label> 
 
                <div className="flex gap-2 flex-wrap"> 
                  {TASK_COLORS.map(c => ( 
                    <button 
                      key={c} 
                      onClick={() => setColor(c)} 
                      className={`w-7 h-7 rounded-full transition-transform ${ 
                        color === c ? 'scale-125 ring-2 ring-foreground' : '' 
                      }`} 
                      style={{ backgroundColor: hsl(${c}) }} 
                    /> 
                  ))} 
                </div> 
 
              </div> 
 
              <Button onClick={handleCreate} className="w-full"> 
                Create Task 
              </Button> 
 
            </div> 
          </DialogContent> 
        </Dialog> 
 
      </div> 
 
      {/* TASK LIST */} 
 
      <AnimatePresence> 
 
        {activeTasks.length === 0 && ( 
          <p className="text-muted-foreground text-sm text-center py-6"> 
            No tasks yet. Create one! 
          </p> 
        )} 
 
        {activeTasks.map((task, i) => ( 
 
          <motion.div 
            key={task.id} 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }} 
            transition={{ delay: i * 0.05 }} 
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 mb-2 transition-colors" 
          > 
 
            {/* COLOR DOT */} 
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: hsl(${task.color}) }} 
            /> 
 
            {/* TASK TEXT */} 
            <div className="flex-1 min-w-0"> 
 
              <div className="font-medium text-sm truncate"> 
                {task.title} 
              </div> 
 
              <div className="text-xs text-muted-foreground flex items-center gap-1"> 
                <Clock className="w-3 h-3" /> 
                {task.startTime} - {task.endTime} 
              </div> 
 
            </div> 
 
            {/* ACTION BUTTONS */} 
            <div className="flex items-center gap-2"> 
 
              {/* COMPLETE */} 
              <button 
                onClick={() => completeTask(task.id)} 
                className="p-1 rounded hover:bg-green-500/20 text-green-500 transition" 
              > 
                <Check className="w-4 h-4" /> 
              </button> 
 
              {/* OPEN DETAILS */} 
              <button 
                onClick={() => navigate(`/task/${task.id}`)} 
                className="p-1 rounded hover:bg-blue-500/20 text-blue-400 transition" 
              > 
                <ArrowRight className="w-4 h-4" /> 
              </button> 
 
              {/* DELETE */} 
              <button 
                onClick={() => deleteTask(task.id)} 
                className="p-1 rounded hover:bg-red-500/20 text-red-500 transition" 
              > 
                <Trash2 className="w-4 h-4" /> 
              </button> 
 
            </div> 
 
          </motion.div> 
 
        ))} 
 
      </AnimatePresence> 
 
    </div> 
  ); 
}; 
 
export default TaskList;