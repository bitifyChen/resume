import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import {
  projects,
  caseStudies,
  sideProjects,
  findProject,
  getProjectCases,
  findCaseStudy
} from '../src/data/portfolio.js'
import { createPortfolio, caseStudyLocation } from '../src/utils/portfolio.js'
import { createPinia, setActivePinia } from 'pinia'
import { usePortfolioStore } from '../src/store/usePortfolioStore.js'

test('home projects follow requested order; case records resolve their own project and evidence', async () => {
  assert.deepEqual(
    projects.map((p) => p.title),
    ['商城前台', '商城後台', 'POS 後台']
  )
  assert.ok(projects.every((project) => project.demo === undefined))
  assert.ok(sideProjects.length > 0)
  assert.ok(sideProjects.every((project) => project.slug))
  for (const project of projects) {
    assert.equal(findProject(project.slug), project)
    assert.ok([...project.summary].length <= 55)
    await access(new URL('../public/' + project.image, import.meta.url))
    for (const study of getProjectCases(project.id)) {
      assert.equal(findCaseStudy(project, study.id), study)
      assert.ok(study.projects.includes(project))
      if (study.projectId === project.id) assert.equal(study.project, project)
      assert.equal(study.demo, undefined)
      assert.equal(study.try, undefined)
      assert.ok(['issue', 'feature'].includes(study.type))
      assert.equal(caseStudyLocation(study), '/case-studies/' + study.id)
      assert.equal(caseStudyLocation(study, 'home'), '/case-studies/' + study.id + '?from=home')
      assert.equal(
        caseStudyLocation(study, 'project'),
        '/case-studies/' + study.id + '?from=project'
      )
      assert.ok(study.title.length <= 20)
      if (study.type === 'issue') {
        for (const phase of ['before', 'after']) {
          assert.ok(study[phase].title)
          assert.ok([...study[phase].description].length <= 60)
          assert.ok(study[phase].steps.length >= 2)
        }
      } else {
        assert.equal(study.before, undefined)
        assert.equal(study.after, undefined)
        assert.ok(study.details.length > 0)
      }
      for (const shot of study.images || [])
        await access(new URL('../public/' + shot.src, import.meta.url))
      if (study.kind === 'team-component') {
        assert.ok(study.component?.name)
        assert.ok(study.component?.preview)
        assert.ok(study.component?.props.length >= 4)
      }
      if (!study.images?.length) assert.ok(study.component || study.previewType)
    }
  }
  assert.equal(
    caseStudies.length,
    new Set(projects.flatMap((project) => getProjectCases(project.id).map((study) => study.id))).size
  )
})

test('team components use UI library metadata instead of screenshot walkthroughs', () => {
  const components = caseStudies.filter((study) => study.kind === 'team-component')
  assert.deepEqual(
    components.map((study) => study.component.name).toSorted(),
    ['DynamicForm', 'DynamicTable', 'UploadImage']
  )
  for (const study of components) {
    assert.equal(study.images, undefined)
    assert.ok(Array.isArray(study.component.slots))
    assert.ok(study.component.events.length)
  }
  assert.deepEqual(components.find((study) => study.component.name === 'UploadImage').component.slots, [])
  assert.ok(components.find((study) => study.component.name === 'DynamicTable').component.slots.length)
  assert.ok(components.find((study) => study.component.name === 'DynamicForm').component.slots.length)
})

test('feature cases emphasize delivered work and implementation instead of forcing before and after', () => {
  const chat = caseStudies.find((study) => study.id === 'realtime-chat')
  assert.equal(chat.type, 'feature')
  assert.equal(chat.before, undefined)
  assert.equal(chat.after, undefined)
  assert.ok([...chat.description].length >= 95 && [...chat.description].length <= 125)
  assert.equal(chat.story, undefined)
  assert.doesNotMatch(chat.description, /App\.vue/)
  assert.deepEqual(chat.details.map((detail) => detail.label), [
    '即時連線與事件訂閱',
    '會員未讀提醒',
    '客服會話排序與自動捲動',
    '訊息編輯與收回',
    '訊息搜尋、高亮與網址辨識',
    '常見問題選取與預設答覆'
  ])
  assert.match(chat.details[0].text, /Vue、Pinia.*Laravel Echo \/ Pusher/)
  assert.match(chat.details[4].text, /v-html.*HTTP \/ HTTPS/)
  assert.match(chat.details[5].text, /點選常見問題.*預設答覆/)
})

test('showcase sort choices stay in Pinia while navigating between portfolio pages', () => {
  setActivePinia(createPinia())
  const portfolio = usePortfolioStore()
  portfolio.caseStudySort = 'type'
  portfolio.sideProjectSort = 'featured'

  assert.equal(usePortfolioStore().caseStudySort, 'type')
  assert.equal(usePortfolioStore().sideProjectSort, 'featured')
})

test('case study types use fixed data-driven templates with a showcase slot', async () => {
  const read = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8')
  const problemTemplate = await read('src/components/Showcase/ProblemCaseTemplate.vue')
  const featureTemplate = await read('src/components/Showcase/FeatureCaseTemplate.vue')

  const problemOrder = [
    '<CaseProblemSummary',
    '<CaseImplementationDetails',
    '<CaseComparison',
    '<CaseStudyShowcase'
  ].map((component) => problemTemplate.indexOf(component))
  assert.ok(problemOrder.every((index) => index >= 0))
  assert.deepEqual(problemOrder, [...problemOrder].sort((a, b) => a - b))

  const featureOrder = ['<CaseImplementationDetails', '<CaseStudyShowcase'].map((component) =>
    featureTemplate.indexOf(component)
  )
  assert.ok(featureOrder.every((index) => index >= 0))
  assert.deepEqual(featureOrder, [...featureOrder].sort((a, b) => a - b))
  assert.match(problemTemplate, /<slot name="showcase"/)
  assert.match(featureTemplate, /<slot name="showcase"/)

  for (const path of [
    'src/components/Showcase/CaseWalkthrough.vue',
    'src/components/Showcase/ComponentLibraryStory.vue',
    'src/components/Showcase/CaseFeaturePreview.vue',
    'src/components/Showcase/RealtimeChatDemo.vue'
  ]) {
    assert.doesNotMatch(await read(path), /<h2[^>]*>(我如何解決|實際流程重製|元件介面與擴充點|前台與客服後台即時對話)<\/h2>/)
  }
})

test('legacy issue links retain safe fallbacks', () => {
  assert.equal(findCaseStudy(projects[0], 'unknown'), getProjectCases(projects[0].id)[0])
  assert.equal(findCaseStudy(undefined, 'unknown'), undefined)
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
    sideProjects: [{ id: 'personal-tool', slug: 'personal-tool', status: 'published', order: 1 }]
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
    sideProjects: [{ id: 'draft-tool', slug: 'draft-tool', status: 'draft' }]
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
  assert.throws(
    () =>
      createPortfolio({
        projects: [p],
        caseStudies: [{ id: 'bad-type', projectId: 'p', type: 'unknown', status: 'published' }]
      }),
    /invalid type/
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

test('website uses clean history URLs without hash routing', async () => {
  const router = await readFile(new URL('../src/router/index.js', import.meta.url), 'utf8')
  const admin = await readFile(new URL('../src/pages/admin/index.vue', import.meta.url), 'utf8')
  assert.match(router, /createWebHistory\(import\.meta\.env\.BASE_URL\)/)
  assert.doesNotMatch(router, /createWebHashHistory/)
  assert.doesNotMatch(router, /\/demo\//)
  assert.doesNotMatch(admin, /#\/case-studies/)
})
