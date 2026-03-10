import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, Habit, TodoItem, Reminder, TimerEntry } from '@/types';
import { getTasks } from "@/api";

interface AppState {
  tasks: Task[];
  habits: Habit[];
  todos: TodoItem[];
  reminders: Reminder[];
}

interface AppContextType extends AppState {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'timerSeconds' | 'timerLog'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  addTimerEntry: (id: string, type: 'task' | 'habit', entry: TimerEntry) => void;

  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'timerSeconds' | 'timerLog'>) => void;
  toggleHabitDay: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;

  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;

  addReminder: (text: string, dateTime: string) => void;
  deleteReminder: (id: string) => void;

  getItemById: (id: string, type: 'task' | 'habit') => Task | Habit | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'prodify_data';

const loadState = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return { tasks: [], habits: [], todos: [], reminders: [] };
};

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [state, setState] = useState<AppState>(loadState);

 // ⭐ LOAD TASKS FROM BACKEND (SAFE)
useEffect(() => {
  async function loadTasksFromBackend() {
    try {
      const tasks = await getTasks();

      // ensure tasks is always an array
      if (Array.isArray(tasks)) {
        setState(prev => ({
          ...prev,
          tasks
        }));
      } else {
        console.warn("Invalid tasks response:", tasks);
      }

    } catch (err) {
      console.error("Failed to load tasks from backend", err);
    }
  }

  loadTasksFromBackend();
}, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Check reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setState(prev => {
        let changed = false;

        const reminders = prev.reminders.map(r => {
          if (!r.notified && new Date(r.dateTime) <= now) {
            changed = true;

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Prodify Reminder', { body: r.text });
            }

            return { ...r, notified: true };
          }

          return r;
        });

        return changed ? { ...prev, reminders } : prev;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'timerSeconds' | 'timerLog'>) => {

    setState(prev => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          ...task,
          id: uid(),
          createdAt: new Date().toISOString(),
          completed: false,
          timerSeconds: 0,
          timerLog: []
        }
      ]
    }));

  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  }, []);

  const completeTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: true } : t)
    }));
  }, []);

  const addTimerEntry = useCallback((id: string, type: 'task' | 'habit', entry: TimerEntry) => {

    setState(prev => {

      if (type === 'task') {

        return {
          ...prev,
          tasks: prev.tasks.map(t =>
            t.id === id
              ? { ...t, timerSeconds: t.timerSeconds + entry.seconds, timerLog: [...t.timerLog, entry] }
              : t
          )
        };

      }

      return {
        ...prev,
        habits: prev.habits.map(h =>
          h.id === id
            ? { ...h, timerSeconds: h.timerSeconds + entry.seconds, timerLog: [...h.timerLog, entry] }
            : h
        )
      };

    });

  }, []);

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'timerSeconds' | 'timerLog'>) => {

    setState(prev => ({
      ...prev,
      habits: [
        ...prev.habits,
        {
          ...habit,
          id: uid(),
          createdAt: new Date().toISOString(),
          completedDates: [],
          timerSeconds: 0,
          timerLog: []
        }
      ]
    }));

  }, []);

  const toggleHabitDay = useCallback((id: string, date: string) => {

    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {

        if (h.id !== id) return h;

        const dates = h.completedDates.includes(date)
          ? h.completedDates.filter(d => d !== date)
          : [...h.completedDates, date];

        return { ...h, completedDates: dates };

      })
    }));

  }, []);

  const deleteHabit = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id)
    }));
  }, []);

  const addTodo = useCallback((text: string) => {

    setState(prev => ({
      ...prev,
      todos: [
        ...prev.todos,
        {
          id: uid(),
          text,
          completed: false,
          createdAt: new Date().toISOString()
        }
      ]
    }));

  }, []);

  const toggleTodo = useCallback((id: string) => {

    setState(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id)
    }));

  }, []);

  const deleteTodo = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id)
    }));
  }, []);

  const addReminder = useCallback((text: string, dateTime: string) => {

    if ('Notification' in window) Notification.requestPermission();

    setState(prev => ({
      ...prev,
      reminders: [
        ...prev.reminders,
        {
          id: uid(),
          text,
          dateTime,
          notified: false,
          createdAt: new Date().toISOString()
        }
      ]
    }));

  }, []);

  const deleteReminder = useCallback((id: string) => {

    setState(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r.id !== id)
    }));

  }, []);

  const getItemById = useCallback((id: string, type: 'task' | 'habit') => {

    if (type === 'task') return state.tasks.find(t => t.id === id);

    return state.habits.find(h => h.id === id);

  }, [state.tasks, state.habits]);

  return (
    <AppContext.Provider value={{
      ...state,
      addTask,
      updateTask,
      deleteTask,
      completeTask,
      addTimerEntry,
      addHabit,
      toggleHabitDay,
      deleteHabit,
      addTodo,
      toggleTodo,
      deleteTodo,
      addReminder,
      deleteReminder,
      getItemById
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};