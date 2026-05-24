// project.jsx — detail page for a single project. Reads slug from URL.

import React from 'react';
import { Link, useParams } from 'react-router-dom';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isInProgress = (project) => project.status === 'in-progress';
const projectStatusLabel = (project) => isInProgress(project) ? 'IN PROGRESS' : 'COMPLETE';

function StatusPill({ project, onImage = false }) {
  if (!isInProgress(project)) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
      padding: onImage ? '4px 8px' : '5px 9px',
      borderRadius: 999,
      border: onImage ? '1px solid rgba(255,255,255,0.32)' : '1px solid var(--border)',
      background: onImage ? 'rgba(255,255,255,0.14)' : 'var(--hover)',
      color: onImage ? 'rgba(255,255,255,0.9)' : 'var(--fg)',
      fontFamily: 'var(--mono)', fontSize: onImage ? 8 : 9,
      lineHeight: 1, letterSpacing: '0.16em',
    }}>
      IN PROGRESS
    </span>
  );
}

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

const FONT = { sans: '"Inter Tight", Helvetica, Arial, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.02em' };

function useReveal() {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { setShown(true); io.disconnect(); return; }
    }, { threshold: 0.1 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}
function Reveal({ children, delay = 0 }) {
  const [ref, shown] = useReveal();
  return <div ref={ref} style={{
    transform: shown ? 'translateY(0)' : 'translateY(16px)',
    opacity: shown ? 1 : 0,
    transition: `transform .8s cubic-bezier(.2,.7,.3,1) ${delay}ms, opacity .8s ease ${delay}ms`,
  }}>{children}</div>;
}

function TopBar({ dark, setDark, projectName }) {
  const themeBtn = (on) => ({
    border: 'none', padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
    background: on ? 'var(--fg)' : 'transparent',
    color: on ? 'var(--bg)' : 'var(--muted)',
    fontSize: 9, letterSpacing: '0.18em', fontFamily: 'inherit', fontWeight: 600,
    transition: 'background .2s, color .2s',
  });
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      backdropFilter: 'blur(14px) saturate(140%)', WebkitBackdropFilter: 'blur(14px) saturate(140%)',
      background: 'var(--bg-blur)', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', padding: '16px 40px', fontSize: 11,
        letterSpacing: '0.12em', fontFamily: 'var(--mono)',
      }}>
        <div style={{ justifySelf: 'start', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/all-works" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg)' }}>
            <span style={{ color: 'var(--muted)' }}>←</span>
            <span>ALL WORKS</span>
          </Link>
          <span style={{ color: 'var(--muted)' }}>/</span>
          <span style={{ color: 'var(--muted)' }}>{projectName || '—'}</span>
        </div>
        <div style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 999, padding: 2 }}>
          <button onClick={() => setDark(true)} style={themeBtn(dark)}>DARK</button>
          <button onClick={() => setDark(false)} style={themeBtn(!dark)}>LIGHT</button>
        </div>
        <Link to="/#contact" style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg)', textDecoration: 'none' }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--fg)', boxShadow: '0 0 8px var(--fg)' }} />
          <span>INITIATE DIALOGUE</span>
        </Link>
      </div>
    </div>
  );
}

function Hero({ p }) {
  return (
    <div style={{ padding: '60px 40px 0' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 24 }}>
        / {p.kind.toUpperCase()} · {p.year}
      </div>
      {isInProgress(p) && (
        <div style={{ marginBottom: 18 }}>
          <StatusPill project={p} />
        </div>
      )}
      <h1 style={{
        margin: 0, fontFamily: 'var(--sans)', fontWeight: 400,
        fontSize: 'clamp(48px, 6vw, 92px)', lineHeight: 1, letterSpacing: 'var(--letter)', color: 'var(--fg)',
      }}>{p.name}</h1>
      <div style={{
        marginTop: 24, fontFamily: 'var(--sans)', fontSize: 'clamp(18px, 1.6vw, 22px)',
        color: 'var(--muted)', maxWidth: 720, lineHeight: 1.5, fontWeight: 300, letterSpacing: 'var(--letter)',
      }}>
        {p.summary}
      </div>

      <div style={{
        marginTop: 56, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        border: '1px solid var(--border)',
      }}>
        {[
          { k: 'ROLE', v: p.role },
          { k: 'TIMELINE', v: p.timeline },
          { k: 'STACK', v: Array.isArray(p.stack) ? p.stack.join(' / ') : p.stack },
          { k: 'STATUS', v: projectStatusLabel(p) },
        ].map((m, i, arr) => (
          <div key={m.k} style={{
            padding: '24px 28px',
            borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.24em', color: 'var(--muted)' }}>
              / {m.k}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em', color: 'var(--fg)', lineHeight: 1.4 }}>
              {m.v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroTile({ p }) {
  return (
    <div style={{
      margin: '60px 40px 0', height: 'clamp(320px, 48vh, 560px)',
      position: 'relative', overflow: 'hidden',
      background: 'var(--tile-bg)', border: '1px solid var(--border)',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: p.img }} />
      {p.accent && <div style={{ position: 'absolute', inset: 0, background: p.accent, mixBlendMode: 'screen' }} />}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.012) 2px 3px)',
      }} />
      <div style={{
        position: 'absolute', top: 16, left: 18,
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.55)',
      }}>
        — VISUAL · PLACEHOLDER
      </div>
      <div style={{ position: 'absolute', top: 16, right: 18 }}>
        <StatusPill project={p} onImage />
      </div>
      <div style={{
        position: 'absolute', bottom: 16, right: 18,
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.55)',
      }}>
        {p.name} / 01
      </div>
    </div>
  );
}

function Paragraph({ section }) {
  return (
    <Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32, padding: '40px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', paddingTop: 6 }}>
          / {section.label}
        </div>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 'clamp(18px, 1.5vw, 22px)',
          lineHeight: 1.55, color: 'var(--fg)', fontWeight: 300, letterSpacing: 'var(--letter)',
          maxWidth: 780, textWrap: 'pretty',
        }}>
          {section.body}
        </div>
      </div>
    </Reveal>
  );
}

function Metrics({ section }) {
  return (
    <Reveal>
      <div style={{ padding: '40px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 24 }}>
          / METRICS
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: `repeat(${section.items.length}, 1fr)`,
          border: '1px solid var(--border)',
        }}>
          {section.items.map((m, i, arr) => (
            <div key={m.k} style={{
              padding: '32px 24px',
              borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--sans)', fontSize: 'clamp(28px, 3vw, 44px)',
                fontWeight: 400, letterSpacing: 'var(--letter)', color: 'var(--fg)', lineHeight: 1,
              }}>{m.v}</div>
              <div style={{
                marginTop: 14, fontFamily: 'var(--mono)', fontSize: 9,
                letterSpacing: '0.24em', color: 'var(--muted)',
              }}>{m.k}</div>
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
    <Link to={`/project/${nextSlug}`} style={{
      display: 'block', margin: '80px 40px 0',
      padding: '48px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      textDecoration: 'none', color: 'inherit',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)' }}>
          / NEXT PROJECT
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)' }}>
          {String(((idx + 1) % slugs.length) + 1).padStart(2, '0')} / {slugs.length}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 24 }}>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 'clamp(40px, 5vw, 72px)',
          fontWeight: 400, letterSpacing: 'var(--letter)', color: 'var(--fg)', lineHeight: 1,
        }}>
          {next.name}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: '0.18em', color: 'var(--fg)' }}>
          → READ
        </div>
      </div>
      <div style={{ marginTop: 16, fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--muted)', maxWidth: 600, lineHeight: 1.5, fontWeight: 300 }}>
        {next.summary}
      </div>
    </Link>
  );
}

export default function Project() {
  const [dark, setDark] = React.useState(true);
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

  const vars = {
    '--bg': dark ? '#0a0a0a' : '#f5f4ef',
    '--bg-blur': dark ? 'rgba(10,10,10,0.72)' : 'rgba(245,244,239,0.72)',
    '--fg': dark ? '#f2f1ec' : '#131312',
    '--muted': dark ? 'rgba(242,241,236,0.5)' : 'rgba(19,19,18,0.55)',
    '--border': dark ? 'rgba(242,241,236,0.12)' : 'rgba(19,19,18,0.12)',
    '--tile-bg': dark ? '#0e0e0e' : '#e9e8e3',
    '--hover': dark ? 'rgba(242,241,236,0.06)' : 'rgba(19,19,18,0.04)',
    '--sans': FONT.sans, '--mono': FONT.mono, '--letter': FONT.letter,
  };

  if (!p) {
    return (
      <div style={{ ...vars, background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
        <TopBar dark={dark} setDark={setDark} projectName="NOT FOUND" />
        <div style={{ padding: '120px 40px', maxWidth: 700 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 16 }}>/ 404</div>
          <h1 style={{ fontWeight: 400, fontSize: 48, letterSpacing: 'var(--letter)', margin: 0 }}>Project not found.</h1>
          <Link to="/all-works" style={{ display: 'inline-block', marginTop: 32, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}>← BACK TO ALL WORKS</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...vars, background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
      <TopBar dark={dark} setDark={setDark} projectName={p.name} />

      <Hero p={p} />
      <HeroTile p={p} />

      <div style={{ padding: '40px 40px 0' }}>
        {p.sections.map((s, i) => (
          s.kind === 'metrics'
            ? <Metrics key={i} section={s} />
            : <Paragraph key={i} section={s} />
        ))}
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>

      <div style={{ padding: '60px 40px 0' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 16 }}>
          / LINKS
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {p.links.map(l => (
            <a key={l.k} href="#" style={{
              padding: '12px 20px', textDecoration: 'none',
              border: '1px solid var(--border)', borderRadius: 999,
              fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg)',
              transition: 'background .2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {l.k} <span style={{ color: 'var(--muted)', marginLeft: 8 }}>{l.v} →</span>
            </a>
          ))}
        </div>
      </div>

      <NextProject current={slug} projects={PROJECTS} />

      <div style={{
        padding: '32px 40px 40px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)',
      }}>
        <span>© 2026 / Richard</span>
        <span>{p.name} · {p.year}</span>
      </div>
    </div>
  );
}
