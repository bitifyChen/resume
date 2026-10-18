export const CASE_STUDY_DRAFTS_KEY = 'chenchen-case-study-drafts-v1'

const editableFields = [
  'type',
  'title',
  'subtitle',
  'teaser',
  'description',
  'story',
  'before',
  'after',
  'walkthrough',
  'details'
]

const clone = (value) => JSON.parse(JSON.stringify(value))

export function pickCaseStudyDraft(study) {
  return Object.fromEntries(
    editableFields
      .filter((field) => study[field] !== undefined)
      .map((field) => [field, clone(study[field])])
  )
}

export function mergeCaseStudyDrafts(studies, drafts = {}) {
  return studies.map((study) => {
    const draft = drafts?.[study.id]
    if (!draft || typeof draft !== 'object' || Array.isArray(draft)) return clone(study)

    return {
      ...clone(study),
      ...Object.fromEntries(
        editableFields
          .filter(
            (field) =>
              draft[field] !== undefined &&
              (field !== 'type' || ['issue', 'feature'].includes(draft.type))
          )
          .map((field) => [field, clone(draft[field])])
      )
    }
  })
}

export function loadCaseStudyDrafts(storage = globalThis.localStorage) {
  if (!storage) return {}
  try {
    const value = JSON.parse(storage.getItem(CASE_STUDY_DRAFTS_KEY) || '{}')
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  } catch {
    return {}
  }
}

export function saveCaseStudyDrafts(drafts, storage = globalThis.localStorage) {
  if (!storage) return false
  storage.setItem(CASE_STUDY_DRAFTS_KEY, JSON.stringify(drafts))
  return true
}

export function clearCaseStudyDrafts(storage = globalThis.localStorage) {
  storage?.removeItem(CASE_STUDY_DRAFTS_KEY)
}
