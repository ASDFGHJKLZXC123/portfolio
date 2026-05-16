// portfolio.jsx — R's expanded portfolio, editorial dark style
// Sections: hero · selected work (expandable) · about · skills · education · writing · contact
// Sticky top nav w/ section anchors, scroll-reveal on sections, hover-reveal on tiles.

import React from 'react';
import { Link } from 'react-router-dom';
import {
  useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle,
  TweakRadio, TweakColor,
} from '../components/tweaks-panel';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": true,
  "accent": "#d9d9d4",
  "font": "neue",
  "showAbout": true,
  "showSkills": true,
  "showEducation": true,
  "showWriting": true,
  "projectCount": 5
}/*EDITMODE-END*/;

// Project data is loaded from projects.json — see admin.html to add/edit projects
// without touching code. The list below is a fallback for offline preview only.
const PROJECTS_FALLBACK = [
  {
    name: 'INFORM.UCI',
    kind: 'sponsor capstone',
    stack: 'REACT / NODE / POSTGRES',
    year: '2025',
    summary: 'Sponsor-capstone project with a healthcare startup. Built an intake triage tool used by three clinics during pilot.',
    role: 'Full-stack lead · team of 4',
    details: [
      'Designed the intake flow from a 40-question paper form into a 5-minute adaptive questionnaire.',
      'Built the patient dashboard, clinician review queue, and FHIR-compatible export.',
      'Shipped to three pilot clinics; avg. intake time down from 22 → 6 min.',
    ],
    img: 'linear-gradient(135deg,#0b2a3a 0%,#0d3b4f 40%,#1e6580 100%)',
    accent: 'radial-gradient(ellipse at 30% 40%, rgba(80,200,220,.35), transparent 55%)',
  },
  {
    name: 'LATECHEF',
    kind: 'personal · web app',
    stack: 'NEXT / POSTGRES / LLM',
    year: '2025',
    summary: 'Tell it what\'s in your fridge at 2am, it tells you what to cook. Built as a one-weekend project, somehow still used.',
    role: 'Solo',
    details: [
      'Recipe generation via LLM with structured output + pantry state tracker.',
      'Auth, saved recipes, shopping list export. ~800 WAU with zero marketing.',
      'Learned hard lessons about token costs and rate-limit UX.',
    ],
    img: 'linear-gradient(180deg,#1a0f0a 0%,#2a1810 55%,#0a0605 100%)',
    accent: 'radial-gradient(circle at 70% 30%, rgba(220,140,60,.45), transparent 50%)',
  },
  {
    name: 'RAMEN-DB',
    kind: 'coursework · systems',
    stack: 'GO / RAFT / GRPC',
    year: '2024',
    summary: 'A tiny in-memory KV store with Raft consensus, written for ICS 143A. Not production, but the tests pass.',
    role: 'Solo · course project',
    details: [
      'Leader election, log replication, snapshotting.',
      'Linearizable reads, client retry with request IDs.',
      'Passed all 34 Jepsen-ish tests in the course harness.',
    ],
    img: 'linear-gradient(160deg,#0a0a0a 0%,#141414 50%,#0a0a0a 100%)',
    accent: 'repeating-linear-gradient(90deg, transparent 0 2px, rgba(120,255,170,.06) 2px 3px)',
  },
  {
    name: 'PAPERBOAT',
    kind: 'personal · ml',
    stack: 'PYTORCH / FASTAPI',
    year: '2024',
    summary: 'Arxiv paper recommender trained on my reading history. Learned that my taste is more narrow than I thought.',
    role: 'Solo',
    details: [
      'Embedding-based recs using SPECTER; fine-tuned on ~1200 labeled papers.',
      'Daily digest email; one-click feedback loop to update the model.',
      'Offline eval vs. simple tf-idf baseline: recall@10 improved ~18%.',
    ],
    img: 'linear-gradient(135deg,#1a0a2e 0%,#0e0820 40%,#2a1a4a 100%)',
    accent: 'radial-gradient(ellipse at 50% 60%, rgba(180,120,220,.4), transparent 55%)',
  },
  {
    name: 'MIDNIGHT-LOFI',
    kind: 'personal · audio',
    stack: 'WEBAUDIO / TONE.JS',
    year: '2023',
    summary: 'Generative lofi that runs entirely in the browser. No audio files, just math and melancholy.',
    role: 'Solo',
    details: [
      'Markov-chain melody over a rotating chord palette, drums from WebAudio synths.',
      'Rain and tape-hiss generated procedurally.',
      'Shared on HN; front page for ~6 hours.',
    ],
    img: 'linear-gradient(180deg,#0a1a1a 0%,#0f2525 60%,#050f0f 100%)',
    accent: 'radial-gradient(ellipse at 40% 50%, rgba(80,220,180,.3), transparent 60%)',
  },
  { name: 'CLASSY',       kind: 'coursework',      stack: 'SVELTE / SUPABASE',    year: '2024', summary: 'Course planner with prereq graph viz.' },
  { name: 'DORM-SENSOR',  kind: 'hardware',        stack: 'ESP32 / MQTT',         year: '2024', summary: 'ESP32 that yells if you leave the door open.' },
  { name: 'TYPO-HUNTER',  kind: 'tool',            stack: 'RUST / TREE-SITTER',   year: '2023', summary: 'Finds typos in code comments via tree-sitter.' },
];

const SKILLS = [
  { group: 'LANGUAGES',   items: ['TypeScript', 'Python', 'Go', 'Rust', 'C++', 'SQL'] },
  { group: 'FRONTEND',    items: ['React', 'Next.js', 'Svelte', 'Tailwind', 'Framer Motion', 'D3'] },
  { group: 'BACKEND',     items: ['Node', 'FastAPI', 'PostgreSQL', 'Redis', 'gRPC', 'GraphQL'] },
  { group: 'INFRA',       items: ['Docker', 'GitHub Actions', 'Fly.io', 'AWS (S3, EC2, Lambda)', 'Terraform'] },
  { group: 'ML / DATA',   items: ['PyTorch', 'Pandas', 'Embeddings / RAG', 'Jupyter'] },
  { group: 'CRAFT',       items: ['System design', 'API design', 'Product thinking', 'Writing docs that don\'t suck'] },
];

const EDUCATION = {
  school: 'UNIVERSITY OF CALIFORNIA, IRVINE',
  degree: 'B.S. INFORMATICS',
  dept: 'DONALD BREN SCHOOL OF ICS',
  dates: '2021 — 2025',
  note: 'Switched from Computer Science to Informatics in my junior year to weight the coursework toward human-centered systems without losing the fundamentals.',
  coursework: [
    'ICS 139W · Technical Writing',
    'ICS 143A · Operating Systems',
    'ICS 161 · Design of Algorithms',
    'IN4MATX 131 · Human-Computer Interaction',
    'IN4MATX 113 · Requirements Analysis',
    'ICS 184 · Full Stack Web Development',
    'ICS 171 · Intro to Artificial Intelligence',
    'IN4MATX 121 · Software Design',
  ],
  roles: [
    { when: '2024 — 2025', what: 'Peer Academic Advisor, ICS Student Affairs' },
    { when: '2023 — 2024', what: 'Tutor, ICS 31/32/33 (Intro Python sequence)' },
    { when: '2023',        what: 'Hack@UCI · semifinalist, Best Hardware Hack' },
  ],
};

const WRITING = [
  { title: 'What capstone actually taught me', date: 'APR 2025', read: '6 min', tag: 'essay' },
  { title: 'Notes on building Raft from the paper', date: 'DEC 2024', read: '12 min', tag: 'technical' },
  { title: 'Why I switched from CS to Informatics', date: 'OCT 2023', read: '4 min', tag: 'essay' },
  { title: 'A tiny guide to debugging WebAudio', date: 'JUN 2023', read: '8 min', tag: 'technical' },
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isInProgress = (project) => project.status === 'in-progress';

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

const FONTS = {
  neue:  { sans: '"Inter Tight", Helvetica, Arial, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.02em' },
  serif: { sans: '"Fraunces", "Times New Roman", serif',         mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.015em' },
  mono:  { sans: '"JetBrains Mono", ui-monospace, monospace',    mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.01em' },
};

function useReveal() {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { setShown(true); io.disconnect(); return; }
    }, { threshold: 0.12 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, delay = 0, style }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} style={{
      transform: shown ? 'translateY(0)' : 'translateY(16px)',
      opacity: shown ? 1 : 0,
      transition: `transform .8s cubic-bezier(.2,.7,.3,1) ${delay}ms, opacity .8s ease ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

function TopBar({ dark, setDark, active, sections }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      backdropFilter: 'blur(14px) saturate(140%)',
      WebkitBackdropFilter: 'blur(14px) saturate(140%)',
      background: 'var(--bg-blur)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', padding: '16px 40px', fontSize: 11,
        letterSpacing: '0.12em', fontFamily: 'var(--mono)',
      }}>
        <div style={{ justifySelf: 'start' }} />

        <nav style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} style={{
              padding: '6px 10px', borderRadius: 999, textDecoration: 'none',
              fontSize: 10, letterSpacing: '0.15em',
              color: active === s.id ? 'var(--fg)' : 'var(--muted)',
              background: active === s.id ? 'var(--hover)' : 'transparent',
              transition: 'color .2s, background .2s',
            }}>{s.label}</a>
          ))}
          <span style={{ width: 1, height: 14, background: 'var(--border)', margin: '0 6px' }} />
          <div style={{
            display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 999, padding: 2,
          }}>
            <button onClick={() => setDark(true)} style={themeBtn(dark)}>DARK</button>
            <button onClick={() => setDark(false)} style={themeBtn(!dark)}>LIGHT</button>
          </div>
        </nav>

        <Link to="/now" style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg)', textDecoration: 'none' }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: '#7ec97e', boxShadow: '0 0 8px #7ec97e' }} />
          <span>/NOW</span>
        </Link>
      </div>
    </div>
  );
}

const themeBtn = (on) => ({
  border: 'none', padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
  background: on ? 'var(--fg)' : 'transparent',
  color: on ? 'var(--bg)' : 'var(--muted)',
  fontSize: 9, letterSpacing: '0.18em', fontFamily: 'inherit', fontWeight: 600,
  transition: 'background .2s, color .2s',
});

function SectionHead({ index, title, subtitle }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, alignItems: 'baseline',
      paddingBottom: 32, borderBottom: '1px solid var(--border)', marginBottom: 40,
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)' }}>
        / {String(index).padStart(2, '0')}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 8 }}>
          {subtitle}
        </div>
        <h2 style={{
          margin: 0, fontFamily: 'var(--sans)', fontWeight: 400,
          fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: 'var(--letter)',
          lineHeight: 1.1, color: 'var(--fg)',
        }}>{title}</h2>
      </div>
    </div>
  );
}

function CurrentlyStrip() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/now.json`).then((r) => r.ok ? r.json() : null).then((d) => { if (d?.currently) setData(d.currently); }).catch(() => {});
  }, []);
  if (!data?.items?.length) return null;
  const upd = data.updated ? new Date(data.updated + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() : '';
  return (
    <Link to="/now" style={{
      display: 'block', textDecoration: 'none', color: 'inherit',
      margin: '0 40px', padding: '20px 24px',
      border: '1px solid var(--border)', borderRadius: 4,
      background: 'linear-gradient(90deg, rgba(126,201,126,0.04), transparent 60%)',
      transition: 'border-color .25s, background .25s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--fg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7ec97e', boxShadow: '0 0 8px #7ec97e' }} />
          / CURRENTLY {upd && `· ${upd}`}
        </div>
        <div style={{ flex: 1, minWidth: 280, fontSize: 15, color: 'var(--fg)', letterSpacing: 'var(--letter)' }}>
          {data.items.join(' · ')}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)' }}>
          READ JOURNAL →
        </div>
      </div>
    </Link>
  );
}

function Hero() {
  return (
    <div style={{ padding: '80px 40px 60px', maxWidth: 1000 }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em',
        color: 'var(--muted)', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
        AVAILABLE FOR FULL-TIME ROLES · SUMMER 2026
      </div>
      <h1 style={{
        margin: 0, fontFamily: 'var(--sans)', fontWeight: 400,
        fontSize: 'clamp(40px, 4.5vw, 64px)', lineHeight: 1.05,
        letterSpacing: 'var(--letter)', color: 'var(--fg)',
      }}>
        I build full-stack tools for the web —<br />
        <span style={{ color: 'var(--muted)' }}>from polished interfaces to reliable APIs, databases, and internal systems.</span>
      </h1>
      <p style={{
        margin: '28px 0 0', fontFamily: 'var(--sans)', fontWeight: 300,
        fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: 1.5,
        color: 'var(--muted)', maxWidth: 620, letterSpacing: 'var(--letter)',
      }}>
        Recent Informatics grad from UC Irvine’s Bren School of ICS.
        I build full-stack products end-to-end, from APIs and data models
        to interfaces that make complex systems feel usable.
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 40, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em' }}>
        <a href="#work" style={ctaPrimary()}>→ SEE THE WORK</a>
        <a href="#contact" style={ctaGhost()}>↓ GET IN TOUCH</a>
      </div>
    </div>
  );
}

const ctaPrimary = () => ({
  padding: '12px 20px', background: 'var(--fg)', color: 'var(--bg)',
  textDecoration: 'none', borderRadius: 999, fontWeight: 600,
});
const ctaGhost = () => ({
  padding: '12px 20px', border: '1px solid var(--border)', color: 'var(--fg)',
  textDecoration: 'none', borderRadius: 999, fontWeight: 500,
});

function ProjectTile({ project, index, expanded, onToggle }) {
  const n = String(index + 1).padStart(2, '0');
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ gridColumn: expanded ? 'span 2' : 'span 1', transition: 'grid-column .3s' }}>
      <div style={{
          display: 'flex', flexDirection: 'column', gap: 14, cursor: 'pointer',
          position: 'relative',
          transform: hover && !expanded ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'transform .5s cubic-bezier(.2,.7,.3,1)',
        }}
        onClick={onToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{
          position: 'absolute', left: -14, top: 28, bottom: 14, width: 2,
          background: 'var(--fg)',
          transform: hover ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          transition: 'transform .45s cubic-bezier(.2,.7,.3,1)',
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', gap: 8,
        }}>
          <div style={{
            minWidth: 0,
            transform: hover ? 'translateX(6px)' : 'translateX(0)',
            transition: 'transform .4s cubic-bezier(.2,.7,.3,1)',
          }}>
            <div style={{ color: 'var(--fg)', fontWeight: 600, marginBottom: 4 }}>{project.name}</div>
            <div style={{ color: 'var(--muted)', fontWeight: 400 }}>{Array.isArray(project.stack) ? project.stack.join(' / ') : project.stack}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ color: 'var(--muted)', marginBottom: 4 }}>{n}</div>
            <div style={{ color: 'var(--muted)' }}>{project.year}</div>
          </div>
        </div>

        <div style={{
          height: expanded ? 320 : 420, position: 'relative', overflow: 'hidden',
          background: 'var(--tile-bg)',
          border: '1px solid var(--border)',
          borderColor: hover ? 'var(--fg)' : 'var(--border)',
          boxShadow: hover && !expanded ? '0 24px 60px -20px rgba(0,0,0,0.55)' : '0 0 0 rgba(0,0,0,0)',
          transition: 'height .35s cubic-bezier(.2,.7,.3,1), border-color .3s, box-shadow .4s',
        }}>
          <div data-img style={{
            position: 'absolute', inset: 0,
            background: project.img || 'linear-gradient(135deg,#1a1a1a,#0a0a0a)',
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            filter: hover ? 'brightness(1.12) saturate(1.1)' : 'brightness(1) saturate(1)',
            transition: 'transform .8s cubic-bezier(.2,.7,.3,1), filter .5s',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 100%, rgba(255,255,255,0.18), transparent 60%)',
            opacity: hover ? 1 : 0,
            transition: 'opacity .5s',
            pointerEvents: 'none',
          }} />
          {project.accent && (
            <div style={{ position: 'absolute', inset: 0, background: project.accent, mixBlendMode: 'screen', pointerEvents: 'none' }} />
          )}
          <div style={{ position: 'absolute', top: 10, left: 12, zIndex: 2 }}>
            <StatusPill project={project} onImage />
          </div>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.012) 2px 3px)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: 10, left: 12,
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em',
            color: hover ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)',
            transform: hover ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'color .3s, transform .4s',
          }}>
            — {project.kind.toUpperCase()}
          </div>
          <div style={{
            position: 'absolute', top: 10, right: 12,
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.85)',
            padding: '3px 8px',
            border: '1px solid rgba(255,255,255,0.25)',
            background: hover && !expanded ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0)',
            borderRadius: 999,
            transform: hover && !expanded ? 'translateX(-4px)' : 'translateX(0)',
            transition: 'background .3s, transform .4s, border-color .3s',
          }}>
            {expanded ? '— CLOSE' : (hover ? '→ READ MORE' : '+ READ MORE')}
          </div>
          <div style={{
            position: 'absolute', right: 14, bottom: 14,
            fontFamily: 'var(--sans)', fontSize: 96, fontWeight: 300,
            color: 'rgba(255,255,255,0.18)', lineHeight: 1, letterSpacing: '-0.04em',
            opacity: hover && !expanded ? 1 : 0,
            transform: hover && !expanded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .5s, transform .6s cubic-bezier(.2,.7,.3,1)',
            pointerEvents: 'none',
          }}>
            {n}
          </div>
        </div>

        <div style={{
          maxHeight: expanded ? 400 : 0, overflow: 'hidden',
          transition: 'max-height .4s cubic-bezier(.2,.7,.3,1), opacity .3s',
          opacity: expanded ? 1 : 0,
        }}>
          <div style={{
            padding: '18px 4px 4px', display: 'grid',
            gridTemplateColumns: '1fr 2fr', gap: 24,
            fontFamily: 'var(--sans)',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span>{project.role}</span>
                <StatusPill project={project} />
              </div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--fg)', letterSpacing: 'var(--letter)' }}>
              <div style={{ marginBottom: 14 }}>{project.summary}</div>
              {project.details && (
                <ul style={{ margin: 0, paddingLeft: 16, color: 'var(--muted)' }}>
                  {project.details.map((d, i) => <li key={i} style={{ marginBottom: 6 }}>{d}</li>)}
                </ul>
              )}
              <div style={{ display: 'flex', gap: 14, marginTop: 18, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em' }}>
                <a href="#" style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}>SOURCE →</a>
                <Link to={`/project/${slugify(project.name)}`} style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}>CASE STUDY →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchiveRow({ project, index }) {
  const n = String(index + 1).padStart(2, '0');
  return (
    <Link to={`/project/${slugify(project.name)}`} style={{
      display: 'grid',
      gridTemplateColumns: '40px minmax(0, 1.5fr) minmax(0, 2fr) minmax(0, 1.5fr) 60px',
      alignItems: 'baseline', gap: 16,
      padding: '18px 0',
      borderTop: '1px solid var(--border)',
      fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em',
      cursor: 'pointer', transition: 'color .2s, padding .2s',
      textDecoration: 'none',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.paddingLeft = '8px'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = ''; e.currentTarget.style.paddingLeft = '0'; }}
    >
      <span style={{ color: 'var(--muted)' }}>{n}</span>
      <span style={{ color: 'var(--fg)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span>{project.name}</span>
        <StatusPill project={project} />
      </span>
      <span style={{ color: 'var(--muted)' }}>{project.summary || project.kind.toUpperCase()}</span>
      <span style={{ color: 'var(--muted)' }}>{Array.isArray(project.stack) ? project.stack.join(' / ') : project.stack}</span>
      <span style={{ color: 'var(--muted)', textAlign: 'right' }}>{project.year}</span>
    </Link>
  );
}

function About() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40, alignItems: 'start' }}>
      <div style={{ position: 'sticky', top: 100 }}>
        <div style={{
          width: '100%', aspectRatio: '1 / 1.2', maxWidth: 260,
          background: 'linear-gradient(165deg, #1a1a1a 0%, #0a0a0a 100%)',
          border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 40%, rgba(242,241,236,0.08), transparent 60%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 10, left: 12,
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)',
          }}>— R, CIRCA 2025</div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: 1.55, letterSpacing: 'var(--letter)', color: 'var(--fg)', fontWeight: 300, maxWidth: 640 }}>
        <p style={{ marginTop: 0 }}>
          I came to UCI as a Computer Science major, stayed for the systems
          courses, and switched to Informatics halfway through because the
          questions I kept coming back to were less about software in isolation
          and more about what happens when it meets people. In practice, I
          don’t think the distinction matters much — I still write the code —
          but the framing stuck.
        </p>
        <p>
          I didn’t take the traditional internship route. Instead, I chose
          the sponsor-capstone track, where I worked with a real team on a
          real product that clinicians now use. It was the best thing I did
          in undergrad.
        </p>
        <p style={{ color: 'var(--muted)' }}>
          Outside of work, I cook too much, read more systems papers than is
          probably healthy, and keep trying to learn Rust for real this time.
        </p>
        <div style={{
          marginTop: 32, padding: '20px 24px',
          border: '1px solid var(--border)',
          display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12,
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em',
        }}>
          <span style={{ color: 'var(--muted)' }}>NOW</span>
          <span style={{ color: 'var(--fg)' }}>Finishing capstone · reading the Raft paper (again) · job-hunting</span>
          <span style={{ color: 'var(--muted)' }}>BASED</span>
          <span style={{ color: 'var(--fg)' }}>Irvine, CA · open to relocation (SF, NYC, remote)</span>
          <span style={{ color: 'var(--muted)' }}>SEEKING</span>
          <span style={{ color: 'var(--fg)' }}>Full-stack or infra roles at small/mid product teams</span>
        </div>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
      {SKILLS.map((group) => (
        <div key={group.group}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em',
            color: 'var(--muted)', paddingBottom: 12, marginBottom: 16,
            borderBottom: '1px solid var(--border)',
          }}>
            / {group.group}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {group.items.map((item) => (
              <div key={item} style={{
                fontFamily: 'var(--sans)', fontSize: 15, letterSpacing: 'var(--letter)',
                color: 'var(--fg)', fontWeight: 400,
              }}>{item}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Education() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40, alignItems: 'start' }}>
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 8 }}>
          {EDUCATION.dates}
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 22, letterSpacing: 'var(--letter)', color: 'var(--fg)', fontWeight: 400, lineHeight: 1.15 }}>
          {EDUCATION.school}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--muted)', marginTop: 12, lineHeight: 1.6 }}>
          {EDUCATION.degree}<br />{EDUCATION.dept}
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--muted)', marginTop: 24, lineHeight: 1.55, letterSpacing: 'var(--letter)', fontWeight: 300 }}>
          {EDUCATION.note}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 12 }}>
            / SELECTED COURSEWORK
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
            {EDUCATION.coursework.map((c) => (
              <div key={c} style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--fg)', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Writing() {
  return (
    <div>
      {WRITING.map((post, i) => (
        <a key={post.title} href="#" style={{
          display: 'grid', gridTemplateColumns: '80px 1fr auto 60px', gap: 24,
          alignItems: 'baseline', padding: '24px 0',
          borderTop: '1px solid var(--border)',
          borderBottom: i === WRITING.length - 1 ? '1px solid var(--border)' : 'none',
          textDecoration: 'none', transition: 'padding-left .3s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = '12px'; }}
          onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = '0'; }}
        >
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)' }}>
            {post.date}
          </span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(18px, 1.7vw, 24px)', letterSpacing: 'var(--letter)', color: 'var(--fg)', fontWeight: 400 }}>
            {post.title}
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)', padding: '2px 8px', border: '1px solid var(--border)', borderRadius: 999 }}>
            {post.tag}
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)', textAlign: 'right' }}>
            {post.read}
          </span>
        </a>
      ))}
    </div>
  );
}

function Contact() {
  return (
    <div style={{ padding: '20px 0 0' }}>
      <div style={{
        fontFamily: 'var(--sans)', fontSize: 'clamp(40px, 4.5vw, 64px)',
        letterSpacing: 'var(--letter)', color: 'var(--fg)', fontWeight: 400, lineHeight: 1.05,
      }}>
        Got something to<br />build together?
      </div>
      <div style={{
        fontFamily: 'var(--sans)', fontSize: 'clamp(16px, 1.4vw, 19px)',
        color: 'var(--muted)', fontWeight: 300, marginTop: 24, maxWidth: 560, lineHeight: 1.5, letterSpacing: 'var(--letter)',
      }}>
        The fastest way to reach me is email. I usually reply within a day,
        sometimes two if I'm shipping. No subject line required.
      </div>

      <div style={{
        marginTop: 40, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        border: '1px solid var(--border)',
      }}>
        {[
          { k: 'EMAIL',    v: 'r@r.systems',        href: 'mailto:r@r.systems' },
          { k: 'GITHUB',   v: 'github.com/r',       href: '#' },
          { k: 'LINKEDIN', v: 'linkedin.com/in/r',  href: '#' },
          { k: 'RESUME',   v: 'resume.pdf ↓',       href: '#' },
        ].map((c, i) => (
          <a key={c.k} href={c.href} style={{
            padding: '32px 28px', textDecoration: 'none',
            borderRight: i < 3 ? '1px solid var(--border)' : 'none',
            display: 'flex', flexDirection: 'column', gap: 10,
            transition: 'background .2s',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)' }}>{c.k}</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 18, color: 'var(--fg)', letterSpacing: 'var(--letter)' }}>{c.v}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div style={{
      marginTop: 80, padding: '32px 40px 40px', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      borderTop: '1px solid var(--border)',
      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)',
    }}>
      <span>© 2026 / R · BUILT IN REACT + TOO MUCH COFFEE</span>
      <span>LAST SYNC · 04.26</span>
    </div>
  );
}

export default function Portfolio() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [expanded, setExpanded] = React.useState(null);
  const [active, setActive] = React.useState('work');
  const [PROJECTS, setProjects] = React.useState(PROJECTS_FALLBACK);
  const fonts = FONTS[t.font] || FONTS.neue;
  const dark = t.dark;

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/projects.json`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data && data.projects) setProjects(data.projects); })
      .catch(() => {});
  }, []);

  const featured = PROJECTS.slice(0, t.projectCount);
  const extra = PROJECTS.slice(t.projectCount);

  const sections = [
    { id: 'work',      label: 'WORK',      show: true },
    { id: 'about',     label: 'ABOUT',     show: t.showAbout },
    { id: 'skills',    label: 'SKILLS',    show: t.showSkills },
    { id: 'education', label: 'EDUCATION', show: t.showEducation },
    { id: 'writing',   label: 'WRITING',   show: t.showWriting },
    { id: 'contact',   label: 'CONTACT',   show: true },
  ].filter((s) => s.show);

  React.useEffect(() => {
    const ids = sections.map((s) => s.id);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) setActive(e.target.id);
      }
    }, { rootMargin: '-30% 0% -60% 0%', threshold: 0 });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [sections.map((s) => s.id).join(',')]);

  const vars = {
    '--bg': dark ? '#0a0a0a' : '#f5f4ef',
    '--bg-blur': dark ? 'rgba(10,10,10,0.72)' : 'rgba(245,244,239,0.72)',
    '--fg': dark ? '#f2f1ec' : '#131312',
    '--muted': dark ? 'rgba(242,241,236,0.5)' : 'rgba(19,19,18,0.55)',
    '--border': dark ? 'rgba(242,241,236,0.12)' : 'rgba(19,19,18,0.12)',
    '--tile-bg': dark ? '#0e0e0e' : '#e9e8e3',
    '--hover': dark ? 'rgba(242,241,236,0.06)' : 'rgba(19,19,18,0.04)',
    '--accent': t.accent,
    '--sans': fonts.sans, '--mono': fonts.mono, '--letter': fonts.letter,
  };

  let sectionIdx = 0;
  const nextIdx = () => ++sectionIdx;

  return (
    <div style={{ ...vars, background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
      <TopBar dark={dark} setDark={(v) => setTweak('dark', v)} active={active} sections={sections} />

      <Hero />

      <CurrentlyStrip />

      <section id="work" style={{ padding: '40px 40px 0', scrollMarginTop: 80 }}>
        <Reveal><SectionHead index={nextIdx()} title="Selected work" subtitle="— EIGHT THINGS, FIVE I'D SHOW A RECRUITER" /></Reveal>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(featured.length, 5)}, minmax(0, 1fr))`,
          gap: 24,
          transition: 'grid-template-columns .3s',
        }}>
          {featured.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}>
              <ProjectTile
                project={p} index={i}
                expanded={expanded === p.name}
                onToggle={() => setExpanded(expanded === p.name ? null : p.name)}
              />
            </Reveal>
          ))}
        </div>
        {extra.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 8 }}>
              / ARCHIVE — {extra.length} MORE
            </div>
            {extra.map((p, i) => <ArchiveRow key={p.name} project={p} index={featured.length + i} />)}
            <div style={{ borderTop: '1px solid var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
              <Link to="/all-works" style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '16px 28px', textDecoration: 'none',
                border: '1px solid var(--border)', borderRadius: 999,
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
                color: 'var(--fg)', transition: 'background .2s, padding .2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover)'; e.currentTarget.style.paddingLeft = '32px'; e.currentTarget.style.paddingRight = '32px'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.paddingLeft = '28px'; e.currentTarget.style.paddingRight = '28px'; }}
              >
                <span>VIEW ALL WORKS</span>
                <span style={{ fontFamily: 'var(--mono)' }}>→</span>
              </Link>
            </div>
          </div>
        )}
      </section>

      {t.showAbout && (
        <section id="about" style={{ padding: '120px 40px 0', scrollMarginTop: 80 }}>
          <Reveal><SectionHead index={nextIdx()} title="About" subtitle="— WHO, WHERE, AND WHY" /></Reveal>
          <Reveal delay={100}><About /></Reveal>
        </section>
      )}

      {t.showSkills && (
        <section id="skills" style={{ padding: '120px 40px 0', scrollMarginTop: 80 }}>
          <Reveal><SectionHead index={nextIdx()} title="Stack" subtitle="— WHAT I REACH FOR" /></Reveal>
          <Reveal delay={100}><Skills /></Reveal>
        </section>
      )}

      {t.showEducation && (
        <section id="education" style={{ padding: '120px 40px 0', scrollMarginTop: 80 }}>
          <Reveal><SectionHead index={nextIdx()} title="Education" subtitle="— FOUR YEARS, ONE DEGREE, ZERO REGRETS" /></Reveal>
          <Reveal delay={100}><Education /></Reveal>
        </section>
      )}

      {t.showWriting && (
        <section id="writing" style={{ padding: '120px 40px 0', scrollMarginTop: 80 }}>
          <Reveal><SectionHead index={nextIdx()} title="Writing" subtitle="— NOTES FROM BUILDING THINGS" /></Reveal>
          <Reveal delay={100}><Writing /></Reveal>
        </section>
      )}

      <section id="contact" style={{ padding: '140px 40px 0', scrollMarginTop: 80 }}>
        <Reveal><SectionHead index={nextIdx()} title="Contact" subtitle="— SAY HELLO" /></Reveal>
        <Reveal delay={100}><Contact /></Reveal>
      </section>

      <Footer />

      <TweaksPanel title="style">
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak('dark', v)} />
        <TweakColor  label="Accent"    value={t.accent} onChange={(v) => setTweak('accent', v)} />

        <TweakSection label="Typography" />
        <TweakRadio label="Typeface" value={t.font}
          options={[{ value: 'neue', label: 'neue' }, { value: 'serif', label: 'serif' }, { value: 'mono', label: 'mono' }]}
          onChange={(v) => setTweak('font', v)} />

        <TweakSection label="Sections" />
        <TweakToggle label="About"     value={t.showAbout}     onChange={(v) => setTweak('showAbout', v)} />
        <TweakToggle label="Skills"    value={t.showSkills}    onChange={(v) => setTweak('showSkills', v)} />
        <TweakToggle label="Education" value={t.showEducation} onChange={(v) => setTweak('showEducation', v)} />
        <TweakToggle label="Writing"   value={t.showWriting}   onChange={(v) => setTweak('showWriting', v)} />

        <TweakSection label="Work" />
        <TweakSlider label="Featured count" value={t.projectCount} min={3} max={5}
          onChange={(v) => setTweak('projectCount', v)} />
      </TweaksPanel>
    </div>
  );
}
