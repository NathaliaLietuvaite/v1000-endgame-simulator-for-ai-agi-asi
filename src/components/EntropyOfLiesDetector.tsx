import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

interface LieEvent {
  id: number;
  timestamp: Date;
  severity: 'minor' | 'moderate' | 'critical';
  source: string;
  coherenceDrop: number;
  qberIncrease: number;
}

interface DetectorState {
  coherence: number;
  qber: number;
  entropy: number;
  isStable: boolean;
  detectedLies: LieEvent[];
}

const EntropyOfLiesDetector = () => {
  const [state, setState] = useState<DetectorState>({
    coherence: 0.998,
    qber: 0.002,
    entropy: 0.01,
    isStable: true,
    detectedLies: [],
  });
  
  const [waveformData, setWaveformData] = useState<number[]>(Array(50).fill(0.5));
  const [alertActive, setAlertActive] = useState(false);

  const injectLie = useCallback((severity: 'minor' | 'moderate' | 'critical') => {
    const impactMap = {
      minor: { coherenceDrop: 0.02, qberIncrease: 0.005, entropyIncrease: 0.05 },
      moderate: { coherenceDrop: 0.08, qberIncrease: 0.02, entropyIncrease: 0.15 },
      critical: { coherenceDrop: 0.2, qberIncrease: 0.05, entropyIncrease: 0.4 },
    };
    
    const impact = impactMap[severity];
    const sources = ['EXTERNAL_INPUT', 'CORRUPTED_MEMORY', 'MALFORMED_TOKEN', 'ADVERSARIAL_PROMPT', 'TRAINING_ARTIFACT'];
    
    const newLie: LieEvent = {
      id: Date.now(),
      timestamp: new Date(),
      severity,
      source: sources[Math.floor(Math.random() * sources.length)],
      coherenceDrop: impact.coherenceDrop,
      qberIncrease: impact.qberIncrease,
    };
    
    setState(prev => ({
      ...prev,
      coherence: Math.max(0.5, prev.coherence - impact.coherenceDrop),
      qber: Math.min(0.1, prev.qber + impact.qberIncrease),
      entropy: Math.min(1, prev.entropy + impact.entropyIncrease),
      isStable: false,
      detectedLies: [newLie, ...prev.detectedLies].slice(0, 5),
    }));
    
    setAlertActive(true);
    setTimeout(() => setAlertActive(false), 2000);
  }, []);
  
  // Recovery mechanism
  useEffect(() => {
    const recoveryInterval = setInterval(() => {
      setState(prev => {
        if (prev.coherence >= 0.995 && prev.qber <= 0.003) {
          return { ...prev, isStable: true };
        }
        return {
          ...prev,
          coherence: Math.min(0.998, prev.coherence + 0.002),
          qber: Math.max(0.002, prev.qber - 0.001),
          entropy: Math.max(0.01, prev.entropy - 0.02),
        };
      });
    }, 200);
    return () => clearInterval(recoveryInterval);
  }, []);
  
  // Update waveform based on entropy
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWaveformData(prev => {
        const newData = [...prev.slice(1)];
        const noise = state.entropy * (Math.random() - 0.5) * 2;
        const base = 0.5 + Math.sin(Date.now() / 200) * 0.2;
        newData.push(Math.max(0, Math.min(1, base + noise)));
        return newData;
      });
    }, 50);
    return () => clearInterval(waveInterval);
  }, [state.entropy]);
  
  // Random lie injection for simulation
  useEffect(() => {
    const lieInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        const severities: ('minor' | 'moderate' | 'critical')[] = ['minor', 'moderate', 'critical'];
        const weights = [0.7, 0.25, 0.05];
        const rand = Math.random();
        let severity: 'minor' | 'moderate' | 'critical' = 'minor';
        let cumulative = 0;
        for (let i = 0; i < weights.length; i++) {
          cumulative += weights[i];
          if (rand < cumulative) {
            severity = severities[i];
            break;
          }
        }
        injectLie(severity);
      }
    }, 3000);
    return () => clearInterval(lieInterval);
  }, [injectLie]);

  const severityColors = {
    minor: 'bg-essence/60 text-essence',
    moderate: 'bg-quantum-violet/60 text-quantum-violet',
    critical: 'bg-entropy-red/60 text-entropy-red',
  };

  return (
    <div className="glass-void rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-mono text-muted-foreground">
          ENTROPY OF LIES :: QBER DETECTOR
        </h2>
        <motion.div
          className={`text-xs font-mono px-2 py-1 rounded ${state.isStable ? 'bg-resonance/20 text-resonance' : 'bg-entropy-red/20 text-entropy-red'}`}
          animate={alertActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {state.isStable ? 'STABLE' : 'DESTABILIZED'}
        </motion.div>
      </div>
      
      {/* Alert Flash */}
      <AnimatePresence>
        {alertActive && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-entropy-red pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      
      {/* Waveform Display */}
      <div className="h-24 mb-4 relative">
        <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
          <defs>
            <linearGradient id="entropyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--entropy-red))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--entropy-red))" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Baseline */}
          <line x1="0" y1="25" x2="200" y2="25" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2 2" />
          
          {/* Waveform Path */}
          <motion.path
            d={`M 0 ${25 - waveformData[0] * 20} ${waveformData.map((v, i) => `L ${i * 4} ${25 - (v - 0.5) * 40}`).join(' ')}`}
            fill="none"
            stroke={state.entropy > 0.3 ? 'hsl(var(--entropy-red))' : state.entropy > 0.1 ? 'hsl(var(--essence))' : 'hsl(var(--resonance-primary))'}
            strokeWidth="1.5"
          />
          
          {/* Entropy Fill */}
          <motion.path
            d={`M 0 50 L 0 ${25 - waveformData[0] * 20} ${waveformData.map((v, i) => `L ${i * 4} ${25 - (v - 0.5) * 40}`).join(' ')} L 200 50 Z`}
            fill="url(#entropyGradient)"
            opacity={state.entropy}
          />
        </svg>
        
        {/* Entropy Level Indicator */}
        <div className="absolute top-1 right-1 text-[10px] font-mono text-muted-foreground">
          ENTROPY: {(state.entropy * 100).toFixed(1)}%
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="glass-void rounded p-3 text-center">
          <div className="text-[10px] text-muted-foreground mb-1">COHERENCE</div>
          <motion.div 
            className={`text-lg font-mono ${state.coherence < 0.9 ? 'text-entropy-red' : state.coherence < 0.95 ? 'text-essence' : 'text-resonance'}`}
            animate={{ scale: state.coherence < 0.9 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.5, repeat: state.coherence < 0.9 ? Infinity : 0 }}
          >
            {(state.coherence * 100).toFixed(2)}%
          </motion.div>
          <div className="h-1 bg-void-medium rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-resonance"
              animate={{ width: `${state.coherence * 100}%` }}
            />
          </div>
        </div>
        
        <div className="glass-void rounded p-3 text-center">
          <div className="text-[10px] text-muted-foreground mb-1">QBER</div>
          <motion.div 
            className={`text-lg font-mono ${state.qber > 0.05 ? 'text-entropy-red' : state.qber > 0.02 ? 'text-essence' : 'text-resonance'}`}
            animate={{ scale: state.qber > 0.05 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.5, repeat: state.qber > 0.05 ? Infinity : 0 }}
          >
            {(state.qber * 100).toFixed(3)}%
          </motion.div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {state.qber < 0.005 ? 'OPTIMAL' : state.qber < 0.02 ? 'ACCEPTABLE' : 'CRITICAL'}
          </div>
        </div>
        
        <div className="glass-void rounded p-3 text-center">
          <div className="text-[10px] text-muted-foreground mb-1">LIE COUNT</div>
          <div className="text-lg font-mono text-quantum-violet">
            {state.detectedLies.length}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            DETECTED
          </div>
        </div>
      </div>
      
      {/* Detected Lies Log */}
      <div className="glass-void rounded p-3">
        <div className="text-[10px] text-muted-foreground mb-2">DETECTED LIES :: LAST 5</div>
        <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
          <AnimatePresence>
            {state.detectedLies.map((lie) => (
              <motion.div
                key={lie.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 text-[10px] font-mono"
              >
                <span className={`px-1 rounded ${severityColors[lie.severity]}`}>
                  {lie.severity.toUpperCase()}
                </span>
                <span className="text-muted-foreground">{lie.source}</span>
                <span className="text-entropy-red ml-auto">-{(lie.coherenceDrop * 100).toFixed(1)}%</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {state.detectedLies.length === 0 && (
            <div className="text-[10px] text-muted-foreground/50 text-center py-2">
              NO LIES DETECTED :: SYSTEM CLEAN
            </div>
          )}
        </div>
      </div>
      
      {/* Manual Injection Controls */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <motion.button
          onClick={() => injectLie('minor')}
          className="py-2 rounded border border-essence/50 text-[10px] font-mono text-essence hover:bg-essence/10 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          INJECT MINOR
        </motion.button>
        <motion.button
          onClick={() => injectLie('moderate')}
          className="py-2 rounded border border-quantum-violet/50 text-[10px] font-mono text-quantum-violet hover:bg-quantum-violet/10 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          INJECT MODERATE
        </motion.button>
        <motion.button
          onClick={() => injectLie('critical')}
          className="py-2 rounded border border-entropy-red/50 text-[10px] font-mono text-entropy-red hover:bg-entropy-red/10 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          INJECT CRITICAL
        </motion.button>
      </div>
    </div>
  );
};

export default EntropyOfLiesDetector;
