/* Curated evidence registry for the atlas.
   Prefer original research, standards bodies, and first-party engineering guidance.
   Plate mappings are intentionally explicit so citation coverage is reviewable. */
export const SOURCES = {
  'anthropic-agents': { title: 'Building effective agents', author: 'Anthropic', year: 2024, kind: 'Engineering guide', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
  'openai-agents': { title: 'A practical guide to building agents', author: 'OpenAI', year: 2025, kind: 'Engineering guide', url: 'https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/' },
  react: { title: 'ReAct: Synergizing Reasoning and Acting in Language Models', author: 'Yao et al.', year: 2022, kind: 'Research paper', url: 'https://arxiv.org/abs/2210.03629' },
  'planning-survey': { title: 'Understanding the Planning of LLM Agents: A Survey', author: 'Huang et al.', year: 2024, kind: 'Research survey', url: 'https://arxiv.org/abs/2402.02716' },
  'self-refine': { title: 'Self-Refine: Iterative Refinement with Self-Feedback', author: 'Madaan et al.', year: 2023, kind: 'Research paper', url: 'https://arxiv.org/abs/2303.17651' },
  reflexion: { title: 'Reflexion: Language Agents with Verbal Reinforcement Learning', author: 'Shinn et al.', year: 2023, kind: 'Research paper', url: 'https://arxiv.org/abs/2303.11366' },
  'multi-agent-survey': { title: 'Large Language Model Based Multi-Agents: A Survey', author: 'Guo et al.', year: 2024, kind: 'Research survey', url: 'https://arxiv.org/abs/2402.01680' },
  'anthropic-research-system': { title: 'How we built our multi-agent research system', author: 'Anthropic', year: 2025, kind: 'Engineering report', url: 'https://www.anthropic.com/engineering/multi-agent-research-system' },
  'anthropic-long-running': { title: 'Effective harnesses for long-running agents', author: 'Anthropic', year: 2025, kind: 'Engineering report', url: 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents' },

  'owasp-agency': { title: 'LLM06:2025 Excessive Agency', author: 'OWASP GenAI Security Project', year: 2025, kind: 'Security standard', url: 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/' },
  'owasp-agentic': { title: 'OWASP Top 10 for Agentic Applications', author: 'OWASP GenAI Security Project', year: 2025, kind: 'Security framework', url: 'https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/' },
  'indirect-injection': { title: 'Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection', author: 'Greshake et al.', year: 2023, kind: 'Research paper', url: 'https://arxiv.org/abs/2302.12173' },
  'prompt-injection': { title: 'Prompt Injection Attack against LLM-integrated Applications', author: 'Liu et al.', year: 2023, kind: 'Research paper', url: 'https://arxiv.org/abs/2306.05499' },
  spotlighting: { title: 'Defending Against Indirect Prompt Injection Attacks With Spotlighting', author: 'Hines et al.', year: 2024, kind: 'Research paper', url: 'https://www.microsoft.com/en-us/research/publication/defending-against-indirect-prompt-injection-attacks-with-spotlighting/' },
  'nist-hijacking': { title: 'Strengthening AI Agent Hijacking Evaluations', author: 'NIST CAISI', year: 2025, kind: 'Government research', url: 'https://www.nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations' },
  'microsoft-ipi': { title: 'Defend against indirect prompt injection attacks', author: 'Microsoft', year: 2025, kind: 'Security guidance', url: 'https://learn.microsoft.com/en-us/security/zero-trust/sfi/defend-indirect-prompt-injection' },
  'owasp-memory': { title: 'Memory Is a Feature. It Is Also an Attack Surface', author: 'OWASP GenAI Security Project', year: 2026, kind: 'Security analysis', url: 'https://genai.owasp.org/2026/05/13/memory-is-a-feature-it-is-also-an-attack-surface/' },

  'anthropic-evals': { title: 'Demystifying evals for AI agents', author: 'Anthropic', year: 2026, kind: 'Engineering guide', url: 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents' },
  'openai-evals': { title: 'Evaluation best practices', author: 'OpenAI', year: 2025, kind: 'Developer guide', url: 'https://developers.openai.com/api/docs/guides/evaluation-best-practices' },
  agentbench: { title: 'AgentBench: Evaluating LLMs as Agents', author: 'Liu et al.', year: 2023, kind: 'Research paper', url: 'https://arxiv.org/abs/2308.03688' },
  'judge-position-bias': { title: 'Judging the Judges: A Systematic Study of Position Bias in LLM-as-a-Judge', author: 'Shi et al.', year: 2024, kind: 'Research paper', url: 'https://arxiv.org/abs/2406.07791' },
  'judge-self-bias': { title: 'Self-Preference Bias in LLM-as-a-Judge', author: 'Wataoka et al.', year: 2024, kind: 'Research paper', url: 'https://arxiv.org/abs/2410.21819' },

  'anthropic-context': { title: 'Effective context engineering for AI agents', author: 'Anthropic', year: 2025, kind: 'Engineering guide', url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents' },
  'lost-middle': { title: 'Lost in the Middle: How Language Models Use Long Contexts', author: 'Liu et al.', year: 2023, kind: 'Research paper', url: 'https://arxiv.org/abs/2307.03172' },
  memgpt: { title: 'MemGPT: Towards LLMs as Operating Systems', author: 'Packer et al.', year: 2023, kind: 'Research paper', url: 'https://arxiv.org/abs/2310.08560' },
  'generative-agents': { title: 'Generative Agents: Interactive Simulacra of Human Behavior', author: 'Park et al.', year: 2023, kind: 'Research paper', url: 'https://arxiv.org/abs/2304.03442' },
  rag: { title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', author: 'Lewis et al.', year: 2020, kind: 'Research paper', url: 'https://arxiv.org/abs/2005.11401' },

  'swe-bench': { title: 'SWE-bench: Can Language Models Resolve Real-World GitHub Issues?', author: 'Jimenez et al.', year: 2023, kind: 'Research paper', url: 'https://arxiv.org/abs/2310.06770' },
  'git-worktree': { title: 'git-worktree documentation', author: 'Git project', year: 2026, kind: 'Official documentation', url: 'https://git-scm.com/docs/git-worktree' },
  'git-commit': { title: 'git-commit documentation', author: 'Git project', year: 2026, kind: 'Official documentation', url: 'https://git-scm.com/docs/git-commit' },
  playwright: { title: 'Visual comparisons', author: 'Playwright', year: 2026, kind: 'Official documentation', url: 'https://playwright.dev/docs/test-snapshots' },
};

const mappings = {
  harnesses: {
    'single-shot': ['anthropic-agents', 'openai-agents'],
    react: ['react', 'anthropic-agents'],
    'plan-execute': ['planning-survey', 'anthropic-agents'],
    replanner: ['planning-survey', 'reflexion'],
    'generator-critic': ['self-refine', 'anthropic-agents'],
    'actor-verifier': ['anthropic-agents', 'anthropic-evals'],
    'best-of-n': ['anthropic-agents', 'openai-evals'],
    'retry-loop': ['openai-agents', 'reflexion'],
    'state-machine': ['openai-agents', 'anthropic-long-running'],
    hierarchical: ['multi-agent-survey', 'anthropic-research-system'],
    'parallel-swarm': ['anthropic-agents', 'anthropic-research-system'],
    'human-in-the-loop': ['openai-agents', 'owasp-agency'],
    'event-driven': ['openai-agents', 'anthropic-long-running'],
    'long-running': ['anthropic-long-running', 'anthropic-context'],
  },
  security: {
    'chatbot-vs-agent': ['owasp-agency', 'openai-agents'],
    'indirect-prompt-injection': ['indirect-injection', 'nist-hijacking', 'spotlighting'],
    'direct-prompt-injection': ['prompt-injection', 'owasp-agentic'],
    'data-exfiltration': ['indirect-injection', 'microsoft-ipi', 'owasp-agency'],
    'confused-deputy': ['owasp-agency', 'owasp-agentic'],
    'tool-poisoning': ['owasp-agentic', 'microsoft-ipi'],
    'memory-poisoning': ['owasp-memory', 'owasp-agentic'],
    'malicious-retrieved-content': ['indirect-injection', 'rag', 'spotlighting'],
    'credential-leakage': ['owasp-agentic', 'microsoft-ipi'],
    'privilege-escalation': ['owasp-agency', 'owasp-agentic'],
    'unsafe-side-effects': ['owasp-agency', 'openai-agents'],
  },
  evals: {
    'outcome-eval': ['anthropic-evals', 'openai-evals'],
    'trajectory-eval': ['anthropic-evals', 'agentbench'],
    'llm-as-judge': ['judge-position-bias', 'judge-self-bias', 'openai-evals'],
    'human-calibrated-judge': ['anthropic-evals', 'openai-evals'],
    'regression-evals': ['anthropic-evals', 'openai-evals'],
    'failure-taxonomy': ['anthropic-evals', 'agentbench'],
    'outcome-vs-process': ['anthropic-evals', 'agentbench'],
    'adversarial-evals': ['nist-hijacking', 'openai-evals'],
    'cross-model-evals': ['anthropic-evals', 'openai-evals'],
    'offline-vs-online': ['anthropic-evals', 'openai-evals'],
  },
  context: {
    'context-window-anatomy': ['anthropic-context', 'lost-middle'],
    'context-compaction': ['anthropic-context', 'memgpt'],
    retrieval: ['rag', 'anthropic-context'],
    'context-budget': ['anthropic-context', 'lost-middle'],
    'context-overflow': ['memgpt', 'anthropic-context'],
    'context-rot': ['lost-middle', 'anthropic-context'],
    'sliding-window': ['memgpt', 'anthropic-context'],
    'memory-types': ['generative-agents', 'memgpt'],
    'memory-write-policies': ['generative-agents', 'owasp-memory'],
    'state-representation': ['anthropic-context', 'anthropic-long-running'],
  },
  'coding-agents': {
    'test-loop': ['swe-bench', 'anthropic-evals'],
    'single-vs-multi': ['multi-agent-survey', 'anthropic-research-system'],
    'ci-loop': ['swe-bench', 'anthropic-evals'],
    'plan-first': ['planning-survey', 'anthropic-long-running'],
    'test-driven': ['swe-bench', 'anthropic-evals'],
    'reviewer-agent': ['self-refine', 'anthropic-evals'],
    worktrees: ['git-worktree', 'anthropic-research-system'],
    'researcher-implementer': ['anthropic-research-system', 'anthropic-context'],
    checkpointing: ['git-commit', 'anthropic-long-running'],
    'repo-indexing': ['rag', 'swe-bench'],
    'computer-use': ['playwright', 'anthropic-evals'],
  },
};

export const PLATE_SOURCE_IDS = Object.fromEntries(
  Object.entries(mappings).flatMap(([collection, plates]) =>
    Object.entries(plates).map(([slug, ids]) => [`${collection}/${slug}`, ids])),
);

export function sourcesForPlate(collection, slug) {
  return (PLATE_SOURCE_IDS[`${collection}/${slug}`] || []).map(id => ({ id, ...SOURCES[id] }));
}
