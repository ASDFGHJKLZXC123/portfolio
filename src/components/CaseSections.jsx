// CaseSections.jsx — the renderers for a case study's body.
//
// Every project used to render the identical five-slot skeleton
// (paragraph, paragraph, metrics, paragraph, paragraph), which meant three
// case studies read as the same page three times. These add the section kinds
// that let a project's structure follow its actual story.

import React from 'react';
import Reveal from './Reveal';

/* ---------------------------------------------------------------- paragraph */

export function Paragraph({ section, headingLevel = 'h3' }) {
  const Heading = headingLevel;
  return (
    <Reveal>
      <section className="case-paragraph">
        <Heading className="case-section-label">/ {section.label}</Heading>
        <div className="case-section-body">{section.body}</div>
      </section>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ metrics */

// Only ~28% of metric values across the dataset start with a digit. Rendering
// "Singleton/DAO/Observer" at clamp(28px,3vw,44px) made the grid look broken and
// undercut the big-number promise for the values that *are* numbers, so the two
// are now separated and typeset differently.
const isNumeric = (v) => /^[\d(]|^[<>~+]?\s*\d/.test(String(v ?? '').trim());

export function Metrics({ section }) {
  const items = Array.isArray(section.items) ? section.items : [];
  const numbers = items.filter((m) => isNumeric(m.v));
  const facts = items.filter((m) => !isNumeric(m.v));

  if (!items.length) return null;

  return (
    <Reveal>
      <section className="case-block">
        <h3 className="case-section-label case-block-label">
          / {section.label || 'ENGINEERING SIGNALS'}
        </h3>

        {numbers.length > 0 && (
          <div className="case-metrics" data-count={numbers.length}>
            {numbers.map((m) => (
              <div key={m.k} className="case-metric">
                <div className="case-metric-value">{m.v}</div>
                <div className="case-metric-key">{m.k}</div>
              </div>
            ))}
          </div>
        )}

        {facts.length > 0 && (
          <dl className="case-specs">
            {facts.map((m) => (
              <div key={m.k} className="case-spec">
                <dt>{m.k}</dt>
                <dd>{m.v}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ diagram */

export function Diagram({ section }) {
  const nodes = Array.isArray(section.nodes) ? section.nodes : [];
  const branches = Array.isArray(section.branches) ? section.branches : [];
  if (!nodes.length) return null;

  return (
    <Reveal>
      <section className="case-block">
        <h3 className="case-section-label case-block-label">/ {section.label || 'ARCHITECTURE'}</h3>

        <div className="case-diagram">
          <ol className="case-diagram-flow">
            {nodes.map((n, i) => (
              <li key={n.t} className="case-diagram-node">
                <span className="case-diagram-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="case-diagram-title">{n.t}</span>
                <span className="case-diagram-sub">{n.s}</span>
              </li>
            ))}
          </ol>

          {branches.length > 0 && (
            <ul className="case-diagram-branches">
              {branches.map((b) => (
                <li
                  key={b.t}
                  className="case-diagram-branch"
                  data-tone={b.tone === 'warn' ? 'warn' : 'ok'}
                >
                  <span className="case-diagram-branch-title">{b.t}</span>
                  <span className="case-diagram-sub">{b.s}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {section.caption && <p className="case-block-caption">{section.caption}</p>}
      </section>
    </Reveal>
  );
}

/* --------------------------------------------------------------------- code */

export function Code({ section }) {
  if (!section.body) return null;
  return (
    <Reveal>
      <section className="case-block">
        <h3 className="case-section-label case-block-label">/ {section.label || 'CODE'}</h3>
        <figure className="case-code">
          <div className="case-code-bar">
            <span>{section.lang || 'CODE'}</span>
            <span>{section.label}</span>
          </div>
          <pre className="case-code-body">
            <code>{section.body}</code>
          </pre>
          {section.caption && <figcaption>{section.caption}</figcaption>}
        </figure>
      </section>
    </Reveal>
  );
}

/* ---------------------------------------------------------------- tradeoffs */

export function Tradeoffs({ section }) {
  const items = Array.isArray(section.items) ? section.items : [];
  if (!items.length) return null;
  return (
    <Reveal>
      <section className="case-block">
        <h3 className="case-section-label case-block-label">/ {section.label || 'TRADEOFFS'}</h3>
        <ul className="case-tradeoffs">
          {items.map((t) => (
            <li key={t.d} className="case-tradeoff">
              <h4 className="case-tradeoff-decision">{t.d}</h4>
              <div className="case-tradeoff-cols">
                <div>
                  <span className="case-tradeoff-tag">WHY</span>
                  <p>{t.w}</p>
                </div>
                <div>
                  <span className="case-tradeoff-tag case-tradeoff-tag--cost">COST</span>
                  <p>{t.c}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}

/* ------------------------------------------------------------ build details */

// `details` carries three substantive technical bullets on all 27 projects and
// was rendered by nothing — grep for it in src/ before this returned no hits.
export function BuildNotes({ details }) {
  const items = (details || []).filter(Boolean);
  if (!items.length) return null;
  return (
    <Reveal>
      <section className="case-block">
        <h3 className="case-section-label case-block-label">/ BUILD NOTES</h3>
        <ol className="case-notes">
          {items.map((d, i) => (
            <li key={i} className="case-note">
              <span className="case-note-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="case-note-body">{d}</span>
            </li>
          ))}
        </ol>
      </section>
    </Reveal>
  );
}

/* -------------------------------------------------------------- dispatchers */

const RENDERERS = {
  paragraph: Paragraph,
  metrics: Metrics,
  diagram: Diagram,
  code: Code,
  tradeoffs: Tradeoffs,
};

export function CaseSection({ section }) {
  if (!section || typeof section !== 'object') return null;
  const Renderer = RENDERERS[section.kind] || Paragraph;
  return <Renderer section={section} />;
}

export default CaseSection;
