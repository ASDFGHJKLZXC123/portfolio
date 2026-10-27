// writing.jsx — index of all posts. Editorial dark style.

import React from 'react';
import { Link } from 'react-router-dom';
import { EdPage, EdFooter, PageHeading, Reveal, useDarkMode } from '../components/editorial';

const FALLBACK = { posts: [] };

const fmtDate = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
};
const fmtYear = (iso) => iso.slice(0, 4);

export default function Writing() {
  const [dark, setDark] = useDarkMode();
  const [data, setData] = React.useState(FALLBACK);
  const [filter, setFilter] = React.useState('all');

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/writing.json`).then((r) => r.ok ? r.json() : null).then((d) => { if (d) setData(d); }).catch(() => {});
  }, []);

  React.useEffect(() => { window.scrollTo(0, 0); }, []);

  const tags = ['all', ...Array.from(new Set(data.posts.map((p) => p.tag)))];
  const filtered = filter === 'all' ? data.posts : data.posts.filter((p) => p.tag === filter);
  const featured = filtered.find((p) => p.featured) || filtered[0];
  const rest = filtered.filter((p) => p !== featured);

  const grouped = {};
  for (const p of rest) {
    const y = fmtYear(p.date);
    (grouped[y] = grouped[y] || []).push(p);
  }
  const years = Object.keys(grouped).sort().reverse();

  return (
    <EdPage dark={dark} setDark={setDark} back={{ to: '/', label: 'PORTFOLIO' }} crumb="WRITING">
      <PageHeading
        eyebrow={`/ WRITING — ${data.posts.length} POSTS · 2023–2026`}
        lines={['Notes from', { text: 'building things.', em: true }]}
      >
        <p className="ed-lead ed-lead--lg" style={{ marginTop: 36 }}>
          Essays and technical writeups. Mostly thinking out loud about projects, sometimes about the stack, occasionally about the work itself.
        </p>
        <div className="ed-filters" role="group" aria-label="Filter by tag">
          {tags.map((t) => (
            <button key={t} type="button" onClick={() => setFilter(t)} aria-pressed={filter === t}
              className={`ed-filter${filter === t ? ' is-on' : ''}`}>
              {t}
            </button>
          ))}
        </div>
      </PageHeading>

      {featured && (
        <section className="ed-page-section" style={{ paddingTop: 24 }}>
          <Reveal key={featured.slug}>
            <Link to={`/post/${featured.slug}`} className="ed-feature">
              <div className="ed-feature-meta">
                <span>/ FEATURED · {fmtDate(featured.date)} · {featured.readTime}</span>
                <span className="ed-pill">{featured.tag.toUpperCase()}</span>
              </div>
              <div>
                <h2 className="ed-feature-title">{featured.title}</h2>
                <p className="ed-feature-summary">{featured.summary}</p>
                <span className="ed-feature-read">READ <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      <section className="ed-page-section">
        {years.map((y) => (
          <div key={y} className="ed-year-group">
            <div className="ed-year">{y}</div>
            <div className="ed-post-list">
              {grouped[y].map((p) => (
                <Link key={p.slug} to={`/post/${p.slug}`} className="ed-post-row">
                  <span className="ed-post-date">{fmtDate(p.date).split(' ').slice(0, 2).join(' ')}</span>
                  <span>
                    <span className="ed-post-title">{p.title}</span>
                    <span className="ed-post-summary">{p.summary}</span>
                  </span>
                  <span className="ed-post-tag">{p.tag}</span>
                  <span className="ed-post-time">{p.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="ed-empty">NO POSTS IN THIS TAG.</div>
        )}
      </section>

      <EdFooter left="Richard's Portfolio Page / WRITING" right={`${data.posts.length} POSTS`} />
    </EdPage>
  );
}
