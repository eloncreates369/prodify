export interface Task {
  id: string;
  title: string;
  color: string; // HSL color string
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  date: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string;
  timerSeconds: number; // total seconds recorded
  timerLog: TimerEntry[];
  priority: 'low' | 'medium' | 'high';
}

export interface TimerEntry {
  date: string;
  seconds: number;
}

export interface Habit {
  id: string;
  title: string;
  color: string;
  createdAt: string;
  completedDates: string[]; // YYYY-MM-DD
  timerSeconds: number;
  timerLog: TimerEntry[];
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Reminder {
  id: string;
  text: string;
  dateTime: string; // ISO string
  notified: boolean;
  createdAt: string;
}

export const TASK_COLORS = [
  '38 92% 55%',   // amber
  '160 60% 45%',  // teal
  '210 80% 55%',  // blue
  '340 75% 55%',  // pink
  '280 65% 55%',  // purple
  '20 85% 55%',   // orange
  '120 50% 45%',  // green
  '0 72% 55%',    // red
];
