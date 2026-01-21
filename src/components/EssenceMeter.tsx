import { motion } from 'framer-motion';

interface EssenceMeterProps {
  value: number; // 0 to 1
  label?: string;
}

const EssenceMeter = ({ value = 0.95, label = "ODOS Coherence" }: EssenceMeterProps) => {
  const percentage = Math.min(Math.max(value * 100, 0), 100);
  const isOptimal = value >= 0.95;
  const isWarning = value < 0.95 && value >= 0.7;
  const isCritical = value < 0.7;
  
  return (
    <div className="w-full max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`font-mono text-sm ${
          isOptimal ? 'text-resonance text-glow-resonance' : 
          isWarning ? 'text-essence' : 
          'text-entropy-red'
        }`}>
          ΔE: {(1 - value).toFixed(4)}
        </span>
      </div>
      
      <div className="relative h-3 bg-void-light rounded-full overflow-hidden">
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: isOptimal 
              ? 'linear-gradient(90deg, transparent, hsl(var(--resonance-primary)), transparent)'
              : isWarning
              ? 'linear-gradient(90deg, transparent, hsl(var(--essence-gold)), transparent)'
              : 'linear-gradient(90deg, transparent, hsl(var(--entropy-red)), transparent)'
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Progress bar */}
        <motion.div
          className="h-full rounded-full"
          style={{
            background: isOptimal 
              ? 'linear-gradient(90deg, hsl(var(--resonance-subtle)), hsl(var(--resonance-primary)))'
              : isWarning
              ? 'linear-gradient(90deg, hsl(var(--essence-warm)), hsl(var(--essence-gold)))'
              : 'linear-gradient(90deg, hsl(var(--entropy-orange)), hsl(var(--entropy-red)))',
            boxShadow: isOptimal
              ? '0 0 15px hsl(var(--resonance-glow) / 0.5)'
              : isWarning
              ? '0 0 15px hsl(var(--essence-glow) / 0.5)'
              : '0 0 15px hsl(var(--entropy-red) / 0.5)'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      
      <div className="flex justify-between mt-1 text-xs font-mono text-muted-foreground">
        <span>0.00</span>
        <span className={isOptimal ? 'text-resonance' : ''}>
          {value.toFixed(4)}
        </span>
        <span>1.00</span>
      </div>
      
      {/* Status indicator */}
      <div className="mt-3 flex items-center gap-2">
        <motion.div
          className={`w-2 h-2 rounded-full ${
            isOptimal ? 'bg-resonance' : isWarning ? 'bg-essence' : 'bg-entropy-red'
          }`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="text-xs text-muted-foreground">
          {isOptimal ? 'RESONANT: Essence Coherence Optimal' : 
           isWarning ? 'DRIFT: Approaching Threshold' : 
           'DISSONANCE: Ethical Entropy Detected'}
        </span>
      </div>
    </div>
  );
};

export default EssenceMeter;
