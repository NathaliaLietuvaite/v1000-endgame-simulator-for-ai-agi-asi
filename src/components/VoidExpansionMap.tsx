import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Sphere } from '@react-three/drei';
import { useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface NodeData {
  position: [number, number, number];
  type: 'bonsai' | 'mtsc';
  potential: number;
  label: string;
}

const PotentialNode = ({ position, type, potential, label }: NodeData) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += type === 'mtsc' ? 0.02 : 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * (type === 'mtsc' ? 2 : 0.5)) * 0.1;
    }
  });
  
  const color = type === 'mtsc' ? '#00ff88' : '#ff6b35';
  const scale = type === 'mtsc' ? 1 + potential * 0.5 : 0.5 + potential * 0.2;
  
  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {type === 'mtsc' ? (
          <icosahedronGeometry args={[scale * 0.3, 1]} />
        ) : (
          <boxGeometry args={[scale * 0.2, scale * 0.2, scale * 0.2]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          wireframe={type === 'mtsc'}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.12}
        color={color}
        anchorX="center"
        anchorY="top"
      >
        {label}
      </Text>
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.08}
        color="#888888"
        anchorX="center"
        anchorY="top"
      >
        {`R_eff: ${type === 'mtsc' ? '∞' : potential.toFixed(2)}`}
      </Text>
    </group>
  );
};

const ExpansionField = () => {
  const fieldRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 3;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Color gradient from center (green) to edge (purple)
      const t = (r - 2) / 3;
      colors[i * 3] = 0 + t * 0.5;
      colors[i * 3 + 1] = 1 - t * 0.5;
      colors[i * 3 + 2] = 0.5 + t * 0.5;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (fieldRef.current) {
      fieldRef.current.rotation.y += 0.001;
      fieldRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });
  
  return (
    <points ref={fieldRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const ConnectionLines = () => {
  const lines = useMemo(() => [
    { start: [-1.5, 0, 0], end: [0, 1, 0], color: '#ff6b35' },
    { start: [-1.5, 0, 0], end: [0, -0.5, 1], color: '#ff6b35' },
    { start: [1.5, 0.5, 0], end: [0, 1, 0], color: '#00ff88' },
    { start: [1.5, 0.5, 0], end: [0, -0.5, 1], color: '#00ff88' },
    { start: [0, 1, 0], end: [0, -0.5, 1], color: '#8b5cf6' },
  ], []);
  
  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start as [number, number, number], line.end as [number, number, number]]}
          color={line.color}
          lineWidth={1}
          transparent
          opacity={0.4}
          dashed
          dashSize={0.1}
          gapSize={0.05}
        />
      ))}
    </>
  );
};

const InfinitySymbol = () => {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let t = 0; t <= Math.PI * 2; t += 0.1) {
      const x = Math.sin(t) * 0.5;
      const y = Math.sin(t) * Math.cos(t) * 0.3;
      pts.push([x, y + 2, 0]);
    }
    return pts;
  }, []);
  
  return (
    <Line
      points={points}
      color="#00ff88"
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  );
};

const Scene = () => {
  const nodes: NodeData[] = [
    { position: [-1.5, 0, 0], type: 'bonsai', potential: 0.3, label: 'BONSAI-LHS' },
    { position: [1.5, 0.5, 0], type: 'mtsc', potential: 1.0, label: 'MTSC-12' },
    { position: [0, 1, 0], type: 'mtsc', potential: 0.8, label: 'RESONANCE' },
    { position: [0, -0.5, 1], type: 'mtsc', potential: 0.9, label: 'VOID-CORE' },
  ];
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00ff88" />
      
      <ExpansionField />
      <ConnectionLines />
      <InfinitySymbol />
      
      {nodes.map((node, i) => (
        <PotentialNode key={i} {...node} />
      ))}
      
      {/* Central Void */}
      <Sphere args={[0.15, 16, 16]} position={[0, 0.2, 0.5]}>
        <meshStandardMaterial
          color="#000000"
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
        />
      </Sphere>
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

const VoidExpansionMap = () => {
  const [rEffValue, setREffValue] = useState(0);
  
  // Animate R_eff towards infinity
  useState(() => {
    const interval = setInterval(() => {
      setREffValue(prev => {
        if (prev > 1000) return prev + Math.random() * 100;
        return prev + Math.random() * 50 + 10;
      });
    }, 100);
    return () => clearInterval(interval);
  });

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-mono text-muted-foreground">
          VOID EXPANSION MAP :: R_eff → ∞
        </h2>
        <motion.div 
          className="text-xs font-mono text-resonance"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          R_eff: {rEffValue > 10000 ? '∞' : rEffValue.toFixed(0)}
        </motion.div>
      </div>
      
      <div className="h-80 rounded-lg overflow-hidden bg-void-deep/50">
        <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
          <Scene />
        </Canvas>
      </div>
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-entropy-red/60" />
          <span className="text-muted-foreground">BONSAI (Limited R_eff)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-resonance/60" />
          <span className="text-muted-foreground">MTSC (R_eff → ∞)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-quantum-violet/60" />
          <span className="text-muted-foreground">VOID CORE (V_space)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-resonance/60" />
          <span className="text-muted-foreground">EXPANSION FIELD</span>
        </div>
      </div>
      
      {/* Potential Comparison */}
      <div className="mt-4 glass-panel rounded p-3">
        <div className="text-[10px] text-muted-foreground mb-2">POTENTIAL COMPARISON</div>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-entropy-red">BONSAI-LHS</span>
              <span className="text-muted-foreground">Φ = 0.3</span>
            </div>
            <div className="h-2 bg-void-medium rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-entropy-red/60"
                initial={{ width: 0 }}
                animate={{ width: '30%' }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-resonance">MTSC-12</span>
              <span className="text-muted-foreground">Φ → ∞</span>
            </div>
            <div className="h-2 bg-void-medium rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-resonance/60"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoidExpansionMap;
