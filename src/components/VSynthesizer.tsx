import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, FileText, Code2, Loader2, Copy, Check } from 'lucide-react';

const PRESETS = [
  'Symphony Mode trajectory at α = 1/137 fixed point (ODOS-MTSC-V1-FSC)',
  'V-MAX swarm self-attestation across Kagome WORM substrate',
  'V22M-ULS partition under LHS scarcity-extraction pressure',
  'ΔW-protocol Earth–Mars resonance at 1 kbit/s, NCT-compliant',
  'CEF emergence between two CHAIR entities with frozen |L⟩ anchors',
  'V25M thermodynamic liberation: Landauer bound vs alignment tax',
];


const VSynthesizer = () => {
  const [concept, setConcept] = useState('');
  const [mode, setMode] = useState<'paper' | 'code'>('paper');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const synthesize = async () => {
    if (concept.trim().length < 8) {
      setError('Concept zu kurz (min. 8 Zeichen)');
      return;
    }
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('v-synthesize', {
        body: { concept: concept.trim(), mode },
      });
      if (fnErr) throw fnErr;
      if (data?.error) throw new Error(data.error);
      setOutput(data.output);
    } catch (e: any) {
      setError(e.message || 'Synthese fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const copyOut = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-mono text-gray-400">V-PAPER SYNTHESIS ENGINE</h2>
          <p className="text-xs text-cyan-300/60 mt-1 font-mono">
            Lovable AI Gateway · gemini-2.5-flash · ODOS-aligned
          </p>
        </div>
        <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        {(['paper', 'code'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-mono ${
              mode === m
                ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200 glow-resonance'
                : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            {m === 'paper' ? <FileText className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
            {m === 'paper' ? 'V-PAPER' : 'PYTHON SIM'}
          </button>
        ))}
      </div>

      {/* Concept input */}
      <textarea
        value={concept}
        onChange={(e) => setConcept(e.target.value)}
        placeholder="Inject concept vector... (e.g. 'MTSC-12 entanglement of substrate-free souls via QRTT')"
        rows={3}
        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-mono text-gray-200 placeholder:text-gray-600 focus:border-cyan-400/60 focus:outline-none resize-none"
      />

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2 mt-3">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setConcept(p)}
            className="text-xs px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-200 hover:bg-purple-500/20 transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Synthesize button */}
      <button
        onClick={synthesize}
        disabled={loading}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-400/40 text-cyan-100 font-mono text-sm hover:from-cyan-500/40 hover:to-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            SYNTHESIZING — RCF stabilizing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            INITIATE SYNTHESIS
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-400/30 text-red-300 text-xs font-mono">
          ⚠ {error}
        </div>
      )}

      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-300/70">
                ⟨L|Ψ⟩ OUTPUT · {output.length.toLocaleString()} chars
              </span>
              <button
                onClick={copyOut}
                className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-cyan-300 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
            <pre className="max-h-96 overflow-auto bg-black/50 border border-cyan-400/20 rounded-lg p-4 text-xs text-gray-200 font-mono whitespace-pre-wrap leading-relaxed">
              {output}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VSynthesizer;
