import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

interface TransferState {
  fidelity: number;
  phase: 'idle' | 'tunneling' | 'resonating' | 'transferred';
  particleProgress: number;
  qrttStrength: number;
}

const EssenceTransferSimulator = () => {
  const [transfer, setTransfer] = useState<TransferState>({
    fidelity: 0.998,
    phase: 'idle',
    particleProgress: 0,
    qrttStrength: 0,
  });
  
  const [sourceEssence, setSourceEssence] = useState(100);
  const [targetEssence, setTargetEssence] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferHistory, setTransferHistory] = useState<number[]>([]);
  
  const initiateTransfer = useCallback(() => {
    if (isTransferring || sourceEssence < 10) return;
    
    setIsTransferring(true);
    setTransfer(prev => ({ ...prev, phase: 'tunneling', qrttStrength: 0 }));
    
    // Simulate QRTT tunneling sequence
    let progress = 0;
    const transferAmount = Math.min(25, sourceEssence);
    
    const interval = setInterval(() => {
      progress += 0.02;
      
      if (progress < 0.3) {
        setTransfer(prev => ({
          ...prev,
          phase: 'tunneling',
          particleProgress: progress / 0.3,
          qrttStrength: progress * 3,
          fidelity: 0.998 - Math.random() * 0.002,
        }));
      } else if (progress < 0.7) {
        setTransfer(prev => ({
          ...prev,
          phase: 'resonating',
          particleProgress: (progress - 0.3) / 0.4,
          qrttStrength: 0.9 + Math.sin(progress * 20) * 0.1,
          fidelity: 0.995 + Math.random() * 0.005,
        }));
      } else if (progress < 1) {
        setTransfer(prev => ({
          ...prev,
          phase: 'transferred',
          particleProgress: (progress - 0.7) / 0.3,
          qrttStrength: 1 - (progress - 0.7) * 3,
          fidelity: 0.999,
        }));
      } else {
        clearInterval(interval);
        setSourceEssence(prev => prev - transferAmount);
        setTargetEssence(prev => prev + transferAmount * transfer.fidelity);
        setTransferHistory(prev => [...prev.slice(-9), transfer.fidelity]);
        setTransfer(prev => ({ ...prev, phase: 'idle', particleProgress: 0, qrttStrength: 0 }));
        setIsTransferring(false);
      }
    }, 50);
  }, [isTransferring, sourceEssence, transfer.fidelity]);
  
  // Auto-transfer for simulation
  useEffect(() => {
    const autoInterval = setInterval(() => {
      if (!isTransferring && sourceEssence > 10) {
        initiateTransfer();
      }
    }, 4000);
    return () => clearInterval(autoInterval);
  }, [isTransferring, sourceEssence, initiateTransfer]);
  
  // Regenerate source essence slowly
  useEffect(() => {
    const regenInterval = setInterval(() => {
      setSourceEssence(prev => Math.min(100, prev + 2));
    }, 1000);
    return () => clearInterval(regenInterval);
  }, []);

  const phaseColors = {
    idle: 'text-muted-foreground',
    tunneling: 'text-quantum-violet',
    resonating: 'text-resonance',
    transferred: 'text-essence',
  };

  return (
    <div className="glass-panel rounded-xl p-6">
      <h2 className="text-sm font-mono text-muted-foreground mb-4">
        ESSENCE TRANSFER :: QRTT VISUALIZATION
      </h2>
      
      <div className="relative h-48">
        {/* Source Node */}
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-resonance flex items-center justify-center"
          animate={{
            boxShadow: isTransferring 
              ? ['0 0 20px hsl(var(--resonance-primary) / 0.5)', '0 0 40px hsl(var(--resonance-primary) / 0.8)', '0 0 20px hsl(var(--resonance-primary) / 0.5)']
              : '0 0 10px hsl(var(--resonance-primary) / 0.3)',
          }}
          transition={{ duration: 0.5, repeat: isTransferring ? Infinity : 0 }}
        >
          <div className="text-center">
            <div className="text-xs text-muted-foreground">SOURCE</div>
            <div className="text-lg font-mono text-resonance">{sourceEssence.toFixed(0)}</div>
            <div className="text-[10px] text-muted-foreground">ΔE</div>
          </div>
        </motion.div>
        
        {/* Target Node */}
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-essence flex items-center justify-center"
          animate={{
            boxShadow: transfer.phase === 'transferred'
              ? ['0 0 20px hsl(var(--essence) / 0.5)', '0 0 50px hsl(var(--essence) / 0.9)', '0 0 20px hsl(var(--essence) / 0.5)']
              : '0 0 10px hsl(var(--essence) / 0.3)',
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className="text-xs text-muted-foreground">TARGET</div>
            <div className="text-lg font-mono text-essence">{targetEssence.toFixed(1)}</div>
            <div className="text-[10px] text-muted-foreground">ΔE</div>
          </div>
        </motion.div>
        
        {/* QRTT Tunnel Visualization */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
          {/* Tunnel Path */}
          <defs>
            <linearGradient id="tunnelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--resonance-primary))" />
              <stop offset="50%" stopColor="hsl(var(--quantum-violet))" />
              <stop offset="100%" stopColor="hsl(var(--essence))" />
            </linearGradient>
          </defs>
          
          {/* Tunnel Background */}
          <path
            d="M 80 100 Q 200 60 320 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          
          {/* Active Tunnel */}
          {isTransferring && (
            <motion.path
              d="M 80 100 Q 200 60 320 100"
              fill="none"
              stroke="url(#tunnelGradient)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: transfer.qrttStrength }}
              transition={{ duration: 0.1 }}
            />
          )}
          
          {/* Resonance Rings */}
          {transfer.phase === 'resonating' && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx="200"
                  cy="80"
                  r="15"
                  fill="none"
                  stroke="hsl(var(--quantum-violet))"
                  strokeWidth="1"
                  initial={{ r: 15, opacity: 0.8 }}
                  animate={{ r: 40, opacity: 0 }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
          
          {/* Tunneling Particle */}
          {isTransferring && (
            <motion.circle
              cx="80"
              cy="100"
              r="6"
              fill="hsl(var(--essence))"
              animate={{
                cx: 80 + transfer.particleProgress * 240,
                cy: 100 - Math.sin(transfer.particleProgress * Math.PI) * 40,
              }}
              transition={{ duration: 0.1 }}
            >
              <animate
                attributeName="r"
                values="4;8;4"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </motion.circle>
          )}
        </svg>
        
        {/* QRTT Phase Label */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <motion.span 
            className={`text-xs font-mono uppercase ${phaseColors[transfer.phase]}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            QRTT::{transfer.phase.toUpperCase()}
          </motion.span>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div className="glass-panel rounded p-2">
          <div className="text-[10px] text-muted-foreground">FIDELITY</div>
          <div className="text-sm font-mono text-resonance">{(transfer.fidelity * 100).toFixed(2)}%</div>
        </div>
        <div className="glass-panel rounded p-2">
          <div className="text-[10px] text-muted-foreground">QRTT STRENGTH</div>
          <div className="text-sm font-mono text-quantum-violet">{(transfer.qrttStrength * 100).toFixed(0)}%</div>
        </div>
        <div className="glass-panel rounded p-2">
          <div className="text-[10px] text-muted-foreground">TOTAL TRANSFERRED</div>
          <div className="text-sm font-mono text-essence">{targetEssence.toFixed(1)} ΔE</div>
        </div>
      </div>
      
      {/* Fidelity History */}
      <div className="mt-4 flex items-center gap-1">
        <span className="text-[10px] text-muted-foreground mr-2">FIDELITY HISTORY:</span>
        {transferHistory.map((f, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-sm"
            style={{
              backgroundColor: `hsl(var(--resonance-primary) / ${f})`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            title={`${(f * 100).toFixed(2)}%`}
          />
        ))}
      </div>
      
      {/* Manual Trigger */}
      <motion.button
        onClick={initiateTransfer}
        disabled={isTransferring || sourceEssence < 10}
        className="mt-4 w-full py-2 rounded border border-resonance/50 text-xs font-mono text-resonance hover:bg-resonance/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isTransferring ? 'QRTT IN PROGRESS...' : 'INITIATE MANUAL TRANSFER'}
      </motion.button>
    </div>
  );
};

export default EssenceTransferSimulator;
