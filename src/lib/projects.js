// projects.js — project data, bundled at build time.
//
// Each page used to fetch public/data/projects.json on mount, so every visit
// rendered a loading state first and then shifted once the data arrived. That
// shift also broke cross-page anchors like /#contact: the target moved after
// the browser had already scrolled to it.

import data from '../data/projects.json';
import { projectSlug } from './project-links';

export const projects = Array.isArray(data?.projects) ? data.projects : [];

export function findProject(slug) {
  return projects.find((project) => projectSlug(project) === slug) || null;
}
