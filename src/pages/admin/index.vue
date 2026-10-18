<script setup>
  import { computed, ref, watch } from 'vue'
  import { caseStudies as sourceStudies } from '@/data/caseStudies'
  import { projects } from '@/data/projects'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import {
    clearCaseStudyDrafts,
    loadCaseStudyDrafts,
    mergeCaseStudyDrafts,
    pickCaseStudyDraft,
    saveCaseStudyDrafts
  } from '@/utils/caseStudyDrafts'

  const localHosts = new Set(['localhost', '127.0.0.1', '[::1]'])
  const isLocal = localHosts.has(window.location.hostname)
  const storedDrafts = ref(loadCaseStudyDrafts())
  const selectedId = ref(sourceStudies[0]?.id || '')
  const editor = ref(null)
  const savedMessage = ref('')
  const importInput = ref(null)
  const projectById = new Map(projects.map((project) => [project.id, project]))
  const linkedProjects = (study) =>
    [...new Set([study?.projectId, ...(study?.projectIds || [])])]
      .map((id) => projectById.get(id))
      .filter(Boolean)
  const storyFields = computed(() => {
    const feature = editor.value?.type === 'feature'
    return [
      [feature ? 'scope' : 'problem', feature ? '功能範圍' : '問題'],
      ['role', '我的角色'],
      [feature ? 'delivery' : 'action', feature ? '功能作法' : '解決作法'],
      ['technology', '關鍵技術'],
      ['result', '成果']
    ]
  })

  const resolvedStudies = computed(() =>
    mergeCaseStudyDrafts(sourceStudies, storedDrafts.value)
  )
  const selectedStudy = computed(() =>
    resolvedStudies.value.find((study) => study.id === selectedId.value)
  )
  const selectedProjects = computed(() => linkedProjects(selectedStudy.value))
  const hasDraft = computed(() => Boolean(storedDrafts.value[selectedId.value]))
  const isDirty = computed(() => {
    if (!editor.value || !selectedStudy.value) return false
    return JSON.stringify(pickCaseStudyDraft(editor.value)) !== JSON.stringify(pickCaseStudyDraft(selectedStudy.value))
  })

  function loadEditor() {
    editor.value = selectedStudy.value
      ? JSON.parse(JSON.stringify(selectedStudy.value))
      : null
    savedMessage.value = ''
  }

  function selectStudy(id) {
    if (isDirty.value && !window.confirm('目前內容尚未儲存，仍要切換案例嗎？')) return
    selectedId.value = id
  }

  function saveCurrent() {
    if (!editor.value) return
    const next = {
      ...storedDrafts.value,
      [editor.value.id]: pickCaseStudyDraft(editor.value)
    }
    saveCaseStudyDrafts(next)
    storedDrafts.value = next
    savedMessage.value = '已儲存於這個瀏覽器'
  }

  function previewCurrent() {
    saveCurrent()
    const url = new URL(`/case-studies/${selectedId.value}`, window.location.origin)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function resetCurrent() {
    if (!hasDraft.value || !window.confirm('要移除這個案例的本機修改嗎？')) return
    const next = { ...storedDrafts.value }
    delete next[selectedId.value]
    saveCaseStudyDrafts(next)
    storedDrafts.value = next
    loadEditor()
  }

  function resetAll() {
    if (!Object.keys(storedDrafts.value).length) return
    if (!window.confirm('要移除所有案例的本機修改嗎？')) return
    clearCaseStudyDrafts()
    storedDrafts.value = {}
    loadEditor()
  }

  function exportDrafts() {
    const content = JSON.stringify(storedDrafts.value, null, 2)
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'case-study-drafts.json'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  async function importDrafts(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const value = JSON.parse(await file.text())
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error()
      const knownIds = new Set(sourceStudies.map((study) => study.id))
      const next = Object.fromEntries(
        Object.entries(value).filter(([id, draft]) => knownIds.has(id) && draft && typeof draft === 'object')
      )
      saveCaseStudyDrafts(next)
      storedDrafts.value = next
      loadEditor()
      savedMessage.value = `已匯入 ${Object.keys(next).length} 個案例`
    } catch {
      window.alert('檔案格式不正確，請選擇由此頁匯出的 JSON。')
    } finally {
      event.target.value = ''
    }
  }

  function updateSteps(target, value) {
    target.steps = value.split('\n').map((item) => item.trim()).filter(Boolean)
  }

  function ensureIssueFields(event) {
    if (event.target.value !== 'issue') return
    editor.value.before ||= { title: '', description: '', steps: [] }
    editor.value.after ||= { title: '', description: '', steps: [] }
  }

  function addDetail() {
    editor.value.details.push({ label: '新增欄位', text: '' })
  }

  function removeDetail(index) {
    editor.value.details.splice(index, 1)
  }

  watch(selectedId, loadEditor, { immediate: true })
</script>

<template>
  <main v-if="isLocal" id="main-content" class="content-admin">
    <header class="content-admin-header">
      <div>
        <RouterLink to="/" class="content-admin-wordmark">Chenchen / Local Editor</RouterLink>
        <p>只儲存在目前瀏覽器，不會寫回公司專案或公開資料。</p>
      </div>
      <div class="content-admin-actions">
        <span v-if="savedMessage" class="content-admin-status">{{ savedMessage }}</span>
        <button type="button" class="button secondary" @click="exportDrafts">
          <AppIcon name="Download" :size="16" />
          匯出備份
        </button>
        <button type="button" class="button secondary" @click="importInput?.click()">
          <AppIcon name="Upload" :size="16" />
          匯入
        </button>
        <input ref="importInput" class="sr-only" type="file" accept="application/json" @change="importDrafts" />
      </div>
    </header>

    <div class="content-admin-layout">
      <aside class="content-admin-sidebar" aria-label="案例清單">
        <div class="content-admin-sidebar-heading">
          <strong>Case Study</strong>
          <span>{{ sourceStudies.length }} 項</span>
        </div>
        <button
          v-for="study in resolvedStudies"
          :key="study.id"
          type="button"
          class="content-admin-case-button"
          :class="{ 'is-active': study.id === selectedId }"
          @click="selectStudy(study.id)"
        >
          <small v-for="project in linkedProjects(study)" :key="project.id">{{ project.title }}</small>
          <span>{{ study.title }}</span>
          <em v-if="storedDrafts[study.id]">已修改</em>
        </button>
        <button type="button" class="content-admin-reset-all" @click="resetAll">清除全部本機修改</button>
      </aside>

      <form v-if="editor" class="content-admin-form" @submit.prevent="saveCurrent">
        <header class="content-admin-form-heading">
          <div>
            <span
              v-for="project in selectedProjects"
              :key="project.id"
              class="case-study-project-label"
            >
              {{ project.title }}
            </span>
            <h1>{{ editor.title }}</h1>
            <p>以具體問題、個人貢獻與可驗證的作法取代空泛技術清單。</p>
          </div>
          <div class="content-admin-form-actions">
            <button v-if="hasDraft" type="button" class="button secondary" @click="resetCurrent">還原此案例</button>
            <button type="button" class="button secondary" @click="previewCurrent">
              <AppIcon name="View" :size="16" />
              儲存並預覽
            </button>
            <button type="submit" class="button primary" :disabled="!isDirty && hasDraft">儲存</button>
          </div>
        </header>

        <section class="content-editor-section">
          <div class="content-editor-section-title">
            <h2>首頁摘要</h2>
            <p>依案例性質選擇呈現方式，並用約 100 字摘要交代主要貢獻。</p>
          </div>
          <div class="content-editor-grid">
            <label>
              <span>案例類型</span>
              <select v-model="editor.type" @change="ensureIssueFields">
                <option value="issue">解決議題（顯示 Before / After）</option>
                <option value="feature">功能實作（顯示實作細節）</option>
              </select>
            </label>
            <label>
              <span>標題</span>
              <input v-model.trim="editor.title" type="text" maxlength="32" />
            </label>
            <label>
              <span>副標題</span>
              <input v-model.trim="editor.subtitle" type="text" />
            </label>
            <label>
              <span>卡片短句</span>
              <input v-model.trim="editor.teaser" type="text" />
            </label>
            <label class="is-wide">
              <span>案例說明</span>
              <textarea v-model.trim="editor.description" rows="3"></textarea>
            </label>
          </div>
        </section>

        <section class="content-editor-section">
          <div class="content-editor-section-title">
            <h2>{{ editor.type === 'feature' ? '功能說明' : '案例拆解' }}</h2>
            <p>
              {{
                editor.type === 'feature'
                  ? '交代實作範圍、操作流程、關鍵技術與功能成果。'
                  : '面試官應該能在一輪掃讀中看見你的判斷與貢獻。'
              }}
            </p>
          </div>
          <div class="content-editor-story">
            <label v-for="[key, label] in storyFields" :key="key">
              <span>{{ label }}</span>
              <textarea v-model.trim="editor.story[key]" rows="3"></textarea>
            </label>
          </div>
        </section>

        <section v-if="editor.type !== 'feature'" class="content-editor-section">
          <div class="content-editor-section-title">
            <h2>Before / After</h2>
            <p>描述操作或維護方式如何改變，不使用無法證明的數字。</p>
          </div>
          <div class="content-editor-comparison">
            <fieldset v-for="phase in ['before', 'after']" :key="phase">
              <legend>{{ phase === 'before' ? 'Before' : 'After' }}</legend>
              <label>
                <span>標題</span>
                <input v-model.trim="editor[phase].title" type="text" />
              </label>
              <label>
                <span>說明</span>
                <textarea v-model.trim="editor[phase].description" rows="3"></textarea>
              </label>
              <label>
                <span>步驟，每行一項</span>
                <textarea
                  :value="editor[phase].steps.join('\n')"
                  rows="4"
                  @input="updateSteps(editor[phase], $event.target.value)"
                ></textarea>
              </label>
            </fieldset>
          </div>
        </section>

        <section class="content-editor-section">
          <div class="content-editor-section-title">
            <h2>圖片導覽文字</h2>
            <p>圖片與順序由資料檔管理，這裡只修改讀者看到的敘述。</p>
          </div>
          <div class="content-editor-rows">
            <div v-for="(step, index) in editor.walkthrough" :key="index" class="content-editor-row">
              <span>{{ index + 1 }}</span>
              <label>
                <span>畫面標題</span>
                <input v-model.trim="step.title" type="text" />
              </label>
              <label>
                <span>畫面說明</span>
                <textarea v-model.trim="step.description" rows="2"></textarea>
              </label>
            </div>
          </div>
        </section>

        <section class="content-editor-section">
          <div class="content-editor-section-title has-action">
            <div>
              <h2>實作細節</h2>
              <p>以具體技術或功能作為標題，右側說明實作方式與限制。</p>
            </div>
            <button type="button" class="button secondary" @click="addDetail">
              <AppIcon name="Plus" :size="16" />
              新增欄位
            </button>
          </div>
          <div class="content-editor-rows">
            <div v-for="(detail, index) in editor.details" :key="index" class="content-editor-row">
              <button type="button" class="icon-button" aria-label="刪除欄位" @click="removeDetail(index)">
                <AppIcon name="Delete" :size="16" />
              </button>
              <label>
                <span>欄位名稱</span>
                <input v-model.trim="detail.label" type="text" />
              </label>
              <label>
                <span>內容</span>
                <textarea v-model.trim="detail.text" rows="3"></textarea>
              </label>
            </div>
          </div>
        </section>

        <footer class="content-admin-savebar">
          <span>{{ isDirty ? '有尚未儲存的修改' : '內容已同步' }}</span>
          <button type="button" class="button secondary" @click="previewCurrent">儲存並預覽</button>
          <button type="submit" class="button primary" :disabled="!isDirty && hasDraft">儲存</button>
        </footer>
      </form>
    </div>
  </main>

  <main v-else id="main-content" class="content-admin-blocked">
    <h1>此頁只提供本機編輯。</h1>
    <RouterLink to="/" class="button primary">返回作品總覽</RouterLink>
  </main>
</template>
