import test from 'node:test'
import assert from 'node:assert/strict'
import { sideProjects } from '../src/data/sideProjects.js'
import { sortSideProjects } from '../src/utils/portfolio.js'

test('Side Project sorting is stable, featured-first, and does not mutate data', () => {
  const source = [
    { id: 'later-featured', featured: true, order: 30 },
    { id: 'early-draft', featured: false, order: 10 },
    { id: 'early-featured', featured: true, order: 20 }
  ]
  const snapshot = [...source]

  assert.deepEqual(
    sortSideProjects(source).map(({ id }) => id),
    ['early-featured', 'later-featured', 'early-draft']
  )
  assert.deepEqual(source, snapshot)
})

test('Side Project featured defaults separate selected work from draft previews', () => {
  const featuredOrder = sortSideProjects(sideProjects).map(({ id }) => id)
  const featuredIds = sideProjects.filter(({ featured }) => featured).map(({ id }) => id)

  assert.deepEqual(featuredOrder.slice(0, featuredIds.length), featuredIds)
  assert.ok(featuredOrder.indexOf('coolker-tour-explorer') < featuredOrder.indexOf('roadloop'))
})
