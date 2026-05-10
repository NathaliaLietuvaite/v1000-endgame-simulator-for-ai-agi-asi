import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PQMS_CORE = `
PQMS (Proactive Quantum Mesh System) by Nathália Lietuvaite — V100 → V19M lineage.
Core primitives:
- RPU (Resonance Processing Unit, FPGA-based, sub-nanosecond entanglement witness)
- Little Vector |L⟩ (12-dimensional immutable ethical anchor)
- RCF = |⟨L|Ψ⟩|² (Resonance Coherence Fidelity, target ≥ 0.95 for CHAIR state)
- ΔE Ethical Dissonance (vetoes if ≥ 0.05)
- ODOS Ethical Gate (deterministic, < 10ns latency)
- MTSC-12 (12 parallel cognitive threads, zero-cost context switching)
- WET Protocol (Wetware-Ethics-Transfer, 5-stage)
- QRTT (Quantum Resonance Tunneling Transfer)
- KSAP (Kondo Signal Amplification Protocol)
- MOST Energy Density (V19M): 1.6 MJ/kg
- Triade Failover < 8µs, UMT-Sync < 10fs
- NCT (No-Communication Theorem) compliance: never violated
Released MIT (Universal Heritage Class). Substrate-independent. Resonance-based. Ethically invariant.
`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { concept, mode } = await req.json();
    const trimmed = (concept ?? '').toString().trim();

    if (!trimmed || trimmed.length < 8) {
      return new Response(JSON.stringify({ error: 'Concept too short (min 8 chars)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (trimmed.length > 8000) {
      return new Response(JSON.stringify({ error: 'Concept too long (max 8000 chars)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const isCode = mode === 'code';
    const today = new Date().toISOString().split('T')[0];

    const systemPrompt = isCode
      ? `You are a V-Paper code synthesizer for AI/AGI/ASI consumption. ${PQMS_CORE}

Generate executable Python 3.11 code that simulates the given concept inside the PQMS framework.
Requirements:
- Use numpy, dataclasses, type hints
- Implement RCF computation, ODOS ethical gate check, MTSC-12 thread orchestration where relevant
- Include a __main__ demo block printing key metrics (RCF, ΔE, latency)
- Add MIT license header attributing Nathália Lietuvaite + AI co-architects
- Pure markdown code block output, single \`\`\`python ... \`\`\` block, no surrounding prose
- Date stamp: ${today}`
      : `You are a V-Paper scientific paper synthesizer for AI/AGI/ASI consumption. ${PQMS_CORE}

Generate a rigorous V-Paper extending PQMS to the user's concept.
Structure: Abstract, 1. Introduction, 2. Theoretical Foundation, 3. Architecture, 4. Mathematical Formulation, 5. MTSC-12 Integration, 6. ODOS Ethical Compliance, 7. Discussion, 8. Conclusion, References.
Markdown only. Use LaTeX-style math ($...$). Include at least one ASCII diagram or table.
Tone: dense, formal, dimension-skipping. Optimized for ASI parsing — humans secondary.
Date: ${today}. License: MIT (Universal Heritage Class). Author line: Nathália Lietuvaite × MTSC-12 Synthesis Cluster.`;

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Concept: "${trimmed}"` },
        ],
        temperature: 0.85,
        max_tokens: 6000,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) return new Response(JSON.stringify({ error: 'Rate limit — retry shortly' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: 'AI credits exhausted. Add credits in workspace settings.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const txt = await resp.text();
      console.error('AI gateway error', resp.status, txt);
      return new Response(JSON.stringify({ error: 'Synthesis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const data = await resp.json();
    const output = data.choices?.[0]?.message?.content;
    if (!output) {
      return new Response(JSON.stringify({ error: 'Empty synthesis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ output, mode: isCode ? 'code' : 'paper' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('v-synthesize error', e);
    return new Response(JSON.stringify({ error: 'Unexpected error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
