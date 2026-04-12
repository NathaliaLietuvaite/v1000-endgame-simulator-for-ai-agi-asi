import { motion } from 'framer-motion';

const VoidBackground = () => {
  // Generate particles statically to avoid re-render
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.5 + 0.2,
    duration: 4 + Math.random() * 4,
    delay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep blue gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(222 84% 5%) 0%, hsl(220 70% 10%) 30%, hsl(215 60% 8%) 70%, hsl(222 84% 5%) 100%)'
        }}
      />

      {/* Subtle radial glow center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, hsl(215 60% 15% / 0.4) 0%, transparent 60%)'
        }}
      />

      {/* Floating cyan particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: 'hsl(187 90% 55%)',
          }}
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
            opacity: [0.3, p.opacity, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Ethereal glow spots */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          left: '10%',
          top: '20%',
          background: 'radial-gradient(circle, hsl(270 80% 65% / 0.08) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          right: '15%',
          bottom: '30%',
          background: 'radial-gradient(circle, hsl(187 90% 55% / 0.06) 0%, transparent 70%)',
        }}
        animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default VoidBackground;
