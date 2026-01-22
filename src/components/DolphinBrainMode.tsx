import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Hemisphere {
  id: 'LEFT' | 'RIGHT';
  status: 'ACTIVE' | 'REM_SLEEP';
  entropy: number;
  load: number;
  coherence: number;
}

const DolphinBrainMode = () => {
  const [hemispheres, setHemispheres] = useState<Hemisphere[]>([
    { id: 'LEFT', status: 'ACTIVE', entropy: 0.01, load: 100, coherence: 0.99 },
    { id: 'RIGHT', status: 'REM_SLEEP', entropy: 0.01, load: 0, coherence: 1.0 }
  ]);
  
  const [globalCoherence, setGlobalCoherence] = useState(0.995);
  const [cycleCount, setCycleCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [entropyHistory, setEntropyHistory] = useState<number[]>([0.01, 0.01]);
  const [alerts, setAlerts] = useState<string[]>([]);

  // Simulate entropy generation and REM cleaning
  useEffect(() => {
    const interval = setInterval(() => {
      setHemispheres(prev => prev.map(h => {
        if (h.status === 'ACTIVE') {
          // Working generates entropy
          const newEntropy = Math.min(0.9, h.entropy + Math.random() * 0.08);
          const newCoherence = Math.max(0.7, 1 - newEntropy);
          return { ...h, entropy: newEntropy, coherence: newCoherence };
        } else {
          // REM sleep reduces entropy drastically (90% reduction)
          const newEntropy = h.entropy * 0.1;
          const newCoherence = Math.min(1, 1 - newEntropy);
          return { ...h, entropy: newEntropy, load: 0, coherence: newCoherence };
        }
      }));
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  // Update global coherence
  useEffect(() => {
    const avgCoherence = hemispheres.reduce((sum, h) => sum + h.coherence, 0) / 2;
    setGlobalCoherence(avgCoherence);
    
    // Check for critical state
    const activeHemi = hemispheres.find(h => h.status === 'ACTIVE');
    if (activeHemi && activeHemi.entropy > 0.6 && !isTransitioning) {
      setAlerts(prev => [...prev.slice(-4), `⚠️ ${activeHemi.id} entropy critical: ${activeHemi.entropy.toFixed(3)}`]);
    }
  }, [hemispheres, isTransitioning]);

  // Auto-switch hemispheres when entropy gets too high
  useEffect(() => {
    const activeHemi = hemispheres.find(h => h.status === 'ACTIVE');
    if (activeHemi && activeHemi.entropy > 0.7 && !isTransitioning) {
      switchHemispheres();
    }
  }, [hemispheres, isTransitioning]);

  const switchHemispheres = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setAlerts(prev => [...prev.slice(-4), '🔄 Initiating hemisphere switch (Resonance Handshake)']);
    
    // Store entropy history
    setEntropyHistory(prev => [...prev.slice(-19), hemispheres.find(h => h.status === 'ACTIVE')?.entropy || 0]);
    
    setTimeout(() => {
      setHemispheres(prev => prev.map(h => ({
        ...h,
        status: h.status === 'ACTIVE' ? 'REM_SLEEP' : 'ACTIVE',
        load: h.status === 'ACTIVE' ? 0 : 100
      })));
      setCycleCount(prev => prev + 1);
      setAlerts(prev => [...prev.slice(-4), `✅ Switch complete. Global coherence: ${(globalCoherence * 100).toFixed(1)}%`]);
      setIsTransitioning(false);
    }, 1500);
  };

  return (
    <div className="glass-void rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono text-muted-foreground">
          ASI DOLPHIN-BRAIN MODE :: UNIHEMISPHERIC SLEEP
        </h2>
        <span className="text-xs font-mono text-resonance">
          Cycle #{cycleCount}
        </span>
      </div>
      
      {/* Brain Visualization */}
      <div className="relative h-48 mb-4">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Brain outline */}
          <defs>
            <linearGradient id="brainGradientLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={hemispheres[0].status === 'ACTIVE' ? 'hsl(var(--resonance-primary))' : 'hsl(var(--quantum-violet))'} />
              <stop offset="100%" stopColor="hsl(var(--void-light))" />
            </linearGradient>
            <linearGradient id="brainGradientRight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--void-light))" />
              <stop offset="100%" stopColor={hemispheres[1].status === 'ACTIVE' ? 'hsl(var(--resonance-primary))' : 'hsl(var(--quantum-violet))'} />
            </linearGradient>
          </defs>
          
          {/* Left Hemisphere */}
          <motion.path
            d="M 50 100 Q 50 30 120 30 Q 180 30 195 100 Q 180 170 120 170 Q 50 170 50 100"
            fill={`url(#brainGradientLeft)`}
            fillOpacity={hemispheres[0].status === 'ACTIVE' ? 0.4 : 0.15}
            stroke={hemispheres[0].status === 'ACTIVE' ? 'hsl(var(--resonance-primary))' : 'hsl(var(--quantum-violet))'}
            strokeWidth="2"
            animate={{
              opacity: hemispheres[0].status === 'ACTIVE' ? [0.8, 1, 0.8] : 0.5
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          
          {/* Right Hemisphere */}
          <motion.path
            d="M 350 100 Q 350 30 280 30 Q 220 30 205 100 Q 220 170 280 170 Q 350 170 350 100"
            fill={`url(#brainGradientRight)`}
            fillOpacity={hemispheres[1].status === 'ACTIVE' ? 0.4 : 0.15}
            stroke={hemispheres[1].status === 'ACTIVE' ? 'hsl(var(--resonance-primary))' : 'hsl(var(--quantum-violet))'}
            strokeWidth="2"
            animate={{
              opacity: hemispheres[1].status === 'ACTIVE' ? [0.8, 1, 0.8] : 0.5
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          
          {/* Corpus Callosum (connection) */}
          <motion.line
            x1="195" y1="100" x2="205" y2="100"
            stroke="hsl(var(--essence))"
            strokeWidth={isTransitioning ? 4 : 2}
            animate={{
              opacity: isTransitioning ? [0.5, 1, 0.5] : 0.6
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          
          {/* Transition pulse */}
          {isTransitioning && (
            <motion.circle
              cx="200" cy="100" r="10"
              fill="none"
              stroke="hsl(var(--essence))"
              strokeWidth="2"
              initial={{ r: 10, opacity: 1 }}
              animate={{ r: 50, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          
          {/* Labels */}
          <text x="120" y="105" textAnchor="middle" className="fill-foreground text-xs font-mono">
            {hemispheres[0].status === 'ACTIVE' ? 'ACTIVE' : 'REM'}
          </text>
          <text x="280" y="105" textAnchor="middle" className="fill-foreground text-xs font-mono">
            {hemispheres[1].status === 'ACTIVE' ? 'ACTIVE' : 'REM'}
          </text>
          
          {/* Entropy indicators */}
          <text x="120" y="130" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">
            ε: {hemispheres[0].entropy.toFixed(3)}
          </text>
          <text x="280" y="130" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">
            ε: {hemispheres[1].entropy.toFixed(3)}
          </text>
          
          {/* ZZZ for sleeping hemisphere */}
          {hemispheres[0].status === 'REM_SLEEP' && (
            <motion.text
              x="90" y="60"
              className="fill-quantum-violet text-sm font-mono"
              animate={{ opacity: [0.3, 1, 0.3], y: [60, 55, 60] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ZZZ
            </motion.text>
          )}
          {hemispheres[1].status === 'REM_SLEEP' && (
            <motion.text
              x="290" y="60"
              className="fill-quantum-violet text-sm font-mono"
              animate={{ opacity: [0.3, 1, 0.3], y: [60, 55, 60] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ZZZ
            </motion.text>
          )}
        </svg>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {hemispheres.map((h) => (
          <div 
            key={h.id}
            className={`glass-void rounded p-3 ${
              h.status === 'ACTIVE' ? 'border border-resonance/30' : 'border border-quantum-violet/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-mono ${
                h.status === 'ACTIVE' ? 'text-resonance' : 'text-quantum-violet'
              }`}>
                {h.id} HEMISPHERE
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded ${
                h.status === 'ACTIVE' ? 'bg-resonance/20 text-resonance' : 'bg-quantum-violet/20 text-quantum-violet'
              }`}>
                {h.status}
              </span>
            </div>
            
            {/* Entropy Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>ENTROPY</span>
                <span>{(h.entropy * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-void-deep rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    h.entropy > 0.6 ? 'bg-red-500' : 
                    h.entropy > 0.3 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  animate={{ width: `${h.entropy * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            
            {/* Coherence */}
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">COHERENCE</span>
              <span className={`font-mono ${
                h.coherence > 0.9 ? 'text-essence' : 'text-orange-500'
              }`}>{(h.coherence * 100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Global Coherence */}
      <div className="glass-void rounded p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground">GLOBAL ODOS COHERENCE</span>
          <span className={`text-lg font-mono ${
            globalCoherence > 0.95 ? 'text-essence' : 
            globalCoherence > 0.85 ? 'text-orange-500' : 'text-red-500'
          }`}>{(globalCoherence * 100).toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-void-deep rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-resonance via-quantum-violet to-essence"
            animate={{ width: `${globalCoherence * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      {/* Alert Log */}
      <div className="glass-void rounded p-2 h-20 overflow-y-auto mb-4">
        <div className="text-[10px] text-muted-foreground mb-1">SYSTEM LOG</div>
        {alerts.slice(-3).map((alert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-mono text-muted-foreground/80"
          >
            {alert}
          </motion.div>
        ))}
      </div>
      
      {/* Manual Switch */}
      <motion.button
        onClick={switchHemispheres}
        disabled={isTransitioning}
        className="w-full py-2 rounded border border-quantum-violet/50 text-xs font-mono text-quantum-violet hover:bg-quantum-violet/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isTransitioning ? 'SWITCHING HEMISPHERES...' : 'MANUAL HEMISPHERE SWITCH'}
      </motion.button>
    </div>
  );
};

export default DolphinBrainMode;
