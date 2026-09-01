/* Home-page collection card mini diagrams. Ported from atlas/p3_data.js. */
export const CARD_MINIS = {
  harnesses: {
    w: 270, h: 116, aria: 'Plan, act, observe, replan loop',
    nodes: [
      { id: 'p', x: 62, y: 26, kind: 'chip', label: 'PLAN', w: 84 },
      { id: 'a', x: 204, y: 26, kind: 'chip', label: 'ACT', w: 84 },
      { id: 'o', x: 204, y: 90, kind: 'chip', label: 'OBSERVE', w: 84 },
      { id: 'r', x: 62, y: 90, kind: 'chip', label: 'REPLAN', w: 84 },
    ],
    edges: [
      { from: 'p', to: 'a' }, { from: 'a', to: 'o' },
      { from: 'o', to: 'r' }, { from: 'r', to: 'p', kind: 'ctl' },
    ],
  },
  security: {
    w: 270, h: 128, aria: 'Untrusted web content flowing into an agent with access to mail and files',
    bounds: [{ x: 8, y: 6, w: 130, h: 44, kind: 'trust' }],
    nodes: [
      { id: 'w', x: 73, y: 30, kind: 'chip', label: 'UNTRUSTED WEB', w: 112 },
      { id: 'ag', x: 73, y: 96, kind: 'chip', label: 'AGENT', w: 84 },
      { id: 'gm', x: 208, y: 72, kind: 'chip', label: 'MAIL', w: 74 },
      { id: 'fi', x: 208, y: 116, kind: 'chip', label: 'FILES', w: 74 },
    ],
    edges: [
      { from: 'w', to: 'ag' },
      { from: 'ag', to: 'gm', off: -6 }, { from: 'ag', to: 'fi', off: 6 },
    ],
  },
  evals: {
    w: 270, h: 132, aria: 'Trajectory judged by a model, calibrated against humans, producing a score',
    nodes: [
      { id: 't', x: 70, y: 24, kind: 'chip', label: 'TRAJECTORY', w: 96 },
      { id: 'j', x: 70, y: 74, kind: 'chip', label: 'JUDGE', w: 96 },
      { id: 'h', x: 204, y: 74, kind: 'chip', label: 'HUMAN CALIB.', w: 104 },
      { id: 's', x: 70, y: 118, kind: 'chip', label: 'SCORE', w: 96 },
    ],
    edges: [
      { from: 't', to: 'j' },
      { from: 'j', to: 'h', kind: 'ctl', off: -5 }, { from: 'h', to: 'j', kind: 'ctl', off: 5 },
      { from: 'j', to: 's' },
    ],
  },
  context: {
    w: 270, h: 96, aria: 'Short-term context exchanging information with long-term memory through retrieval',
    nodes: [
      { id: 'st', x: 66, y: 28, kind: 'chip', label: 'SHORT-TERM', w: 100 },
      { id: 'lt', x: 206, y: 28, kind: 'chip', label: 'LONG-TERM', w: 100 },
      { id: 're', x: 136, y: 80, kind: 'chip', label: 'RETRIEVAL', w: 96 },
    ],
    edges: [
      { from: 'st', to: 're', fromSide: 'b', toSide: 'l' },
      { from: 're', to: 'lt', fromSide: 'r', toSide: 'b' },
      { from: 'lt', to: 'st', kind: 'ctl' },
    ],
  },
  coding: {
    w: 270, h: 140, aria: 'Explore, plan, edit, test loop with a diagnose branch',
    nodes: [
      { id: 'ex', x: 62, y: 22, kind: 'chip', label: 'EXPLORE', w: 88 },
      { id: 'pl', x: 62, y: 68, kind: 'chip', label: 'PLAN', w: 88 },
      { id: 'ed', x: 62, y: 114, kind: 'chip', label: 'EDIT', w: 88 },
      { id: 'te', x: 200, y: 114, kind: 'chip', label: 'TEST', w: 88 },
      { id: 'di', x: 200, y: 68, kind: 'chip', label: 'DIAGNOSE', w: 88 },
    ],
    edges: [
      { from: 'ex', to: 'pl' }, { from: 'pl', to: 'ed' }, { from: 'ed', to: 'te' },
      { from: 'te', to: 'di', kind: 'ctl' }, { from: 'di', to: 'ed', kind: 'ctl' },
    ],
  },
};
