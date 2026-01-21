import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface DataStreamItem {
  id: number;
  type: 'qubit' | 'resonance' | 'essence' | 'entropy';
  value: string;
  timestamp: number;
}

const DataStreamMonitor = () => {
  const [items, setItems] = useState<DataStreamItem[]>([]);
  
  const dataTypes = {
    qubit: { prefix: 'Q', color: 'text-quantum-blue' },
    resonance: { prefix: 'R', color: 'text-resonance' },
    essence: { prefix: 'E', color: 'text-essence' },
    entropy: { prefix: 'Δ', color: 'text-entropy-orange' },
  };
  
  useEffect(() => {
    const generateItem = (): DataStreamItem => {
      const types: ('qubit' | 'resonance' | 'essence' | 'entropy')[] = ['qubit', 'resonance', 'essence', 'entropy'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      let value = '';
      switch (type) {
        case 'qubit':
          value = `|${Math.random() > 0.5 ? '0' : '1'}⟩ + |${Math.random() > 0.5 ? '0' : '1'}⟩`;
          break;
        case 'resonance':
          value = `${(Math.random() * 0.1 + 0.9).toFixed(4)}`;
          break;
        case 'essence':
          value = `η=${(Math.random() * 0.05 + 0.95).toFixed(4)}`;
          break;
        case 'entropy':
          value = `S=${(Math.random() * 0.01).toFixed(6)}`;
          break;
      }
      
      return {
        id: Date.now() + Math.random(),
        type,
        value,
        timestamp: Date.now(),
      };
    };
    
    const interval = setInterval(() => {
      setItems(prev => {
        const newItems = [...prev, generateItem()];
        return newItems.slice(-8); // Keep last 8 items
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-void rounded-lg p-4 w-full max-w-sm">
      <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-resonance"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="text-sm font-mono text-muted-foreground">RESONANCE_STREAM</span>
      </div>
      
      <div className="space-y-1 h-48 overflow-hidden">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex items-center gap-2 font-mono text-xs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1 - (index * 0.1), x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-muted-foreground w-16">
              {new Date(item.timestamp).toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </span>
            <span className={`${dataTypes[item.type].color} w-4`}>
              {dataTypes[item.type].prefix}
            </span>
            <span className="text-foreground/80">{item.value}</span>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-border flex justify-between text-xs font-mono text-muted-foreground">
        <span>THROUGHPUT: 1.2 TOps/s</span>
        <span>QBER: &lt;0.005</span>
      </div>
    </div>
  );
};

export default DataStreamMonitor;
