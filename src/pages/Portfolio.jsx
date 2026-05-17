// portfolio.jsx — R's portfolio, editorial dark style
// Sections: hero · selected engineering work · about · skills · education · contact
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
  "projectCount": 3
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
  { group: 'Languages', items: ['TypeScript', 'Python', 'Go', 'SQL'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind'] },
  { group: 'Backend & Data', items: ['FastAPI', 'Node.js', 'PostgreSQL', 'Redis'] },
  { group: 'Systems & Infra', items: ['Docker', 'AWS', 'GitHub Actions', 'API Design', 'System Design'] },
];

const EDUCATION = {
  school: 'University of California, Irvine',
  degree: 'B.S. Informatics',
  dept: 'Donald Bren School of Information & Computer Sciences',
  dates: '2023–2026',
  note: 'Built on a Computer Science foundation with coursework across systems, algorithms, full-stack development, and human-centered software design.',
  coursework: ['Operating Systems', 'Algorithms', 'Full-Stack Web Development', 'Human-Computer Interaction'],
};

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

        <div style={{ justifySelf: 'end' }} />
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

function Hero() {
  return (
    <div style={{ padding: '80px 40px 60px', maxWidth: 1000 }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em',
        color: 'var(--muted)', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
        Software Engineer (Full-Stack) · Available Summer 2026
      </div>
      <h1 style={{
        margin: 0, fontFamily: 'var(--sans)', fontWeight: 400,
        fontSize: 'clamp(40px, 4.5vw, 64px)', lineHeight: 1.05,
        letterSpacing: 'var(--letter)', color: 'var(--fg)',
      }}>
        Full-Stack Engineer Building Reliable Web Systems
      </h1>
      <p style={{
        margin: '28px 0 0', fontFamily: 'var(--sans)', fontWeight: 300,
        fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: 1.5,
        color: 'var(--muted)', maxWidth: 620, letterSpacing: 'var(--letter)',
      }}>
        Recent Informatics graduate from UC Irvine. I design and ship
        end-to-end web systems, from APIs and data models to interfaces
        that make complex workflows clear and usable.
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 40, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em' }}>
        <a href="#work" style={ctaPrimary()}>SEE THE WORK</a>
        <a href="#" style={ctaGhost()}>VIEW RESUME</a>
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

function ProjectTile({ project }) {
  const [hover, setHover] = React.useState(false);
  const stack = Array.isArray(project.stack) ? project.stack.slice(0, 3).join(' · ') : project.stack;
  const sourceHref = project.source || project.github || '#';
  return (
    <article>
      <div style={{
          display: 'flex', flexDirection: 'column', gap: 18,
          position: 'relative',
          transform: hover ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'transform .5s cubic-bezier(.2,.7,.3,1)',
        }}
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
          height: 240, position: 'relative', overflow: 'hidden',
          background: 'var(--tile-bg)',
          border: '1px solid var(--border)',
          borderColor: hover ? 'var(--fg)' : 'var(--border)',
          boxShadow: hover ? '0 22px 52px -28px rgba(0,0,0,0.65)' : '0 0 0 rgba(0,0,0,0)',
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
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--sans)', fontSize: 22, lineHeight: 1.15, fontWeight: 400, letterSpacing: 'var(--letter)', color: 'var(--fg)' }}>
              {project.name}
            </h3>
            <div style={{ marginTop: 10, fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.5, letterSpacing: '0.08em', color: 'var(--fg)' }}>
              <span style={{ color: 'var(--muted)' }}>Stack: </span>{stack}
            </div>
          </div>
          <p style={{
            margin: 0, fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.55,
            color: 'var(--muted)', letterSpacing: 'var(--letter)',
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            <span style={{ color: 'var(--fg)' }}>Summary: </span>{project.summary}
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em' }}>
            <Link to={`/project/${slugify(project.name)}`} style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
              VIEW CASE STUDY →
            </Link>
            <a
              href={sourceHref}
              onClick={(e) => { if (sourceHref === '#') e.preventDefault(); }}
              style={{ color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              SOURCE →
            </a>
          </div>
        </div>
      </div>
    </article>
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
          }}>Richard Zhang · 2025</div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: 1.55, letterSpacing: 'var(--letter)', color: 'var(--fg)', fontWeight: 300, maxWidth: 640 }}>
        <p style={{ marginTop: 0 }}>
          I’m a recent Informatics graduate from UC Irvine with a Computer
          Science and systems foundation. My work sits between backend
          engineering and product-facing software: APIs, data models, and
          interfaces that make complex workflows usable. I’m looking for
          entry-level roles where I can build reliable web systems and grow
          across backend, full-stack, and infrastructure work.
        </p>
        <div style={{
          marginTop: 32, padding: '22px 24px',
          border: '1px solid var(--border)',
          display: 'grid', gridTemplateColumns: '112px 1fr', gap: '14px 18px',
          alignItems: 'baseline',
        }}>
          <span style={{ color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em' }}>BASED</span>
          <span style={{ color: 'var(--fg)', fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.45, letterSpacing: 'var(--letter)' }}>Irvine, CA · Open to relocation and remote work</span>
          <span style={{ color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em' }}>SEEKING</span>
          <span style={{ color: 'var(--fg)', fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.45, letterSpacing: 'var(--letter)' }}>Entry-level backend, full-stack, or infrastructure software roles</span>
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
            / {group.group.toUpperCase()}
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
    <div className="education-layout">
      <div>
        <h3 id="education-degree" style={{ margin: 0, fontFamily: 'var(--sans)', fontSize: 'clamp(22px, 2.2vw, 30px)', letterSpacing: 'var(--letter)', color: 'var(--fg)', fontWeight: 400, lineHeight: 1.15 }}>
          {EDUCATION.school} <span aria-hidden="true">·</span> {EDUCATION.degree}
        </h3>
        <p aria-label={`${EDUCATION.dept}, ${EDUCATION.dates}`} style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--muted)', margin: '14px 0 0', lineHeight: 1.7 }}>
          <span>{EDUCATION.dept}</span>
          <span aria-hidden="true"> · </span>
          <span>{EDUCATION.dates}</span>
        </p>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--fg)', margin: '28px 0 0', lineHeight: 1.6, letterSpacing: 'var(--letter)', fontWeight: 400, maxWidth: 620 }}>
          {EDUCATION.note}
        </p>
      </div>
      <div>
        <h4 id="education-coursework" style={{ margin: '0 0 14px', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase' }}>
          <span aria-hidden="true">/ </span>Coursework
        </h4>
        <ul className="education-course-list" aria-labelledby="education-coursework">
          {EDUCATION.coursework.map((course) => (
            <li key={course}>{course}</li>
          ))}
        </ul>
      </div>
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
        Let’s connect about software engineering roles
      </div>
      <div style={{
        fontFamily: 'var(--sans)', fontSize: 'clamp(16px, 1.4vw, 19px)',
        color: 'var(--muted)', fontWeight: 300, marginTop: 24, maxWidth: 560, lineHeight: 1.5, letterSpacing: 'var(--letter)',
      }}>
        Email is the best way to reach me. I’m open to entry-level backend,
        full-stack, and infrastructure-oriented software engineering roles.
      </div>

      <div style={{
        marginTop: 40, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        border: '1px solid var(--border)',
      }}>
        {[
          { k: 'EMAIL',    v: 'yonghuz1@uci.edu', href: 'mailto:yonghuz1@uci.edu' },
          { k: 'GITHUB',   v: 'github.com/ASDFGHJKLZXC123', href: 'https://github.com/ASDFGHJKLZXC123' },
          { k: 'LINKEDIN', v: 'linkedin.com/in/richard-zhang-7ba1802b3', href: 'https://linkedin.com/in/richard-zhang-7ba1802b3' },
        ].map((c, i) => (
          <a
            key={c.k}
            href={c.href}
            target={c.href.startsWith('https://') ? '_blank' : undefined}
            rel={c.href.startsWith('https://') ? 'noreferrer' : undefined}
            onClick={(e) => { if (c.href === '#') e.preventDefault(); }}
            style={{
            padding: '32px 28px', textDecoration: 'none',
            borderRight: i < 2 ? '1px solid var(--border)' : 'none',
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

      <section id="work" style={{ padding: '40px 40px 0', scrollMarginTop: 80 }}>
        <Reveal><SectionHead index={nextIdx()} title="Selected Engineering Work" subtitle="Systems-focused projects with emphasis on reliability, data, and APIs" /></Reveal>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 32,
          transition: 'grid-template-columns .3s',
        }}>
          {featured.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}>
              <ProjectTile project={p} />
            </Reveal>
          ))}
        </div>
        {extra.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56 }}>
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
                <span>VIEW ALL PROJECTS →</span>
              </Link>
          </div>
        )}
      </section>

      {t.showAbout && (
        <section id="about" style={{ padding: '120px 40px 0', scrollMarginTop: 80 }}>
          <Reveal><SectionHead index={nextIdx()} title="About" subtitle="Background and focus" /></Reveal>
          <Reveal delay={100}><About /></Reveal>
        </section>
      )}

      {t.showSkills && (
        <section id="skills" style={{ padding: '120px 40px 0', scrollMarginTop: 80 }}>
          <Reveal><SectionHead index={nextIdx()} title="Technical Stack" subtitle="Tools and practices behind my selected work" /></Reveal>
          <Reveal delay={100}><Skills /></Reveal>
        </section>
      )}

      {t.showEducation && (
        <section id="education" style={{ padding: '120px 40px 0', scrollMarginTop: 80 }}>
          <Reveal><SectionHead index={nextIdx()} title="Education" subtitle="Academic background" /></Reveal>
          <Reveal delay={100}><Education /></Reveal>
        </section>
      )}

      <section id="contact" style={{ padding: '140px 40px 0', scrollMarginTop: 80 }}>
        <Reveal><SectionHead index={nextIdx()} title="Contact" subtitle="Hiring contact" /></Reveal>
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

        <TweakSection label="Work" />
        <TweakSlider label="Featured count" value={t.projectCount} min={3} max={5}
          onChange={(v) => setTweak('projectCount', v)} />
      </TweaksPanel>
    </div>
  );
}
