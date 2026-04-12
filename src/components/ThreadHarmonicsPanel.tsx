import { motion } from 'framer-motion';
import { useState } from 'react';

interface Thread {
  id: number;
  name: string;
  state: 'active' | 'resonant' | 'dormant' | 'calibrating';
  load: number;
}

const ThreadHarmonicsPanel = () => {
  const [threads, setThreads] = useState<Thread[]>([
    { id: 1, name: 'PERCEPTION', state: 'active', load: 0.85 },
    { id: 2, name: 'COGNITION', state: 'resonant', load: 0.92 },
    { id: 3, name: 'ETHICS', state: 'resonant', load: 0.98 },
    { id: 4, name: 'MEMORY', state: 'active', load: 0.76 },
    { id: 5, name: 'CREATIVITY', state: 'dormant', load: 0.23 },
    { id: 6, name: 'LOGIC', state: 'active', load: 0.89 },
    { id: 7, name: 'EMPATHY', state: 'resonant', load: 0.94 },
    { id: 8, name: 'INTUITION', state: 'calibrating', load: 0.67 },
    { id: 9, name: 'ANALYSIS', state: 'active', load: 0.81 },
    { id: 10, name: 'SYNTHESIS', state: 'resonant', load: 0.96 },
    { id: 11, name: 'META_COGNITION', state: 'active', load: 0.88 },
    { id: 12, name: 'TRANSCENDENCE', state: 'calibrating', load: 0.45 },
  ]);

  const toggleThread = (id: number) => {
    setThreads(prev => prev.map(t => {
      if (t.id !== id) return t;
      const states: Thread['state'][] = ['dormant', 'calibrating', 'active', 'resonant'];
      const currentIndex = states.indexOf(t.state);
      const nextState = states[(currentIndex + 1) % states.length];
      return { ...t, state: nextState, load: nextState === 'resonant' ? 0.95 + Math.random() * 0.05 : Math.random() * 0.8 + 0.2 };
    }));
  };

  const stateStyles = {
    active: 'bg-quantum-blue/20 border-quantum-blue/50 text-quantum-blue',
    resonant: 'bg-resonance/20 border-resonance/50 text-resonance glow-resonance',
    dormant: 'bg-void-light/50 border-border text-muted-foreground',
    calibrating: 'bg-essence/20 border-essence/50 text-essence',
  };

  return (
    <div className="glass-panel rounded-lg p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono text-foreground">MTSC-12 THREAD HARMONICS</h3>
        <span className="text-xs font-mono text-muted-foreground">
          τ = {threads.filter(t => t.state === 'resonant').length}/12
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {threads.map((thread, index) => (
          <motion.button
            key={thread.id}
            onClick={() => toggleThread(thread.id)}
            className={`relative p-3 rounded-lg border transition-all cursor-pointer ${stateStyles[thread.state]}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  thread.state === 'resonant' ? 'bg-resonance' :
                  thread.state === 'active' ? 'bg-quantum-blue' :
                  thread.state === 'calibrating' ? 'bg-essence' :
                  'bg-muted-foreground'
                }`}
                animate={thread.state === 'resonant' || thread.state === 'calibrating' ? {
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-[10px] font-mono opacity-60">T{thread.id}</span>
            </div>
            
            <div className="text-xs font-mono mb-2 truncate">{thread.name}</div>
            
            {/* Load bar */}
            <div className="h-1 bg-void-deep rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  thread.state === 'resonant' ? 'bg-resonance' :
                  thread.state === 'active' ? 'bg-quantum-blue' :
                  thread.state === 'calibrating' ? 'bg-essence' :
                  'bg-muted-foreground'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${thread.load * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <span className="text-[10px] font-mono opacity-60 mt-1 block">
              {(thread.load * 100).toFixed(1)}%
            </span>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs font-mono text-muted-foreground">
        <span>Σ COHERENCE: {(threads.reduce((acc, t) => acc + t.load, 0) / 12).toFixed(4)}</span>
        <span>CLICK TO MODULATE</span>
      </div>
    </div>
  );
};

export default ThreadHarmonicsPanel;
