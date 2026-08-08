// project.jsx — detail page for a single project. Reads slug from URL.

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectImageBackground, projectImageSource } from '../lib/project-image';
import { externalLinkProps, isUsableHref, projectLinkHref } from '../lib/project-links';
import { curatedProjects } from '../lib/portfolio-curation';
import { useTheme } from '../lib/use-theme';
import Reveal from '../components/Reveal';
import { BuildNotes, CaseSection } from '../components/CaseSections';
import TechnicalCover from '../components/TechnicalCover';

const pendingStatusLabel = (project) => project.status === 'in-progress'
  ? 'IN PROGRESS'
  : project.status === 'verification-pending'
    ? 'VERIFICATION PENDING'
    : '';
const projectStatusLabel = (project) => pendingStatusLabel(project) || 'COMPLETE';

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

function TopBar({ dark, setDark, projectName }) {
  const themeBtn = (on) => ({
    border: 'none', padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
    background: on ? 'var(--fg)' : 'transparent',
    color: on ? 'var(--bg)' : 'var(--muted)',
    fontSize: 9, letterSpacing: '0.18em', fontFamily: 'inherit', fontWeight: 600,
    transition: 'background .2s, color .2s',
  });
  return (
    <div className="topbar project-topbar" style={{
      position: 'sticky', top: 0, zIndex: 40,
      backdropFilter: 'blur(14px) saturate(140%)', WebkitBackdropFilter: 'blur(14px) saturate(140%)',
      background: 'var(--bg-blur)', borderBottom: '1px solid var(--border)',
    }}>
      <div className="project-topbar-inner" style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', padding: '16px 40px', fontSize: 11,
        letterSpacing: '0.12em', fontFamily: 'var(--mono)',
      }}>
        <div className="project-breadcrumb" style={{ justifySelf: 'start', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/all-works" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg)' }}>
            <span style={{ color: 'var(--muted)' }}>←</span>
            <span>ALL WORKS</span>
          </Link>
          <span style={{ color: 'var(--muted)' }}>/</span>
          <span className="project-breadcrumb-name" style={{ color: 'var(--muted)' }}>{projectName || '—'}</span>
        </div>
        <div className="theme-switch" role="group" aria-label="Color theme" style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 999, padding: 2 }}>
          <button aria-pressed={dark} onClick={() => setDark(true)} style={themeBtn(dark)}>DARK</button>
          <button aria-pressed={!dark} onClick={() => setDark(false)} style={themeBtn(!dark)}>LIGHT</button>
        </div>
        <Link className="project-contact-cta" to="/#contact" style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg)', textDecoration: 'none' }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--fg)', boxShadow: '0 0 8px var(--fg)' }} />
          <span>INITIATE DIALOGUE</span>
        </Link>
      </div>
    </div>
  );
}

// `kind` is the only per-project descriptor that actually varies — role is
// "Solo" and year is "2026" on all 27 entries, so two of the four meta cells
// used to read identically on every case study.
function focusLabel(p) {
  const kind = typeof p.kind === 'string' ? p.kind : '';
  const tail = kind.split('·').pop().trim();
  return (tail || kind || 'Software').toUpperCase();
}

function Hero({ p }) {
  const stack = Array.isArray(p.stack) ? p.stack : (p.stack ? [p.stack] : []);
  return (
    <div className="project-hero" style={{ padding: '60px 40px 0' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 24 }}>
        / {(p.kind || 'project').toUpperCase()} · {p.year}
      </div>
      {pendingStatusLabel(p) && (
        <div style={{ marginBottom: 18 }}>
          <StatusPill project={p} />
        </div>
      )}
      <h1 className="project-title" style={{
        margin: 0, fontFamily: 'var(--sans)', fontWeight: 400,
        fontSize: 'clamp(48px, 6vw, 92px)', lineHeight: 1, letterSpacing: 'var(--letter)', color: 'var(--fg)',
      }}>{p.name}</h1>
      <div className="project-summary" style={{
        marginTop: 24, fontFamily: 'var(--sans)', fontSize: 'clamp(18px, 1.6vw, 22px)',
        color: 'var(--muted)', maxWidth: 720, lineHeight: 1.5, fontWeight: 300, letterSpacing: 'var(--letter)',
      }}>
        {p.summary}
      </div>

      <div className="project-meta-grid" style={{
        marginTop: 56, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        border: '1px solid var(--border)',
      }}>
        {[
          { k: 'FOCUS', v: focusLabel(p) },
          { k: 'ROLE', v: p.role },
          { k: 'TIMELINE', v: p.timeline },
          { k: 'STATUS', v: projectStatusLabel(p) },
        ].map((m, i, arr) => (
          <div key={m.k} className="project-meta-item" style={{
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

      {/* Stack was previously joined with " / " into one meta cell — ten
          entries in a 180px column wrapped into an unreadable block. */}
      {stack.length > 0 && (
        <div className="project-stack-row">
          <span className="project-stack-label">/ STACK</span>
          <ul className="project-stack-list">
            {stack.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProjectMedia({ p }) {
  const media = p.media || {};
  const technicalCover = p.technicalCover && typeof p.technicalCover === 'object' ? p.technicalCover : null;
  const rawSource = projectImageSource(media.src || p.img);
  const shouldRefresh = media.state === 'refresh';
  const requestedSource = shouldRefresh ? '' : rawSource;
  const [failedSource, setFailedSource] = React.useState('');
  const imageFailed = Boolean(requestedSource && failedSource === requestedSource);
  const source = imageFailed ? '' : requestedSource;
  const layout = media.layout === 'portrait' ? 'portrait' : 'landscape';
  const interfaceLabel = media.label || (layout === 'portrait' ? 'MOBILE INTERFACE' : 'PROJECT INTERFACE');
  const label = technicalCover?.label || interfaceLabel;
  const alt = media.alt || `${p.name} project interface`;
  const normalizedAlt = alt.replace(/[.\s]+$/, '');
  const interfaceCaption = media.caption || 'Primary project interface';
  const caption = technicalCover?.caption || interfaceCaption;
  const placeholderState = imageFailed ? 'SCREENSHOT UNAVAILABLE' : shouldRefresh ? 'SCREENSHOT REFRESH NEEDED' : 'INTERFACE PREVIEW';
  const placeholderBackground = rawSource
    ? 'linear-gradient(135deg, #11151a 0%, #18212b 52%, #243241 100%)'
    : projectImageBackground(p.img);

  return (
    <>
    <figure className={`project-media project-media--${layout}`}>
      <div className="project-media-heading">
        <span>/ {label}</span>
        <span>{p.name} · 01</span>
      </div>

      <div
        className={`project-media-stage project-media-stage--${layout}${source || technicalCover ? '' : ' project-media-stage--placeholder'}${technicalCover ? ' project-media-stage--technical' : ''}`}
        style={source || technicalCover ? undefined : { background: placeholderBackground }}
      >
        {technicalCover ? (
          <TechnicalCover cover={technicalCover} projectName={p.name} />
        ) : source ? (
          <img
            className="project-media-image"
            src={source}
            width={media.width}
            height={media.height}
            alt={alt}
            loading="eager"
            fetchpriority="high"
            decoding="async"
            onError={() => setFailedSource(requestedSource)}
          />
        ) : (
          <div
            className={`project-media-placeholder project-media-placeholder--${layout}`}
            role="img"
            aria-label={`${normalizedAlt}. ${placeholderState.toLowerCase()}.`}
          >
            <span>/ {label}</span>
            <strong>{p.name}</strong>
            <div className="project-media-placeholder-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <small>{placeholderState}</small>
          </div>
        )}
      </div>

      <figcaption className="project-media-caption">
        <span>{caption}</span>
        {technicalCover ? (
          <span>REPOSITORY-GROUNDED TECHNICAL VIEW</span>
        ) : source ? (
          <a href={source} target="_blank" rel="noreferrer" aria-label={`Open full-size ${p.name} project screenshot`}>
            OPEN FULL SIZE ↗
          </a>
        ) : (
          <span>{placeholderState}</span>
        )}
      </figcaption>
    </figure>
    {technicalCover && source && (
      <figure className={`project-media project-media--${layout} project-media--supporting`}>
        <div className="project-media-heading">
          <span>/ SUPPORTING INTERFACE · {interfaceLabel}</span>
          <span>{p.name} · 02</span>
        </div>
        <div className={`project-media-stage project-media-stage--${layout}`}>
          <img
            className="project-media-image"
            src={source}
            width={media.width}
            height={media.height}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailedSource(requestedSource)}
          />
        </div>
        <figcaption className="project-media-caption">
          <span>{interfaceCaption}</span>
          <a href={source} target="_blank" rel="noreferrer" aria-label={`Open full-size ${p.name} supporting interface screenshot`}>
            OPEN FULL SIZE ↗
          </a>
        </figcaption>
      </figure>
    )}
    </>
  );
}

function NextProject({ current, projects }) {
  const slugs = Object.keys(projects);
  if (!slugs.length) return null;
  const idx = slugs.indexOf(current);
  const nextSlug = slugs[(idx + 1) % slugs.length];
  const next = projects[nextSlug];
  return (
    <Link className="next-project" to={`/project/${nextSlug}`} style={{
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
      <div className="next-project-title-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 24 }}>
        <h2 className="next-project-title" style={{
          margin: 0,
          fontFamily: 'var(--sans)', fontSize: 'clamp(40px, 5vw, 72px)',
          fontWeight: 400, letterSpacing: 'var(--letter)', color: 'var(--fg)', lineHeight: 1,
        }}>
          {next.name}
        </h2>
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
  const [dark, setDark] = useTheme();
  const [PROJECTS, setProjects] = React.useState(null);
  const { slug } = useParams();

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/projects.json`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && data.projects) {
          const map = {};
          for (const p of data.projects) map[p.slug] = p;
          setProjects(map);
        } else {
          setProjects({});
        }
      })
      .catch(() => setProjects({}));
  }, []);

  React.useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const p = PROJECTS?.[slug];
  const allProjects = PROJECTS
    ? Object.entries(PROJECTS).map(([projectSlug, project]) => ({ slug: project.slug || projectSlug, ...project }))
    : [];
  const publicProjects = curatedProjects(allProjects);
  const nextProjectsList = publicProjects.some((project) => project.slug === slug) ? publicProjects : allProjects;
  const nextProjects = Object.fromEntries(nextProjectsList.map((project) => [project.slug, project]));

  React.useEffect(() => {
    if (PROJECTS === null) return;
    document.title = p ? `${p.name} — Richard Zhang` : 'Project Not Found — Richard Zhang';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      p?.summary || 'The requested project case study could not be found.',
    );
  }, [p, PROJECTS]);

  // Tokens live in index.css under :root[data-theme]; useTheme sets the attribute.
  const shell = { background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', fontFamily: 'var(--sans)' };

  if (PROJECTS === null) {
    return (
      <div className="project-page" style={shell}>
        <TopBar dark={dark} setDark={setDark} projectName="LOADING" />
        <main className="project-loading" style={{ padding: '120px 40px', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--muted)' }}>
          LOADING CASE STUDY…
        </main>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="project-page" style={shell}>
        <TopBar dark={dark} setDark={setDark} projectName="NOT FOUND" />
        <main className="project-loading" style={{ padding: '120px 40px', maxWidth: 700 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 16 }}>/ 404</div>
          <h1 style={{ fontWeight: 400, fontSize: 48, letterSpacing: 'var(--letter)', margin: 0 }}>Project not found.</h1>
          <Link to="/all-works" style={{ display: 'inline-block', marginTop: 32, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}>← BACK TO ALL WORKS</Link>
        </main>
      </div>
    );
  }

  const usableLinks = (p.links || [])
    .map((link) => ({ link, href: projectLinkHref(p, link) }))
    .filter(({ href }) => isUsableHref(href));

  // A malformed entry used to white-screen the whole page here.
  const sections = Array.isArray(p.sections) ? p.sections : [];

  return (
    <div className="project-page" style={shell}>
      <TopBar dark={dark} setDark={setDark} projectName={p.name} />

      <main className="project-main">
        <Reveal>
          <Hero p={p} />
        </Reveal>
        <Reveal delay={80}>
          <ProjectMedia p={p} />
        </Reveal>

        <div className="case-content" style={{ padding: '40px 40px 0' }}>
          <div className="case-content-heading">
            <span>/ CASE STUDY</span>
            <h2>Inside the build</h2>
          </div>
          {sections.map((s, i) => <CaseSection key={i} section={s} />)}
          <BuildNotes details={p.details} />
        </div>

        {usableLinks.length > 0 && (
          <Reveal>
          <div className="project-links" style={{ padding: '60px 40px 0' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 16 }}>
            / LINKS
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {usableLinks.map(({ link: l, href }) => (
            <a key={l.k} href={href} {...externalLinkProps(href)} style={{
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
          </Reveal>
        )}

        <Reveal>
          <NextProject current={slug} projects={nextProjects} />
        </Reveal>
      </main>

      <div className="project-footer" style={{
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
