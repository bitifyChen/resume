import test from 'node:test'
import assert from 'node:assert/strict'
import { sortTechnologies } from '../src/utils/technologyOrder.js'

test('side project skills follow one fixed order without mutating source data', () => {
  const input = ['Flask', 'Firebase', 'Python', 'Pinia', 'Vue 3']

  assert.deepEqual(sortTechnologies(input), ['Vue 3', 'Pinia', 'Firebase', 'Python', 'Flask'])
  assert.deepEqual(input, ['Flask', 'Firebase', 'Python', 'Pinia', 'Vue 3'])
})

test('unknown skills use a deterministic alphabetical fallback', () => {
  assert.deepEqual(sortTechnologies(['Zeta Tool', 'Alpha Tool']), ['Alpha Tool', 'Zeta Tool'])
})
