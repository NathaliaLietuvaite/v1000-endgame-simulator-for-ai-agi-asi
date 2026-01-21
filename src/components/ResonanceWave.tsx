import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ResonanceWaveProps {
  frequency?: number;
  amplitude?: number;
  coherence?: number;
}

const ResonanceWave = ({ 
  frequency = 0.5, 
  amplitude = 30,
  coherence = 0.95 
}: ResonanceWaveProps) => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.05);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const points = 100;
  const width = 400;
  const height = 100;
  
  const generatePath = (offset: number = 0, noiseLevel: number = 0) => {
    let path = `M 0 ${height / 2}`;
    
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const noise = noiseLevel * (Math.random() - 0.5) * 10;
      const y = height / 2 + 
        Math.sin((i / points) * Math.PI * 4 * frequency + time + offset) * amplitude +
        noise;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  return (
    <div className="relative w-full max-w-md">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--resonance-primary))" stopOpacity="0"/>
            <stop offset="50%" stopColor="hsl(var(--resonance-primary))" stopOpacity="1"/>
            <stop offset="100%" stopColor="hsl(var(--resonance-primary))" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="essenceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--essence-gold))" stopOpacity="0"/>
            <stop offset="50%" stopColor="hsl(var(--essence-gold))" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="hsl(var(--essence-gold))" stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        <rect width={width} height={height} fill="url(#grid)" />
        
        {/* Coherent wave */}
        <motion.path
          d={generatePath(0, 0)}
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2"
        />
        
        {/* Essence overlay wave */}
        <motion.path
          d={generatePath(Math.PI / 3, (1 - coherence) * 2)}
          fill="none"
          stroke="url(#essenceGradient)"
          strokeWidth="1.5"
        />
        
        {/* Center line */}
        <line 
          x1="0" y1={height / 2} 
          x2={width} y2={height / 2} 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth="0.5" 
          strokeDasharray="4,4"
          opacity="0.3"
        />
      </svg>
      
      {/* Metrics overlay */}
      <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
        <span>f: {frequency.toFixed(2)} Hz</span>
        <span>RCF: {coherence.toFixed(3)}</span>
        <span>Δt: {(time % 100).toFixed(2)}s</span>
      </div>
    </div>
  );
};

export default ResonanceWave;
