import test from 'node:test'
import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { comparisonNote, projects, findProject, findIssue } from '../src/data/projects.js'

test('three projects expose concise issue entries and real local evidence', async () => {
  assert.equal(projects.length, 3)
  assert.equal(new Set(projects.map((item) => item.demo)).size, 3)
  for (const project of projects) {
    assert.equal(findProject(project.slug), project)
    assert.equal(project.issues.length, 2)
    assert.equal(new Set(project.issues.map((issue) => issue.id)).size, project.issues.length)
    assert.ok(project.summary.length <= 45)
    assert.ok(project.responsibilities.length > 0)
    for (const issue of project.issues) {
      assert.equal(findIssue(project, issue.id), issue)
      assert.ok(issue.title.length <= 20)
      for (const phase of ['before', 'after']) {
        assert.ok(issue[phase].title)
        assert.ok(issue[phase].description.length <= 50)
        assert.ok(issue[phase].steps.length >= 2)
      }
      for (const shot of issue.images)
        await access(new URL(`../public/${shot.src}`, import.meta.url))
    }
    await access(new URL(`../public/${project.image}`, import.meta.url))
  }
})

test('issue links fall back safely and distinguish reconstructed Before from historical evidence', () => {
  assert.equal(findIssue(projects[0], 'unknown'), projects[0].issues[0])
  assert.equal(findIssue(undefined, 'unknown'), undefined)
  assert.ok(comparisonNote.includes('問題情境重建'))
  assert.ok(comparisonNote.includes('並非公司舊版截圖'))
})
