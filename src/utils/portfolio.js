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
  for (const project of projects) {
    if (![0, 1].includes(project.contentStatus ?? 0))
      throw new Error(`projects: invalid content status for ${project.id}`)
  }
  for (const project of sideProjects) {
    if (!project.slug) throw new Error(`sideProjects: missing slug for ${project.id}`)
    if (![0, 1].includes(project.contentStatus ?? 0))
      throw new Error(`sideProjects: invalid content status for ${project.id}`)
  }
  const linkedProjectIds = (study) =>
    [...new Set([study.projectId, ...(study.projectIds || [])].filter(Boolean))]
  for (const study of caseStudies) {
    if (study.type && !['issue', 'feature'].includes(study.type))
      throw new Error(`caseStudies: invalid type for ${study.id}`)
    if (![0, 1].includes(study.contentStatus ?? 0))
      throw new Error(`caseStudies: invalid content status for ${study.id}`)
    for (const projectId of linkedProjectIds(study)) {
      if (!byId.has(projectId)) throw new Error(`caseStudies: unknown project ${projectId}`)
    }
  }
  const published = (entries) =>
    entries
      .filter((entry) => entry.status === 'published')
      .toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return {
    projects: published(projects),
    caseStudies: published(caseStudies)
      .filter((study) => linkedProjectIds(study).every((id) => byId.get(id).status === 'published'))
      .map((study) => {
        const projectIds = linkedProjectIds(study)
        return {
          ...study,
          type: study.type || 'issue',
          contentStatus: study.contentStatus ?? 0,
          projectIds,
          project: byId.get(study.projectId),
          projects: projectIds.map((id) => byId.get(id))
        }
      }),
    sideProjects: published(sideProjects)
  }
}

export const caseStudyLocation = (study, source, projectId) => {
  const path = `/case-studies/${study.id}`
  if (!['home', 'project'].includes(source)) return path
  const project = source === 'project' && projectId ? `&project=${projectId}` : ''
  return `${path}?from=${source}${project}`
}

export const sortSideProjects = (sideProjects) =>
  [...sideProjects].sort(
    (a, b) =>
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      (a.order ?? 0) - (b.order ?? 0)
  )
