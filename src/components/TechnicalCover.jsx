import React from 'react';

const items = (value) => Array.isArray(value) ? value.filter(Boolean) : [];

function FlowVisual({ cover, compact }) {
  const nodes = items(cover.nodes);
  if (!nodes.length) return null;

  return (
    <ol className="technical-cover-flow" aria-label={cover.flowLabel || 'System flow'}>
      {nodes.map((node, index) => (
        <li className="technical-cover-node" key={`${node.title}-${index}`}>
          <span className="technical-cover-node-index">{String(index + 1).padStart(2, '0')}</span>
          <strong>{node.title}</strong>
          {!compact && node.detail && <small>{node.detail}</small>}
        </li>
      ))}
    </ol>
  );
}

function BenchmarkVisual({ cover, compact }) {
  const series = items(cover.series).filter((entry) => Number.isFinite(Number(entry.value)));
  if (!series.length) return null;

  const maxLog = Math.max(...series.map((entry) => Math.log10(Number(entry.value) + 1)), 1);

  return (
    <div className="technical-cover-benchmark" role="img" aria-label={cover.chartLabel || 'Benchmark results'}>
      {series.map((entry) => {
        const width = Math.max(10, (Math.log10(Number(entry.value) + 1) / maxLog) * 100);
        return (
          <div className="technical-cover-benchmark-row" key={entry.label}>
            <span>{entry.label}</span>
            <span className="technical-cover-benchmark-track" aria-hidden="true">
              <span style={{ width: `${width}%` }} />
            </span>
            <strong>{entry.display || entry.value}</strong>
            {!compact && entry.note && <small>{entry.note}</small>}
          </div>
        );
      })}
    </div>
  );
}

function TerminalVisual({ terminal, compact }) {
  const lines = items(terminal?.lines);
  if (!lines.length) return null;

  return (
    <div className="technical-cover-terminal" aria-label={terminal.label || 'Representative terminal session'}>
      <div className="technical-cover-terminal-bar">
        <span aria-hidden="true">● ● ●</span>
        <span>{terminal.title || 'project.session'}</span>
      </div>
      <pre><code>{lines.slice(0, compact ? 4 : 8).join('\n')}</code></pre>
    </div>
  );
}

export default function TechnicalCover({ cover, projectName, compact = false }) {
  if (!cover || typeof cover !== 'object') return null;

  const type = ['benchmark', 'terminal', 'flow'].includes(cover.type) ? cover.type : 'flow';
  const stats = items(cover.stats);

  return (
    <div
      className={`technical-cover technical-cover--${type}${compact ? ' technical-cover--compact' : ''}`}
      aria-label={`${projectName || 'Project'} technical overview`}
    >
      <div className="technical-cover-grid" aria-hidden="true" />
      <header className="technical-cover-header">
        <span>/ {cover.label || 'TECHNICAL OVERVIEW'}</span>
        {cover.signal && <span>{cover.signal}</span>}
      </header>

      <div className="technical-cover-title">
        {cover.kicker && <span>{cover.kicker}</span>}
        <strong>{cover.title || projectName}</strong>
        {!compact && cover.subtitle && <p>{cover.subtitle}</p>}
      </div>

      <div className="technical-cover-primary">
        {type === 'benchmark' ? (
          <BenchmarkVisual cover={cover} compact={compact} />
        ) : type === 'terminal' ? (
          <TerminalVisual terminal={cover.terminal} compact={compact} />
        ) : (
          <FlowVisual cover={cover} compact={compact} />
        )}
      </div>

      {!compact && type !== 'terminal' && cover.terminal && (
        <TerminalVisual terminal={cover.terminal} compact={false} />
      )}

      {stats.length > 0 && (
        <dl className="technical-cover-stats">
          {stats.slice(0, compact ? 3 : 4).map((stat) => (
            <div key={`${stat.label}-${stat.value}`}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
