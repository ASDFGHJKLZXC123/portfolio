// page-meta.js — <title> and description for each route.
//
// Read by the pages at runtime (usePageMeta) and by
// scripts/prerender-routes.mjs at build time, so the static HTML that link
// previews and crawlers see can't drift from what the live page sets.
// Plain data only: this module also runs under Node.

const NAME = 'Richard Zhang';

export const homeMeta = {
  title: `${NAME} — Full-Stack Software Engineer`,
  description: 'Richard Zhang is a UC Irvine Informatics graduate building reliable backend and full-stack systems, from job processing and APIs to operational interfaces.',
};

// No project count here: the curated set size is dynamic.
export const allWorksMeta = {
  title: `Selected Engineering Work — ${NAME}`,
  description: 'Selected backend and full-stack engineering projects, with an optional archive of additional builds.',
};

export const projectMeta = (project) => ({
  title: `${project.name} — ${NAME}`,
  description: project.summary,
});

export const notFoundMeta = {
  title: `Project Not Found — ${NAME}`,
  description: 'The requested project case study could not be found.',
};
