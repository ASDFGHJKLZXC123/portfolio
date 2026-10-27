// portfolio.jsx — Richard's portfolio, editorial dark style
// Sections: hero · selected engineering work · about · skills · education · contact
// Sticky top nav w/ scroll progress, masked hero type, lead project + grid, scroll-reveal on sections.

import React from 'react';
import { Link } from 'react-router-dom';
import {
  useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle,
  TweakRadio, TweakColor,
} from '../components/tweaks-panel';
import { projectImageBackground } from '../lib/project-image';
import { externalLinkProps, isUsableHref, projectSlug, projectSourceHref } from '../lib/project-links';
import {
  Reveal, useReveal, ScrollProgress, ThemeToggle, StatusPill, themeVars, pad2, readStoredDark, storeDark,
} from '../components/editorial';

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

const FONTS = {
  neue:  { sans: '"Inter Tight", Helvetica, Arial, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.02em' },
  serif: { sans: '"Fraunces", "Times New Roman", serif',         mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.015em' },
  mono:  { sans: '"JetBrains Mono", ui-monospace, monospace',    mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.01em' },
};

function TopBar({ dark, setDark, active, sections }) {
  return (
    <header className="ed-topbar">
      <div className="ed-topbar-inner">
        <a href="#top" className="ed-brand">
          <span className="ed-brand-name">Richard Zhang</span>
          <span className="ed-brand-role ed-hide-md">Full-Stack Engineer</span>
        </a>

        <nav className="ed-nav" aria-label="Sections">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : undefined}>{s.label}</a>
          ))}
        </nav>

        <div className="ed-topbar-right">
          <span className="ed-status ed-hide-md"><span className="ed-dot" />Available Summer 2026</span>
          <ThemeToggle dark={dark} setDark={setDark} />
        </div>
      </div>
      <ScrollProgress />
    </header>
  );
}

function SectionHead({ index, title, subtitle }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={`ed-sechead${shown ? ' is-in' : ''}`}>
      <span className="ed-sechead-rule" aria-hidden="true" />
      <div className="ed-sechead-index">/ {pad2(index)}</div>
      <h2 className="ed-h2"><span className="ed-mask"><span>{title}</span></span></h2>
      <div className="ed-sechead-sub">{subtitle}</div>
    </div>
  );
}

// Spotlight that trails the cursor inside the hero; static under reduced motion / touch.
function useSpotlight() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia?.('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, []);
  return ref;
}

function Hero() {
  const ref = useSpotlight();
  const meta = [
    ['BASED', 'Irvine, CA'],
    ['EDUCATION', 'B.S. Informatics · UC Irvine'],
    ['FOCUS', 'Backend · Full-Stack · Infra'],
    ['STATUS', 'Available Summer 2026'],
  ];
  return (
    <div id="top" ref={ref} className="ed-hero">
      <div className="ed-hero-light" aria-hidden="true" />
      <div className="ed-eyebrow ed-rise" style={{ animationDelay: '0ms' }}>
        <span className="ed-dot" />
        Software Engineer (Full-Stack) · Available Summer 2026
      </div>

      <h1 className="ed-h1" aria-label="Full-Stack Engineer Building Reliable Web Systems">
        <span className="ed-line" aria-hidden="true"><span style={{ animationDelay: '80ms' }}>Full-Stack Engineer</span></span>
        <span className="ed-line" aria-hidden="true"><span style={{ animationDelay: '180ms' }}>Building <em>Reliable</em></span></span>
        <span className="ed-line" aria-hidden="true"><span style={{ animationDelay: '280ms' }}>Web Systems</span></span>
      </h1>

      <div className="ed-hero-foot">
        <div className="ed-rise" style={{ animationDelay: '420ms' }}>
          <p className="ed-lead">
            Recent Informatics graduate from UC Irvine. I design and ship
            end-to-end web systems, from APIs and data models to interfaces
            that make complex workflows clear and usable.
          </p>
          <div className="ed-cta-row">
            <a href="#work" className="ed-btn ed-btn--primary">SEE THE WORK <span aria-hidden="true">↓</span></a>
            <a href="#" className="ed-btn">VIEW RESUME <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <dl className="ed-hero-meta ed-rise" style={{ animationDelay: '520ms' }}>
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <a href="#work" className="ed-scroll ed-hide-md" aria-label="Scroll to work">
        <span>SCROLL</span><span className="ed-scroll-line" aria-hidden="true" />
      </a>
    </div>
  );
}

function Marquee() {
  const items = SKILLS.flatMap((g) => g.items);
  const row = (hidden) => (
    <div className="ed-marquee-row" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <span key={it}>{it}<i aria-hidden="true">✦</i></span>
      ))}
    </div>
  );
  return (
    <div className="ed-marquee" aria-label="Technologies">
      <div className="ed-marquee-track">{row(false)}{row(true)}</div>
    </div>
  );
}

function ProjectTile({ project, index, total, large = false }) {
  const stack = Array.isArray(project.stack) ? project.stack.slice(0, 3).join(' · ') : project.stack;
  const sourceHref = projectSourceHref(project);
  const hasSource = isUsableHref(sourceHref);
  const detailSlug = projectSlug(project);
  return (
    <article className={`ed-card${large ? ' ed-card--large' : ''}`}>
      <Link to={`/project/${detailSlug}`} className="ed-card-media" aria-label={`${project.name} case study`}>
        <div className="ed-card-img" style={{ background: projectImageBackground(project.img) }} />
        {project.accent && (
          <div style={{ position: 'absolute', inset: 0, background: project.accent, mixBlendMode: 'screen', pointerEvents: 'none' }} />
        )}
        <div className="ed-card-shade" aria-hidden="true" />
        <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 2 }}>
          <StatusPill project={project} onImage />
        </div>
        <span className="ed-card-cta" aria-hidden="true">VIEW CASE STUDY <b>↗</b></span>
      </Link>

      <div className="ed-card-body">
        <div className="ed-card-index">
          <span>{pad2(index + 1)}</span>
          <span className="ed-card-index-rule" aria-hidden="true" />
          <span>{pad2(total)}</span>
        </div>
        <h3 className="ed-card-title">{project.name}</h3>
        <div className="ed-card-stack"><span>Stack: </span>{stack}</div>
        <p className={`ed-card-summary${large ? '' : ' is-clamped'}`}>
          <span style={{ color: 'var(--fg)' }}>Summary: </span>{project.summary}
        </p>
        <div className="ed-card-links">
          <Link to={`/project/${detailSlug}`} className="ed-link ed-link--strong">VIEW CASE STUDY →</Link>
          <a
            href={hasSource ? sourceHref : '#'}
            {...externalLinkProps(sourceHref)}
            onClick={(e) => { if (!hasSource) e.preventDefault(); }}
            className="ed-link"
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
    <div className="ed-about">
      <div className="ed-about-side">
        <div className="ed-portrait">
          <div className="ed-portrait-glow" aria-hidden="true" />
          <div className="ed-portrait-caption">Richard Zhang · 2026</div>
        </div>
      </div>
      <div>
        <p className="ed-about-lead">
          I’m a recent Informatics graduate from UC Irvine with a Computer
          Science and systems foundation. My work sits between backend
          engineering and product-facing software: APIs, data models, and
          interfaces that make complex workflows usable. I’m looking for
          entry-level roles where I can build reliable web systems and grow
          across backend, full-stack, and infrastructure work.
        </p>
        <dl className="ed-rows">
          <div>
            <dt>BASED</dt>
            <dd>Irvine, CA · Open to relocation and remote work</dd>
          </div>
          <div>
            <dt>SEEKING</dt>
            <dd>Entry-level backend, full-stack, or infrastructure software roles</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div className="ed-skills">
      {SKILLS.map((group, gi) => (
        <div key={group.group} className="ed-skill-col">
          <div className="ed-skill-head">
            <span>{pad2(gi + 1)} / {group.group.toUpperCase()}</span>
            <span>({group.items.length})</span>
          </div>
          <ul>
            {group.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Education() {
  return (
    <div className="education-layout">
      <div>
        <div className="ed-edu-dates" aria-hidden="true">{EDUCATION.dates}</div>
        <h3 id="education-degree" className="ed-h3">
          {EDUCATION.school} <span aria-hidden="true">·</span> {EDUCATION.degree}
        </h3>
        <p aria-label={`${EDUCATION.dept}, ${EDUCATION.dates}`} className="ed-edu-dept">
          <span>{EDUCATION.dept}</span>
          <span aria-hidden="true"> · </span>
          <span>{EDUCATION.dates}</span>
        </p>
        <p className="ed-edu-note">{EDUCATION.note}</p>
      </div>
      <div>
        <h4 id="education-coursework" className="ed-h4">
          <span aria-hidden="true">/ </span>Coursework
        </h4>
        <ol className="ed-course-list" aria-labelledby="education-coursework">
          {EDUCATION.coursework.map((course, i) => (
            <li key={course}><span aria-hidden="true">{pad2(i + 1)}</span>{course}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="ed-contact">
      <div className="ed-contact-title">
        Let’s connect about software engineering roles
      </div>
      <div className="ed-lead" style={{ marginTop: 28, maxWidth: 560 }}>
        Email is the best way to reach me. I’m open to entry-level backend,
        full-stack, and infrastructure-oriented software engineering roles.
      </div>

      <div className="ed-contact-list">
        {[
          { k: 'EMAIL',    v: 'yonghuz1@uci.edu', href: 'mailto:yonghuz1@uci.edu' },
          { k: 'GITHUB',   v: 'github.com/ASDFGHJKLZXC123', href: 'https://github.com/ASDFGHJKLZXC123' },
          { k: 'LINKEDIN', v: 'linkedin.com/in/richard-zhang-7ba1802b3', href: 'https://linkedin.com/in/richard-zhang-7ba1802b3' },
        ].map((c) => (
          <a
            key={c.k}
            href={c.href}
            target={c.href.startsWith('https://') ? '_blank' : undefined}
            rel={c.href.startsWith('https://') ? 'noreferrer' : undefined}
            onClick={(e) => { if (c.href === '#') e.preventDefault(); }}
            className="ed-contact-row"
          >
            <span className="ed-contact-k">{c.k}</span>
            <span className="ed-contact-v">{c.v}</span>
            <span className="ed-contact-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="ed-footer">
      <span>© 2026 / Richard · BUILT IN REACT + TOO MUCH COFFEE</span>
      <a href="#top" className="ed-link">BACK TO TOP ↑</a>
      <span>LAST SYNC · 04.26</span>
    </footer>
  );
}

export default function Portfolio() {
  const [t, setTweak] = useTweaks(React.useMemo(() => ({ ...TWEAK_DEFAULTS, dark: readStoredDark(TWEAK_DEFAULTS.dark) }), []));
  const setDark = (v) => { setTweak('dark', v); storeDark(v); };
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

  const featured = PROJECTS
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999))
    .slice(0, t.projectCount);
  const shownSlugs = new Set(featured.map((p) => projectSlug(p)));
  const extra = PROJECTS.filter((p) => !shownSlugs.has(projectSlug(p)));
  const [lead, ...rest] = featured;

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

  const vars = themeVars(dark, { accent: t.accent, font: fonts });

  let sectionIdx = 0;
  const nextIdx = () => ++sectionIdx;

  return (
    <div className="ed-root" style={{ ...vars, background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
      <div className="ed-grain" aria-hidden="true" />
      <TopBar dark={dark} setDark={setDark} active={active} sections={sections} />

      <Hero />
      <Marquee />

      <section id="work" className="ed-section">
        <SectionHead index={nextIdx()} title="Selected Engineering Work" subtitle="Systems-focused projects with emphasis on reliability, data, and APIs" />
        {lead && (
          <Reveal><ProjectTile project={lead} index={0} total={featured.length} large /></Reveal>
        )}
        {rest.length > 0 && (
          <div className="ed-work-grid">
            {rest.map((p, i) => (
              <Reveal key={p.name} delay={i * 90}>
                <ProjectTile project={p} index={i + 1} total={featured.length} />
              </Reveal>
            ))}
          </div>
        )}
        {extra.length > 0 && (
          <div className="ed-more">
            <Link to="/all-works" className="ed-btn ed-btn--wide">
              <span>VIEW ALL PROJECTS →</span>
            </Link>
          </div>
        )}
      </section>

      {t.showAbout && (
        <section id="about" className="ed-section">
          <SectionHead index={nextIdx()} title="About" subtitle="Background and focus" />
          <Reveal delay={100}><About /></Reveal>
        </section>
      )}

      {t.showSkills && (
        <section id="skills" className="ed-section">
          <SectionHead index={nextIdx()} title="Technical Stack" subtitle="Tools and practices behind my selected work" />
          <Reveal delay={100}><Skills /></Reveal>
        </section>
      )}

      {t.showEducation && (
        <section id="education" className="ed-section">
          <SectionHead index={nextIdx()} title="Education" subtitle="Academic background" />
          <Reveal delay={100}><Education /></Reveal>
        </section>
      )}

      <section id="contact" className="ed-section ed-section--contact">
        <SectionHead index={nextIdx()} title="Contact" subtitle="Hiring contact" />
        <Reveal delay={100}><Contact /></Reveal>
      </section>

      <Footer />

      <TweaksPanel title="style">
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t.dark} onChange={setDark} />
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
