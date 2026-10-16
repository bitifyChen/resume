import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { comparisonNote } from '../src/data/caseStudies.js'
import {
  projects,
  caseStudies,
  sideProjects,
  findProject,
  getProjectCases,
  findCaseStudy
} from '../src/data/portfolio.js'
import { createPortfolio, caseStudyLocation } from '../src/utils/portfolio.js'

test('home projects follow requested order; case records resolve their own project and evidence', async () => {
  assert.deepEqual(
    projects.map((p) => p.title),
    ['商城前台', '商城後台', 'POS 後台']
  )
  assert.equal(new Set(projects.map((p) => p.demo)).size, projects.length)
  assert.deepEqual(sideProjects, [])
  for (const project of projects) {
    assert.equal(findProject(project.slug), project)
    assert.ok(project.summary.length <= 45)
    await access(new URL('../public/' + project.image, import.meta.url))
    for (const study of getProjectCases(project.id)) {
      assert.equal(findCaseStudy(project, study.id), study)
      assert.equal(study.project, project)
      assert.deepEqual(caseStudyLocation(study), {
        path: '/projects/' + project.slug,
        query: { issue: study.id }
      })
      assert.ok(study.title.length <= 20)
      for (const phase of ['before', 'after']) {
        assert.ok(study[phase].title)
        assert.ok(study[phase].description.length <= 50)
        assert.ok(study[phase].steps.length >= 2)
      }
      for (const shot of study.images)
        await access(new URL('../public/' + shot.src, import.meta.url))
    }
  }
  assert.equal(
    caseStudies.length,
    projects.flatMap((project) => getProjectCases(project.id)).length
  )
})

test('legacy issue links retain safe fallbacks and honest Before disclosure', () => {
  assert.equal(findCaseStudy(projects[0], 'unknown'), getProjectCases(projects[0].id)[0])
  assert.equal(findCaseStudy(undefined, 'unknown'), undefined)
  assert.ok(comparisonNote.includes('問題情境重建'))
  assert.ok(comparisonNote.includes('並非公司舊版截圖'))
})

test('new projects, any number of cases and side projects extend the catalog without template changes', () => {
  const extra = {
    id: 'new-product',
    slug: 'new-product',
    title: '新專案',
    status: 'published',
    order: 5
  }
  const added = Array.from({ length: 7 }, (_, i) => ({
    id: 'new-case-' + i,
    title: '新增議題',
    projectId: extra.id,
    status: 'published',
    order: i
  }))
  const source = {
    projects: [...projects, extra],
    caseStudies: [...caseStudies, ...added],
    sideProjects: [{ id: 'personal-tool', status: 'published', order: 1 }]
  }
  const snapshot = JSON.stringify(source)
  const result = createPortfolio(source)
  assert.equal(result.projects[0].id, extra.id)
  assert.equal(result.caseStudies.filter((c) => c.projectId === extra.id).length, 7)
  assert.equal(result.sideProjects.length, 1)
  assert.equal(result.caseStudies.find((c) => c.id === added[0].id).project.title, '新專案')
  assert.equal(JSON.stringify(source), snapshot)
  assert.deepEqual(createPortfolio({}), { projects: [], caseStudies: [], sideProjects: [] })
})

test('drafts and cases belonging to draft projects do not appear publicly', () => {
  const result = createPortfolio({
    projects: [
      { id: 'draft', slug: 'draft', status: 'draft' },
      { id: 'live', slug: 'live', status: 'published' }
    ],
    caseStudies: [
      { id: 'parent-draft', projectId: 'draft', status: 'published' },
      { id: 'own-draft', projectId: 'live', status: 'draft' }
    ],
    sideProjects: [{ id: 'draft-tool', status: 'draft' }]
  })
  assert.equal(result.projects.length, 1)
  assert.deepEqual(result.caseStudies, [])
  assert.deepEqual(result.sideProjects, [])
})

test('invalid references, duplicate identifiers, slugs and statuses fail explicitly', () => {
  const p = { id: 'p', slug: 'p', status: 'published' }
  assert.throws(() => createPortfolio({ projects: [p, p] }), /duplicate id/)
  assert.throws(() => createPortfolio({ projects: [p, { ...p, id: 'other' }] }), /duplicate slug/)
  assert.throws(
    () =>
      createPortfolio({
        projects: [p],
        caseStudies: [{ id: 'bad', projectId: 'missing', status: 'published' }]
      }),
    /unknown project/
  )
  assert.throws(
    () => createPortfolio({ projects: [{ ...p, status: 'invalid' }] }),
    /invalid status/
  )
  assert.throws(
    () => createPortfolio({ projects: [{ id: 'missing-slug', status: 'published' }] }),
    /missing slug/
  )
})

test('light-only entry ignores persisted or system dark preferences', async () => {
  const read = (p) => readFile(new URL('../' + p, import.meta.url), 'utf8')
  assert.match(await read('index.html'), /data-theme="light"/)
  assert.match(await read('src/assets/styles/_tokens.scss'), /color-scheme: light/)
  for (const p of [
    'src/store/useSessionStore.js',
    'src/components/Showcase/SiteHeader.vue',
    'src/App.vue'
  ]) {
    assert.doesNotMatch(await read(p), /toggleTheme|isDark|prefers-color-scheme|resume-theme/)
  }
})
