// Reveal.jsx — scroll-triggered fade/rise, shared by all three pages.
// Was previously defined three times, once per page file, with identical bodies.

import React from 'react';

export function useReveal() {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return undefined;
    }
    if (!ref.current) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            return;
          }
        }
      },
      { threshold: 0.1 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return [ref, shown];
}

export function Reveal({ children, delay = 0, style, as: Tag = 'div' }) {
  const [ref, shown] = useReveal();
  return (
    <Tag
      ref={ref}
      className="reveal"
      style={{
        transform: shown ? 'translateY(0)' : 'translateY(16px)',
        opacity: shown ? 1 : 0,
        transition: `transform .8s cubic-bezier(.2,.7,.3,1) ${delay}ms, opacity .8s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
