// now.jsx — /now page · what I'm working on right now. Same editorial dark style.

import React from 'react';
import { Link } from 'react-router-dom';

const FALLBACK = {
  currently: { updated: '2026-04-26', items: ['Building things', 'Reading things', 'Looking for work'] },
  entries: [],
};

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
}

export default function Now() {
  const [dark, setDark] = React.useState(true);
  const [data, setData] = React.useState(FALLBACK);

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/now.json`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setData(d); })
      .catch(() => {});
  }, []);

  const vars = {
    '--bg':      dark ? '#0a0a0a' : '#f5f4ef',
    '--fg':      dark ? '#f2f1ec' : '#1a1a1a',
    '--muted':   dark ? 'rgba(242,241,236,0.55)' : 'rgba(26,26,26,0.55)',
    '--border':  dark ? 'rgba(242,241,236,0.16)' : 'rgba(26,26,26,0.16)',
    '--sans':    '"Inter Tight", Helvetica, Arial, sans-serif',
    '--mono':    '"JetBrains Mono", ui-monospace, monospace',
    '--letter':  '-0.02em',
  };

  const lastUpdated = data.currently?.updated ? fmtDate(data.currently.updated) : '';

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
          <span>Richard's Portfolio Page</span>
          <span style={{ color: 'var(--muted)' }}>/ NOW</span>
        </Link>
        <button onClick={() => setDark(!dark)} style={{
          background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg)',
          padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em',
        }}>{dark ? 'LIGHT' : 'DARK'}</button>
      </div>

      <div style={{ padding: '80px 40px 40px', maxWidth: 880 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7ec97e', boxShadow: '0 0 10px #7ec97e' }} />
          / CURRENTLY · UPDATED {lastUpdated}
        </div>
        <h1 style={{
          margin: 0, fontFamily: 'var(--sans)', fontWeight: 400,
          fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 1, letterSpacing: '-0.03em',
        }}>
          What I'm doing<br />right now.
        </h1>
        <div style={{ marginTop: 32, fontSize: 17, lineHeight: 1.5, color: 'var(--fg)', maxWidth: 600, fontWeight: 300 }}>
          A working journal. Updated weekly-ish. Inspired by{' '}
          <a href="https://nownownow.com" target="_blank" rel="noreferrer" style={{ color: 'var(--fg)', textDecorationThickness: 1, textUnderlineOffset: 4 }}>nownownow.com</a>.
        </div>

        {data.currently?.items?.length > 0 && (
          <div style={{ marginTop: 48, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {data.currently.items.map((it, i) => (
              <div key={i} style={{
                fontFamily: 'var(--sans)', fontSize: 14, padding: '10px 18px',
                border: '1px solid var(--border)', borderRadius: 999,
                background: dark ? 'rgba(242,241,236,0.04)' : 'rgba(26,26,26,0.04)',
              }}>{it}</div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '40px 40px 100px', maxWidth: 880 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 24 }}>
          / JOURNAL — {data.entries.length} ENTRIES
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 6, top: 8, bottom: 8, width: 1,
            background: 'var(--border)',
          }} />

          {data.entries.map((e, i) => (
            <div key={i} style={{
              position: 'relative', paddingLeft: 36, paddingBottom: 40,
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 8,
                width: 13, height: 13, borderRadius: '50%',
                background: 'var(--bg)', border: '1px solid var(--fg)',
              }}>
                {i === 0 && (
                  <div style={{
                    position: 'absolute', inset: 2, borderRadius: '50%', background: '#7ec97e',
                    boxShadow: '0 0 12px #7ec97e',
                  }} />
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)' }}>
                  {fmtDate(e.date)}
                </span>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em',
                  padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 999,
                  color: 'var(--fg)',
                }}>{e.tag}</span>
              </div>
              <div style={{
                fontFamily: 'var(--sans)', fontSize: 22, fontWeight: 400,
                letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 10,
              }}>
                {e.title}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 640 }}>
                {e.body}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)' }}>
          <span>Richard's Portfolio Page / NOW</span>
          <Link to="/" style={{ color: 'var(--fg)', textDecoration: 'none' }}>← BACK TO PORTFOLIO</Link>
        </div>
      </div>
    </div>
  );
}
