// portfolio.jsx — Richard's portfolio, editorial dark style
// Sections: hero · selected engineering work · about · skills · education · contact
// Sticky top nav w/ section anchors, scroll-reveal on sections, hover-reveal on tiles.

import React from 'react';
import { Link } from 'react-router-dom';
import {
  useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle,
  TweakRadio, TweakColor,
} from '../components/tweaks-panel';
import { projectImageBackground } from '../lib/project-image';
import { externalLinkProps, isUsableHref, projectSlug, projectSourceHref, projectDemoHref } from '../lib/project-links';
import { curatedProjects } from '../lib/portfolio-curation';
import { applyTheme, initialThemeIsDark } from '../lib/use-theme';
import TechnicalCover from '../components/TechnicalCover';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": true,
  "accent": "#d9d9d4",
  "font": "neue",
  "showAbout": true,
  "showSkills": true,
  "showEducation": true,
  "projectCount": 3
}/*EDITMODE-END*/;

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
  note: 'Built on a software engineering and computer science foundation, with coursework spanning data structures, databases, networks, artificial intelligence, and human-centered software design.',
  coursework: ['Data Structure Implementation & Analysis', 'Introduction to Data Management', 'Computer Networks', 'Introduction to Artificial Intelligence', 'Engineering of AI Software', 'Probability & Statistics for CS', 'Requirements Analysis & Engineering', 'Software Design', 'Human-Computer Interaction', 'Project Management'],
};

const pendingStatusLabel = (project) => project.status === 'in-progress'
  ? 'IN PROGRESS'
  : project.status === 'verification-pending'
    ? 'VERIFICATION PENDING'
    : '';

function StatusPill({ project, onImage = false }) {
  const label = pendingStatusLabel(project);
  if (!label) return null;
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
      {label}
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
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return undefined;
    }
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
    <div ref={ref} className="reveal" style={{
      transform: shown ? 'translateY(0)' : 'translateY(16px)',
      opacity: shown ? 1 : 0,
      transition: `transform .8s cubic-bezier(.2,.7,.3,1) ${delay}ms, opacity .8s ease ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

function TopBar({ dark, setDark, active, sections }) {
  return (
    <div className="topbar portfolio-topbar" style={{
      position: 'sticky', top: 0, zIndex: 40,
      backdropFilter: 'blur(14px) saturate(140%)',
      WebkitBackdropFilter: 'blur(14px) saturate(140%)',
      background: 'var(--bg-blur)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="portfolio-topbar-inner" style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', padding: '16px 40px', fontSize: 11,
        letterSpacing: '0.12em', fontFamily: 'var(--mono)',
      }}>
        <div style={{ justifySelf: 'start' }} />

        <nav className="portfolio-nav" aria-label="Portfolio sections" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? 'location' : undefined}
              className={`portfolio-nav-link${s.id === 'skills' || s.id === 'education' ? ' portfolio-nav-link-secondary' : ''}`}
              style={{
              padding: '6px 10px', borderRadius: 999, textDecoration: 'none',
              fontSize: 10, letterSpacing: '0.15em',
              color: active === s.id ? 'var(--fg)' : 'var(--muted)',
              background: active === s.id ? 'var(--hover)' : 'transparent',
              transition: 'color .2s, background .2s',
            }}>{s.label}</a>
          ))}
          <span className="portfolio-nav-divider" aria-hidden="true" style={{ width: 1, height: 14, background: 'var(--border)', margin: '0 6px' }} />
          <div className="theme-switch" role="group" aria-label="Color theme" style={{
            display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 999, padding: 2,
          }}>
            <button aria-pressed={dark} onClick={() => setDark(true)} style={themeBtn(dark)}>DARK</button>
            <button aria-pressed={!dark} onClick={() => setDark(false)} style={themeBtn(!dark)}>LIGHT</button>
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
    <div className="section-head" style={{
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

// The hero previously stopped at maxWidth 1000 and left the right half of a
// desktop viewport empty. The index panel fills it with the fastest possible
// route into the actual work.
function HeroIndex({ projects }) {
  if (!projects.length) return null;
  return (
    <aside className="hero-index" aria-label="Selected work index">
      <div className="hero-index-label">/ SELECTED WORK</div>
      <ol className="hero-index-list">
        {projects.map((p, i) => (
          <li key={projectSlug(p)}>
            <Link to={`/project/${projectSlug(p)}`}>
              <span className="hero-index-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="hero-index-name">{p.name}</span>
              <span className="hero-index-kind">{(p.stack || [])[0] || p.kind}</span>
            </Link>
          </li>
        ))}
      </ol>
      <Link className="hero-index-all" to="/all-works">ALL PROJECTS →</Link>
    </aside>
  );
}

function Hero({ indexProjects = [] }) {
  return (
    <div className="portfolio-hero" style={{ padding: '80px 40px 60px' }}>
      <div className="portfolio-hero-copy">
      <div className="availability-line" style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em',
        color: 'var(--muted)', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
        Software Engineer (Full-Stack) · Open to opportunities
      </div>
      <h1 className="portfolio-hero-title" style={{
        margin: 0, fontFamily: 'var(--sans)', fontWeight: 400,
        fontSize: 'clamp(40px, 4.5vw, 64px)', lineHeight: 1.05,
        letterSpacing: 'var(--letter)', color: 'var(--fg)',
      }}>
        I Build Reliable Backend and Full-Stack Systems
      </h1>
      <p className="portfolio-hero-summary" style={{
        margin: '28px 0 0', fontFamily: 'var(--sans)', fontWeight: 300,
        fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: 1.5,
        color: 'var(--muted)', maxWidth: 620, letterSpacing: 'var(--letter)',
      }}>
        UC Irvine Informatics graduate focused on the seams that make software
        hold up: transactions, retries, data validation, role-based workflows,
        and clear operational interfaces.
      </p>
      <div className="hero-actions" style={{ display: 'flex', gap: 16, marginTop: 40, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em' }}>
        <a href="#work" style={ctaPrimary()}>SEE THE WORK</a>
        <a href="#contact" style={ctaGhost()}>GET IN TOUCH</a>
      </div>
      </div>

      <HeroIndex projects={indexProjects} />
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
  const sourceHref = projectSourceHref(project);
  const hasSource = isUsableHref(sourceHref);
  const demoHref = projectDemoHref(project);
  const hasDemo = isUsableHref(demoHref);
  const detailSlug = projectSlug(project);
  return (
    <article>
      <div className="featured-card" style={{
          display: 'flex', flexDirection: 'column', gap: 18,
          position: 'relative',
          transform: hover ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'transform .5s cubic-bezier(.2,.7,.3,1)',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocusCapture={() => setHover(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHover(false);
        }}
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
          {project.technicalCover ? (
            <TechnicalCover cover={project.technicalCover} projectName={project.name} compact />
          ) : (
            <div data-img style={{
              position: 'absolute', inset: 0,
              background: projectImageBackground(project.img),
              transform: hover ? 'scale(1.06)' : 'scale(1)',
              filter: hover ? 'brightness(1.12) saturate(1.1)' : 'brightness(1) saturate(1)',
              transition: 'transform .8s cubic-bezier(.2,.7,.3,1), filter .5s',
            }} />
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 100%, rgba(255,255,255,0.18), transparent 60%)',
            opacity: hover ? 1 : 0,
            transition: 'opacity .5s',
            pointerEvents: 'none',
          }} />
          {!project.technicalCover && project.accent && (
            <div style={{ position: 'absolute', inset: 0, background: project.accent, mixBlendMode: 'screen', pointerEvents: 'none' }} />
          )}
          {!project.technicalCover && (
            <div style={{ position: 'absolute', top: 10, left: 12, zIndex: 2, pointerEvents: 'none' }}>
              <StatusPill project={project} onImage />
            </div>
          )}
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
            <Link
              className="featured-card-primary"
              to={`/project/${detailSlug}`}
              aria-label={`View ${project.name} case study`}
              style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              VIEW CASE STUDY →
            </Link>
            {hasSource && (
              <a
                className="featured-card-secondary-action"
                href={sourceHref}
                {...externalLinkProps(sourceHref)}
                aria-label={`Open ${project.name} GitHub repository`}
                style={{ color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 4 }}
              >
                {project.sourceLabel || 'GITHUB REPO'} ↗
              </a>
            )}
            {hasDemo && (
              <a
                className="featured-card-secondary-action"
                href={demoHref}
                {...externalLinkProps(demoHref)}
                style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}
              >
                LIVE DEMO →
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function About() {
  return (
    <div className="about-layout" style={{ maxWidth: 760 }}>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: 1.55, letterSpacing: 'var(--letter)', color: 'var(--fg)', fontWeight: 300, maxWidth: 700 }}>
        <p style={{ marginTop: 0 }}>
          I’m a recent Informatics graduate from UC Irvine who likes the seams
          where product behavior meets backend correctness: queues, APIs, data
          models, authentication, and the operational interfaces around them.
          I’m looking for an entry-level team where I can contribute across the
          stack while continuing to deepen my backend and infrastructure skills.
        </p>
        <div className="about-facts" style={{
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {group.items.map((item) => (
              <div key={item} style={{
                fontFamily: 'var(--sans)', fontSize: 18, lineHeight: 1.35, letterSpacing: 'var(--letter)',
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
          <span aria-hidden="true">/ </span>Selected Coursework
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

      <div className="contact-grid" style={{
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
            className="contact-link"
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
    <div className="portfolio-footer" style={{
      marginTop: 80, padding: '32px 40px 40px', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      borderTop: '1px solid var(--border)',
      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)',
    }}>
      <span>© 2026 / Richard · BUILT IN REACT + TOO MUCH COFFEE</span>
      <span>OPEN TO SOFTWARE ENGINEERING OPPORTUNITIES</span>
    </div>
  );
}

// Seed the panel's dark toggle from the visitor's stored/system preference so
// arriving from a case study (or a second visit) doesn't snap back to dark.
const TWEAK_INITIAL = { ...TWEAK_DEFAULTS, dark: initialThemeIsDark() };

export default function Portfolio() {
  const [t, setTweak] = useTweaks(TWEAK_INITIAL);
  const [active, setActive] = React.useState('work');
  const [PROJECTS, setProjects] = React.useState(null);
  const fonts = FONTS[t.font] || FONTS.neue;
  const dark = t.dark;

  React.useEffect(() => {
    document.title = 'Richard Zhang — Full-Stack Software Engineer';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Richard Zhang is a UC Irvine Informatics graduate building reliable backend and full-stack systems.',
    );
  }, []);

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/projects.json`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setProjects(Array.isArray(data?.projects) ? data.projects : []))
      .catch(() => setProjects([]));
  }, []);

  const projectsList = PROJECTS || [];
  const featured = curatedProjects(projectsList).slice(0, t.projectCount);
  const shownSlugs = new Set(featured.map((p) => projectSlug(p)));
  const extra = projectsList.filter((p) => !shownSlugs.has(projectSlug(p)));

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

  // Colour tokens live in index.css under :root[data-theme]. This page owns its
  // own `dark` (it comes from the tweaks panel), so it pushes the choice out to
  // the shared attribute + storage rather than reading it back.
  React.useEffect(() => { applyTheme(dark); }, [dark]);

  // Only the values the tweaks panel can actually change stay inline.
  const vars = {
    '--accent': t.accent,
    '--sans': fonts.sans, '--mono': fonts.mono, '--letter': fonts.letter,
  };

  let sectionIdx = 0;
  const nextIdx = () => ++sectionIdx;

  return (
    <div className="portfolio-page" style={{ ...vars, background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
      <TopBar dark={dark} setDark={(v) => setTweak('dark', v)} active={active} sections={sections} />

      <main>
        <Hero indexProjects={featured} />

        <section id="work" className="portfolio-section portfolio-work" style={{ padding: '40px 40px 0', scrollMarginTop: 80 }}>
        <Reveal><SectionHead index={nextIdx()} title="Selected Engineering Work" subtitle="Systems-focused projects with emphasis on reliability, data, and APIs" /></Reveal>
        <div className="featured-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 32,
          transition: 'grid-template-columns .3s',
        }}>
          {PROJECTS === null ? (
            <div role="status" style={{ gridColumn: '1 / -1', padding: '28px 0', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)' }}>
              LOADING SELECTED WORK…
            </div>
          ) : featured.length > 0 ? (
            featured.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <ProjectTile project={p} />
              </Reveal>
            ))
          ) : (
            <div role="status" style={{ gridColumn: '1 / -1', padding: '28px 0', fontFamily: 'var(--mono)', fontSize: 10, lineHeight: 1.6, letterSpacing: '0.18em', color: 'var(--muted)' }}>
              SELECTED PROJECTS ARE TEMPORARILY UNAVAILABLE.
            </div>
          )}
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
                <span>VIEW SELECTED WORK →</span>
              </Link>
          </div>
        )}
        </section>

        {t.showAbout && (
          <section id="about" className="portfolio-section" style={{ padding: '120px 40px 0', scrollMarginTop: 80 }}>
            <Reveal><SectionHead index={nextIdx()} title="About" subtitle="Background and focus" /></Reveal>
            <Reveal delay={100}><About /></Reveal>
          </section>
        )}

        {t.showSkills && (
          <section id="skills" className="portfolio-section" style={{ padding: '120px 40px 0', scrollMarginTop: 80 }}>
            <Reveal><SectionHead index={nextIdx()} title="Technical Stack" subtitle="Tools and practices behind my selected work" /></Reveal>
            <Reveal delay={100}><Skills /></Reveal>
          </section>
        )}

        {t.showEducation && (
          <section id="education" className="portfolio-section" style={{ padding: '120px 40px 0', scrollMarginTop: 80 }}>
            <Reveal><SectionHead index={nextIdx()} title="Education" subtitle="Academic background" /></Reveal>
            <Reveal delay={100}><Education /></Reveal>
          </section>
        )}

        <section id="contact" className="portfolio-section portfolio-contact" style={{ padding: '140px 40px 0', scrollMarginTop: 80 }}>
          <Reveal><SectionHead index={nextIdx()} title="Contact" subtitle="Hiring contact" /></Reveal>
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
