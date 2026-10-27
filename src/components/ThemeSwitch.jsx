// ThemeSwitch.jsx — the DARK / LIGHT pill in every page's top bar.
// Each page used to carry its own copy of this markup and its button styles.

import React from 'react';

const themeBtn = (on) => ({
  border: 'none', padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
  background: on ? 'var(--fg)' : 'transparent',
  color: on ? 'var(--bg)' : 'var(--muted)',
  fontSize: 9, letterSpacing: '0.18em', fontFamily: 'inherit', fontWeight: 600,
  transition: 'background .2s, color .2s',
});

export function ThemeSwitch({ dark, setDark }) {
  return (
    <div className="theme-switch" role="group" aria-label="Color theme" style={{
      display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 999, padding: 2,
    }}>
      <button type="button" aria-pressed={dark} onClick={() => setDark(true)} style={themeBtn(dark)}>DARK</button>
      <button type="button" aria-pressed={!dark} onClick={() => setDark(false)} style={themeBtn(!dark)}>LIGHT</button>
    </div>
  );
}

export default ThemeSwitch;
