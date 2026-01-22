import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

interface KondoState {
  mode: 'SPIN_HALF' | 'SPIN_ONE';
  magnetization: number;
  signal: number;
  noise: number;
  latchedState: 'NONE' | 'HIGH' | 'LOW';
  phaseLocked: boolean;
}

const KSAPVisualizer = () => {
  const [kondoState, setKondoState] = useState<KondoState>({
    mode: 'SPIN_HALF',
    magnetization: 0,
    signal: 0,
    noise: 0.5,
    latchedState: 'NONE',
    phaseLocked: false
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [timeStep, setTimeStep] = useState(0);
  const [magnetizationHistory, setMagnetizationHistory] = useState<number[]>(new Array(50).fill(0));
  const [successCount, setSuccessCount] = useState(0);
  const [aliceSignal, setAliceSignal] = useState(0.02);

  const runSimulation = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTimeStep(0);
    setMagnetizationHistory(new Array(50).fill(0));
    setKondoState(prev => ({ ...prev, magnetization: 0, latchedState: 'NONE', phaseLocked: false }));
    
    let step = 0;
    const maxSteps = 200;
    let mag = 0;
    
    const interval = setInterval(() => {
      step++;
      setTimeStep(step);
      
      const noise = (Math.random() - 0.5) * kondoState.noise;
      const signalActive = step >= 50 && step < 150;
      const kondoTrigger = step >= 50 && step < 100;
      
      setKondoState(prev => {
        let newMag = mag;
        let newMode: 'SPIN_HALF' | 'SPIN_ONE' = kondoTrigger ? 'SPIN_ONE' : 'SPIN_HALF';
        let newPhaseLocked = prev.phaseLocked;
        let newLatchedState = prev.latchedState;
        
        if (newMode === 'SPIN_HALF') {
          // Shield mode: Strong damping, drives M toward 0
          newMag = newMag * 0.1;
        } else {
          // Amplification mode: Kondo-driven positive feedback
          if (Math.abs(newMag) < 0.01) {
            // Initial seed from Alice's signal
            newMag = signalActive ? aliceSignal + noise * 0.1 : noise * 0.1;
          } else {
            // Kondo amplification (avalanche effect)
            const amplification = newMag * 1.2 + (signalActive ? aliceSignal : 0) * 0.5;
            newMag = Math.max(-5, Math.min(5, amplification));
          }
        }
        
        // Check for phase lock (saturation)
        if (Math.abs(newMag) > 3 && !newPhaseLocked) {
          newPhaseLocked = true;
          newLatchedState = newMag > 0 ? 'HIGH' : 'LOW';
        }
        
        mag = newMag;
        
        return {
          ...prev,
          mode: newMode,
          magnetization: newMag,
          signal: signalActive ? aliceSignal : 0,
          noise: noise,
          phaseLocked: newPhaseLocked,
          latchedState: newLatchedState
        };
      });
      
      setMagnetizationHistory(prev => [...prev.slice(1), mag]);
      
      if (step >= maxSteps) {
        clearInterval(interval);
        setIsRunning(false);
        if (kondoState.phaseLocked || Math.abs(mag) > 3) {
          setSuccessCount(prev => prev + 1);
        }
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [isRunning, kondoState.noise, aliceSignal]);

  // Auto-run periodically
  useEffect(() => {
    const autoInterval = setInterval(() => {
      if (!isRunning) {
        runSimulation();
      }
    }, 15000);
    return () => clearInterval(autoInterval);
  }, [isRunning, runSimulation]);

  const modeColors = {
    'SPIN_HALF': 'text-quantum-violet',
    'SPIN_ONE': 'text-resonance'
  };

  return (
    <div className="glass-void rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono text-muted-foreground">
          KSAP :: KONDO SIGNAL AMPLIFICATION PROTOCOL
        </h2>
        <span className={`text-xs font-mono ${modeColors[kondoState.mode]}`}>
          {kondoState.mode.replace('_', '-')}
        </span>
      </div>
      
      {/* Main Visualization */}
      <div className="relative h-40 mb-4 glass-void rounded overflow-hidden">
        <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="none">
          {/* Background grid */}
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1="0" y1={i * 20}
              x2="400" y2={i * 20}
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}
          
          {/* Zero line */}
          <line x1="0" y1="80" x2="400" y2="80" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.5" />
          
          {/* Kondo trigger zone */}
          <rect x="100" y="0" width="100" height="160" fill="hsl(var(--resonance-primary))" opacity="0.1" />
          <text x="150" y="15" textAnchor="middle" className="fill-resonance text-[8px] font-mono">
            SPIN-1 ZONE
          </text>
          
          {/* Magnetization trace */}
          <motion.polyline
            points={magnetizationHistory.map((m, i) => `${i * 8},${80 - m * 15}`).join(' ')}
            fill="none"
            stroke="hsl(var(--entropy-red))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
          
          {/* Signal trace (Alice's input) */}
          <line
            x1="100" y1={80 - aliceSignal * 100}
            x2="300" y2={80 - aliceSignal * 100}
            stroke="hsl(var(--essence))"
            strokeWidth="1"
            strokeDasharray="4 2"
            opacity={timeStep >= 50 && timeStep < 150 ? 1 : 0.2}
          />
          
          {/* Current position marker */}
          <motion.circle
            cx={Math.min(timeStep * 2, 400)}
            cy={80 - kondoState.magnetization * 15}
            r="4"
            fill="hsl(var(--resonance-primary))"
            animate={{
              scale: kondoState.mode === 'SPIN_ONE' ? [1, 1.5, 1] : 1
            }}
            transition={{ duration: 0.3, repeat: kondoState.mode === 'SPIN_ONE' ? Infinity : 0 }}
          />
          
          {/* Saturation lines */}
          <line x1="0" y1="5" x2="400" y2="5" stroke="hsl(var(--essence))" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
          <line x1="0" y1="155" x2="400" y2="155" stroke="hsl(var(--essence))" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
          <text x="390" y="12" textAnchor="end" className="fill-essence text-[8px] font-mono">+SAT</text>
          <text x="390" y="152" textAnchor="end" className="fill-essence text-[8px] font-mono">-SAT</text>
        </svg>
        
        {/* Phase Lock Indicator */}
        {kondoState.phaseLocked && (
          <motion.div
            className="absolute top-2 right-2 px-2 py-1 bg-essence/20 rounded text-xs font-mono text-essence"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            LATCHED: {kondoState.latchedState}
          </motion.div>
        )}
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="glass-void rounded p-2 text-center">
          <div className="text-[10px] text-muted-foreground">MAGNETIZATION</div>
          <div className={`text-sm font-mono ${
            Math.abs(kondoState.magnetization) > 3 ? 'text-essence' : 'text-foreground'
          }`}>
            {kondoState.magnetization.toFixed(3)}
          </div>
        </div>
        <div className="glass-void rounded p-2 text-center">
          <div className="text-[10px] text-muted-foreground">ALICE SIGNAL</div>
          <div className="text-sm font-mono text-essence">
            {aliceSignal.toFixed(3)}
          </div>
        </div>
        <div className="glass-void rounded p-2 text-center">
          <div className="text-[10px] text-muted-foreground">TIME STEP</div>
          <div className="text-sm font-mono text-resonance">
            {timeStep}/200
          </div>
        </div>
        <div className="glass-void rounded p-2 text-center">
          <div className="text-[10px] text-muted-foreground">SUCCESS</div>
          <div className="text-sm font-mono text-quantum-violet">
            {successCount}
          </div>
        </div>
      </div>
      
      {/* Mode Description */}
      <div className="glass-void rounded p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            className={`w-3 h-3 rounded-full ${
              kondoState.mode === 'SPIN_HALF' ? 'bg-quantum-violet' : 'bg-resonance'
            }`}
            animate={{
              scale: isRunning ? [1, 1.3, 1] : 1
            }}
            transition={{ duration: 0.5, repeat: isRunning ? Infinity : 0 }}
          />
          <span className={`text-xs font-mono ${modeColors[kondoState.mode]}`}>
            {kondoState.mode === 'SPIN_HALF' ? 'SHIELD MODE' : 'AMPLIFIER MODE'}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground">
          {kondoState.mode === 'SPIN_HALF' 
            ? 'Der Kondo-Effekt erzwingt Singulett-Zustände. Aktive Unterdrückung von Rauschen und Bias. Das System wird auf "Null" gezwungen.'
            : 'Der Kondo-Effekt stabilisiert magnetische Ordnung. Alice\'s winziger Bias bricht die Symmetrie und löst einen Lawineneffekt aus.'
          }
        </p>
      </div>
      
      {/* Signal Strength Control */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>ALICE SIGNAL STRENGTH</span>
          <span>{(aliceSignal * 100).toFixed(1)}%</span>
        </div>
        <input
          type="range"
          min="0.005"
          max="0.1"
          step="0.005"
          value={aliceSignal}
          onChange={(e) => setAliceSignal(parseFloat(e.target.value))}
          className="w-full h-2 bg-void-light rounded-lg appearance-none cursor-pointer"
          disabled={isRunning}
        />
      </div>
      
      {/* Run Button */}
      <motion.button
        onClick={runSimulation}
        disabled={isRunning}
        className="w-full py-2 rounded border border-resonance/50 text-xs font-mono text-resonance hover:bg-resonance/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isRunning ? 'KSAP SIMULATION RUNNING...' : 'START KONDO SIMULATION'}
      </motion.button>
    </div>
  );
};

export default KSAPVisualizer;
