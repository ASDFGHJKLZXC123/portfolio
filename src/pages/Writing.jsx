// writing.jsx — index of all posts. Editorial dark style.

import React from 'react';
import { Link } from 'react-router-dom';

const FALLBACK = { posts: [] };

const fmtDate = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
};
const fmtYear = (iso) => iso.slice(0, 4);

export default function Writing() {
  const [dark, setDark] = React.useState(true);
  const [data, setData] = React.useState(FALLBACK);
  const [filter, setFilter] = React.useState('all');

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/writing.json`).then((r) => r.ok ? r.json() : null).then((d) => { if (d) setData(d); }).catch(() => {});
  }, []);

  const vars = {
    '--bg':     dark ? '#0a0a0a' : '#f5f4ef',
    '--fg':     dark ? '#f2f1ec' : '#1a1a1a',
    '--muted':  dark ? 'rgba(242,241,236,0.55)' : 'rgba(26,26,26,0.55)',
    '--border': dark ? 'rgba(242,241,236,0.16)' : 'rgba(26,26,26,0.16)',
    '--sans':   '"Inter Tight", Helvetica, Arial, sans-serif',
    '--mono':   '"JetBrains Mono", ui-monospace, monospace',
    '--letter': '-0.02em',
  };

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
    <div style={{ ...vars, minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--sans)', letterSpacing: 'var(--letter)' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        backdropFilter: 'blur(14px) saturate(140%)', WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        background: dark ? 'rgba(10,10,10,0.72)' : 'rgba(245,244,239,0.72)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em',
      }}>
        <Link to="/" style={{ color: 'var(--fg)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--muted)' }}>←</span>
          <span>R.SYSTEMS</span>
          <span style={{ color: 'var(--muted)' }}>/ WRITING</span>
        </Link>
        <button onClick={() => setDark(!dark)} style={{
          background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg)',
          padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em',
        }}>{dark ? 'LIGHT' : 'DARK'}</button>
      </div>

      <div style={{ padding: '80px 40px 40px', maxWidth: 1100 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 24 }}>
          / WRITING — {data.posts.length} POSTS · 2023–2026
        </div>
        <h1 style={{ margin: 0, fontFamily: 'var(--sans)', fontWeight: 400, fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 1, letterSpacing: '-0.03em' }}>
          Notes from<br />building things.
        </h1>
        <div style={{ marginTop: 32, fontSize: 17, lineHeight: 1.5, color: 'var(--muted)', maxWidth: 600, fontWeight: 300 }}>
          Essays and technical writeups. Mostly thinking out loud about projects, sometimes about the stack, occasionally about the work itself.
        </div>

        <div style={{ marginTop: 40, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tags.map((t) => (
            <button key={t} onClick={() => setFilter(t)} style={{
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
              padding: '8px 16px', borderRadius: 999, cursor: 'pointer',
              background: filter === t ? 'var(--fg)' : 'transparent',
              color: filter === t ? 'var(--bg)' : 'var(--fg)',
              border: '1px solid ' + (filter === t ? 'var(--fg)' : 'var(--border)'),
              transition: 'background .2s, color .2s',
              textTransform: 'uppercase',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {featured && (
        <div style={{ padding: '40px 40px 0', maxWidth: 1100 }}>
          <Link to={`/post/${featured.slug}`} style={{
            display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 40,
            padding: '40px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
            textDecoration: 'none', color: 'var(--fg)', cursor: 'pointer',
            transition: 'padding-left .3s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = '12px'; }}
            onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = '0'; }}
          >
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 16 }}>
                / FEATURED · {fmtDate(featured.date)} · {featured.readTime}
              </div>
              <div style={{ display: 'inline-block', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em', padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 999, marginBottom: 24, textTransform: 'uppercase' }}>
                {featured.tag}
              </div>
            </div>
            <div>
              <h2 style={{ margin: 0, fontWeight: 400, fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 18 }}>
                {featured.title}
              </h2>
              <div style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 560 }}>
                {featured.summary}
              </div>
              <div style={{ marginTop: 20, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                READ →
              </div>
            </div>
          </Link>
        </div>
      )}

      <div style={{ padding: '60px 40px 100px', maxWidth: 1100 }}>
        {years.map((y) => (
          <div key={y} style={{ marginBottom: 60 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24, alignItems: 'start' }}>
              <div style={{ position: 'sticky', top: 80, fontFamily: 'var(--sans)', fontSize: 56, fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--muted)' }}>
                {y}
              </div>
              <div>
                {grouped[y].map((p, i) => (
                  <Link key={p.slug} to={`/post/${p.slug}`} style={{
                    display: 'grid', gridTemplateColumns: '90px 1fr 80px 60px', gap: 20,
                    alignItems: 'baseline', padding: '24px 0',
                    borderTop: '1px solid var(--border)',
                    borderBottom: i === grouped[y].length - 1 ? '1px solid var(--border)' : 'none',
                    textDecoration: 'none', color: 'var(--fg)',
                    transition: 'padding-left .3s, color .2s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = '12px'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = '0'; }}
                  >
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)' }}>
                      {fmtDate(p.date).split(' ').slice(0, 2).join(' ')}
                    </span>
                    <span>
                      <div style={{ fontSize: 19, fontWeight: 400, marginBottom: 4, letterSpacing: '-0.01em' }}>{p.title}</div>
                      <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>{p.summary}</div>
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                      {p.tag}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--muted)', textAlign: 'right' }}>
                      {p.readTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: 80, textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em' }}>
            NO POSTS IN THIS TAG.
          </div>
        )}

        <div style={{ marginTop: 40, paddingTop: 40, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)' }}>
          <span>R.SYSTEMS / WRITING</span>
          <Link to="/" style={{ color: 'var(--fg)', textDecoration: 'none' }}>← BACK TO PORTFOLIO</Link>
        </div>
      </div>
    </div>
  );
}
