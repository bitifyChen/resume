import test from 'node:test'
import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { projects, findProject } from '../src/data/projects.js'

test('three separate cases each have responsibility, work story, demo and an actual local preview', async () => {
  assert.equal(projects.length, 3)
  assert.equal(new Set(projects.map((item) => item.demo)).size, 3)
  for (const project of projects) {
    assert.equal(findProject(project.slug), project)
    assert.ok(project.workHighlights.length >= 2)
    assert.ok(project.resumeLine.length > 20)
    for (const story of project.workHighlights) {
      for (const key of ['problem', 'decision', 'result']) assert.ok(story[key])
    }
    await access(new URL(`../public/${project.image}`, import.meta.url))
  }
})
