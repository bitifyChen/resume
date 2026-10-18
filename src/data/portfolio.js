import { projects as projectRecords } from './projects.js'
import { caseStudies as studyRecords } from './caseStudies.js'
import { sideProjects as sideRecords } from './sideProjects.js'
import { createPortfolio } from '../utils/portfolio.js'
import { loadCaseStudyDrafts, mergeCaseStudyDrafts } from '../utils/caseStudyDrafts.js'

const resolvedStudyRecords = mergeCaseStudyDrafts(
  studyRecords,
  import.meta.env?.DEV ? loadCaseStudyDrafts() : {}
)

export const { projects, caseStudies, sideProjects } = createPortfolio({
  projects: projectRecords,
  caseStudies: resolvedStudyRecords,
  sideProjects: sideRecords
})
export const findProject = (slug) => projects.find((project) => project.slug === slug)
export const findSideProject = (slug) => sideProjects.find((project) => project.slug === slug)
export const getProjectCases = (projectId) =>
  caseStudies.filter((study) => study.projectIds.includes(projectId))
export const findCaseStudy = (project, id) => {
  const studies = getProjectCases(project?.id)
  return studies.find((study) => study.id === id) || studies[0]
}
export const findCaseStudyById = (id) => caseStudies.find((study) => study.id === id)
