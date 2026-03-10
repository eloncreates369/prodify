import { format, getDaysInMonth, isPast, isToday } from 'date-fns';
import { motion } from 'framer-motion';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const YearTracker = () => {
  const now = new Date();
  const year = now.getFullYear();

  const daysRemaining = Math.ceil(
    (new Date(year, 11, 31).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 mb-6"
    >
      <p className="text-sm text-muted-foreground italic mb-4 text-center">
        "The number of days like today you've remaining are{' '}
        <span className="text-primary font-semibold not-italic">{daysRemaining}</span>, use them
        wisely and plan them here."
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {MONTHS.map((month, mi) => {
          const daysInMonth = getDaysInMonth(new Date(year, mi));
          return (
            <div key={month}>
              <div className="text-xs text-muted-foreground font-medium mb-1.5">{month}</div>
              <div className="flex flex-wrap gap-[3px]">
                {Array.from({ length: daysInMonth }, (_, di) => {
                  const date = new Date(year, mi, di + 1);
                  const past = isPast(date) && !isToday(date);
                  const today = isToday(date);
                  return (
                    <div
                      key={di}
                      className={`w-2.5 h-2.5 rounded-full ${
                        today
                          ? 'bg-primary ring-1 ring-primary/50'
                          : past
                          ? 'bg-info/70'
                          : 'bg-muted'
                      }`}
                      title={format(date, 'MMM d, yyyy')}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default YearTracker;
