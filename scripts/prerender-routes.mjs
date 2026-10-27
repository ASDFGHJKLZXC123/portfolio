// prerender-routes.mjs — give every client route its own index.html.
//
// GitHub Pages only serves files. Deep links such as /portfolio/project/<slug>
// used to fall through to the 404.html SPA fallback: the app still booted, but
// the response was an HTTP 404 carrying the homepage's title and description,
// which is all that link previews (LinkedIn, Slack, iMessage) and crawlers see.
// This copies the built dist/index.html into dist/all-works/ and
// dist/project/<slug>/ with each page's own title, description and URL.
//
// Runs after `vite build` (see package.json "build").

import fs from 'node:fs';
import path from 'node:path';
import { allWorksMeta, projectMeta } from '../src/lib/page-meta.js';
import { projectSlug } from '../src/lib/project-links.js';

const DIST = path.resolve('dist');
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const { projects } = JSON.parse(fs.readFileSync(path.resolve('src/data/projects.json'), 'utf8'));

const siteRoot = template.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
if (!siteRoot) throw new Error('index.html needs <meta property="og:url"> to prerender routes');

const escapeAttr = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Replace one attribute value on the single tag matched by `tagPattern`.
function setTag(html, tagPattern, attr, value) {
  const matches = html.match(new RegExp(tagPattern, 'g')) || [];
  if (matches.length !== 1) throw new Error(`expected one ${tagPattern} in index.html, found ${matches.length}`);
  const tag = matches[0];
  return html.replace(tag, tag.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${escapeAttr(value)}"`));
}

function renderRoute(route, { title, description }) {
  const url = new URL(route, siteRoot).href;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`);
  html = setTag(html, '<meta name="description"[^>]*>', 'content', description);
  html = setTag(html, '<link rel="canonical"[^>]*>', 'href', url);
  html = setTag(html, '<meta property="og:url"[^>]*>', 'content', url);
  html = setTag(html, '<meta property="og:title"[^>]*>', 'content', title);
  html = setTag(html, '<meta property="og:description"[^>]*>', 'content', description);
  html = setTag(html, '<meta name="twitter:title"[^>]*>', 'content', title);
  html = setTag(html, '<meta name="twitter:description"[^>]*>', 'content', description);

  const file = path.join(DIST, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

renderRoute('all-works/', allWorksMeta);
for (const project of projects) {
  renderRoute(`project/${projectSlug(project)}/`, projectMeta(project));
}

console.log(`prerendered ${projects.length + 1} routes into dist/`);
