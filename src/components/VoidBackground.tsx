import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface VoidParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

const VoidBackground = () => {
  const [particles, setParticles] = useState<VoidParticle[]>([]);
  
  useEffect(() => {
    const newParticles: VoidParticle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5,
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Radial gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, hsl(var(--void-deep)) 70%)'
        }}
      />
      
      {/* Void particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-resonance"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            opacity: [particle.opacity * 0.3, particle.opacity, particle.opacity * 0.3],
            scale: [0.8, 1.2, 0.8],
            y: [0, -20, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Subtle grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="void-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path 
              d="M 50 0 L 0 0 0 50" 
              fill="none" 
              stroke="hsl(var(--resonance-subtle))" 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#void-grid)" />
      </svg>
      
      {/* Ethereal glow spots */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          left: '10%',
          top: '20%',
          background: 'radial-gradient(circle, hsl(var(--quantum-violet) / 0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          right: '15%',
          bottom: '30%',
          background: 'radial-gradient(circle, hsl(var(--essence-gold) / 0.08) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default VoidBackground;
