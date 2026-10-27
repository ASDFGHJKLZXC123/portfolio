// now.jsx — /now page · what I'm working on right now. Editorial dark style.

import React from 'react';
import { EdPage, EdFooter, PageHeading, Reveal, useDarkMode } from '../components/editorial';

const FALLBACK = {
  currently: { updated: '2026-04-26', items: ['Building things', 'Reading things', 'Looking for work'] },
  entries: [],
};

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
}

export default function Now() {
  const [dark, setDark] = useDarkMode();
  const [data, setData] = React.useState(FALLBACK);

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/now.json`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setData(d); })
      .catch(() => {});
  }, []);

  React.useEffect(() => { window.scrollTo(0, 0); }, []);

  const lastUpdated = data.currently?.updated ? fmtDate(data.currently.updated) : '';

  return (
    <EdPage dark={dark} setDark={setDark} back={{ to: '/', label: 'PORTFOLIO' }} crumb="NOW">
      <PageHeading
        dot
        eyebrow={`/ CURRENTLY · UPDATED ${lastUpdated}`}
        lines={['What I\'m doing', { text: 'right now.', em: true }]}
      >
        <p className="ed-lead ed-lead--lg" style={{ marginTop: 36, color: 'var(--fg)' }}>
          A working journal. Updated weekly-ish. Inspired by{' '}
          <a href="https://nownownow.com" target="_blank" rel="noreferrer" className="ed-link ed-link--inline">nownownow.com</a>.
        </p>
        {data.currently?.items?.length > 0 && (
          <ol className="ed-now-list">
            {data.currently.items.map((it, i) => (
              <li key={i}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{it}</li>
            ))}
          </ol>
        )}
      </PageHeading>

      <section className="ed-page-section ed-narrow">
        <div className="ed-list-head">
          <span>/ JOURNAL</span>
          <span>{data.entries.length} ENTRIES</span>
        </div>

        <ol className="ed-timeline">
          {data.entries.map((e, i) => (
            <li key={i}>
              <Reveal delay={Math.min(i, 3) * 60}>
                <div className="ed-timeline-item">
                  <span className={`ed-timeline-node${i === 0 ? ' is-latest' : ''}`} aria-hidden="true" />
                  <div className="ed-timeline-meta">
                    <span>{fmtDate(e.date)}</span>
                    <span className="ed-pill">{e.tag}</span>
                  </div>
                  <div>
                    <h2 className="ed-timeline-title">{e.title}</h2>
                    <p className="ed-timeline-body">{e.body}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <EdFooter left="Richard's Portfolio Page / NOW" right={lastUpdated && `UPDATED · ${lastUpdated}`} />
    </EdPage>
  );
}
