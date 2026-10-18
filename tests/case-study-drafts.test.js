import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CASE_STUDY_DRAFTS_KEY,
  loadCaseStudyDrafts,
  mergeCaseStudyDrafts,
  pickCaseStudyDraft,
  saveCaseStudyDrafts
} from '../src/utils/caseStudyDrafts.js'

test('case study drafts only override editable copy and keep identity fields intact', () => {
  const source = [
    {
      id: 'chat',
      type: 'issue',
      projectId: 'admin',
      title: '原標題',
      story: { problem: '原問題' },
      images: [{ src: 'safe.jpg' }],
      status: 'published'
    }
  ]
  const snapshot = JSON.stringify(source)
  const [result] = mergeCaseStudyDrafts(source, {
    chat: {
      type: 'feature',
      title: '新標題',
      story: { problem: '新問題' },
      projectId: 'other',
      images: [{ src: 'private.jpg' }]
    }
  })

  assert.equal(result.title, '新標題')
  assert.equal(result.type, 'feature')
  assert.equal(result.story.problem, '新問題')
  assert.equal(result.projectId, 'admin')
  assert.equal(result.images[0].src, 'safe.jpg')
  assert.equal(JSON.stringify(source), snapshot)

  const [invalidType] = mergeCaseStudyDrafts(source, { chat: { type: 'other' } })
  assert.equal(invalidType.type, 'issue')
})

test('case study drafts tolerate empty or malformed browser storage', () => {
  const values = new Map()
  const storage = {
    getItem: (key) => values.get(key),
    setItem: (key, value) => values.set(key, value)
  }

  assert.deepEqual(loadCaseStudyDrafts(storage), {})
  values.set(CASE_STUDY_DRAFTS_KEY, '{bad')
  assert.deepEqual(loadCaseStudyDrafts(storage), {})
  const draft = { chat: pickCaseStudyDraft({ title: '本機標題', status: 'published' }) }
  assert.equal(saveCaseStudyDrafts(draft, storage), true)
  assert.deepEqual(loadCaseStudyDrafts(storage), draft)
})
