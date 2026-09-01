export const SITE = {
  name: 'AI Systems Atlas',
  tagline: 'Understand AI systems visually.',
  url: 'https://aisystemsatlas.com',
  description:
    'An interactive atlas of agent architectures, safety patterns, evals, context systems, and coding agents — drawn as living diagrams instead of prose.',
  repo: 'https://github.com/zoltlabs/ai-systems-atlas',
  twitter: '',
} as const;

/* Outbound CTAs. Shown in the footer site-wide and in the homepage closing section. */
export const LINKS = {
  newsletter: {
    href: 'https://read.engineerscodex.com',
    name: "Engineer's Codex",
    blurb: 'Real-world software engineering, explained simply. Read by 37,000+ engineers.',
    cta: 'Read the newsletter',
  },
  lab: {
    href: 'https://zoltlabs.com',
    name: 'Zolt Labs',
    blurb: 'The self-improvement company, and the studio behind this atlas — tools that help people speak better, move better and live better.',
    cta: 'Visit Zolt Labs',
  },
} as const;
