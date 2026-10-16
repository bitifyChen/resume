import { projects as projectRecords } from './projects.js'
import { caseStudies as studyRecords } from './caseStudies.js'
import { sideProjects as sideRecords } from './sideProjects.js'
import { createPortfolio } from '../utils/portfolio.js'

export const { projects, caseStudies, sideProjects } = createPortfolio({
  projects: projectRecords,
  caseStudies: studyRecords,
  sideProjects: sideRecords
})
export const findProject = (slug) => projects.find((project) => project.slug === slug)
export const getProjectCases = (projectId) =>
  caseStudies.filter((study) => study.projectId === projectId)
export const findCaseStudy = (project, id) => {
  const studies = getProjectCases(project?.id)
  return studies.find((study) => study.id === id) || studies[0]
}
