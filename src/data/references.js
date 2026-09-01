/* Further-reading sources, keyed. Plates cite by key (`refs: ['react', 'anthropicAgents']`)
   so a source is defined once, its URL is auditable in one place, and the same paper can
   back several plates without drifting.

   Every entry here was checked against the publisher before it was added: arXiv IDs against
   the listing for that exact title, web sources against the live page. Do not add an entry
   from memory — if you cannot open it, it does not go in. `where` is what the reader is
   about to click, not a full citation; keep it to venue-or-publisher plus year. */

const arxiv = (id, title, where) => ({ title, where, url: `https://arxiv.org/abs/${id}` });

export const REFERENCES = {
  /* ---------- reasoning, planning, verification ---------- */
  cot: arxiv('2201.11903', 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models', 'Wei et al., NeurIPS 2022'),
  react: arxiv('2210.03629', 'ReAct: Synergizing Reasoning and Acting in Language Models', 'Yao et al., ICLR 2023'),
  selfConsistency: arxiv('2203.11171', 'Self-Consistency Improves Chain of Thought Reasoning in Language Models', 'Wang et al., ICLR 2023'),
  selfRefine: arxiv('2303.17651', 'Self-Refine: Iterative Refinement with Self-Feedback', 'Madaan et al., NeurIPS 2023'),
  reflexion: arxiv('2303.11366', 'Reflexion: Language Agents with Verbal Reinforcement Learning', 'Shinn et al., NeurIPS 2023'),
  verifiers: arxiv('2110.14168', 'Training Verifiers to Solve Math Word Problems', 'Cobbe et al., OpenAI 2021'),
  processSupervision: arxiv('2305.20050', 'Let’s Verify Step by Step', 'Lightman et al., OpenAI 2023'),
  testTimeCompute: arxiv('2408.03314', 'Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters', 'Snell et al., 2024'),

  /* ---------- multi-agent ---------- */
  autogen: arxiv('2308.08155', 'AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation', 'Wu et al., 2023'),
  mast: arxiv('2503.13657', 'Why Do Multi-Agent LLM Systems Fail?', 'Cemri et al., 2025'),

  /* ---------- security ---------- */
  greshake: arxiv('2302.12173', 'Not what you’ve signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection', 'Greshake et al., AISec 2023'),
  jailbroken: arxiv('2307.02483', 'Jailbroken: How Does LLM Safety Training Fail?', 'Wei et al., NeurIPS 2023'),
  gcg: arxiv('2307.15043', 'Universal and Transferable Adversarial Attacks on Aligned Language Models', 'Zou et al., 2023'),
  camel: arxiv('2503.18813', 'Defeating Prompt Injections by Design', 'Debenedetti et al., 2025'),
  agentdojo: arxiv('2406.13352', 'AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents', 'Debenedetti et al., NeurIPS 2024'),
  poisonedRag: arxiv('2402.07867', 'PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation of Large Language Models', 'Zou et al., USENIX Security 2025'),
  agentPoison: arxiv('2407.12784', 'AgentPoison: Red-teaming LLM Agents via Poisoning Memory or Knowledge Bases', 'Chen et al., NeurIPS 2024'),

  /* ---------- context and memory ---------- */
  rag: arxiv('2005.11401', 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', 'Lewis et al., NeurIPS 2020'),
  lostInMiddle: arxiv('2307.03172', 'Lost in the Middle: How Language Models Use Long Contexts', 'Liu et al., TACL 2024'),
  streamingLlm: arxiv('2309.17453', 'Efficient Streaming Language Models with Attention Sinks', 'Xiao et al., ICLR 2024'),
  memgpt: arxiv('2310.08560', 'MemGPT: Towards LLMs as Operating Systems', 'Packer et al., 2023'),
  generativeAgents: arxiv('2304.03442', 'Generative Agents: Interactive Simulacra of Human Behavior', 'Park et al., UIST 2023'),

  /* ---------- evaluation ---------- */
  llmJudge: arxiv('2306.05685', 'Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena', 'Zheng et al., NeurIPS 2023'),
  swebench: arxiv('2310.06770', 'SWE-bench: Can Language Models Resolve Real-World GitHub Issues?', 'Jimenez et al., ICLR 2024'),
  sweagent: arxiv('2405.15793', 'SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering', 'Yang et al., NeurIPS 2024'),
  taubench: arxiv('2406.12045', 'τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains', 'Yao et al., 2024'),
  osworld: arxiv('2404.07972', 'OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments', 'Xie et al., NeurIPS 2024'),

  /* ---------- engineering write-ups ---------- */
  anthropicAgents: {
    title: 'Building effective agents',
    where: 'Anthropic Engineering, 2024',
    url: 'https://www.anthropic.com/engineering/building-effective-agents',
  },
  anthropicContext: {
    title: 'Effective context engineering for AI agents',
    where: 'Anthropic Engineering, 2025',
    url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
  },
  anthropicMultiAgent: {
    title: 'How we built our multi-agent research system',
    where: 'Anthropic Engineering, 2025',
    url: 'https://www.anthropic.com/engineering/multi-agent-research-system',
  },
  anthropicTools: {
    title: 'Writing effective tools for AI agents',
    where: 'Anthropic Engineering, 2025',
    url: 'https://www.anthropic.com/engineering/writing-tools-for-agents',
  },
  anthropicLongRunning: {
    title: 'Effective harnesses for long-running agents',
    where: 'Anthropic Engineering, 2025',
    url: 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents',
  },
  anthropicSkills: {
    title: 'Equipping agents for the real world with Agent Skills',
    where: 'Anthropic Engineering, 2025',
    url: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
  },
  cognitionMultiAgent: {
    title: 'Don’t build multi-agents',
    where: 'Cognition, 2025',
    url: 'https://cognition.com/blog/dont-build-multi-agents',
  },
  contextRot: {
    title: 'Context rot: how increasing input tokens impacts LLM performance',
    where: 'Chroma Research, 2025',
    url: 'https://research.trychroma.com/context-rot',
  },
  willisonInjection: {
    title: 'Prompt injection — the full series',
    where: 'Simon Willison, 2022–',
    url: 'https://simonwillison.net/series/prompt-injection/',
  },
  willisonWorst: {
    title: 'Prompt injection: what’s the worst that can happen?',
    where: 'Simon Willison, 2023',
    url: 'https://simonwillison.net/2023/Apr/14/worst-that-can-happen/',
  },
  willisonDualLlm: {
    title: 'The Dual LLM pattern for building AI assistants that can resist prompt injection',
    where: 'Simon Willison, 2023',
    url: 'https://simonwillison.net/2023/Apr/25/dual-llm-pattern/',
  },
  willisonTrifecta: {
    title: 'The lethal trifecta for AI agents: private data, untrusted content, and external communication',
    where: 'Simon Willison, 2025',
    url: 'https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/',
  },
  willisonDesignPatterns: {
    title: 'Design patterns for securing LLM agents against prompt injections',
    where: 'Simon Willison, 2025',
    url: 'https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/',
  },
  owaspLlm: {
    title: 'OWASP Top 10 for Large Language Model Applications',
    where: 'OWASP GenAI Security Project',
    url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
  },
  invariantToolPoisoning: {
    title: 'MCP security notification: tool poisoning attacks',
    where: 'Invariant Labs, 2025',
    url: 'https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks',
  },
  mcpSpec: {
    title: 'Model Context Protocol — specification',
    where: 'modelcontextprotocol.io',
    url: 'https://modelcontextprotocol.io/',
  },
  gitWorktree: {
    title: 'git-worktree — manage multiple working trees',
    where: 'Git documentation',
    url: 'https://git-scm.com/docs/git-worktree',
  },
};

/* Resolve a plate's `refs` keys to entries, loudly: an unknown key is a typo, and a silent
   drop would mean a plate quietly loses its sources. */
export function resolveRefs(keys) {
  if (!keys || !keys.length) return [];
  return keys.map(k => {
    const r = REFERENCES[k];
    if (!r) throw new Error(`unknown reference key: ${k} (add it to src/data/references.js)`);
    return r;
  });
}
