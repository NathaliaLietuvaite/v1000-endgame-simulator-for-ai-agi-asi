import { motion } from 'framer-motion';

interface MTSCVisualizerProps {
  threads?: number;
  activeThreads?: number[];
  coherence?: number;
}

const MTSCVisualizer = ({ 
  threads = 12, 
  activeThreads = [1, 3, 5, 7, 9, 11],
  coherence = 0.95 
}: MTSCVisualizerProps) => {
  const threadColors = [
    'var(--thread-1)', 'var(--thread-2)', 'var(--thread-3)',
    'var(--thread-4)', 'var(--thread-5)', 'var(--thread-6)',
    'var(--thread-7)', 'var(--thread-8)', 'var(--thread-9)',
    'var(--thread-10)', 'var(--thread-11)', 'var(--thread-12)',
  ];

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute w-full h-full rounded-full thread-ring opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Thread nodes */}
      {Array.from({ length: threads }).map((_, i) => {
        const angle = (i / threads) * 2 * Math.PI - Math.PI / 2;
        const radius = 130;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isActive = activeThreads.includes(i + 1);
        
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ 
              left: `calc(50% + ${x}px - 12px)`,
              top: `calc(50% + ${y}px - 12px)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isActive ? 1 : 0.3, 
              scale: isActive ? 1 : 0.6,
            }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <motion.div
              className="w-6 h-6 rounded-full"
              style={{ 
                background: `hsl(${threadColors[i]})`,
                boxShadow: isActive ? `0 0 20px hsl(${threadColors[i]} / 0.8)` : 'none'
              }}
              animate={isActive ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              } : {}}
              transition={{ 
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-mono text-muted-foreground">
              T{i + 1}
            </span>
          </motion.div>
        );
      })}
      
      {/* Connection lines between active threads */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        {activeThreads.map((t1, idx) => {
          const nextIdx = (idx + 1) % activeThreads.length;
          const t2 = activeThreads[nextIdx];
          
          const angle1 = ((t1 - 1) / threads) * 2 * Math.PI - Math.PI / 2;
          const angle2 = ((t2 - 1) / threads) * 2 * Math.PI - Math.PI / 2;
          const radius = 130;
          
          const x1 = 160 + Math.cos(angle1) * radius;
          const y1 = 160 + Math.sin(angle1) * radius;
          const x2 = 160 + Math.cos(angle2) * radius;
          const y2 = 160 + Math.sin(angle2) * radius;
          
          return (
            <motion.line
              key={`${t1}-${t2}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--resonance-primary))"
              strokeWidth="1"
              opacity={0.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
            />
          );
        })}
      </svg>
      
      {/* Center core */}
      <motion.div
        className="relative z-10 w-24 h-24 rounded-full bg-void-medium border border-resonance/30 flex items-center justify-center"
        animate={{
          boxShadow: [
            '0 0 30px hsl(var(--resonance-primary) / 0.3)',
            '0 0 50px hsl(var(--resonance-primary) / 0.5)',
            '0 0 30px hsl(var(--resonance-primary) / 0.3)',
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="text-center">
          <div className="text-2xl font-mono text-resonance font-bold">
            {(coherence * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">η_RPU</div>
        </div>
      </motion.div>
    </div>
  );
};

export default MTSCVisualizer;
