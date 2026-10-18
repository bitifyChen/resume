import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  const caseStudySort = ref('project')

  return { caseStudySort }
})
