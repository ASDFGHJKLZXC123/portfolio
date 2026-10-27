// all-works.jsx — full archive of every project, editorial dark style (shared via components/editorial).
// Project data is loaded from projects.json. The fallback below is for offline preview only.

import React from 'react';
import { Link } from 'react-router-dom';
import { projectImageBackground } from '../lib/project-image';
import { externalLinkProps, isUsableHref, projectSlug, projectSourceHref } from '../lib/project-links';
import { EdPage, EdFooter, PageHeading, Reveal, StatusPill, pad2, useDarkMode } from '../components/editorial';

const PROJECTS_FALLBACK = [
  { name: 'INFORM.UCI',   kind: 'sponsor capstone',     stack: 'REACT / NODE / POSTGRES',    year: '2026',
    summary: 'Sponsor-capstone project with a healthcare startup. Intake triage tool used by three pilot clinics.',
    role: 'Full-stack lead · team of 4',
    img: 'linear-gradient(135deg,#0b2a3a 0%,#0d3b4f 40%,#1e6580 100%)',
    accent: 'radial-gradient(ellipse at 30% 40%, rgba(80,200,220,.35), transparent 55%)' },
  { name: 'LATECHEF',     kind: 'personal · web app',    stack: 'NEXT / POSTGRES / LLM',     year: '2026',
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

function WorkRow({ project, index }) {
  const detailSlug = projectSlug(project);
  const sourceHref = projectSourceHref(project);
  const hasSource = isUsableHref(sourceHref);
  const stack = Array.isArray(project.stack) ? project.stack.join(' · ') : project.stack;
  return (
    <article className="ed-work-row">
      <div className="ed-work-row-index">/ {pad2(index + 1)}</div>
      <Link to={`/project/${detailSlug}`} className="ed-card-media" aria-label={`${project.name} case study`}>
        <div className="ed-card-img" style={{ background: projectImageBackground(project.img) }} />
        {project.accent && <div style={{ position: 'absolute', inset: 0, background: project.accent, mixBlendMode: 'screen', pointerEvents: 'none' }} />}
        <div className="ed-card-shade" aria-hidden="true" />
        <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 2 }}>
          <StatusPill project={project} onImage />
        </div>
        <span className="ed-card-cta" aria-hidden="true">VIEW CASE STUDY <b>↗</b></span>
      </Link>
      <div className="ed-work-row-body">
        <div className="ed-work-row-meta">
          <span>{project.role}</span>
          <span>{project.year}</span>
        </div>
        <Link to={`/project/${detailSlug}`} className="ed-work-row-title">{project.name}</Link>
        {project.kind && <div className="ed-work-row-kind">— {project.kind.toUpperCase()}</div>}
        <p className="ed-work-row-summary">{project.summary}</p>
        <div className="ed-card-stack"><span>Stack: </span>{stack}</div>
        <div className="ed-card-links">
          <Link to={`/project/${detailSlug}`} className="ed-link ed-link--strong">CASE STUDY →</Link>
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

export default function AllWorks() {
  const [dark, setDark] = useDarkMode();
  const [PROJECTS, setProjects] = React.useState([]);

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/projects.json`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data && data.projects) setProjects(data.projects); })
      .catch(() => {});
  }, []);

  React.useEffect(() => { window.scrollTo(0, 0); }, []);

  const projectsList = PROJECTS.length ? PROJECTS : PROJECTS_FALLBACK;

  return (
    <EdPage dark={dark} setDark={setDark} back={{ to: '/', label: 'PORTFOLIO' }} crumb="ALL WORKS">
      <PageHeading
        eyebrow={`/ ALL WORKS — ${projectsList.length} PROJECTS · 2023 — 2026`}
        lines={['Everything I\'ve built —', { text: 'shipped, half-shipped, or learned from.', muted: true }]}
      />

      <section className="ed-page-section">
        {projectsList.map((p, i) => (
          <Reveal key={p.name} delay={Math.min(i, 3) * 60}>
            <WorkRow project={p} index={i} />
          </Reveal>
        ))}

        <div className="ed-more">
          <Link to="/" className="ed-btn ed-btn--wide">
            <span aria-hidden="true">←</span>BACK TO PORTFOLIO
          </Link>
        </div>
      </section>

      <EdFooter left="© 2026 / Richard" right="LAST SYNC · 04.26" />
    </EdPage>
  );
}
