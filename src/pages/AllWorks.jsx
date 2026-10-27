// all-works.jsx — curated hiring set with an optional full build archive.

import React from 'react';
import { Link } from 'react-router-dom';
import { projectImageBackground } from '../lib/project-image';
import { externalLinkProps, isUsableHref, projectSlug, projectSourceHref } from '../lib/project-links';
import { curatedProjects } from '../lib/portfolio-curation';
import { projects } from '../lib/projects';
import { useTheme } from '../lib/use-theme';
import Reveal from '../components/Reveal';
import StatusPill from '../components/StatusPill';
import ThemeSwitch from '../components/ThemeSwitch';
import TechnicalCover from '../components/TechnicalCover';

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const countWord = (n) => NUMBER_WORDS[n] || String(n);

function TopBar({ dark, setDark }) {
  return (
    <div className="topbar archive-topbar" style={{
      position: 'sticky', top: 0, zIndex: 40,
      backdropFilter: 'blur(14px) saturate(140%)', WebkitBackdropFilter: 'blur(14px) saturate(140%)',
      background: 'var(--bg-blur)', borderBottom: '1px solid var(--border)',
    }}>
      <div className="archive-topbar-inner" style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', padding: '16px 40px', fontSize: 11,
        letterSpacing: '0.12em', fontFamily: 'var(--mono)',
      }}>
        <Link className="archive-home-link" to="/" style={{ justifySelf: 'start', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg)' }}>
          <span style={{ color: 'var(--muted)' }}>←</span>
          <span>PORTFOLIO</span>
        </Link>
        <ThemeSwitch dark={dark} setDark={setDark} />
        <div />
      </div>
    </div>
  );
}

function WorkCard({ project, index }) {
  const n = String(index + 1).padStart(2, '0');
  const detailSlug = projectSlug(project);
  const sourceHref = projectSourceHref(project);
  const hasSource = isUsableHref(sourceHref);
  return (
    <article className="archive-card" style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 32, padding: '40px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', paddingTop: 4 }}>
        / {n}
      </div>
      <div className="archive-card-content" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'start' }}>
        <Link aria-label={`View ${project.name} case study`} className="archive-card-visual" to={`/project/${detailSlug}`} style={{
          height: 280, position: 'relative', overflow: 'hidden',
          background: 'var(--tile-bg)', border: '1px solid var(--border)',
          cursor: 'pointer', textDecoration: 'none', display: 'block',
        }}
          onMouseEnter={(e) => { const im = e.currentTarget.querySelector('[data-img]'); if (im) { im.style.transform = 'scale(1.04)'; im.style.filter = 'brightness(1.1)'; } }}
          onMouseLeave={(e) => { const im = e.currentTarget.querySelector('[data-img]'); if (im) { im.style.transform = 'scale(1)'; im.style.filter = 'brightness(1)'; } }}
        >
          {project.technicalCover ? (
            <TechnicalCover cover={project.technicalCover} projectName={project.name} compact />
          ) : (
            <div data-img style={{
              position: 'absolute', inset: 0, background: projectImageBackground(project.img),
              transition: 'transform .6s cubic-bezier(.2,.7,.3,1), filter .4s',
            }} />
          )}
          {!project.technicalCover && project.accent && <div style={{ position: 'absolute', inset: 0, background: project.accent, mixBlendMode: 'screen', pointerEvents: 'none' }} />}
          {!project.technicalCover && (
            <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
              <StatusPill project={project} onImage />
            </div>
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.012) 2px 3px)', pointerEvents: 'none',
          }} />
          {!project.technicalCover && <div style={{
            position: 'absolute', bottom: 10, left: 12,
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)',
          }}>
            — {project.kind.toUpperCase()}
          </div>}
        </Link>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)', marginBottom: 16 }}>
            <span>{project.role}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <StatusPill project={project} />
              <span>{project.year}</span>
            </span>
          </div>
          <Link to={`/project/${detailSlug}`} style={{
            fontFamily: 'var(--sans)', fontSize: 'clamp(24px, 2.4vw, 32px)',
            letterSpacing: 'var(--letter)', color: 'var(--fg)', fontWeight: 400,
            lineHeight: 1.1, marginBottom: 16, display: 'block',
            textDecoration: 'none', transition: 'opacity .2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            <h2 style={{ margin: 0, font: 'inherit', letterSpacing: 'inherit', lineHeight: 'inherit' }}>{project.name}</h2>
          </Link>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.55, color: 'var(--muted)', letterSpacing: 'var(--letter)', fontWeight: 300, marginBottom: 24 }}>
            {project.summary}
          </div>
          <div className="archive-stack" style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg)', marginBottom: 20, padding: '6px 10px', display: 'inline-block', border: '1px solid var(--border)', borderRadius: 999 }}>
            {Array.isArray(project.stack) ? project.stack.join(' / ') : project.stack}
          </div>
          <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em' }}>
            {hasSource && (
              <a
                href={sourceHref}
                {...externalLinkProps(sourceHref)}
                aria-label={`Open ${project.name} GitHub repository`}
                style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}
              >
                {project.sourceLabel || 'GITHUB REPO'} ↗
              </a>
            )}
            <Link to={`/project/${detailSlug}`} style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}>CASE STUDY →</Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AllWorks() {
  const [dark, setDark] = useTheme();
  const [showArchive, setShowArchive] = React.useState(false);

  React.useEffect(() => {
    document.title = 'Selected Engineering Work — Richard Zhang';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Five selected backend and full-stack engineering projects, with an optional archive of additional builds.',
    );
  }, []);

  const curated = curatedProjects(projects);
  const selectedProjects = curated.length ? curated : projects.slice(0, 5);
  const selectedSlugs = new Set(selectedProjects.map((project) => projectSlug(project)));
  const archivedProjects = projects.filter((project) => !selectedSlugs.has(projectSlug(project)));
  const visibleProjects = showArchive ? [...selectedProjects, ...archivedProjects] : selectedProjects;
  const years = projects.map((project) => Number(project.year)).filter(Number.isFinite);
  const earliestYear = years.length ? Math.min(...years) : null;
  const latestYear = years.length ? Math.max(...years) : null;
  const yearLabel = earliestYear === latestYear ? String(latestYear || '') : `${earliestYear} — ${latestYear}`;

  // Tokens live in index.css under :root[data-theme]; useTheme sets the attribute.
  return (
    <div className="archive-page" style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
      <TopBar dark={dark} setDark={setDark} />

      <main>
        <div className="archive-hero" style={{ padding: '80px 40px 40px', maxWidth: 1100 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 24 }}>
          / SELECTED WORK — {selectedProjects.length} PROJECTS · {yearLabel}
        </div>
        <h1 style={{
          margin: 0, fontFamily: 'var(--sans)', fontWeight: 400,
          fontSize: 'clamp(40px, 4.5vw, 64px)', lineHeight: 1.05,
          letterSpacing: 'var(--letter)', color: 'var(--fg)',
        }}>
          {/* Was hardcoded to "Five" while the curated set size is dynamic. */}
          {countWord(selectedProjects.length)} projects worth opening.<br /><span style={{ color: 'var(--muted)' }}>The rest stays available as build history.</span>
        </h1>
        </div>

        <div className="archive-list" style={{ padding: '40px 40px 80px' }}>
        {visibleProjects.map((p, i) => (
          <Reveal key={p.name} delay={Math.min(i * 40, 240)}>
            <WorkCard project={p} index={i} />
          </Reveal>
        ))}
        <div style={{ borderTop: '1px solid var(--border)' }} />

        {archivedProjects.length > 0 && (
          <div className="archive-toggle-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 48 }}>
            <div style={{ maxWidth: 560, textAlign: 'center', fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.55, color: 'var(--muted)' }}>
              {showArchive
                ? 'Showing the complete build archive, including experiments and work in progress.'
                : `${archivedProjects.length} additional experiments and work-in-progress builds are kept out of the primary hiring set.`}
            </div>
            <button
              type="button"
              aria-expanded={showArchive}
              onClick={() => setShowArchive((value) => !value)}
              style={{
                padding: '14px 24px', border: '1px solid var(--border)', borderRadius: 999,
                background: 'transparent', color: 'var(--fg)', cursor: 'pointer',
                fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
              }}
            >
              {showArchive ? 'SHOW SELECTED WORK ONLY' : `EXPLORE FULL ARCHIVE (${projects.length})`}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
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
      </main>

      <div className="archive-footer" style={{
        padding: '32px 40px 40px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid var(--border)',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)',
      }}>
        <span>© 2026 / Richard</span>
        <span>CURATED PROJECT ARCHIVE</span>
      </div>
    </div>
  );
}
