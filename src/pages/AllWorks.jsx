// all-works.jsx — full archive of every project, same editorial dark style.
// Project data is loaded from projects.json. The fallback below is for offline preview only.

import React from 'react';
import { Link } from 'react-router-dom';

const PROJECTS_FALLBACK = [
  { name: 'INFORM.UCI',   kind: 'sponsor capstone',     stack: 'REACT / NODE / POSTGRES',    year: '2025',
    summary: 'Sponsor-capstone project with a healthcare startup. Intake triage tool used by three pilot clinics.',
    role: 'Full-stack lead · team of 4',
    img: 'linear-gradient(135deg,#0b2a3a 0%,#0d3b4f 40%,#1e6580 100%)',
    accent: 'radial-gradient(ellipse at 30% 40%, rgba(80,200,220,.35), transparent 55%)' },
  { name: 'LATECHEF',     kind: 'personal · web app',    stack: 'NEXT / POSTGRES / LLM',     year: '2025',
    summary: 'Tell it what\'s in your fridge at 2am, it tells you what to cook.',
    role: 'Solo',
    img: 'linear-gradient(180deg,#1a0f0a 0%,#2a1810 55%,#0a0605 100%)',
    accent: 'radial-gradient(circle at 70% 30%, rgba(220,140,60,.45), transparent 50%)' },
  { name: 'RAMEN-DB',     kind: 'coursework · systems', stack: 'GO / RAFT / GRPC',           year: '2024',
    summary: 'A tiny in-memory KV store with Raft consensus. Course project for ICS 143A.',
    role: 'Solo · course project',
    img: 'linear-gradient(160deg,#0a0a0a 0%,#141414 50%,#0a0a0a 100%)',
    accent: 'repeating-linear-gradient(90deg, transparent 0 2px, rgba(120,255,170,.06) 2px 3px)' },
  { name: 'PAPERBOAT',    kind: 'personal · ml',         stack: 'PYTORCH / FASTAPI',          year: '2024',
    summary: 'Arxiv paper recommender trained on my reading history.',
    role: 'Solo',
    img: 'linear-gradient(135deg,#1a0a2e 0%,#0e0820 40%,#2a1a4a 100%)',
    accent: 'radial-gradient(ellipse at 50% 60%, rgba(180,120,220,.4), transparent 55%)' },
  { name: 'MIDNIGHT-LOFI', kind: 'personal · audio',     stack: 'WEBAUDIO / TONE.JS',         year: '2023',
    summary: 'Generative lofi that runs entirely in the browser.',
    role: 'Solo',
    img: 'linear-gradient(180deg,#0a1a1a 0%,#0f2525 60%,#050f0f 100%)',
    accent: 'radial-gradient(ellipse at 40% 50%, rgba(80,220,180,.3), transparent 60%)' },
  { name: 'CLASSY',        kind: 'coursework',           stack: 'SVELTE / SUPABASE',          year: '2024',
    summary: 'Course planner with prereq graph viz.',
    role: 'Solo · ICS 184',
    img: 'linear-gradient(135deg,#1a1a0a 0%,#252510 50%,#0a0a05 100%)',
    accent: 'radial-gradient(ellipse at 60% 40%, rgba(220,200,80,.35), transparent 55%)' },
  { name: 'DORM-SENSOR',   kind: 'hardware',             stack: 'ESP32 / MQTT',               year: '2024',
    summary: 'ESP32 that yells if you leave the door open.',
    role: 'Hack@UCI · team of 2',
    img: 'linear-gradient(135deg,#0a0a1a 0%,#101025 50%,#05050f 100%)',
    accent: 'radial-gradient(ellipse at 50% 50%, rgba(120,140,255,.3), transparent 60%)' },
  { name: 'TYPO-HUNTER',   kind: 'tool',                 stack: 'RUST / TREE-SITTER',         year: '2023',
    summary: 'Finds typos in code comments via tree-sitter.',
    role: 'Solo',
    img: 'linear-gradient(180deg,#1a0a0f 0%,#250f15 60%,#0a0508 100%)',
    accent: 'radial-gradient(ellipse at 30% 60%, rgba(220,80,140,.35), transparent 55%)' },
];

const FONT = { sans: '"Inter Tight", Helvetica, Arial, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.02em' };

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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

function TopBar({ dark, setDark }) {
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
        <Link to="/" style={{ justifySelf: 'start', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg)' }}>
          <span style={{ color: 'var(--muted)' }}>←</span>
          <span>R.SYSTEMS</span>
          <span style={{ color: 'var(--muted)' }}>/FULL-STACK</span>
        </Link>
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

function WorkCard({ project, index }) {
  const n = String(index + 1).padStart(2, '0');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 32, padding: '40px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', paddingTop: 4 }}>
        / {n}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'start' }}>
        <Link to={`/project/${slugify(project.name)}`} style={{
          height: 280, position: 'relative', overflow: 'hidden',
          background: 'var(--tile-bg)', border: '1px solid var(--border)',
          cursor: 'pointer', textDecoration: 'none', display: 'block',
        }}
          onMouseEnter={(e) => { const im = e.currentTarget.querySelector('[data-img]'); if (im) { im.style.transform = 'scale(1.04)'; im.style.filter = 'brightness(1.1)'; } }}
          onMouseLeave={(e) => { const im = e.currentTarget.querySelector('[data-img]'); if (im) { im.style.transform = 'scale(1)'; im.style.filter = 'brightness(1)'; } }}
        >
          <div data-img style={{
            position: 'absolute', inset: 0, background: project.img,
            transition: 'transform .6s cubic-bezier(.2,.7,.3,1), filter .4s',
          }} />
          {project.accent && <div style={{ position: 'absolute', inset: 0, background: project.accent, mixBlendMode: 'screen', pointerEvents: 'none' }} />}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.012) 2px 3px)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: 10, left: 12,
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)',
          }}>
            — {project.kind.toUpperCase()}
          </div>
        </Link>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)', marginBottom: 16 }}>
            <span>{project.role}</span>
            <span>{project.year}</span>
          </div>
          <Link to={`/project/${slugify(project.name)}`} style={{
            fontFamily: 'var(--sans)', fontSize: 'clamp(24px, 2.4vw, 32px)',
            letterSpacing: 'var(--letter)', color: 'var(--fg)', fontWeight: 400,
            lineHeight: 1.1, marginBottom: 16, display: 'block',
            textDecoration: 'none', transition: 'opacity .2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            {project.name}
          </Link>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.55, color: 'var(--muted)', letterSpacing: 'var(--letter)', fontWeight: 300, marginBottom: 24 }}>
            {project.summary}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg)', marginBottom: 20, padding: '6px 10px', display: 'inline-block', border: '1px solid var(--border)', borderRadius: 999 }}>
            {Array.isArray(project.stack) ? project.stack.join(' / ') : project.stack}
          </div>
          <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em' }}>
            <a href="#" style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}>LIVE →</a>
            <a href="#" style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}>SOURCE →</a>
            <Link to={`/project/${slugify(project.name)}`} style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}>CASE STUDY →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AllWorks() {
  const [dark, setDark] = React.useState(true);
  const [PROJECTS, setProjects] = React.useState([]);

  React.useEffect(() => {
    fetch('/data/projects.json')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data && data.projects) setProjects(data.projects); })
      .catch(() => {});
  }, []);

  const projectsList = PROJECTS.length ? PROJECTS : PROJECTS_FALLBACK;

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
  return (
    <div style={{ ...vars, background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
      <TopBar dark={dark} setDark={setDark} />

      <div style={{ padding: '80px 40px 40px', maxWidth: 1100 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 24 }}>
          / ALL WORKS — {projectsList.length} PROJECTS · 2023 — 2025
        </div>
        <h1 style={{
          margin: 0, fontFamily: 'var(--sans)', fontWeight: 400,
          fontSize: 'clamp(40px, 4.5vw, 64px)', lineHeight: 1.05,
          letterSpacing: 'var(--letter)', color: 'var(--fg)',
        }}>
          Everything I've built —<br />
          <span style={{ color: 'var(--muted)' }}>shipped, half-shipped, or learned from.</span>
        </h1>
      </div>

      <div style={{ padding: '40px 40px 80px' }}>
        {projectsList.map((p, i) => (
          <Reveal key={p.name} delay={i * 40}>
            <WorkCard project={p} index={i} />
          </Reveal>
        ))}
        <div style={{ borderTop: '1px solid var(--border)' }} />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '16px 28px', textDecoration: 'none',
            border: '1px solid var(--border)', borderRadius: 999,
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
            color: 'var(--fg)', transition: 'background .2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontFamily: 'var(--mono)' }}>←</span>
            <span>BACK TO PORTFOLIO</span>
          </Link>
        </div>
      </div>

      <div style={{
        padding: '32px 40px 40px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid var(--border)',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)',
      }}>
        <span>© 2026 / R</span>
        <span>LAST SYNC · 04.26</span>
      </div>
    </div>
  );
}
