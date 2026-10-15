import { readDatabase, commitOperation } from '@/mock/repository'

// This boundary deliberately has no network client or company endpoint.
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 180))
export const demoApi = {
  snapshot: () => delay(readDatabase()),
  execute: async (operation) => {
    await delay()
    return commitOperation(operation)
  }
}
