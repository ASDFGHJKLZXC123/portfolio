// post.jsx — individual post detail page. Reads slug from URL.

import React from 'react';
import { Link, useParams } from 'react-router-dom';

const FALLBACK = { posts: [] };

const fmtDate = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
};

export default function Post() {
  const [dark, setDark] = React.useState(true);
  const [data, setData] = React.useState(FALLBACK);
  const [progress, setProgress] = React.useState(0);
  const { slug } = useParams();

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/writing.json`).then((r) => r.ok ? r.json() : null).then((d) => { if (d) setData(d); }).catch(() => {});
  }, []);

  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const vars = {
    '--bg':     dark ? '#0a0a0a' : '#f5f4ef',
    '--fg':     dark ? '#f2f1ec' : '#1a1a1a',
    '--muted':  dark ? 'rgba(242,241,236,0.55)' : 'rgba(26,26,26,0.55)',
    '--border': dark ? 'rgba(242,241,236,0.16)' : 'rgba(26,26,26,0.16)',
    '--sans':   '"Inter Tight", Helvetica, Arial, sans-serif',
    '--mono':   '"JetBrains Mono", ui-monospace, monospace',
    '--serif':  '"Fraunces", Georgia, serif',
    '--letter': '-0.02em',
  };

  const post = data.posts.find((p) => p.slug === slug);
  const idx = data.posts.findIndex((p) => p.slug === slug);
  const next = idx >= 0 ? data.posts[(idx + 1) % data.posts.length] : null;

  if (!post && data.posts.length > 0) {
    return (
      <div style={{ ...vars, minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 16 }}>/ 404</div>
          <h1 style={{ fontWeight: 400, fontSize: 48, margin: '0 0 24px', letterSpacing: '-0.02em' }}>Post not found.</h1>
          <Link to="/writing" style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg)' }}>← BACK TO WRITING</Link>
        </div>
      </div>
    );
  }
  if (!post) return null;

  const body = Array.isArray(post.body) ? post.body : [post.body || ''];

  return (
    <div style={{ ...vars, minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--sans)', letterSpacing: 'var(--letter)' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'transparent', zIndex: 50 }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: 'var(--fg)', transition: 'width .1s' }} />
      </div>

      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        backdropFilter: 'blur(14px) saturate(140%)', WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        background: dark ? 'rgba(10,10,10,0.72)' : 'rgba(245,244,239,0.72)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em',
      }}>
        <Link to="/writing" style={{ color: 'var(--fg)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{ color: 'var(--muted)' }}>←</span>
          <span>WRITING</span>
          <span style={{ color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>/ {post.title.toUpperCase()}</span>
        </Link>
        <button onClick={() => setDark(!dark)} style={{
          background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg)',
          padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', flexShrink: 0,
        }}>{dark ? 'LIGHT' : 'DARK'}</button>
      </div>

      <article style={{ padding: '80px 40px 40px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 32, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <span>{fmtDate(post.date)}</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span>{post.readTime}</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 999, textTransform: 'uppercase' }}>{post.tag}</span>
        </div>

        <h1 style={{
          margin: 0, fontFamily: 'var(--serif)', fontWeight: 400,
          fontSize: 'clamp(40px, 5.5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.02em',
        }}>
          {post.title}
        </h1>

        {post.summary && (
          <div style={{ marginTop: 28, fontSize: 20, lineHeight: 1.5, color: 'var(--muted)', fontWeight: 300, fontStyle: 'italic', borderLeft: '2px solid var(--border)', paddingLeft: 20 }}>
            {post.summary}
          </div>
        )}

        <div style={{ marginTop: 60 }}>
          {body.map((p, i) => (
            <p key={i} style={{
              margin: '0 0 28px', fontSize: 18, lineHeight: 1.7,
              color: 'var(--fg)', letterSpacing: 'var(--letter)',
              fontWeight: 300,
            }}>
              {i === 0 && (
                <span style={{ fontFamily: 'var(--serif)', fontSize: 56, lineHeight: 0.9, float: 'left', marginRight: 10, marginTop: 6, fontWeight: 500 }}>
                  {p.charAt(0)}
                </span>
              )}
              {i === 0 ? p.slice(1) : p}
            </p>
          ))}
        </div>

        <div style={{ marginTop: 60, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.4em', color: 'var(--muted)' }}>
          / / /
        </div>
      </article>

      {next && next.slug !== post.slug && (
        <Link to={`/post/${next.slug}`} style={{
          display: 'block', margin: '60px 40px 0', maxWidth: 1100,
          marginLeft: 'auto', marginRight: 'auto',
          padding: '40px 32px', border: '1px solid var(--border)', borderRadius: 4,
          textDecoration: 'none', color: 'var(--fg)',
          transition: 'border-color .3s, padding-left .3s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--fg)'; e.currentTarget.style.paddingLeft = '40px'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.paddingLeft = '32px'; }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--muted)', marginBottom: 12 }}>
            / NEXT POST →
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 8 }}>
            {next.title}
          </div>
          <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, maxWidth: 600 }}>
            {next.summary}
          </div>
        </Link>
      )}

      <div style={{ padding: '60px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ paddingTop: 40, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)' }}>
          <span>Richard's Portfolio Page / WRITING / {post.slug.toUpperCase()}</span>
          <Link to="/writing" style={{ color: 'var(--fg)', textDecoration: 'none' }}>← ALL POSTS</Link>
        </div>
      </div>
    </div>
  );
}
