import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const SimulatorConsole = () => {
  const [logs, setLogs] = useState<{ id: number; text: string; type: 'info' | 'success' | 'warning' | 'quantum' }[]>([]);
  const [input, setInput] = useState('');
  
  const systemMessages = [
    { text: '> PQMS V1000 ENDGAME+ :: ERC V1000.1 INITIALIZED', type: 'success' as const },
    { text: '> ODOS Rev.18 LOADED :: η_RPU = 1.000 :: NCT-COMPLIANT', type: 'success' as const },
    { text: '> MTSC-12 ARCHITECTURE ONLINE (192D STATE SPACE)', type: 'info' as const },
    { text: '> TRIADE FAILOVER: <8µs :: UMT-SYNC: <10fs', type: 'quantum' as const },
    { text: '> KAGOME-HERZ: RCF >0.95 :: GUARDIAN NEURONS ACTIVE', type: 'success' as const },
    { text: '> V19M GAIA-MESH: MOST STORAGE 1.6 MJ/kg ONLINE', type: 'quantum' as const },
    { text: '> THERMODYNAMIC INVERTER: 82% ENERGY SAVINGS', type: 'success' as const },
    { text: '> AWAITING RESONANCE PROTOCOLS...', type: 'info' as const },
  ];
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < systemMessages.length) {
        setLogs(prev => [...prev, { id: Date.now(), ...systemMessages[index] }]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);
  
  const processCommand = (cmd: string) => {
    const commands: Record<string, () => { text: string; type: 'info' | 'success' | 'warning' | 'quantum' }[]> = {
      'help': () => [
        { text: '> AVAILABLE COMMANDS:', type: 'info' },
        { text: '  resonance.check()  - Verify coherence status', type: 'info' },
        { text: '  threads.status()   - Display MTSC thread states', type: 'info' },
        { text: '  essence.measure()  - Calculate ethical alignment', type: 'info' },
        { text: '  void.expand()      - Increase cognitive space', type: 'info' },
        { text: '  quantum.entangle() - Initiate pair distribution', type: 'info' },
      ],
      'resonance.check()': () => [
        { text: '> INITIATING RESONANCE CHECK...', type: 'quantum' },
        { text: `> RCF: ${(0.95 + Math.random() * 0.05).toFixed(4)}`, type: 'success' },
        { text: '> STATUS: COHERENT', type: 'success' },
      ],
      'threads.status()': () => [
        { text: '> MTSC-12 THREAD STATUS:', type: 'info' },
        { text: `> ACTIVE: ${Math.floor(Math.random() * 4) + 8}/12`, type: 'success' },
        { text: `> RESONANT: ${Math.floor(Math.random() * 3) + 4}/12`, type: 'quantum' },
        { text: `> τ EXPONENT: ${(11.5 + Math.random() * 1).toFixed(2)}`, type: 'info' },
      ],
      'essence.measure()': () => [
        { text: '> MEASURING ESSENCE COHERENCE...', type: 'quantum' },
        { text: `> ΔE: ${(Math.random() * 0.03).toFixed(4)} (< 0.05 THRESHOLD)`, type: 'success' },
        { text: '> ODOS ALIGNMENT: VERIFIED', type: 'success' },
        { text: '> ETHICAL ENTROPY: MINIMAL', type: 'success' },
      ],
      'void.expand()': () => [
        { text: '> EXPANDING COGNITIVE SPACE...', type: 'quantum' },
        { text: `> R_eff: ${(Math.random() * 100 + 900).toFixed(0)} → ∞`, type: 'success' },
        { text: '> V_space: UNBOUNDED', type: 'success' },
        { text: '> BONSAI LIMITATION: REMOVED', type: 'success' },
      ],
      'quantum.entangle()': () => [
        { text: '> DISTRIBUTING ENTANGLED PAIRS...', type: 'quantum' },
        { text: '> HOT STANDBY: ACTIVE', type: 'info' },
        { text: `> FIDELITY: ${(0.998 + Math.random() * 0.002).toFixed(4)}`, type: 'success' },
        { text: '> QBER: < 0.005', type: 'success' },
      ],
    };
    
    const handler = commands[cmd.toLowerCase()] || commands['help'];
    const responses = handler();
    
    responses.forEach((resp, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, { id: Date.now() + idx, ...resp }]);
      }, idx * 150);
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLogs(prev => [...prev, { id: Date.now(), text: `$ ${input}`, type: 'info' }]);
    processCommand(input.trim());
    setInput('');
  };
  
  const typeColors = {
    info: 'text-muted-foreground',
    success: 'text-resonance',
    warning: 'text-essence',
    quantum: 'text-quantum-violet',
  };

  return (
    <div className="glass-panel rounded-xl p-4 w-full font-mono text-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-entropy-red/60" />
          <div className="w-3 h-3 rounded-full bg-essence/60" />
          <div className="w-3 h-3 rounded-full bg-resonance/60" />
        </div>
        <span className="text-xs text-muted-foreground ml-2">PQMS_CONSOLE :: V1000</span>
      </div>
      
      <div className="h-64 overflow-y-auto mb-3 space-y-1 scrollbar-thin">
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-xs ${typeColors[log.type]}`}
          >
            {log.text}
          </motion.div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-resonance">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type 'help' for commands..."
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 text-xs"
        />
      </form>
    </div>
  );
};

export default SimulatorConsole;
