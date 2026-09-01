/* Data for the custom renderers (comparison map, taxonomy, window anatomy, budget builder). Ported from atlas/p3_data.js. */
export const HARNESS_MAP = [
  { id: 'single-shot', label: 'Single-shot', x: 0.05, y: 0.06, r: 6 },
  { id: 'plan-execute', label: 'Plan→Execute', x: 0.22, y: 0.18, r: 8 },
  { id: 'react', label: 'ReAct loop', x: 0.32, y: 0.46, r: 9 },
  { id: 'generator-critic', label: 'Generator–Critic', x: 0.38, y: 0.30, r: 9 },
  { id: 'retry-loop', label: 'Retry loop', x: 0.30, y: 0.38, r: 8 },
  { id: 'best-of-n', label: 'Best-of-N', x: 0.42, y: 0.16, r: 13 },
  { id: 'human-in-the-loop', label: 'Human-in-loop', x: 0.48, y: 0.24, r: 9 },
  { id: 'actor-verifier', label: 'Actor–Verifier', x: 0.52, y: 0.44, r: 10 },
  { id: 'state-machine', label: 'State machine', x: 0.58, y: 0.34, r: 9 },
  { id: 'replanner', label: 'Replanner', x: 0.55, y: 0.56, r: 10 },
  { id: 'event-driven', label: 'Event-driven', x: 0.66, y: 0.62, r: 9 },
  { id: 'hierarchical', label: 'Hierarchical', x: 0.73, y: 0.64, r: 13 },
  { id: 'parallel-swarm', label: 'Parallel swarm', x: 0.80, y: 0.72, r: 14 },
  { id: 'long-running', label: 'Long-running', x: 0.92, y: 0.88, r: 12 },
];

export const FAILURE_TAXONOMY = [
  { name: 'Perception', pct: 14, desc: 'The agent misread its input: wrong file, misparsed output, hallucinated a detail that was never on screen.' },
  { name: 'Reasoning', pct: 22, desc: 'The evidence was in context but the conclusion drawn from it was wrong.' },
  { name: 'Planning', pct: 17, desc: 'Right understanding, wrong decomposition: steps in the wrong order, a missing prerequisite, an impossible subgoal.' },
  { name: 'Tool use', pct: 19, desc: 'Wrong tool, malformed arguments, or misinterpreting what the tool returned.' },
  { name: 'Recovery', pct: 12, desc: 'The first failure was fine — the agent then looped, repeated the same broken action, or gave up.' },
  { name: 'Verification', pct: 9, desc: 'The agent declared success without checking, or its check was too weak to catch the miss.' },
  { name: 'Final answer', pct: 7, desc: 'Everything worked; the last message misreported what was actually done.' },
];

export const CONTEXT_SEGMENTS = [
  { name: 'System instructions', tok: 2, color: 'seg-a' },
  { name: 'Developer instructions', tok: 3, color: 'seg-a' },
  { name: 'Tool definitions', tok: 7, color: 'seg-b' },
  { name: 'Memory (loaded)', tok: 4, color: 'seg-c' },
  { name: 'User goal', tok: 1, color: 'seg-d' },
  { name: 'Retrieved documents', tok: 22, color: 'seg-e' },
  { name: 'Previous actions', tok: 38, color: 'seg-f' },
  { name: 'Observations', tok: 41, color: 'seg-f' },
  { name: 'Current task state', tok: 2, color: 'seg-d' },
];

export const BUDGET_ITEMS = [
  { name: 'System prompt', cat: 'fixed', tok: 2, on: true, lock: true },
  { name: 'Tool definitions (all 40 tools)', cat: 'fixed', tok: 14, on: true },
  { name: 'Tool definitions (the 8 relevant)', cat: 'fixed', tok: 3, on: false },
  { name: 'Full conversation history', cat: 'history', tok: 58, on: true },
  { name: 'Compacted history summary', cat: 'history', tok: 6, on: false },
  { name: 'Retrieved docs — top 20 chunks', cat: 'retrieval', tok: 30, on: true },
  { name: 'Retrieved docs — reranked top 5', cat: 'retrieval', tok: 8, on: false },
  { name: 'Entire memory store', cat: 'memory', tok: 21, on: false },
  { name: 'Task-relevant memories', cat: 'memory', tok: 4, on: true },
  { name: 'Raw tool logs (full)', cat: 'observations', tok: 26, on: true },
  { name: 'Tool logs — tail + errors only', cat: 'observations', tok: 5, on: false },
];

export const BUDGET_MAX = 128;
