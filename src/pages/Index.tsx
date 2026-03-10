import DayScore from '@/components/DayScore';
import YearTracker from '@/components/YearTracker';
import TaskList from '@/components/TaskList';
import HabitTracker from '@/components/HabitTracker';
import TodoList from '@/components/TodoList';
import ReminderList from '@/components/ReminderList';
import DayCalendar from '@/components/DayCalendar';
import OverallAnalytics from '@/components/OverallAnalytics';
import { motion } from 'framer-motion';

import { useNavigate } from "react-router-dom";

const Index = () => {

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex items-center justify-between"
        >

          <div>
            <h1 className="font-display text-3xl font-bold text-gradient-primary">
              Prodify
            </h1>

            <p className="text-sm text-muted-foreground">
              Your productivity command center
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>

        </motion.div>

        {/* Day Score */}
        <DayScore />

        {/* Year Tracker */}
        <YearTracker />

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <TaskList />
          <HabitTracker />
          <TodoList />
          <ReminderList />
        </div>

        {/* Calendar */}
        <div className="mb-8">
          <DayCalendar />
        </div>

        {/* Analytics */}
        <div className="mb-8">
          <OverallAnalytics />
        </div>

      </div>

    </div>
  );
};

export default Index;