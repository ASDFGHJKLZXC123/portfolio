// ScrollManager.jsx — scroll position for client-side navigation.
//
// BrowserRouter leaves the window wherever it was on a route change, so a page
// could open mid-scroll, the case study's "/#contact" link landed at the top of
// the homepage instead of on the contact section, and Back from a case study
// dropped you at the top of the list you came from.

import React from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// index.css sets `scroll-behavior: smooth` for in-page anchors; a route change
// should jump, not animate through the new page. Reading the computed value
// forces the override to apply before the scroll; without it Chrome still
// animates with the stale `smooth`.
function jump(scroll) {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  void getComputedStyle(root).scrollBehavior;
  scroll();
  root.style.scrollBehavior = previous;
}

// Last scroll offset of each history entry, for Back/Forward between pages.
const savedPositions = new Map();

export default function ScrollManager() {
  const { key, pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const keyRef = React.useRef(key);
  const lastPathname = React.useRef(null);

  React.useEffect(() => {
    const save = () => savedPositions.set(keyRef.current, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, []);

  // Layout effect, so the new page never paints at the old offset.
  React.useLayoutEffect(() => {
    keyRef.current = key;
    const firstRender = lastPathname.current === null;
    const samePage = lastPathname.current === pathname;
    lastPathname.current = pathname;

    if (navigationType === 'POP' && !firstRender) {
      // Anchor jumps and Back/Forward within one page scroll natively.
      if (samePage) return;
      const saved = savedPositions.get(key);
      if (saved !== undefined) jump(() => window.scrollTo(0, saved));
      return;
    }

    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) {
      const toTarget = () => jump(() => target.scrollIntoView({ block: 'start' }));
      toTarget();
      // On a fresh load the web fonts reflow the page after this runs; re-align
      // once they land unless the visitor has already scrolled somewhere else.
      if (firstRender && document.fonts) {
        const landedAt = window.scrollY;
        document.fonts.ready.then(() => { if (window.scrollY === landedAt) toTarget(); });
      }
    } else if (!firstRender && !samePage) {
      jump(() => window.scrollTo(0, 0));
    }
  }, [key, pathname, hash, navigationType]);

  return null;
}
