import { createSeed, DEMO_VERSION } from './seed.js'
import { applyOperation } from './operations.js'

const STORAGE_KEY = 'chenchen-resume-demo-v1'
let memory
export function readDatabase() {
  if (memory) return structuredClone(memory)
  try {
    const stored = JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) || 'null')
    memory =
      stored?.version === DEMO_VERSION &&
      Array.isArray(stored.products) &&
      Array.isArray(stored.conversations)
        ? stored
        : createSeed()
  } catch {
    memory = createSeed()
  }
  return structuredClone(memory)
}

export function commitOperation(operation) {
  const next = applyOperation(readDatabase(), operation)
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* Private browsing can disable persistent storage; the in-memory demo still works. */
  }
  memory = next
  return structuredClone(next)
}
