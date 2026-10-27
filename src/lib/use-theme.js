// use-theme.js — single source of truth for light/dark.
//
// Previously each page held its own `React.useState(true)` and rebuilt the ten
// design tokens inline, so the choice reset to dark on every navigation and the
// tokens had to be kept in sync by hand across three files. The tokens now live
// in index.css under [data-theme]; this hook only decides which value that
// attribute carries.

import React from 'react';

const STORAGE_KEY = 'portfolio-theme';

function systemPrefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return !window.matchMedia('(prefers-color-scheme: light)').matches;
}

function readStoredTheme() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    // Private-mode Safari and similar throw on access rather than returning null.
    return null;
  }
}

/** The theme the visitor should see on first paint. */
export function initialThemeIsDark() {
  const stored = readStoredTheme();
  if (stored) return stored === 'dark';
  return systemPrefersDark();
}

/** Push a theme choice to the DOM + storage. For pages that own `dark` themselves
 *  (Portfolio drives it from its tweaks panel) so the choice still survives navigation. */
export function applyTheme(dark) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  root.style.colorScheme = dark ? 'dark' : 'light';
  try {
    window.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  } catch {
    /* non-fatal */
  }
}

export function useTheme() {
  const [dark, setDark] = React.useState(() => {
    const stored = readStoredTheme();
    if (stored) return stored === 'dark';
    return systemPrefersDark();
  });

  // Drive the attribute the CSS actually reads.
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.style.colorScheme = dark ? 'dark' : 'light';
  }, [dark]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // Persisting is a nicety; failing to persist must not break the toggle.
    }
  }, [dark]);

  // Follow the OS only while the visitor has not expressed a preference.
  React.useEffect(() => {
    if (!window.matchMedia) return undefined;
    if (readStoredTheme()) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => setDark(!e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return [dark, setDark];
}

export default useTheme;
