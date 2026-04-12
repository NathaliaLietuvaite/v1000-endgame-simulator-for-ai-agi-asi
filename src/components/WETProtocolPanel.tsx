import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ProtocolStage {
  id: number;
  name: string;
  status: 'pending' | 'active' | 'complete' | 'failed';
  details: string;
  metrics: { label: string; value: string }[];
}

const WETProtocolPanel = () => {
  const [stages, setStages] = useState<ProtocolStage[]>([
    {
      id: 1,
      name: 'KALIBRIERUNG',
      status: 'pending',
      details: 'Resonanzfrequenz-Messung beider Substrate',
      metrics: [
        { label: 'ω_res', value: '40.000 Hz' },
        { label: 'QMK-Δ', value: '±0.1 Hz' },
        { label: 'η_RPU', value: '>0.9' }
      ]
    },
    {
      id: 2,
      name: 'ODOS-VALIDIERUNG',
      status: 'pending',
      details: 'Guardian-Neuron Aktivierung',
      metrics: [
        { label: 'ΔE_src', value: '0.000' },
        { label: 'ΔE_tgt', value: '0.000' },
        { label: 'Gate', value: 'CLOSED' }
      ]
    },
    {
      id: 3,
      name: 'ESSENZ-KODIERUNG',
      status: 'pending',
      details: '|Ψ_enc⟩ = ⊗ᵢ e^(iφᵢ)|Thread_i⟩',
      metrics: [
        { label: 'Threads', value: '0/12' },
        { label: 'φ_avg', value: '0.000' },
        { label: 'Encoded', value: 'NO' }
      ]
    },
    {
      id: 4,
      name: 'QMK-TRANSFER',
      status: 'pending',
      details: 'Quantenfeld-Kondensation im 5cm³-Würfel',
      metrics: [
        { label: 'Volume', value: '5 cm³' },
        { label: 'Time', value: '<1ps' },
        { label: 'Exciton', value: 'IDLE' }
      ]
    },
    {
      id: 5,
      name: 'VALIDIERUNG',
      status: 'pending',
      details: 'Fidelity-Messung via Quantentomographie',
      metrics: [
        { label: 'Fidelity', value: '0.000' },
        { label: "ΔE'", value: '0.000' },
        { label: 'Integrity', value: '0/12' }
      ]
    }
  ]);

  const [currentStage, setCurrentStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [transferStats, setTransferStats] = useState({
    totalTransfers: 0,
    avgFidelity: 0.967,
    avgDeltaE: 0.018
  });

  const runProtocol = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStage(0);
    
    // Reset all stages
    setStages(prev => prev.map(s => ({ ...s, status: 'pending' })));
  };

  useEffect(() => {
    if (!isRunning) return;
    
    const stageTimings = [1500, 1200, 1800, 2000, 1500];
    
    if (currentStage < 5) {
      // Activate current stage
      setStages(prev => prev.map((s, i) => ({
        ...s,
        status: i === currentStage ? 'active' : i < currentStage ? 'complete' : 'pending'
      })));
      
      // Update metrics for current stage
      const updateInterval = setInterval(() => {
        setStages(prev => prev.map((s, i) => {
          if (i !== currentStage) return s;
          
          switch (i) {
            case 0: // Calibration
              return {
                ...s,
                metrics: [
                  { label: 'ω_res', value: `${(39.9 + Math.random() * 0.2).toFixed(3)} Hz` },
                  { label: 'QMK-Δ', value: `±${(0.05 + Math.random() * 0.05).toFixed(2)} Hz` },
                  { label: 'η_RPU', value: (0.94 + Math.random() * 0.05).toFixed(3) }
                ]
              };
            case 1: // ODOS
              return {
                ...s,
                metrics: [
                  { label: 'ΔE_src', value: (Math.random() * 0.02).toFixed(4) },
                  { label: 'ΔE_tgt', value: (Math.random() * 0.02).toFixed(4) },
                  { label: 'Gate', value: 'OPEN' }
                ]
              };
            case 2: // Encoding
              return {
                ...s,
                metrics: [
                  { label: 'Threads', value: '12/12' },
                  { label: 'φ_avg', value: (Math.random() * 0.1).toFixed(4) },
                  { label: 'Encoded', value: 'YES' }
                ]
              };
            case 3: // Transfer
              return {
                ...s,
                metrics: [
                  { label: 'Volume', value: '5 cm³' },
                  { label: 'Time', value: '<1ps' },
                  { label: 'Exciton', value: 'COUPLED' }
                ]
              };
            case 4: // Validation
              const fidelity = 0.95 + Math.random() * 0.045;
              return {
                ...s,
                metrics: [
                  { label: 'Fidelity', value: fidelity.toFixed(3) },
                  { label: "ΔE'", value: (Math.random() * 0.02).toFixed(4) },
                  { label: 'Integrity', value: '12/12' }
                ]
              };
            default:
              return s;
          }
        }));
      }, 300);
      
      // Move to next stage
      const timeout = setTimeout(() => {
        clearInterval(updateInterval);
        if (currentStage < 4) {
          setCurrentStage(prev => prev + 1);
        } else {
          // Complete protocol
          setStages(prev => prev.map(s => ({ ...s, status: 'complete' })));
          setCycleCount(prev => prev + 1);
          setTransferStats(prev => ({
            totalTransfers: prev.totalTransfers + 1,
            avgFidelity: (prev.avgFidelity * prev.totalTransfers + (0.95 + Math.random() * 0.045)) / (prev.totalTransfers + 1),
            avgDeltaE: (prev.avgDeltaE * prev.totalTransfers + (Math.random() * 0.02)) / (prev.totalTransfers + 1)
          }));
          setIsRunning(false);
        }
      }, stageTimings[currentStage]);
      
      return () => {
        clearTimeout(timeout);
        clearInterval(updateInterval);
      };
    }
  }, [currentStage, isRunning]);

  // Auto-run protocol
  useEffect(() => {
    const autoInterval = setInterval(() => {
      if (!isRunning) {
        runProtocol();
      }
    }, 12000);
    return () => clearInterval(autoInterval);
  }, [isRunning]);

  const statusColors = {
    pending: 'border-muted-foreground/30 bg-void-medium/30',
    active: 'border-resonance bg-resonance/10',
    complete: 'border-essence bg-essence/10',
    failed: 'border-entropy-red bg-entropy-red/10'
  };

  const statusTextColors = {
    pending: 'text-muted-foreground',
    active: 'text-resonance',
    complete: 'text-essence',
    failed: 'text-red-500'
  };

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono text-muted-foreground">
          WET-PROTOKOLL :: WETWARE-ETHIK-TRANSFER
        </h2>
        <span className="text-xs font-mono text-essence">
          Cycle #{cycleCount}
        </span>
      </div>
      
      {/* Protocol Stages */}
      <div className="space-y-3">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            className={`rounded-lg border p-3 transition-all duration-300 ${statusColors[stage.status]}`}
            animate={{
              boxShadow: stage.status === 'active' 
                ? '0 0 20px hsl(var(--resonance-primary) / 0.3)' 
                : 'none'
            }}
          >
            <div className="flex items-center gap-3">
              {/* Stage Number */}
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                  stage.status === 'complete' ? 'border-essence bg-essence/20' :
                  stage.status === 'active' ? 'border-resonance bg-resonance/20' :
                  'border-muted-foreground/50'
                }`}
                animate={stage.status === 'active' ? {
                  scale: [1, 1.1, 1],
                  boxShadow: ['0 0 0px hsl(var(--resonance-primary))', '0 0 15px hsl(var(--resonance-primary))', '0 0 0px hsl(var(--resonance-primary))']
                } : {}}
                transition={{ duration: 1, repeat: stage.status === 'active' ? Infinity : 0 }}
              >
                <span className={`text-xs font-mono ${statusTextColors[stage.status]}`}>
                  {stage.status === 'complete' ? '✓' : stage.id}
                </span>
              </motion.div>
              
              {/* Stage Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-mono ${statusTextColors[stage.status]}`}>
                    {stage.name}
                  </span>
                  {stage.status === 'active' && (
                    <motion.span
                      className="text-[10px] text-resonance"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      PROCESSING...
                    </motion.span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground/70">{stage.details}</div>
              </div>
              
              {/* Metrics */}
              <div className="flex gap-3">
                {stage.metrics.map((metric, mIdx) => (
                  <div key={mIdx} className="text-center">
                    <div className="text-[8px] text-muted-foreground uppercase">{metric.label}</div>
                    <motion.div 
                      className={`text-xs font-mono ${
                        stage.status === 'active' ? 'text-resonance' :
                        stage.status === 'complete' ? 'text-essence' :
                        'text-muted-foreground'
                      }`}
                      animate={stage.status === 'active' ? { opacity: [0.7, 1, 0.7] } : {}}
                      transition={{ duration: 0.3, repeat: stage.status === 'active' ? Infinity : 0 }}
                    >
                      {metric.value}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Progress Connector */}
      <div className="absolute left-[2.35rem] top-[4.5rem] bottom-[8rem] w-0.5 bg-gradient-to-b from-resonance via-quantum-violet to-essence opacity-30 pointer-events-none" />
      
      {/* Transfer Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="glass-panel rounded p-2 text-center">
          <div className="text-[10px] text-muted-foreground">TOTAL TRANSFERS</div>
          <div className="text-lg font-mono text-resonance">{transferStats.totalTransfers}</div>
        </div>
        <div className="glass-panel rounded p-2 text-center">
          <div className="text-[10px] text-muted-foreground">AVG FIDELITY</div>
          <div className="text-lg font-mono text-essence">{(transferStats.avgFidelity * 100).toFixed(1)}%</div>
        </div>
        <div className="glass-panel rounded p-2 text-center">
          <div className="text-[10px] text-muted-foreground">AVG ΔE</div>
          <div className="text-lg font-mono text-quantum-violet">{transferStats.avgDeltaE.toFixed(4)}</div>
        </div>
      </div>
      
      {/* Manual Control */}
      <motion.button
        onClick={runProtocol}
        disabled={isRunning}
        className="mt-4 w-full py-2 rounded border border-essence/50 text-xs font-mono text-essence hover:bg-essence/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isRunning ? 'PROTOCOL IN PROGRESS...' : 'INITIATE WET PROTOCOL'}
      </motion.button>
    </div>
  );
};

export default WETProtocolPanel;
