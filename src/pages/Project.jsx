// project.jsx — detail page for a single project. Reads slug from URL. Editorial dark style.

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectImageBackground } from '../lib/project-image';
import { externalLinkProps, isUsableHref, projectLinkHref } from '../lib/project-links';
import { EdPage, EdFooter, NotFound, Reveal, StatusPill, isInProgress, pad2, useDarkMode } from '../components/editorial';

const projectStatusLabel = (project) => isInProgress(project) ? 'IN PROGRESS' : 'COMPLETE';

// Per-project rich content. Loaded from projects.json. The fallback below is for offline preview only.
const PROJECTS_FALLBACK = {
  'inform-uci': {
    name: 'INFORM.UCI', kind: 'sponsor capstone', year: '2026',
    role: 'Full-stack lead · team of 4', timeline: '6 months · 2024–2026',
    stack: ['REACT', 'NODE', 'POSTGRES', 'TAILWIND', 'AWS'],
    summary: 'Sponsor-capstone project with a healthcare startup. Intake triage tool used by three pilot clinics.',
    img: 'linear-gradient(135deg,#0b2a3a 0%,#0d3b4f 40%,#1e6580 100%)',
    accent: 'radial-gradient(ellipse at 30% 40%, rgba(80,200,220,.35), transparent 55%)',
    links: [{ k: 'CASE STUDY', v: 'pdf ↓' }],
    sections: [
      { kind: 'paragraph', label: '01 — CONTEXT',
        body: 'Three pilot clinics in Orange County were using a paper-and-clipboard intake process that took an average of 18 minutes per patient. Our sponsor wanted to cut that in half without forcing staff to learn new software.' },
      { kind: 'paragraph', label: '02 — APPROACH',
        body: 'We shadowed front-desk staff for two weeks before writing any code. The takeaway: the bottleneck wasn\'t typing, it was decision-making — staff had to remember which forms applied to which insurance, which conditions needed extra screening, etc. We built a rules engine that drove the form, not the other way around.' },
      { kind: 'metrics', items: [
        { v: '9 min', k: 'AVG INTAKE' }, { v: '–47%', k: 'TIME SAVED' },
        { v: '3', k: 'CLINICS LIVE' }, { v: '4.6/5', k: 'STAFF NPS' },
      ] },
      { kind: 'paragraph', label: '03 — WHAT I OWNED',
        body: 'I led architecture and shipped the rules engine, the forms runtime, and the audit log. Two teammates handled the dashboard; one handled deploy. I also ran sponsor demos every two weeks.' },
      { kind: 'paragraph', label: '04 — WHAT I LEARNED',
        body: 'Healthcare moves slowly for good reasons. Our first prototype was technically correct and clinically wrong — we were optimizing for time-on-task when staff were optimizing for liability. Rebuilding around their actual constraints was the project.' },
    ],
  },
  'latechef': {
    name: 'LATECHEF', kind: 'personal · web app', year: '2026',
    role: 'Solo', timeline: '3 weeks · spring 2026',
    stack: ['NEXT.JS', 'POSTGRES', 'OPENAI', 'VERCEL'],
    summary: 'Tell it what\'s in your fridge at 2am, it tells you what to cook.',
    img: 'linear-gradient(180deg,#1a0f0a 0%,#2a1810 55%,#0a0605 100%)',
    accent: 'radial-gradient(circle at 70% 30%, rgba(220,140,60,.45), transparent 50%)',
    links: [{ k: 'SOURCE', v: 'github' }],
    sections: [
      { kind: 'paragraph', label: '01 — THE ITCH',
        body: 'I kept ordering DoorDash at midnight because I couldn\'t be bothered to figure out what to make from a half-empty fridge. So I built the laziest possible solution: photograph fridge → get three recipes ranked by effort.' },
      { kind: 'paragraph', label: '02 — THE STACK',
        body: 'Next 14 + Postgres for users and saved recipes. Vision API does ingredient extraction. A small ranking step weighs ingredients-on-hand against pantry staples and effort score.' },
      { kind: 'metrics', items: [
        { v: '1.4k', k: 'MAU' }, { v: '~$11/mo', k: 'INFRA' },
        { v: '3 wks', k: 'TIME TO V1' }, { v: '74%', k: 'RETURN RATE' },
      ] },
      { kind: 'paragraph', label: '03 — TRADEOFFS',
        body: 'Vision is expensive per call, so the extracted ingredients cache for 30 minutes per user. Recipes are deterministic given the ingredient set — same fridge, same suggestions, which made it shareable and testable.' },
    ],
  },
  'ramen-db': {
    name: 'RAMEN-DB', kind: 'coursework · systems', year: '2024',
    role: 'Solo · course project', timeline: '10 weeks · ICS 143A',
    stack: ['GO', 'RAFT', 'GRPC', 'BADGER'],
    summary: 'A tiny in-memory KV store with Raft consensus. Course project for ICS 143A.',
    img: 'linear-gradient(160deg,#0a0a0a 0%,#141414 50%,#0a0a0a 100%)',
    accent: 'repeating-linear-gradient(90deg, transparent 0 2px, rgba(120,255,170,.06) 2px 3px)',
    links: [{ k: 'SOURCE', v: 'github' }, { k: 'WRITEUP', v: 'pdf ↓' }],
    sections: [
      { kind: 'paragraph', label: '01 — GOAL',
        body: 'Implement Raft from the paper, end-to-end, no helpers. The course gave us a test harness and a partition simulator; everything else was on us.' },
      { kind: 'paragraph', label: '02 — WHAT WORKED',
        body: 'I wrote the leader-election state machine as a pure function and unit-tested it with a deterministic clock. Replication and snapshotting fell out cleanly because the core was already correct.' },
      { kind: 'metrics', items: [
        { v: '3-node', k: 'CLUSTER' }, { v: '< 200ms', k: 'ELECT TIME' },
        { v: '12k ops/s', k: 'THROUGHPUT' }, { v: 'A', k: 'GRADE' },
      ] },
      { kind: 'paragraph', label: '03 — WHAT BROKE',
        body: 'Snapshot install raced with normal append-entries on slow followers. Took two days to find. The fix was small; the lesson — log everything, including timestamps you don\'t think you need — was bigger.' },
    ],
  },
  'paperboat': {
    name: 'PAPERBOAT', kind: 'personal · ml', year: '2024',
    role: 'Solo', timeline: '4 weeks · winter 2024',
    stack: ['PYTORCH', 'FASTAPI', 'PINECONE', 'NEXT.JS'],
    summary: 'Arxiv paper recommender trained on my reading history.',
    img: 'linear-gradient(135deg,#1a0a2e 0%,#0e0820 40%,#2a1a4a 100%)',
    accent: 'radial-gradient(ellipse at 50% 60%, rgba(180,120,220,.4), transparent 55%)',
    links: [{ k: 'SOURCE', v: 'github' }],
    sections: [
      { kind: 'paragraph', label: '01 — WHY',
        body: 'Arxiv has a firehose problem. I had a folder of ~400 papers I had liked over two years. Could I train something to find more like them?' },
      { kind: 'paragraph', label: '02 — HOW',
        body: 'Embed abstracts with a sentence-transformer; index in Pinecone; train a small classifier on liked-vs-random. Daily cron pulls new submissions in cs.LG and ranks them.' },
      { kind: 'metrics', items: [
        { v: '0.81', k: 'AUC' }, { v: '~12 papers/day', k: 'SHORTLIST' },
        { v: '~3 keepers/wk', k: 'PRECISION' },
      ] },
    ],
  },
  'midnight-lofi': {
    name: 'MIDNIGHT-LOFI', kind: 'personal · audio', year: '2023',
    role: 'Solo', timeline: '2 weeks · weekends',
    stack: ['WEB AUDIO', 'TONE.JS', 'CANVAS'],
    summary: 'Generative lofi that runs entirely in the browser.',
    img: 'linear-gradient(180deg,#0a1a1a 0%,#0f2525 60%,#050f0f 100%)',
    accent: 'radial-gradient(ellipse at 40% 50%, rgba(80,220,180,.3), transparent 60%)',
    links: [{ k: 'SOURCE', v: 'github' }],
    sections: [
      { kind: 'paragraph', label: '01 — IDEA',
        body: 'Lofi is just a few simple ingredients on loop. I wanted to see how minimal a generator could be and still feel intentional.' },
      { kind: 'paragraph', label: '02 — INGREDIENTS',
        body: 'Markov chain over a chord set, swing-quantized hi-hat, pink-noise rain. Everything synthesized at runtime — no samples — so the page is 14kb.' },
      { kind: 'metrics', items: [
        { v: '14 kb', k: 'PAGE WEIGHT' }, { v: '0', k: 'SAMPLES' }, { v: '∞', k: 'RUNTIME' },
      ] },
    ],
  },
  'classy': {
    name: 'CLASSY', kind: 'coursework', year: '2024',
    role: 'Solo · ICS 184', timeline: '8 weeks · spring 2024',
    stack: ['SVELTE', 'SUPABASE', 'D3'],
    summary: 'Course planner with prereq graph viz.',
    img: 'linear-gradient(135deg,#1a1a0a 0%,#252510 50%,#0a0a05 100%)',
    accent: 'radial-gradient(ellipse at 60% 40%, rgba(220,200,80,.35), transparent 55%)',
    links: [{ k: 'SOURCE', v: 'github' }],
    sections: [
      { kind: 'paragraph', label: '01 — PROBLEM',
        body: 'UCI\'s catalog tells you prereqs as a wall of text. Planning a four-year path means flipping between fifteen tabs. I wanted one screen.' },
      { kind: 'paragraph', label: '02 — RESULT',
        body: 'Force-directed prereq graph with a side panel for the active term. Drag courses into terms; the graph re-renders availability live.' },
      { kind: 'metrics', items: [
        { v: '~1.2k', k: 'COURSES INDEXED' }, { v: '60fps', k: 'GRAPH' }, { v: 'A−', k: 'GRADE' },
      ] },
    ],
  },
  'dorm-sensor': {
    name: 'DORM-SENSOR', kind: 'hardware', year: '2024',
    role: 'Hack@UCI · team of 2', timeline: '36 hours',
    stack: ['ESP32', 'MQTT', 'REACT NATIVE'],
    summary: 'ESP32 that yells if you leave the door open.',
    img: 'linear-gradient(135deg,#0a0a1a 0%,#101025 50%,#05050f 100%)',
    accent: 'radial-gradient(ellipse at 50% 50%, rgba(120,140,255,.3), transparent 60%)',
    links: [{ k: 'SOURCE', v: 'github' }],
    sections: [
      { kind: 'paragraph', label: '01 — HACKATHON',
        body: 'Hack@UCI 2024. My teammate had ESP32s; I had a phone. We taped a magnetic switch to her dorm door and built a notifier.' },
      { kind: 'paragraph', label: '02 — STACK',
        body: 'ESP32 publishes door state to a public MQTT broker on every change. React Native app subscribes; if door is open >5min after midnight, push notification.' },
      { kind: 'metrics', items: [
        { v: '36 hrs', k: 'BUILD TIME' }, { v: '2nd', k: 'PLACE' }, { v: '~$8', k: 'BOM' },
      ] },
    ],
  },
  'typo-hunter': {
    name: 'TYPO-HUNTER', kind: 'tool', year: '2023',
    role: 'Solo', timeline: '2 weeks',
    stack: ['RUST', 'TREE-SITTER'],
    summary: 'Finds typos in code comments via tree-sitter.',
    img: 'linear-gradient(180deg,#1a0a0f 0%,#250f15 60%,#0a0508 100%)',
    accent: 'radial-gradient(ellipse at 30% 60%, rgba(220,80,140,.35), transparent 55%)',
    links: [{ k: 'CRATES.IO', v: 'crates' }, { k: 'SOURCE', v: 'github' }],
    sections: [
      { kind: 'paragraph', label: '01 — IDEA',
        body: 'Spellcheckers don\'t know what code is. Code linters don\'t look at prose. Typo-hunter walks tree-sitter ASTs, pulls comments and string literals, and runs them through a dictionary.' },
      { kind: 'paragraph', label: '02 — RESULT',
        body: 'Used as a pre-commit hook in a few of my repos. Zero deps in CI; binary is ~3MB.' },
      { kind: 'metrics', items: [
        { v: '~3 MB', k: 'BINARY' }, { v: '12 langs', k: 'GRAMMARS' }, { v: '< 50ms', k: 'TYPICAL RUN' },
      ] },
    ],
  },
};

function Hero({ p }) {
  const meta = [
    { k: 'ROLE', v: p.role },
    { k: 'TIMELINE', v: p.timeline },
    { k: 'STACK', v: Array.isArray(p.stack) ? p.stack.join(' · ') : p.stack },
    { k: 'STATUS', v: projectStatusLabel(p) },
  ];
  return (
    <div className="ed-page-hero">
      <div className="ed-eyebrow ed-rise">
        / {p.kind.toUpperCase()} · {p.year}
        <StatusPill project={p} />
      </div>
      <h1 className="ed-h1 ed-h1--project">
        <span className="ed-line"><span style={{ animationDelay: '80ms' }}>{p.name}</span></span>
      </h1>
      <p className="ed-lead ed-lead--lg ed-rise" style={{ animationDelay: '220ms' }}>{p.summary}</p>
      <dl className="ed-meta-strip ed-rise" style={{ animationDelay: '320ms' }}>
        {meta.map((m) => (
          <div key={m.k}>
            <dt>{m.k}</dt>
            <dd>{m.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function HeroTile({ p }) {
  return (
    <div className="ed-project-visual ed-rise" style={{ animationDelay: '420ms' }}>
      <div className="ed-project-visual-img" style={{ background: projectImageBackground(p.img) }} />
      {p.accent && <div style={{ position: 'absolute', inset: 0, background: p.accent, mixBlendMode: 'screen' }} />}
      <div className="ed-project-visual-tag" style={{ top: 16, left: 18 }}>— PROJECT VISUAL</div>
      <div style={{ position: 'absolute', top: 14, right: 16 }}>
        <StatusPill project={p} onImage />
      </div>
      <div className="ed-project-visual-tag" style={{ bottom: 16, right: 18 }}>{p.name} / 01</div>
    </div>
  );
}

function Paragraph({ section }) {
  return (
    <Reveal>
      <div className="ed-story-row">
        <div className="ed-story-label">/ {section.label}</div>
        <p className="ed-story-body">{section.body}</p>
      </div>
    </Reveal>
  );
}

function Metrics({ section }) {
  return (
    <Reveal>
      <div className="ed-story-row ed-story-row--metrics">
        <div className="ed-story-label">/ METRICS</div>
        <div className="ed-metrics" style={{ '--cols': section.items.length }}>
          {section.items.map((m) => (
            <div key={m.k}>
              <div className="ed-metric-v">{m.v}</div>
              <div className="ed-metric-k">{m.k}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function NextProject({ current, projects }) {
  const slugs = Object.keys(projects);
  if (!slugs.length) return null;
  const idx = slugs.indexOf(current);
  const nextSlug = slugs[(idx + 1) % slugs.length];
  const next = projects[nextSlug];
  return (
    <Link to={`/project/${nextSlug}`} className="ed-next">
      <div className="ed-next-meta">
        <span>/ NEXT PROJECT</span>
        <span>{pad2(((idx + 1) % slugs.length) + 1)} / {pad2(slugs.length)}</span>
      </div>
      <div className="ed-next-main">
        <div className="ed-next-title">{next.name}</div>
        <span className="ed-contact-arrow ed-next-arrow" aria-hidden="true">→</span>
      </div>
      <div className="ed-next-summary">{next.summary}</div>
    </Link>
  );
}

export default function Project() {
  const [dark, setDark] = useDarkMode();
  const [PROJECTS, setProjects] = React.useState(PROJECTS_FALLBACK);
  const { slug } = useParams();

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/projects.json`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && data.projects) {
          const map = {};
          for (const p of data.projects) map[p.slug] = p;
          setProjects(map);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const p = PROJECTS[slug];
  const back = { to: '/all-works', label: 'ALL WORKS' };

  if (!p) {
    return (
      <EdPage dark={dark} setDark={setDark} back={back} crumb="NOT FOUND">
        <NotFound title="Project not found." back={{ to: '/all-works', label: 'BACK TO ALL WORKS' }} />
      </EdPage>
    );
  }

  return (
    <EdPage dark={dark} setDark={setDark} back={back} crumb={p.name}>
      {/* key remounts the hero so its entrance animation replays when moving between projects */}
      <div key={slug}>
        <Hero p={p} />
        <HeroTile p={p} />
      </div>

      <section className="ed-page-section ed-story">
        {p.sections.map((s, i) => (
          s.kind === 'metrics'
            ? <Metrics key={`${slug}-${i}`} section={s} />
            : <Paragraph key={`${slug}-${i}`} section={s} />
        ))}
      </section>

      {(p.links || []).length > 0 && (
        <section className="ed-page-section ed-project-links">
          <div className="ed-story-label">/ LINKS</div>
          <div className="ed-cta-row" style={{ marginTop: 0 }}>
            {p.links.map((l) => {
              const href = projectLinkHref(p, l);
              const hasHref = isUsableHref(href);
              return (
                <a key={l.k} href={hasHref ? href : '#'} {...externalLinkProps(href)} className="ed-btn"
                  onClick={(e) => { if (!hasHref) e.preventDefault(); }}
                >
                  {l.k} <span className="ed-btn-sub">{l.v} →</span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <section className="ed-page-section">
        <NextProject current={slug} projects={PROJECTS} />
      </section>

      <EdFooter left="© 2026 / Richard" right={`${p.name} · ${p.year}`} />
    </EdPage>
  );
}
