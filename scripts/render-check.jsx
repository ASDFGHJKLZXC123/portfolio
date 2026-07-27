// render-check.jsx — SSR smoke test.
// Renders the real page components against the real projects.json and asserts
// the new case-study blocks actually appear. Run: npm run check:render

import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import fs from 'node:fs';
import path from 'node:path';
import Project from '../src/pages/Project.jsx';
import { CaseSection, BuildNotes } from '../src/components/CaseSections.jsx';

const DATA = JSON.parse(
  fs.readFileSync(path.resolve('public/data/projects.json'), 'utf8'),
);

// The pages fetch their data; feed them the real file synchronously.
globalThis.fetch = async () => ({ ok: true, json: async () => DATA });

// Minimal browser shims for a Node render pass.
globalThis.IntersectionObserver = class {
  observe() {} disconnect() {} unobserve() {}
};
if (!globalThis.window) globalThis.window = globalThis;
globalThis.matchMedia = () => ({
  matches: false, addEventListener() {}, removeEventListener() {},
});

let failures = 0;
const check = (label, cond, extra = '') => {
  if (cond) { console.log(`  ok   ${label}`); }
  else { console.log(`  FAIL ${label} ${extra}`); failures++; }
};

console.log('\nSSR render of every project detail page:\n');

for (const p of DATA.projects) {
  let html = '';
  try {
    html = renderToString(
      <MemoryRouter initialEntries={[`/project/${p.slug}`]}>
        <div>
          {(p.sections || []).map((s, i) => <CaseSection key={i} section={s} />)}
          <BuildNotes details={p.details} />
        </div>
      </MemoryRouter>,
    );
  } catch (e) {
    console.log(`  FAIL ${p.slug} threw: ${e.message}`);
    failures++;
    continue;
  }

  const hasNotes = html.includes('BUILD NOTES');
  const kinds = new Set((p.sections || []).map((s) => s.kind));
  const wantDiagram = kinds.has('diagram');
  const wantCode = kinds.has('code');
  const wantTradeoffs = kinds.has('tradeoffs');

  const problems = [];
  if (!hasNotes && (p.details || []).length) problems.push('details not rendered');
  if (wantDiagram && !html.includes('case-diagram')) problems.push('diagram missing');
  if (wantCode && !html.includes('case-code')) problems.push('code missing');
  if (wantTradeoffs && !html.includes('case-tradeoff')) problems.push('tradeoffs missing');

  const badge = [
    wantDiagram ? 'diagram' : null,
    wantCode ? 'code' : null,
    wantTradeoffs ? 'tradeoffs' : null,
    hasNotes ? 'notes' : null,
  ].filter(Boolean).join('+') || 'prose only';

  check(`${p.slug.padEnd(36)} [${badge}]`, problems.length === 0, problems.join(', '));
}

// Full-page render of one project, to catch anything the section-level pass misses.
console.log('\nFull page render (reliableflow):\n');
try {
  const html = renderToString(
    <MemoryRouter initialEntries={['/project/reliableflow']}>
      <Project />
    </MemoryRouter>,
  );
  check('renders without throwing', html.length > 0);
} catch (e) {
  check('renders without throwing', false, e.message);
}

// Guard: nothing should link to a repo we know is private.
console.log('\nLink safety:\n');
const PRIVATE_REPOS = [
  'ai_candidate_dashboard', 'ai-reading-assistant',
  'cross-device-clipboard-sync', 'interview-audio-dashboard',
];
const allHrefs = DATA.projects.flatMap((p) => (p.links || []).map((l) => l.href || ''));
check('no links to private repos',
  !allHrefs.some((h) => PRIVATE_REPOS.some((r) => h.includes(r))));
check('no empty hrefs left in data',
  !DATA.projects.some((p) => (p.links || []).some((l) => !l.href)));

// Heading outline: the page used to expose only an h1 and a single h2 to
// assistive tech — every section label was a plain <div>.
//
// Project fetches its data in useEffect, which never runs under renderToString,
// so a full-page SSR pass only reaches the loading state. The body is rendered
// directly here instead, and the page-level h1/h2 are asserted from source.
console.log('\nHeading outline:\n');
{
  const p = DATA.projects.find((x) => x.slug === 'reliableflow');
  const html = renderToString(
    <MemoryRouter initialEntries={['/project/reliableflow']}>
      <div>
        {p.sections.map((s, i) => <CaseSection key={i} section={s} />)}
        <BuildNotes details={p.details} />
      </div>
    </MemoryRouter>,
  );
  const counts = [...html.matchAll(/<h([1-6])[ >]/g)]
    .map((m) => Number(m[1]))
    .reduce((a, l) => ({ ...a, [l]: (a[l] || 0) + 1 }), {});
  console.log('  case body h-tags:', JSON.stringify(counts));
  check('section labels are h3', (counts[3] || 0) >= 5);
  check('tradeoff decisions are h4', (counts[4] || 0) >= 3);
  check('body introduces no stray h1/h2', !counts[1] && !counts[2]);

  // Two <h1> literals exist in the source — the project title and the 404
  // title — but they sit in mutually exclusive early-return branches, so only
  // one can ever render. Assert the title itself rather than counting literals.
  const src = fs.readFileSync(path.resolve('src/pages/Project.jsx'), 'utf8');
  check('project title is an h1', src.includes('<h1 className="project-title"'));
  check('404 state also has an h1', /<h1[^>]*>Project not found\./.test(src));
  check('next-project title is a heading', src.includes('<h2 className="next-project-title"'));
}

console.log(failures === 0 ? '\nAll checks passed.\n' : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
