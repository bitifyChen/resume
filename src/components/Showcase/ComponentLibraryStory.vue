<script setup>
  import { computed, ref, watch } from 'vue'
  import { ArrowLeft, ArrowRight, Delete, Download, Edit, InfoFilled, Plus, Refresh, Search, View, ZoomIn } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const props = defineProps({ issue: { type: Object, required: true } })
  const tab = ref('canvas')
  const searchForm = ref({ name: '', status: '', dateRange: [] })
  const activeSearch = ref({ name: '', status: '', dateRange: [] })
  const selectedRows = ref([])
  const currentPage = ref(1)
  const pageSize = ref(5)
  const dynamicTableRef = ref(null)
  const rowDialogVisible = ref(false)
  const rowDialogMode = ref('detail')
  const activeRow = ref(null)
  const deleteDialogVisible = ref(false)
  const deleteTarget = ref(null)
  const dynamicFormRef = ref(null)
  const formDisabled = ref(false)
  const initialFormValues = {
    name: '隨行保溫杯',
    category: '生活用品',
    stock: 24,
    availableDate: '2026-10-20',
    tags: ['新品', '門市推薦'],
    enabled: true,
    description: '輕量、方便攜帶，適合日常使用。'
  }
  const formValues = ref({ ...initialFormValues, tags: [...initialFormValues.tags] })
  const formRules = {
    name: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
    category: [{ required: true, message: '請選擇商品分類', trigger: 'change' }],
    availableDate: [{ required: true, message: '請選擇上架日期', trigger: 'change' }]
  }
  const uploadStory = ref('multiple')
  const uploadFiles = ref([
    { name: 'travel-cup.jpg', url: '/images/everyday.png', uid: 'sample-1', status: 'success' },
    { name: 'daily-life.jpg', url: '/images/storefront-demo.jpg', uid: 'sample-2', status: 'success' }
  ])
  const previewUrl = ref('')
  const previewVisible = ref(false)
  const component = computed(() => props.issue.component)
  const rows = ref([
    { id: 'P-1024', name: '無線耳機', category: '3C 配件', stock: 34, status: '販售中', createdAt: '2026-08-14' },
    { id: 'P-1025', name: '隨行保溫杯', category: '生活用品', stock: 12, status: '低庫存', createdAt: '2026-08-19' },
    { id: 'P-1026', name: '折疊收納箱', category: '居家收納', stock: 0, status: '已售完', createdAt: '2026-08-22' },
    { id: 'P-1027', name: '陶瓷隨行杯', category: '生活用品', stock: 48, status: '販售中', createdAt: '2026-08-26' },
    { id: 'P-1028', name: '桌上收納架', category: '居家收納', stock: 7, status: '低庫存', createdAt: '2026-09-02' },
    { id: 'P-1029', name: 'Type-C 充電線', category: '3C 配件', stock: 63, status: '販售中', createdAt: '2026-09-05' },
    { id: 'P-1030', name: '旅行收納袋', category: '居家收納', stock: 0, status: '已售完', createdAt: '2026-09-09' }
  ])
  const nextDemoId = ref(1031)
  const filteredRows = computed(() => rows.value.filter((row) => {
    const nameMatches = `${row.id} ${row.name} ${row.category}`.toLowerCase().includes(activeSearch.value.name.trim().toLowerCase())
    const statusMatches = !activeSearch.value.status || row.status === activeSearch.value.status
    const [startDate, endDate] = activeSearch.value.dateRange || []
    const startMatches = !startDate || row.createdAt >= startDate
    const endMatches = !endDate || row.createdAt <= endDate
    return nameMatches && statusMatches && startMatches && endMatches
  }))
  const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredRows.value.slice(start, start + pageSize.value)
  })
  const uploadReadOnly = computed(() => uploadStory.value === 'readonly')
  const uploadMultiple = computed(() => uploadStory.value !== 'single')
  const uploadSortable = computed(() => uploadStory.value === 'sortable')
  const uploadLimit = computed(() => uploadMultiple.value ? 5 : 1)

  watch(uploadStory, (story) => {
    if (story === 'single') uploadFiles.value = uploadFiles.value.slice(0, 1)
  })

  function searchRows() {
    activeSearch.value = { ...searchForm.value, dateRange: [...(searchForm.value.dateRange || [])] }
    currentPage.value = 1
    selectedRows.value = []
    dynamicTableRef.value?.clearSelection()
  }

  function resetSearch() {
    searchForm.value = { name: '', status: '', dateRange: [] }
    activeSearch.value = { name: '', status: '', dateRange: [] }
    currentPage.value = 1
    selectedRows.value = []
    dynamicTableRef.value?.clearSelection()
  }

  function openRowDialog(mode, row) {
    rowDialogMode.value = mode
    activeRow.value = { ...row }
    rowDialogVisible.value = true
  }

  function saveRow() {
    const index = rows.value.findIndex((row) => row.id === activeRow.value?.id)
    if (index < 0) return
    rows.value[index] = { ...rows.value[index], ...activeRow.value }
    rowDialogVisible.value = false
    ElMessage.success('商品資料已更新（展示狀態）')
  }

  function addRow() {
    const nextId = `P-${nextDemoId.value++}`
    rows.value.unshift({ id: nextId, name: '新上架商品', category: '生活用品', stock: 16, status: '販售中', createdAt: '2026-09-12' })
    currentPage.value = 1
    ElMessage.success('已新增一筆展示資料')
  }

  function askRemove(row) {
    deleteTarget.value = row
    deleteDialogVisible.value = true
  }

  function confirmRemove() {
    if (!deleteTarget.value) return
    const deletedId = deleteTarget.value.id
    rows.value = rows.value.filter((item) => item.id !== deletedId)
    selectedRows.value = selectedRows.value.filter((item) => item.id !== deletedId)
    deleteDialogVisible.value = false
    deleteTarget.value = null
    ElMessage.success('已移除展示資料')
  }

  function exportRows() {
    const columns = ['商品編號', '商品名稱', '分類', '庫存', '狀態', '建立日期']
    const body = filteredRows.value.map((row) => [row.id, row.name, row.category, row.stock, row.status, row.createdAt])
    const csv = [columns, ...body].map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = '商品列表-展示資料.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  function resetDynamicForm() {
    formValues.value = { ...initialFormValues, tags: [...initialFormValues.tags] }
    dynamicFormRef.value?.clearValidate()
    ElMessage.success('已重設展示表單')
  }

  async function validateProductName() {
    try {
      await dynamicFormRef.value?.validateField('name')
      ElMessage.success('商品名稱驗證通過')
    } catch {
      ElMessage.warning('請先完成商品名稱')
    }
  }

  async function submitDynamicForm() {
    if (formDisabled.value) return

    try {
      await dynamicFormRef.value?.validate()
    } catch {
      ElMessage.warning('請先完成必填欄位')
      return
    }

    try {
      await ElMessageBox.confirm('確定儲存這次商品資料異動？', '送出前確認', {
        confirmButtonText: '確認儲存',
        cancelButtonText: '返回編輯',
        appendTo: 'body',
        center: true,
        closeOnClickModal: false,
        customClass: 'storybook-save-confirm'
      })
      ElMessage.success('商品資料已儲存（展示狀態）')
    } catch {
      // 使用者返回表單時保留目前輸入內容。
    }
  }

  function handleUploadChange(_file, fileList) {
    uploadFiles.value = fileList
  }

  function handleUploadRemove(_file, fileList) {
    uploadFiles.value = fileList
  }

  function handlePreview(file) {
    previewUrl.value = file.url || ''
    previewVisible.value = Boolean(previewUrl.value)
  }

  function resetUpload() {
    uploadFiles.value = []
  }

  function moveUpload(index, direction) {
    const target = index + direction
    if (target < 0 || target >= uploadFiles.value.length) return
    const next = [...uploadFiles.value]
    ;[next[index], next[target]] = [next[target], next[index]]
    uploadFiles.value = next
  }
</script>

<template>
  <div class="component-library">
    <div class="component-library-shell">
      <div class="component-library-main">
        <header class="component-library-toolbar">
          <div>
            <strong>{{ component.name }}</strong>
            <span>{{ component.summary }}</span>
          </div>
          <div class="component-library-tabs" role="tablist" aria-label="元件文件分頁">
            <button type="button" role="tab" :aria-selected="tab === 'canvas'" @click="tab = 'canvas'">Canvas</button>
            <button type="button" role="tab" :aria-selected="tab === 'props'" @click="tab = 'props'">Props</button>
            <button type="button" role="tab" :aria-selected="tab === 'extension'" @click="tab = 'extension'">Slots & Events</button>
          </div>
        </header>

        <div v-if="tab === 'canvas'" class="component-library-canvas">
          <template v-if="component.preview === 'table'">
            <div class="storybook-preview">
              <el-form :model="searchForm" inline class="storybook-table-search" @submit.prevent="searchRows">
                <el-form-item label="商品名稱">
                  <el-input v-model="searchForm.name" clearable placeholder="輸入商品名稱" @keyup.enter="searchRows">
                    <template #prefix><el-icon><Search /></el-icon></template>
                  </el-input>
                </el-form-item>
                <el-form-item label="狀態">
                  <el-select v-model="searchForm.status" clearable placeholder="全部狀態" class="storybook-status-filter">
                    <el-option label="販售中" value="販售中" />
                    <el-option label="低庫存" value="低庫存" />
                    <el-option label="已售完" value="已售完" />
                  </el-select>
                </el-form-item>
                <el-form-item label="建立日期">
                  <el-date-picker v-model="searchForm.dateRange" type="daterange" value-format="YYYY-MM-DD" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期" class="storybook-date-filter" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :icon="Search" @click="searchRows">搜尋</el-button>
                  <el-button :icon="Refresh" @click="resetSearch">重設</el-button>
                </el-form-item>
              </el-form>
              <div class="storybook-table-actions">
                <span>商品列表 <small>共 {{ filteredRows.length }} 筆</small></span>
                <div>
                  <el-button :icon="Download" @click="exportRows">匯出</el-button>
                  <el-button type="primary" :icon="Plus" @click="addRow">新增商品</el-button>
                </div>
              </div>
              <div class="storybook-table-scroll">
                <el-table
                  ref="dynamicTableRef"
                  :data="paginatedRows"
                  height="390"
                  size="default"
                  border
                  stripe
                  row-key="id"
                  class="storybook-table"
                  @selection-change="(selection) => selectedRows = selection"
                >
                  <el-table-column type="selection" width="48" />
                  <el-table-column prop="id" label="商品編號" width="120" />
                  <el-table-column prop="name" label="商品" min-width="150" />
                  <el-table-column prop="category" label="分類" min-width="120" />
                  <el-table-column prop="stock" label="庫存" width="90" align="right" />
                  <el-table-column prop="createdAt" label="建立日期" width="120" />
                  <el-table-column label="狀態 Slot" min-width="120">
                    <template #default="{ row }">
                      <el-tag :type="row.status === '販售中' ? 'success' : row.status === '低庫存' ? 'warning' : 'info'" effect="plain" round>{{ row.status }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="190" fixed="right" align="center">
                    <template #default="{ row }">
                      <el-button type="primary" link @click="openRowDialog('detail', row)"><el-icon><View /></el-icon>詳情</el-button>
                      <el-button type="primary" link @click="openRowDialog('edit', row)"><el-icon><Edit /></el-icon>編輯</el-button>
                      <el-button type="danger" link @click="askRemove(row)"><el-icon><Delete /></el-icon>刪除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="storybook-table-footer">
                <span>已選取 {{ selectedRows.length }} 筆資料</span>
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 20]" :total="filteredRows.length" />
              </div>
            </div>
            <el-dialog v-model="deleteDialogVisible" title="移除商品" width="min(420px, calc(100vw - 32px))" append-to-body align-center class="storybook-dialog storybook-delete-dialog">
              <p v-if="deleteTarget">確定要移除「{{ deleteTarget.name }}」嗎？此操作只會修改目前展示中的範例資料。</p>
              <template #footer>
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="danger" @click="confirmRemove">確認移除</el-button>
              </template>
            </el-dialog>
            <el-dialog v-model="rowDialogVisible" :title="rowDialogMode === 'edit' ? '編輯商品' : '商品詳情'" width="min(560px, calc(100vw - 32px))" append-to-body align-center class="storybook-dialog storybook-row-dialog">
              <el-form v-if="activeRow" :model="activeRow" label-position="top" class="storybook-row-dialog-form">
                <el-form-item label="商品編號"><el-input v-model="activeRow.id" disabled /></el-form-item>
                <el-form-item label="商品名稱"><el-input v-model="activeRow.name" :readonly="rowDialogMode !== 'edit'" /></el-form-item>
                <el-form-item label="分類"><el-select v-model="activeRow.category" :disabled="rowDialogMode !== 'edit'" class="storybook-full-width"><el-option label="生活用品" value="生活用品" /><el-option label="3C 配件" value="3C 配件" /><el-option label="居家收納" value="居家收納" /></el-select></el-form-item>
                <el-form-item label="庫存"><el-input-number v-model="activeRow.stock" :min="0" :disabled="rowDialogMode !== 'edit'" /></el-form-item>
              </el-form>
              <template #footer>
                <el-button @click="rowDialogVisible = false">關閉</el-button>
                <el-button v-if="rowDialogMode === 'edit'" type="primary" @click="saveRow">儲存</el-button>
              </template>
            </el-dialog>
          </template>

          <template v-else-if="component.preview === 'form'">
            <div class="storybook-preview storybook-form-preview">
              <div class="storybook-form-heading">
                <div><strong>商品基本資料</strong><span>欄位型別、版面與狀態皆由 fields 設定</span></div>
                <div class="storybook-form-heading-actions">
                  <el-button size="small" @click="resetDynamicForm"><el-icon><Refresh /></el-icon>重設</el-button>
                  <el-switch v-model="formDisabled" active-text="唯讀" />
                </div>
              </div>
              <el-form
                ref="dynamicFormRef"
                :model="formValues"
                :rules="formRules"
                label-position="top"
                class="storybook-form"
                :disabled="formDisabled"
                @submit.prevent="submitDynamicForm"
              >
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="商品名稱" prop="name">
                      <el-input v-model="formValues.name" placeholder="請輸入商品名稱" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="商品分類" prop="category">
                      <el-select v-model="formValues.category" placeholder="選擇分類" class="storybook-full-width">
                        <el-option label="生活用品" value="生活用品" />
                        <el-option label="3C 配件" value="3C 配件" />
                        <el-option label="居家收納" value="居家收納" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="安全庫存">
                      <el-input v-model.number="formValues.stock" type="number" min="0">
                        <template #append>件</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="上架日期" prop="availableDate">
                      <el-date-picker
                        v-model="formValues.availableDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="選擇日期"
                        class="storybook-full-width"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="18">
                    <el-form-item label="商品標籤">
                      <el-select v-model="formValues.tags" multiple collapse-tags placeholder="選擇標籤" class="storybook-full-width">
                        <el-option label="新品" value="新品" />
                        <el-option label="門市推薦" value="門市推薦" />
                        <el-option label="熱銷商品" value="熱銷商品" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="6">
                    <el-form-item label="販售狀態">
                      <el-switch v-model="formValues.enabled" inline-prompt active-text="上架" inactive-text="下架" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="商品描述">
                      <el-input v-model="formValues.description" type="textarea" :rows="3" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <div class="storybook-slot-example">
                      <div><el-icon><InfoFilled /></el-icon><span><b>Submit After Slot</b> 放置頁面專屬的延伸操作</span></div>
                      <el-button text type="primary" :disabled="formDisabled" @click="validateProductName">單欄驗證</el-button>
                    </div>
                  </el-col>
                </el-row>
                <div class="storybook-form-footer">
                  <span>送出前會先驗證欄位，再顯示確認訊息。</span>
                  <el-button native-type="submit" type="primary" :disabled="formDisabled">儲存變更</el-button>
                </div>
              </el-form>
            </div>
          </template>

          <template v-else>
            <div class="storybook-preview storybook-upload-preview">
              <div class="storybook-form-heading">
                <div><strong>商品圖片</strong><span>圖片格式 · 單張上限 5 MB</span></div>
                <el-select v-model="uploadStory" size="small" aria-label="選擇 UploadImage 範例情境" class="storybook-upload-mode">
                  <el-option label="多張編輯" value="multiple" />
                  <el-option label="單張上傳" value="single" />
                  <el-option label="拖曳排序" value="sortable" />
                  <el-option label="唯讀預覽" value="readonly" />
                </el-select>
              </div>
              <el-upload
                :file-list="uploadFiles"
                :action="'#'"
                :auto-upload="false"
                :multiple="uploadMultiple"
                :limit="uploadLimit"
                :disabled="uploadReadOnly"
                list-type="picture-card"
                accept="image/png,image/jpeg,image/gif,image/webp"
                class="storybook-upload"
                :on-change="handleUploadChange"
                :on-remove="handleUploadRemove"
                :on-preview="handlePreview"
              >
                <el-icon><Plus /></el-icon>
                <template #file="{ file }">
                  <div class="storybook-upload-card">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" :alt="file.name" />
                    <span v-if="uploadFiles[0]?.uid === file.uid" class="storybook-cover-tag">封面</span>
                    <span class="el-upload-list__item-actions">
                      <span class="el-upload-list__item-preview" @click.stop="handlePreview(file)"><el-icon><ZoomIn /></el-icon></span>
                      <template v-if="uploadSortable && !uploadReadOnly">
                        <span class="el-upload-list__item-delete" @click.stop="moveUpload(uploadFiles.findIndex((item) => item.uid === file.uid), -1)"><el-icon><ArrowLeft /></el-icon></span>
                        <span class="el-upload-list__item-delete" @click.stop="moveUpload(uploadFiles.findIndex((item) => item.uid === file.uid), 1)"><el-icon><ArrowRight /></el-icon></span>
                      </template>
                      <span v-if="!uploadReadOnly" class="el-upload-list__item-delete" @click.stop="handleUploadRemove(file, uploadFiles.filter((item) => item.uid !== file.uid))"><el-icon><Delete /></el-icon></span>
                    </span>
                  </div>
                </template>
              </el-upload>
              <div class="storybook-upload-footer">
                <span>已選 {{ uploadFiles.length }} / {{ uploadLimit }} 張</span>
                <el-button v-if="!uploadReadOnly" text type="danger" @click="resetUpload">清除全部</el-button>
              </div>
              <el-dialog v-model="previewVisible" title="圖片預覽" width="min(560px, calc(100vw - 32px))" append-to-body align-center class="storybook-dialog storybook-upload-dialog">
                <img v-if="previewUrl" :src="previewUrl" alt="上傳圖片預覽" class="storybook-upload-dialog-image" />
              </el-dialog>
            </div>
          </template>
        </div>

        <div v-else-if="tab === 'props'" class="component-library-docs">
          <table><thead><tr><th>Prop</th><th>型別</th><th>用途</th></tr></thead><tbody>
            <tr v-for="item in component.props" :key="item.name"><td><code>{{ item.name }}</code></td><td>{{ item.type }}</td><td>{{ item.description }}</td></tr>
          </tbody></table>
        </div>
        <div v-else class="component-library-extension">
          <div><h3>Slots</h3><ul><li v-for="item in component.slots" :key="item"><code>#{{ item }}</code></li></ul></div>
          <div><h3>Events / Expose</h3><ul><li v-for="item in component.events" :key="item"><code>{{ item }}</code></li></ul></div>
          <p>{{ component.extensionNote }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
