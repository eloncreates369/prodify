import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const OverallAnalytics = () => {
  const { tasks } = useApp();

  const totalCreated = tasks.length;
  const totalDone = tasks.filter(t => t.completed).length;
  const consistency = totalCreated > 0 ? Math.round((totalDone / totalCreated) * 100) : 0;

  // Hours per task for bar chart
  const barData = tasks.slice(0, 10).map(t => ({
    name: t.title.slice(0, 12),
    hours: +(t.timerSeconds / 3600).toFixed(1),
    color: `hsl(${t.color})`,
  }));

  // Pie chart: hours per task out of 24
  const totalHrsToday = tasks.reduce((acc, t) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return acc + t.timerLog.filter(e => e.date === today).reduce((a, e) => a + e.seconds, 0) / 3600;
  }, 0);

  const pieData = [
    ...tasks.filter(t => t.timerSeconds > 0).slice(0, 6).map(t => ({
      name: t.title,
      value: +(t.timerSeconds / 3600).toFixed(1),
      color: `hsl(${t.color})`,
    })),
    { name: 'Remaining', value: Math.max(0, +(24 - totalHrsToday).toFixed(1)), color: 'hsl(220 14% 18%)' },
  ];

  // Line chart: productivity over last 7 days
  const lineData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = format(d, 'yyyy-MM-dd');
    const hrs = tasks.reduce((acc, t) => acc + t.timerLog.filter(e => e.date === ds).reduce((a, e) => a + e.seconds, 0) / 3600, 0);
    return { day: format(d, 'EEE'), hours: +hrs.toFixed(1) };
  });

  return (
    <div className="glass rounded-xl p-4">
      <h2 className="font-display text-lg font-semibold mb-4">Overall Analytics</h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="font-display text-2xl font-bold text-primary">{totalDone}</div>
          <div className="text-xs text-muted-foreground">of {totalCreated} done</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="font-display text-2xl font-bold text-accent">{consistency}%</div>
          <div className="text-xs text-muted-foreground">Consistency</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="font-display text-2xl font-bold text-info">{totalHrsToday.toFixed(1)}h</div>
          <div className="text-xs text-muted-foreground">Today</div>
        </div>
      </div>

      {/* Productivity Line Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Weekly Productivity</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(220 10% 50%)' }} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(220 10% 50%)' }} axisLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="hours" stroke="hsl(38 92% 55%)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(38 92% 55%)' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Hours per task bar chart */}
      {barData.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Hours per Task</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220 10% 50%)' }} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Pie chart - day breakdown */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Day Breakdown (24h)</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {pieData.map((entry, i) => (
            <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}: {entry.value}h
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OverallAnalytics;
