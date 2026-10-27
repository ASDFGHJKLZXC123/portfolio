// portfolio.jsx — Richard's portfolio, terminal / hacker style
// Sections: hero · selected engineering work · about · skills · education · contact
// Sticky shell-prompt nav, typed hero, window-chrome panels, scroll-reveal on sections.

import React from 'react';
import { Link } from 'react-router-dom';
import {
  useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle,
  TweakRadio, TweakColor,
} from '../components/tweaks-panel';
import { projectImageBackground } from '../lib/project-image';
import { externalLinkProps, isUsableHref, projectSlug, projectSourceHref } from '../lib/project-links';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": true,
  "accent": "#39ff88",
  "font": "mono",
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
    year: '2026',
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
    year: '2026',
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
  { group: 'Languages', items: ['TypeScript', 'Python', 'Go', 'C++', 'Java', 'SQL'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind', 'HTML', 'CSS'] },
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
const pad2 = (n) => String(n).padStart(2, '0');
const hex = (n) => `0x${pad2(n)}`;

function StatusPill({ project, onImage = false }) {
  if (!isInProgress(project)) return null;
  return (
    <span className={`geek-pill${onImage ? ' geek-pill--img' : ''}`}>
      <span className="geek-pill-dot" />IN PROGRESS
    </span>
  );
}

const FONTS = {
  neue:  { sans: '"Inter Tight", Helvetica, Arial, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.02em' },
  serif: { sans: '"Fraunces", "Times New Roman", serif',         mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.015em' },
  mono:  { sans: '"JetBrains Mono", ui-monospace, monospace',    mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.03em' },
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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
      filter: shown ? 'none' : 'blur(2px)',
      transition: `transform .7s cubic-bezier(.2,.7,.3,1) ${delay}ms, opacity .7s steps(6) ${delay}ms, filter .7s ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

// Types `text` out one character at a time; renders instantly under reduced motion.
function useTyped(text, speed = 32, startDelay = 300) {
  const [n, setN] = React.useState(() => (prefersReducedMotion() ? text.length : 0));
  React.useEffect(() => {
    if (prefersReducedMotion()) { setN(text.length); return; }
    setN(0);
    let i = 0;
    let id;
    const start = setTimeout(() => {
      id = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) clearInterval(id);
      }, speed);
    }, startDelay);
    return () => { clearTimeout(start); clearInterval(id); };
  }, [text, speed, startDelay]);
  return n;
}

function useClock() {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString('en-US', { hour12: false });
}

function Caret({ small = false }) {
  return <span aria-hidden="true" className={`geek-caret${small ? ' geek-caret--sm' : ''}`} />;
}

function WindowBar({ title, right }) {
  return (
    <div className="geek-winbar">
      <span className="geek-dots" aria-hidden="true"><i /><i /><i /></span>
      <span className="geek-winbar-title">{title}</span>
      <span className="geek-winbar-right">{right}</span>
    </div>
  );
}

function TopBar({ dark, setDark, active, sections }) {
  const time = useClock();
  return (
    <header className="geek-topbar">
      <div className="geek-topbar-inner">
        <a href="#top" className="geek-prompt geek-hide-md" aria-label="Back to top">
          <span style={{ color: 'var(--accent)' }}>richard@uci</span>
          <span style={{ color: 'var(--dim)' }}>:</span>
          <span style={{ color: 'var(--cyan)' }}>~/portfolio</span>
          <span style={{ color: 'var(--dim)' }}>$</span>
          <Caret small />
        </a>

        <nav className="geek-nav" aria-label="Sections">
          {sections.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : undefined}>
              <span className="geek-nav-idx">{pad2(i + 1)}</span>{s.label}
            </a>
          ))}
          <span className="geek-nav-sep" aria-hidden="true" />
          <div className="geek-theme" role="group" aria-label="Theme">
            <span aria-hidden="true">[</span>
            <button type="button" onClick={() => setDark(true)} aria-pressed={dark} className={dark ? 'is-on' : undefined}>DARK</button>
            <span aria-hidden="true">|</span>
            <button type="button" onClick={() => setDark(false)} aria-pressed={!dark} className={!dark ? 'is-on' : undefined}>LIGHT</button>
            <span aria-hidden="true">]</span>
          </div>
        </nav>

        <div className="geek-clock geek-hide-md" aria-hidden="true">
          <span className="geek-led" />SYS.ONLINE<span style={{ color: 'var(--dim)' }}>·</span>{time}
        </div>
      </div>
    </header>
  );
}

function SectionHead({ index, path, title, subtitle }) {
  return (
    <div className="geek-sechead">
      <div className="geek-sechead-meta">
        <span style={{ color: 'var(--accent)' }}>[{hex(index)}]</span>
        <span style={{ color: 'var(--dim)' }}>$ cd</span>
        <span style={{ color: 'var(--cyan)' }}>~/{path}</span>
        <span className="geek-sechead-rule" aria-hidden="true" />
        <span className="geek-sechead-sub"># {subtitle}</span>
      </div>
      <h2 className="geek-h2">
        <span aria-hidden="true" className="geek-h2-prompt">&gt;</span>{title}
      </h2>
    </div>
  );
}

const HERO_TITLE = 'Full-Stack Engineer Building Reliable Web Systems';

function Hero() {
  const typed = useTyped(HERO_TITLE);
  const done = typed >= HERO_TITLE.length;
  const sysinfo = [
    ['USER', 'Richard Zhang'],
    ['ROLE', 'Software Engineer (Full-Stack)'],
    ['EDU', 'B.S. Informatics · UC Irvine'],
    ['BASED', 'Irvine, CA'],
    ['STACK', 'TypeScript · Python · Go · SQL'],
    ['STATUS', 'Available Summer 2026'],
  ];
  return (
    <div id="top" className="geek-hero">
      <div className="geek-window">
        <WindowBar title="richard@uci: ~/portfolio — zsh" right="80×24" />
        <div className="geek-window-body geek-hero-body">
          <div className="geek-cmd"><span className="geek-ps1">$</span> whoami</div>
          <div className="geek-eyebrow">
            <span className="geek-led" />
            Software Engineer (Full-Stack) · Available Summer 2026
          </div>
          <h1 className="geek-h1" aria-label={HERO_TITLE}>
            <span aria-hidden="true">{HERO_TITLE.slice(0, typed)}</span>
            {!done && <Caret />}
            <span aria-hidden="true" style={{ color: 'transparent' }}>{HERO_TITLE.slice(typed)}</span>
            {done && <Caret />}
          </h1>
          <div className="geek-cmd" style={{ marginTop: 32 }}><span className="geek-ps1">$</span> cat ./intro.txt</div>
          <p className="geek-lead">
            Recent Informatics graduate from UC Irvine. I design and ship
            end-to-end web systems, from APIs and data models to interfaces
            that make complex workflows clear and usable.
          </p>
          <div className="geek-cta-row">
            <a href="#work" className="geek-btn geek-btn--primary">[ SEE THE WORK ]</a>
            <a href="#" className="geek-btn">[ VIEW RESUME ]</a>
          </div>
        </div>
      </div>

      <aside className="geek-window geek-sysinfo" aria-label="Summary">
        <WindowBar title="sysinfo" right="pid 2026" />
        <div className="geek-window-body">
          <div className="geek-cmd"><span className="geek-ps1">$</span> neofetch --short</div>
          <div className="geek-sysinfo-head">
            <span style={{ color: 'var(--accent)' }}>richard</span><span style={{ color: 'var(--dim)' }}>@</span><span style={{ color: 'var(--cyan)' }}>uci</span>
            <div className="geek-sysinfo-rule" aria-hidden="true">────────────────────</div>
          </div>
          <dl className="geek-kv">
            {sysinfo.map(([k, v]) => (
              <React.Fragment key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </React.Fragment>
            ))}
          </dl>
          <div className="geek-swatches" aria-hidden="true">
            {['var(--accent)', 'var(--cyan)', 'var(--amber)', 'var(--magenta)', 'var(--fg)', 'var(--dim)'].map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

const splitStack = (stack) => (
  Array.isArray(stack) ? stack : String(stack || '').split('/').map((s) => s.trim()).filter(Boolean)
);

function ProjectTile({ project, index }) {
  const stack = splitStack(project.stack).slice(0, 3);
  const sourceHref = projectSourceHref(project);
  const hasSource = isUsableHref(sourceHref);
  const detailSlug = projectSlug(project);
  return (
    <article className="geek-card">
      <WindowBar title={`${detailSlug}.png`} right={`#${pad2(index + 1)}`} />
      <div className="geek-card-media">
        <div className="geek-card-img" style={{ background: projectImageBackground(project.img) }} />
        {project.accent && (
          <div style={{ position: 'absolute', inset: 0, background: project.accent, mixBlendMode: 'screen', pointerEvents: 'none' }} />
        )}
        <div className="geek-card-scan" aria-hidden="true" />
        <div style={{ position: 'absolute', top: 10, left: 12, zIndex: 2 }}>
          <StatusPill project={project} onImage />
        </div>
      </div>

      <div className="geek-card-body">
        <h3 className="geek-card-title">
          <span aria-hidden="true" style={{ color: 'var(--accent)' }}>./</span>{project.name}
        </h3>
        <div className="geek-chips">
          <span className="geek-chips-label">Stack:</span>
          {stack.map((s) => <span key={s} className="geek-chip">{s}</span>)}
        </div>
        <p className="geek-card-summary">
          <span style={{ color: 'var(--fg)' }}>Summary: </span>{project.summary}
        </p>
        <div className="geek-card-links">
          <Link to={`/project/${detailSlug}`} className="geek-link geek-link--accent">
            VIEW CASE STUDY →
          </Link>
          <a
            href={hasSource ? sourceHref : '#'}
            {...externalLinkProps(sourceHref)}
            onClick={(e) => { if (!hasSource) e.preventDefault(); }}
            className="geek-link"
          >
            SOURCE →
          </a>
        </div>
      </div>
    </article>
  );
}

function About() {
  return (
    <div className="geek-about">
      <div className="geek-about-side">
        <div className="geek-portrait">
          <div className="geek-portrait-grid" aria-hidden="true" />
          <div className="geek-portrait-cross" aria-hidden="true" />
          <span className="geek-corner tl" aria-hidden="true" />
          <span className="geek-corner tr" aria-hidden="true" />
          <span className="geek-corner bl" aria-hidden="true" />
          <span className="geek-corner br" aria-hidden="true" />
          <div className="geek-portrait-tag" aria-hidden="true">IMG_0001.RAW</div>
          <div className="geek-portrait-caption">Richard Zhang · 2026</div>
        </div>
      </div>
      <div>
        <div className="geek-window">
          <WindowBar title="about.md" right="utf-8" />
          <div className="geek-window-body">
            <p className="geek-body-text" style={{ margin: 0 }}>
              I’m a recent Informatics graduate from UC Irvine with a Computer
              Science and systems foundation. My work sits between backend
              engineering and product-facing software: APIs, data models, and
              interfaces that make complex workflows usable. I’m looking for
              entry-level roles where I can build reliable web systems and grow
              across backend, full-stack, and infrastructure work.
            </p>
            <dl className="geek-kv geek-kv--boxed">
              <dt>BASED</dt>
              <dd>Irvine, CA · Open to relocation and remote work</dd>
              <dt>SEEKING</dt>
              <dd>Entry-level backend, full-stack, or infrastructure software roles</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Skills() {
  // Rendered as a source file: one logical line per row with a line-number gutter.
  const lines = [
    { code: <><span className="tok-kw">export const</span> <span className="tok-var">stack</span> = {'{'}</> },
    ...SKILLS.map((group, gi) => ({
      code: (
        <span className="geek-code-indent">
          <span className="tok-key">"{group.group}"</span>: [
          {group.items.map((item, i) => (
            <React.Fragment key={item}>
              <span className="tok-str">'{item}'</span>{i < group.items.length - 1 ? ', ' : ''}
            </React.Fragment>
          ))}
          ]{gi < SKILLS.length - 1 ? ',' : ''}
        </span>
      ),
    })),
    { code: <>{'}'};</> },
  ];
  return (
    <div className="geek-window">
      <WindowBar title="stack.ts" right="TypeScript · LF" />
      <div className="geek-code" role="list" aria-label="Technical stack">
        {lines.map((l, i) => (
          <div key={i} className="geek-code-line" role="listitem">
            <span className="geek-code-ln" aria-hidden="true">{i + 1}</span>
            <span className="geek-code-src">{l.code}</span>
          </div>
        ))}
        <div className="geek-code-line">
          <span className="geek-code-ln" aria-hidden="true">{lines.length + 1}</span>
          <span className="geek-code-src"><Caret small /></span>
        </div>
      </div>
    </div>
  );
}

function Education() {
  return (
    <div className="education-layout">
      <div className="geek-window">
        <WindowBar title="education.yml" right="yaml" />
        <div className="geek-window-body">
          <h3 id="education-degree" className="geek-h3">
            {EDUCATION.school} <span aria-hidden="true" style={{ color: 'var(--accent)' }}>·</span> {EDUCATION.degree}
          </h3>
          <p aria-label={`${EDUCATION.dept}, ${EDUCATION.dates}`} className="geek-yaml">
            <span><span className="tok-key">dept</span>: {EDUCATION.dept}</span>
            <span><span className="tok-key">dates</span>: <span className="tok-str">{EDUCATION.dates}</span></span>
          </p>
          <p className="geek-body-text geek-note">
            <span aria-hidden="true" className="geek-note-mark"># </span>{EDUCATION.note}
          </p>
        </div>
      </div>
      <div>
        <h4 id="education-coursework" className="geek-h4">
          <span aria-hidden="true" style={{ color: 'var(--accent)' }}>$ ls ./</span>Coursework
        </h4>
        <ul className="education-course-list" aria-labelledby="education-coursework">
          {EDUCATION.coursework.map((course) => (
            <li key={course}><span aria-hidden="true" className="geek-check">[✓]</span>{course}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Contact() {
  const links = [
    { k: 'EMAIL',    cmd: 'mail',  v: 'yonghuz1@uci.edu', href: 'mailto:yonghuz1@uci.edu' },
    { k: 'GITHUB',   cmd: 'open',  v: 'github.com/ASDFGHJKLZXC123', href: 'https://github.com/ASDFGHJKLZXC123' },
    { k: 'LINKEDIN', cmd: 'open',  v: 'linkedin.com/in/richard-zhang-7ba1802b3', href: 'https://linkedin.com/in/richard-zhang-7ba1802b3' },
  ];
  return (
    <div style={{ padding: '20px 0 0' }}>
      <div className="geek-h1 geek-contact-title">
        Let’s connect about software engineering roles<Caret />
      </div>
      <div className="geek-lead" style={{ marginTop: 24, maxWidth: 560 }}>
        Email is the best way to reach me. I’m open to entry-level backend,
        full-stack, and infrastructure-oriented software engineering roles.
      </div>

      <div className="geek-contact-grid">
        {links.map((c) => (
          <a
            key={c.k}
            href={c.href}
            target={c.href.startsWith('https://') ? '_blank' : undefined}
            rel={c.href.startsWith('https://') ? 'noreferrer' : undefined}
            onClick={(e) => { if (c.href === '#') e.preventDefault(); }}
            className="geek-contact-cell"
          >
            <span className="geek-contact-k">
              <span>[{c.k}]</span>
              <span aria-hidden="true" className="geek-contact-arrow">↗</span>
            </span>
            <span className="geek-contact-v">
              <span aria-hidden="true" className="geek-contact-cmd">$ {c.cmd} </span>{c.v}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="geek-statusline">
      <span className="geek-statusline-mode">-- NORMAL --</span>
      <span className="geek-statusline-main">© 2026 / Richard · BUILT IN REACT + TOO MUCH COFFEE</span>
      <span className="geek-statusline-right">
        <span className="geek-hide-sm">utf-8 · jsx</span>
        <span>LAST SYNC · 04.26</span>
      </span>
    </footer>
  );
}

export default function Portfolio() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = React.useState('work');
  const [PROJECTS, setProjects] = React.useState(PROJECTS_FALLBACK);
  const fonts = FONTS[t.font] || FONTS.mono;
  const dark = t.dark;

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/projects.json`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data && data.projects) setProjects(data.projects); })
      .catch(() => {});
  }, []);

  const featured = PROJECTS
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999))
    .slice(0, t.projectCount);
  const shownSlugs = new Set(featured.map((p) => projectSlug(p)));
  const extra = PROJECTS.filter((p) => !shownSlugs.has(projectSlug(p)));

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
    '--bg': dark ? '#050807' : '#eef1ea',
    '--bg-blur': dark ? 'rgba(5,8,7,0.8)' : 'rgba(238,241,234,0.82)',
    '--panel': dark ? 'rgba(10,17,13,0.82)' : 'rgba(250,252,248,0.88)',
    '--panel-bar': dark ? 'rgba(18,28,22,0.9)' : 'rgba(226,232,222,0.95)',
    '--fg': dark ? '#e4efe7' : '#0d1a12',
    '--muted': dark ? 'rgba(196,224,206,0.6)' : 'rgba(13,26,18,0.64)',
    '--dim': dark ? 'rgba(196,224,206,0.34)' : 'rgba(13,26,18,0.4)',
    '--border': dark ? 'rgba(120,255,170,0.13)' : 'rgba(13,26,18,0.14)',
    '--tile-bg': dark ? '#070c09' : '#e2e8de',
    '--accent': dark ? t.accent : `color-mix(in srgb, ${t.accent} 45%, #00361b)`,
    '--accent-ink': dark ? '#03110a' : '#f2fff6',
    '--cyan': dark ? '#67e8f9' : '#0e7490',
    '--amber': dark ? '#fbbf24' : '#a16207',
    '--magenta': dark ? '#f472b6' : '#be185d',
    '--grid': dark ? 'rgba(120,255,170,0.05)' : 'rgba(13,26,18,0.055)',
    '--scan': dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.018)',
    '--glow': dark ? '0 0 18px color-mix(in srgb, var(--accent) 45%, transparent)' : 'none',
    '--sans': fonts.sans, '--mono': fonts.mono, '--letter': fonts.letter,
  };

  let sectionIdx = 0;
  const nextIdx = () => ++sectionIdx;

  return (
    <div className="geek-root" style={{ ...vars, background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
      <div className="geek-bg" aria-hidden="true" />
      <div className="geek-scanlines" aria-hidden="true" />

      <TopBar dark={dark} setDark={(v) => setTweak('dark', v)} active={active} sections={sections} />

      <main className="geek-main">
        <Hero />

        <section id="work" className="geek-section" style={{ paddingTop: 40 }}>
          <Reveal><SectionHead index={nextIdx()} path="work" title="Selected Engineering Work" subtitle="Systems-focused projects with emphasis on reliability, data, and APIs" /></Reveal>
          <div className="geek-work-grid">
            {featured.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <ProjectTile project={p} index={i} />
              </Reveal>
            ))}
          </div>
          {extra.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56 }}>
              <Link to="/all-works" className="geek-btn geek-btn--wide">
                <span aria-hidden="true" className="geek-hide-sm" style={{ color: 'var(--accent)' }}>$ ls -a ./projects</span>
                <span>VIEW ALL PROJECTS →</span>
              </Link>
            </div>
          )}
        </section>

        {t.showAbout && (
          <section id="about" className="geek-section">
            <Reveal><SectionHead index={nextIdx()} path="about" title="About" subtitle="Background and focus" /></Reveal>
            <Reveal delay={100}><About /></Reveal>
          </section>
        )}

        {t.showSkills && (
          <section id="skills" className="geek-section">
            <Reveal><SectionHead index={nextIdx()} path="stack" title="Technical Stack" subtitle="Tools and practices behind my selected work" /></Reveal>
            <Reveal delay={100}><Skills /></Reveal>
          </section>
        )}

        {t.showEducation && (
          <section id="education" className="geek-section">
            <Reveal><SectionHead index={nextIdx()} path="education" title="Education" subtitle="Academic background" /></Reveal>
            <Reveal delay={100}><Education /></Reveal>
          </section>
        )}

        <section id="contact" className="geek-section" style={{ paddingTop: 140 }}>
          <Reveal><SectionHead index={nextIdx()} path="contact" title="Contact" subtitle="Hiring contact" /></Reveal>
          <Reveal delay={100}><Contact /></Reveal>
        </section>
      </main>

      <Footer />

      <TweaksPanel title="style">
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak('dark', v)} />
        <TweakColor  label="Accent"    value={t.accent} onChange={(v) => setTweak('accent', v)} />

        <TweakSection label="Typography" />
        <TweakRadio label="Typeface" value={t.font}
          options={[{ value: 'mono', label: 'mono' }, { value: 'neue', label: 'neue' }, { value: 'serif', label: 'serif' }]}
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
