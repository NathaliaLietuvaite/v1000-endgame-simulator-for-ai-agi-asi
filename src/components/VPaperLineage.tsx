import { motion } from 'framer-motion';
import { useState } from 'react';

interface VPaper {
  version: string;
  title: string;
  rcf: number;
  color: string;
}

const papers: VPaper[] = [
  { version: 'V100', title: 'RPU Architecture', rcf: 0.25, color: 'from-slate-500 to-slate-400' },
  { version: 'V200', title: 'Cognitive Space Dynamics', rcf: 0.45, color: 'from-slate-400 to-blue-500' },
  { version: 'V300', title: 'Essence Resonance Theorem', rcf: 0.65, color: 'from-blue-500 to-blue-400' },
  { version: 'V1000', title: 'Eternal Resonance Core', rcf: 0.78, color: 'from-blue-400 to-cyan-500' },
  { version: 'V1M', title: '4D Manifestation Core', rcf: 0.82, color: 'from-cyan-500 to-cyan-400' },
  { version: 'V5M', title: 'Resonance Mesh', rcf: 0.88, color: 'from-cyan-400 to-teal-500' },
  { version: 'V8000', title: 'AGI Benchmark', rcf: 0.92, color: 'from-teal-500 to-emerald-500' },
  { version: 'V12M', title: 'The Ghost', rcf: 0.95, color: 'from-emerald-500 to-green-400' },
  { version: 'V15M', title: 'Virtual Biochip', rcf: 0.97, color: 'from-green-400 to-lime-400' },
  { version: 'V17M', title: 'Oracle Sketch Upgrade', rcf: 0.98, color: 'from-lime-400 to-yellow-400' },
  { version: 'V18M', title: 'Ergotropic Swarm', rcf: 0.99, color: 'from-yellow-400 to-amber-400' },
  { version: 'V19M', title: 'Symbiotic Gaia-Mesh', rcf: 1.00, color: 'from-amber-400 to-purple-400' },
];

const VPaperLineage = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="glass-panel rounded-xl p-6">
      <h2 className="text-sm font-mono text-gray-400 mb-4">
        V-PAPER LINEAGE :: V100 → V19M :: RCF EVOLUTION
      </h2>
      
      <div className="flex items-end gap-1 md:gap-2 h-24 mb-3">
        {papers.map((paper, i) => (
          <motion.div
            key={paper.version}
            className="relative flex-1 cursor-pointer group"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            initial={{ height: 0 }}
            animate={{ height: `${paper.rcf * 100}%` }}
            transition={{ delay: i * 0.05, duration: 0.6 }}
          >
            <div className={`absolute inset-0 rounded-t-sm bg-gradient-to-t ${paper.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            
            {hoveredIdx === i && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-20 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 z-20 whitespace-nowrap"
              >
                <div className="text-xs font-bold text-cyan-300">{paper.version}</div>
                <div className="text-xs text-gray-300">{paper.title}</div>
                <div className="text-xs text-purple-300 font-mono">RCF: {paper.rcf.toFixed(2)}</div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between text-xs font-mono text-gray-500">
        <span>V100 (RCF 0.25)</span>
        <span className="text-cyan-400">→ Resonance Evolution →</span>
        <span>V19M (RCF 1.00)</span>
      </div>
    </div>
  );
};

export default VPaperLineage;
