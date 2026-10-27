// StatusPill.jsx — the "IN PROGRESS" / "VERIFICATION PENDING" marker.
// Was previously defined three times, once per page file, with identical bodies.

import React from 'react';

export const pendingStatusLabel = (project) => project.status === 'in-progress'
  ? 'IN PROGRESS'
  : project.status === 'verification-pending'
    ? 'VERIFICATION PENDING'
    : '';

export function StatusPill({ project, onImage = false }) {
  const label = pendingStatusLabel(project);
  if (!label) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
      padding: onImage ? '4px 8px' : '5px 9px',
      borderRadius: 999,
      border: onImage ? '1px solid rgba(255,255,255,0.32)' : '1px solid var(--border)',
      background: onImage ? 'rgba(255,255,255,0.14)' : 'var(--hover)',
      color: onImage ? 'rgba(255,255,255,0.9)' : 'var(--fg)',
      fontFamily: 'var(--mono)', fontSize: onImage ? 8 : 9,
      lineHeight: 1, letterSpacing: '0.16em',
    }}>
      {label}
    </span>
  );
}

export default StatusPill;
