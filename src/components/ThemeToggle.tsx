import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDay = theme === 'day';

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-400/30 text-cyan-200 hover:border-cyan-400/60 transition-all"
      aria-label={`Switch to ${isDay ? 'night' : 'day'} mode`}
    >
      {isDay ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="text-xs font-mono uppercase">{isDay ? 'Day' : 'Night'}</span>
    </motion.button>
  );
};

export default ThemeToggle;
