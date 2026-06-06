export const slugifyProject = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export function projectSlug(project) {
  return project?.slug || slugifyProject(project?.name);
}

export function isUsableHref(href) {
  return typeof href === 'string' && href.trim() !== '' && href !== '#';
}

export function isExternalHref(href) {
  return /^https?:\/\//i.test(href || '');
}

function sourceLinkFromLinks(project) {
  return (project?.links || []).find((link) => {
    const key = String(link?.k || '').toUpperCase();
    return isUsableHref(link?.href) && (key === 'SOURCE' || key === 'GITHUB');
  })?.href || '';
}

export function projectSourceHref(project) {
  return [project?.source, project?.github, sourceLinkFromLinks(project)].find(isUsableHref) || '';
}

export function projectLinkHref(project, link) {
  if (isUsableHref(link?.href)) return link.href;
  const key = String(link?.k || '').toUpperCase();
  if (key === 'SOURCE' || key === 'GITHUB') return projectSourceHref(project);
  return '';
}

export function externalLinkProps(href) {
  return isExternalHref(href) ? { target: '_blank', rel: 'noreferrer' } : {};
}
