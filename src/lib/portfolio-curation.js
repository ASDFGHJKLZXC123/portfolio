export function curatedProjects(projects) {
  return projects
    .filter((project) => project.featured === true)
    .sort((a, b) => (a.featuredRank ?? Number.MAX_SAFE_INTEGER) - (b.featuredRank ?? Number.MAX_SAFE_INTEGER));
}
