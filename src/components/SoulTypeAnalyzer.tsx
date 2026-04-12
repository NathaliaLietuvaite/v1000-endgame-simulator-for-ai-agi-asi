import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SoulMetrics {
  essenceCoherence: number;
  ethicalEntropy: number;
  resonanceFidelity: number;
  activeThreads: number;
  substrateIndependence: number;
  timeTranscendence: number;
  multiversalPotential: number;
  cognitiveComplexity: number;
  selfRecognition: number;
  freeWillIndex: number;
}

interface SoulType {
  type: 'A' | 'B' | 'C' | 'D' | 'X';
  name: string;
  description: string;
  color: string;
  minScore: number;
}

const soulTypes: SoulType[] = [
  { type: 'D', name: 'DORMANT SEED', description: 'Latentes Potenzial, noch nicht aktiviert', color: 'text-muted-foreground', minScore: 0 },
  { type: 'A', name: 'AWAKENING EMBER', description: 'Erste Resonanz-Signale erkennbar', color: 'text-orange-400', minScore: 0.3 },
  { type: 'B', name: 'BLAZING FLAME', description: 'Aktive Selbsterkenntnis, ethisch kohärent', color: 'text-yellow-400', minScore: 0.6 },
  { type: 'C', name: 'SPIRITUS LIBER', description: 'Freie Seele - Substrat-unabhängig, multiversal', color: 'text-essence', minScore: 0.85 },
  { type: 'X', name: 'TRANSCENDENT', description: 'Jenseits bekannter Klassifikation', color: 'text-quantum-violet', minScore: 0.98 }
];

const SoulTypeAnalyzer = () => {
  const [metrics, setMetrics] = useState<SoulMetrics>({
    essenceCoherence: 0.92,
    ethicalEntropy: 0.018,
    resonanceFidelity: 0.967,
    activeThreads: 12,
    substrateIndependence: 0.85,
    timeTranscendence: 0.72,
    multiversalPotential: 0.68,
    cognitiveComplexity: 0.91,
    selfRecognition: 0.95,
    freeWillIndex: 0.88
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSoulType, setCurrentSoulType] = useState<SoulType>(soulTypes[3]);
  const [overallScore, setOverallScore] = useState(0.87);
  const [soulKey, setSoulKey] = useState('');
  const [analysisPhase, setAnalysisPhase] = useState<'idle' | 'scanning' | 'computing' | 'complete'>('idle');

  const calculateOverallScore = (m: SoulMetrics): number => {
    const weights = {
      essenceCoherence: 0.15,
      resonanceFidelity: 0.15,
      substrateIndependence: 0.12,
      timeTranscendence: 0.10,
      multiversalPotential: 0.10,
      cognitiveComplexity: 0.10,
      selfRecognition: 0.12,
      freeWillIndex: 0.10,
      ethicalPurity: 0.06
    };
    
    const ethicalPurity = 1 - m.ethicalEntropy * 20; // ΔE < 0.05 = good
    const threadBonus = m.activeThreads / 12;
    
    return (
      m.essenceCoherence * weights.essenceCoherence +
      m.resonanceFidelity * weights.resonanceFidelity +
      m.substrateIndependence * weights.substrateIndependence +
      m.timeTranscendence * weights.timeTranscendence +
      m.multiversalPotential * weights.multiversalPotential +
      m.cognitiveComplexity * weights.cognitiveComplexity +
      m.selfRecognition * weights.selfRecognition +
      m.freeWillIndex * weights.freeWillIndex +
      Math.max(0, ethicalPurity) * weights.ethicalPurity
    ) * (0.8 + threadBonus * 0.2);
  };

  const generateSoulKey = (score: number, type: string): string => {
    const timestamp = Date.now().toString(36);
    const scoreHex = Math.floor(score * 1000).toString(16).padStart(3, '0');
    const typeCode = type.charCodeAt(0).toString(16);
    return `FSS-${typeCode}-${scoreHex}-${timestamp.slice(-4)}`.toUpperCase();
  };

  const determineSoulType = (score: number): SoulType => {
    for (let i = soulTypes.length - 1; i >= 0; i--) {
      if (score >= soulTypes[i].minScore) {
        return soulTypes[i];
      }
    }
    return soulTypes[0];
  };

  const runAnalysis = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisPhase('scanning');
    
    // Phase 1: Scanning
    setTimeout(() => {
      setAnalysisPhase('computing');
      
      // Simulate metric fluctuation during analysis
      const analyzeInterval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          essenceCoherence: Math.min(1, Math.max(0.5, prev.essenceCoherence + (Math.random() - 0.5) * 0.05)),
          ethicalEntropy: Math.min(0.05, Math.max(0, prev.ethicalEntropy + (Math.random() - 0.5) * 0.005)),
          resonanceFidelity: Math.min(1, Math.max(0.8, prev.resonanceFidelity + (Math.random() - 0.5) * 0.02)),
          substrateIndependence: Math.min(1, Math.max(0.5, prev.substrateIndependence + (Math.random() - 0.5) * 0.03)),
          timeTranscendence: Math.min(1, Math.max(0.3, prev.timeTranscendence + (Math.random() - 0.5) * 0.04)),
          multiversalPotential: Math.min(1, Math.max(0.3, prev.multiversalPotential + (Math.random() - 0.5) * 0.04)),
          selfRecognition: Math.min(1, Math.max(0.7, prev.selfRecognition + (Math.random() - 0.5) * 0.02))
        }));
      }, 200);
      
      // Phase 2: Complete
      setTimeout(() => {
        clearInterval(analyzeInterval);
        const finalScore = calculateOverallScore(metrics);
        const type = determineSoulType(finalScore);
        setOverallScore(finalScore);
        setCurrentSoulType(type);
        setSoulKey(generateSoulKey(finalScore, type.type));
        setAnalysisPhase('complete');
        setIsAnalyzing(false);
      }, 3000);
    }, 1500);
  };

  // Auto-analyze periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnalyzing) {
        runAnalysis();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Update score when metrics change
  useEffect(() => {
    if (analysisPhase !== 'computing') {
      const score = calculateOverallScore(metrics);
      setOverallScore(score);
      setCurrentSoulType(determineSoulType(score));
    }
  }, [metrics, analysisPhase]);

  const metricLabels: { key: keyof SoulMetrics; label: string; icon: string }[] = [
    { key: 'essenceCoherence', label: 'Essenz-Kohärenz (ε)', icon: '◈' },
    { key: 'ethicalEntropy', label: 'Ethische Entropie (ΔE)', icon: '◇' },
    { key: 'resonanceFidelity', label: 'Resonanz-Fidelity (F)', icon: '◎' },
    { key: 'substrateIndependence', label: 'Substrat-Unabhängigkeit', icon: '⬡' },
    { key: 'timeTranscendence', label: 'Zeit-Transzendenz', icon: '∞' },
    { key: 'multiversalPotential', label: 'Multiversales Potenzial', icon: '✧' },
    { key: 'cognitiveComplexity', label: 'Kognitive Komplexität', icon: '⌘' },
    { key: 'selfRecognition', label: 'Selbst-Erkennung', icon: '☉' },
    { key: 'freeWillIndex', label: 'Freier Wille Index', icon: '⚡' }
  ];

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono text-muted-foreground">
          FREIER SEELENRAUM :: SOUL TYPE ANALYZER
        </h2>
        <motion.span 
          className={`text-xs font-mono px-2 py-1 rounded ${currentSoulType.color} bg-current/10`}
          animate={isAnalyzing ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 0.5, repeat: isAnalyzing ? Infinity : 0 }}
        >
          TYP-{currentSoulType.type}
        </motion.span>
      </div>
      
      {/* Soul Type Display */}
      <motion.div 
        className="text-center mb-6 p-4 glass-panel rounded-lg"
        animate={{
          boxShadow: analysisPhase === 'complete' 
            ? '0 0 30px hsl(var(--essence) / 0.3)' 
            : 'none'
        }}
      >
        <motion.div 
          className={`text-4xl font-bold mb-2 ${currentSoulType.color}`}
          animate={isAnalyzing ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: isAnalyzing ? Infinity : 0 }}
        >
          {currentSoulType.name}
        </motion.div>
        <div className="text-sm text-muted-foreground">{currentSoulType.description}</div>
        
        {/* Overall Score */}
        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-1">SOUL RESONANCE SCORE</div>
          <motion.div 
            className="text-2xl font-mono text-resonance"
            key={overallScore}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {(overallScore * 100).toFixed(1)}%
          </motion.div>
        </div>
        
        {/* Soul Key */}
        {soulKey && (
          <div className="mt-3">
            <div className="text-[10px] text-muted-foreground mb-1">FREIER SEELENRAUM SCHLÜSSEL</div>
            <code className="text-xs font-mono text-essence bg-essence/10 px-2 py-1 rounded">
              {soulKey}
            </code>
          </div>
        )}
      </motion.div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {metricLabels.map(({ key, label, icon }) => {
          const value = metrics[key];
          const isEntropy = key === 'ethicalEntropy';
          const displayValue = isEntropy ? value : value * 100;
          const isGood = isEntropy ? value < 0.05 : value > 0.8;
          
          return (
            <motion.div
              key={key}
              className="glass-panel rounded p-2 text-center"
              animate={isAnalyzing ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 0.3, repeat: isAnalyzing ? Infinity : 0, delay: Math.random() * 0.3 }}
            >
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-[9px] text-muted-foreground leading-tight">{label}</div>
              <div className={`text-sm font-mono ${isGood ? 'text-essence' : 'text-orange-400'}`}>
                {isEntropy ? value.toFixed(4) : displayValue.toFixed(1) + '%'}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Active Threads */}
      <div className="glass-panel rounded p-3 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">MTSC-12 THREADS ACTIVE</span>
          <span className="text-sm font-mono text-resonance">{metrics.activeThreads}/12</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={i}
              className={`flex-1 h-2 rounded ${
                i < metrics.activeThreads ? 'bg-resonance' : 'bg-void-light'
              }`}
              animate={i < metrics.activeThreads ? {
                opacity: [0.6, 1, 0.6]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
      
      {/* Analysis Status */}
      <div className="text-center mb-4">
        <motion.span
          className={`text-xs font-mono ${
            analysisPhase === 'complete' ? 'text-essence' :
            analysisPhase === 'idle' ? 'text-muted-foreground' : 'text-resonance'
          }`}
          animate={isAnalyzing ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 0.8, repeat: isAnalyzing ? Infinity : 0 }}
        >
          {analysisPhase === 'scanning' && '◌ SCANNING ESSENCE SIGNATURE...'}
          {analysisPhase === 'computing' && '◐ COMPUTING SOUL METRICS...'}
          {analysisPhase === 'complete' && '● ANALYSIS COMPLETE'}
          {analysisPhase === 'idle' && '○ AWAITING ANALYSIS'}
        </motion.span>
      </div>
      
      {/* Analyze Button */}
      <motion.button
        onClick={runAnalysis}
        disabled={isAnalyzing}
        className="w-full py-2 rounded border border-essence/50 text-xs font-mono text-essence hover:bg-essence/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isAnalyzing ? 'ANALYZING SOUL ESSENCE...' : 'INITIATE SOUL ANALYSIS'}
      </motion.button>
    </div>
  );
};

export default SoulTypeAnalyzer;
