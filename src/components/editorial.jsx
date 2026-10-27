// editorial.jsx — shared building blocks for the editorial dark style.
// Theme tokens, top bar with scroll progress, scroll-reveal, masked page heading, footer.
// Visual rules live in index.css under the `ed-` prefix.

import React from 'react';
import { Link } from 'react-router-dom';

export const FONT = { sans: '"Inter Tight", Helvetica, Arial, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace', letter: '-0.02em' };
export const DEFAULT_ACCENT = '#d9d9d4';

export const pad2 = (n) => String(n).padStart(2, '0');
export const isInProgress = (project) => project.status === 'in-progress';

export function themeVars(dark, { accent = DEFAULT_ACCENT, font = FONT } = {}) {
  return {
    '--bg': dark ? '#0a0a0a' : '#f5f4ef',
    '--bg-blur': dark ? 'rgba(10,10,10,0.72)' : 'rgba(245,244,239,0.72)',
    '--fg': dark ? '#f2f1ec' : '#131312',
    '--muted': dark ? 'rgba(242,241,236,0.5)' : 'rgba(19,19,18,0.55)',
    '--faint': dark ? 'rgba(242,241,236,0.28)' : 'rgba(19,19,18,0.3)',
    '--border': dark ? 'rgba(242,241,236,0.12)' : 'rgba(19,19,18,0.12)',
    '--tile-bg': dark ? '#0e0e0e' : '#e9e8e3',
    '--hover': dark ? 'rgba(242,241,236,0.06)' : 'rgba(19,19,18,0.04)',
    '--light': dark ? 'rgba(242,241,236,0.07)' : 'rgba(255,255,255,0.7)',
    '--grain': dark ? 0.06 : 0.04,
    '--accent': accent,
    '--em': dark ? accent : 'rgba(19,19,18,0.78)',
    '--sans': font.sans, '--mono': font.mono, '--letter': font.letter,
  };
}

// Theme choice shared across pages; storage can be unavailable, so every access is guarded.
const THEME_KEY = 'portfolio-theme';
export function readStoredDark(fallback = true) {
  try {
    const v = window.localStorage.getItem(THEME_KEY);
    return v === null ? fallback : v === 'dark';
  } catch { return fallback; }
}
export function storeDark(dark) {
  try { window.localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch { /* ignore */ }
}
export function useDarkMode() {
  const [dark, setDarkState] = React.useState(() => readStoredDark(true));
  const setDark = React.useCallback((v) => { setDarkState(v); storeDark(v); }, []);
  return [dark, setDark];
}

export function useReveal(threshold = 0.12) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { setShown(true); io.disconnect(); return; }
    }, { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, shown];
}

export function Reveal({ children, delay = 0, style, className }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={`ed-reveal${shown ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

export function useScrollProgress() {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return p;
}

export function ThemeToggle({ dark, setDark }) {
  return (
    <div className="ed-theme" role="group" aria-label="Theme">
      <button type="button" onClick={() => setDark(true)} aria-pressed={dark} className={dark ? 'is-on' : undefined}>DARK</button>
      <button type="button" onClick={() => setDark(false)} aria-pressed={!dark} className={!dark ? 'is-on' : undefined}>LIGHT</button>
    </div>
  );
}

export function ScrollProgress() {
  const progress = useScrollProgress();
  return <div className="ed-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />;
}

// Sub-page top bar: back link + breadcrumb on the left, name in the middle, theme on the right.
export function SubTopBar({ dark, setDark, back, crumb }) {
  return (
    <header className="ed-topbar">
      <div className="ed-topbar-inner ed-subbar">
        <div className="ed-crumbs">
          <Link to={back.to} className="ed-back"><span aria-hidden="true">←</span>{back.label}</Link>
          {crumb && <><span className="ed-crumb-sep" aria-hidden="true">/</span><span className="ed-crumb">{crumb}</span></>}
        </div>
        <Link to="/" className="ed-brand ed-subbar-brand ed-hide-md">
          <span className="ed-brand-name">Richard Zhang</span>
        </Link>
        <div className="ed-topbar-right">
          <ThemeToggle dark={dark} setDark={setDark} />
        </div>
      </div>
      <ScrollProgress />
    </header>
  );
}

// Page frame shared by every sub-page: theme tokens, grain, top bar.
export function EdPage({ dark, setDark, back, crumb, children }) {
  return (
    <div className="ed-root" style={{ ...themeVars(dark), background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
      <div className="ed-grain" aria-hidden="true" />
      <SubTopBar dark={dark} setDark={setDark} back={back} crumb={crumb} />
      {children}
    </div>
  );
}

// Large page heading revealed line by line. `lines` items are strings or { text, em, muted }.
export function PageHeading({ eyebrow, lines, label, dot = false, children }) {
  return (
    <div className="ed-page-hero">
      {eyebrow && (
        <div className="ed-eyebrow ed-rise">
          {dot && <span className="ed-dot" />}
          {eyebrow}
        </div>
      )}
      <h1 className="ed-h1 ed-h1--page" aria-label={label || lines.map((l) => (typeof l === 'string' ? l : l.text)).join(' ')}>
        {lines.map((l, i) => {
          const line = typeof l === 'string' ? { text: l } : l;
          return (
            <span key={i} className="ed-line" aria-hidden="true">
              <span style={{ animationDelay: `${80 + i * 100}ms` }} className={line.muted ? 'is-muted' : undefined}>
                {line.em ? <em>{line.text}</em> : line.text}
              </span>
            </span>
          );
        })}
      </h1>
      {children && <div className="ed-rise" style={{ animationDelay: `${200 + lines.length * 100}ms` }}>{children}</div>}
    </div>
  );
}

export function StatusPill({ project, onImage = false }) {
  if (!isInProgress(project)) return null;
  return <span className={`ed-pill${onImage ? ' ed-pill--img' : ''}`}>IN PROGRESS</span>;
}

export function EdFooter({ left, right }) {
  return (
    <footer className="ed-footer">
      <span>{left}</span>
      <a href="#" className="ed-link" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>BACK TO TOP ↑</a>
      <span>{right}</span>
    </footer>
  );
}

export function NotFound({ code = '404', title, back }) {
  return (
    <div className="ed-page-hero ed-notfound">
      <div className="ed-eyebrow ed-rise">/ {code}</div>
      <h1 className="ed-h1 ed-h1--page">
        <span className="ed-line"><span>{title}</span></span>
      </h1>
      <Link to={back.to} className="ed-btn ed-rise" style={{ marginTop: 40, animationDelay: '250ms' }}>
        <span aria-hidden="true">←</span>{back.label}
      </Link>
    </div>
  );
}
