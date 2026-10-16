// Independent collections keep new work out of page templates.
export function createPortfolio({ projects = [], caseStudies = [], sideProjects = [] }) {
  for (const [name, entries] of Object.entries({ projects, caseStudies, sideProjects })) {
    const ids = new Set()
    for (const entry of entries) {
      if (!entry.id || ids.has(entry.id)) throw new Error(`${name}: missing or duplicate id`)
      ids.add(entry.id)
      if (!['published', 'draft'].includes(entry.status))
        throw new Error(`${name}: invalid status for ${entry.id}`)
    }
  }
  const byId = new Map(projects.map((project) => [project.id, project]))
  if (projects.some((project) => !project.slug)) throw new Error('projects: missing slug')
  if (new Set(projects.map((project) => project.slug)).size !== projects.length)
    throw new Error('projects: duplicate slug')
  for (const study of caseStudies) {
    if (!byId.has(study.projectId))
      throw new Error(`caseStudies: unknown project ${study.projectId}`)
  }
  const published = (entries) =>
    entries
      .filter((entry) => entry.status === 'published')
      .toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return {
    projects: published(projects),
    caseStudies: published(caseStudies)
      .filter((study) => byId.get(study.projectId).status === 'published')
      .map((study) => ({ ...study, project: byId.get(study.projectId) })),
    sideProjects: published(sideProjects)
  }
}

export const caseStudyLocation = (study) => ({
  path: `/projects/${study.project.slug}`,
  query: { issue: study.id }
})
