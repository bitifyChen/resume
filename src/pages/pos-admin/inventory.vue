<script setup>
  import { computed, reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useDemoData } from '@/hook/useDemoData'
  import { useSessionStore } from '@/store/useSessionStore'
  import { useTable } from '@/hook/useTable'
  import { money, date } from '@/utils/format'
  import { downloadCsv, parseCsv } from '@/utils/csv'
  import DataPanel from '@/components/Table/DataPanel.vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import AccessNotice from '@/components/Shared/AccessNotice.vue'
  const session = useSessionStore()
  const { database, isPending, error, refetch, execute, saving, allowed } = useDemoData()
  const rows = computed(() =>
    (database.value?.inventory || [])
      .filter((item) => item.storeId === session.storeId)
      .map((item) => ({ ...item, status: item.quantity <= item.threshold ? '待補貨' : '庫存正常' }))
  )
  const { keyword, filter, page, pageSize, paged, total, filtered } = useTable(rows, {
    searchKeys: ['name', 'sku']
  })
  const logs = computed(
    () => database.value?.inventoryLogs.filter((log) => log.storeId === session.storeId) || []
  )
  const drawer = ref(false)
  const logDrawer = ref(false)
  const formRef = ref()
  const adjustment = reactive({ id: '', name: '', quantity: 0, delta: 1, reason: '' })
  const rules = {
    delta: [
      {
        type: 'integer',
        required: true,
        validator: (_rule, value, callback) =>
          callback(
            Number.isInteger(value) && value !== 0 && adjustment.quantity + value >= 0
              ? undefined
              : new Error('請填寫非零整數，調整後庫存不得小於 0')
          )
      }
    ],
    reason: [{ required: true, whitespace: true, message: '請填寫調整原因', trigger: 'blur' }]
  }
  const openAdjust = (row) => {
    Object.assign(adjustment, {
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      delta: 1,
      reason: ''
    })
    drawer.value = true
  }
  async function saveAdjustment() {
    if (!(await formRef.value.validate().catch(() => false))) return
    if (
      await execute(
        'inventory.adjust',
        { id: adjustment.id, delta: adjustment.delta, reason: adjustment.reason },
        '庫存已調整並保留紀錄'
      )
    )
      drawer.value = false
  }
  const exportRows = () => {
    if (allowed('inventory', 'export'))
      downloadCsv(
        'demo-inventory.csv',
        ['SKU', '商品名稱', '庫存', '警戒值'],
        filtered.value.map((item) => [item.sku, item.name, item.quantity, item.threshold])
      )
  }
  const fileInput = ref()
  const importOpen = ref(false)
  const importRows = ref([])
  const importStoreId = ref('')
  const importError = ref('')
  const downloadTemplate = () =>
    downloadCsv(
      'inventory-template.csv',
      ['SKU', '庫存'],
      rows.value.slice(0, 3).map((item) => [item.sku, item.quantity + 5])
    )
  async function readImport(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    importError.value = ''
    importRows.value = []
    importOpen.value = true
    importStoreId.value = session.storeId
    try {
      if (file.size > 512000) throw new Error('檔案請小於 500 KB')
      const parsed = parseCsv(await file.text())
      const headers = parsed.shift() || []
      const skuIndex = headers.indexOf('SKU')
      const quantityIndex = headers.indexOf('庫存')
      if (skuIndex < 0 || quantityIndex < 0) throw new Error('需要 SKU 與庫存欄位，請先下載範本')
      if (!parsed.length) throw new Error('檔案沒有資料列')
      const seen = new Set()
      importRows.value = parsed.map((row, index) => {
        const item = rows.value.find((entry) => entry.sku === row[skuIndex]?.trim())
        if (!item) throw new Error(`第 ${index + 2} 行找不到此門店的 SKU`)
        if (seen.has(item.id)) throw new Error(`第 ${index + 2} 行為重複 SKU`)
        seen.add(item.id)
        const raw = row[quantityIndex]?.trim()
        if (!/^\d+$/.test(raw || '')) throw new Error(`第 ${index + 2} 行庫存必須是非負整數`)
        const quantity = Number(raw)
        if (!Number.isSafeInteger(quantity) || quantity > 999999)
          throw new Error(`第 ${index + 2} 行庫存超出範圍`)
        return { id: item.id, sku: item.sku, name: item.name, before: item.quantity, quantity }
      })
    } catch (err) {
      importRows.value = []
      importError.value = err.message
    }
  }
  async function applyImport() {
    if (session.storeId !== importStoreId.value) {
      ElMessage.error('門店已切換，請重新選取檔案')
      return
    }
    if (
      await execute(
        'inventory.import',
        { rows: importRows.value.map((item) => ({ id: item.id, quantity: item.quantity })) },
        '庫存已整批匯入'
      )
    )
      importOpen.value = false
  }
</script>

<template>
  <AccessNotice v-if="!isPending && !allowed('inventory')" />
  <template v-else>
    <div class="page-heading">
      <div>
        <p class="page-context">Retail / Inventory</p>
        <h1>商品與庫存</h1>
        <p>每次調整有原因，每筆異動可追蹤。</p>
      </div>
      <div class="heading-actions">
        <el-button @click="logDrawer = true">異動紀錄</el-button>
        <el-button v-if="allowed('inventory', 'export')" @click="exportRows">
          <AppIcon name="Download" :size="16" />
          匯出
        </el-button>
        <el-button v-if="allowed('inventory', 'edit')" type="primary" @click="fileInput.click()">
          <AppIcon name="Upload" :size="16" />
          匯入 CSV
        </el-button>
        <input
          ref="fileInput"
          type="file"
          accept=".csv,text/csv"
          class="sr-only"
          aria-label="匯入庫存 CSV"
          @change="readImport"
        />
      </div>
    </div>
    <div class="inventory-hint">
      <AppIcon name="Box" :size="20" />
      <span>
        {{ database?.stores.find((store) => store.id === session.storeId)?.name }} /
        {{ rows.length }} 項商品，{{
          rows.filter((row) => row.status === '待補貨').length
        }}
        項待補貨。
      </span>
      <button v-if="allowed('inventory', 'edit')" class="text-button" @click="downloadTemplate">
        下載匯入範本
      </button>
    </div>
    <DataPanel
      v-model:page="page"
      v-model:page-size="pageSize"
      :loading="isPending"
      :error="error"
      :total="total"
      @retry="refetch"
    >
      <template #toolbar>
        <el-input
          v-model="keyword"
          placeholder="商品名稱或 SKU"
          aria-label="搜尋庫存商品"
          clearable
          class="search-input"
        >
          <template #prefix><AppIcon name="Search" :size="16" /></template>
        </el-input>
        <el-select v-model="filter" aria-label="庫存狀態" class="filter-select">
          <el-option
            v-for="status in ['全部', '待補貨', '庫存正常']"
            :key="status"
            :value="status"
            :label="status === '全部' ? '全部庫存' : status"
          />
        </el-select>
      </template>
      <el-table :data="paged" row-key="id" empty-text="沒有符合條件的庫存">
        <el-table-column label="商品名稱" min-width="190">
          <template #default="{ row }">
            <strong>{{ row.name }}</strong>
            <small class="cell-subtitle">{{ row.category }}</small>
          </template>
        </el-table-column>
        <el-table-column prop="sku" label="SKU" min-width="110" />
        <el-table-column label="售價" min-width="110">
          <template #default="{ row }">{{ money(row.price) }}</template>
        </el-table-column>
        <el-table-column prop="quantity" label="現有庫存" width="110" sortable />
        <el-table-column prop="threshold" label="警戒值" width="90" />
        <el-table-column label="庫存狀態" min-width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === '待補貨' ? 'warning' : 'success'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="allowed('inventory', 'edit')" label="操作" width="100">
          <template #default="{ row }">
            <el-button text @click="openAdjust(row)">調整庫存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </DataPanel>
  </template>
  <el-drawer v-model="drawer" title="調整庫存" size="min(440px, 100vw)">
    <h2>{{ adjustment.name }}</h2>
    <p class="muted">目前庫存 {{ adjustment.quantity }} 件</p>
    <el-form ref="formRef" :model="adjustment" :rules="rules" label-position="top">
      <el-form-item label="調整數量（正數入庫，負數出庫）" prop="delta">
        <el-input-number
          v-model="adjustment.delta"
          :precision="0"
          :min="-adjustment.quantity"
          :max="999999"
        />
      </el-form-item>
      <el-form-item label="調整原因" prop="reason">
        <el-input
          v-model="adjustment.reason"
          type="textarea"
          :rows="3"
          maxlength="200"
          placeholder="例如：盤點補登、到貨入庫"
        />
      </el-form-item>
    </el-form>
    <div class="adjustment-result">
      <span>調整後庫存</span>
      <strong>{{ adjustment.quantity + (adjustment.delta || 0) }} 件</strong>
    </div>
    <template #footer>
      <el-button @click="drawer = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="saveAdjustment">確認調整</el-button>
    </template>
  </el-drawer>
  <el-drawer v-model="logDrawer" title="庫存異動紀錄" size="min(680px, 100vw)">
    <el-empty v-if="!logs.length" description="尚無異動，先調整一項商品庫存試試。" />
    <el-table v-else :data="logs">
      <el-table-column prop="name" label="商品" min-width="140" />
      <el-table-column label="異動" width="100">
        <template #default="{ row }">{{ row.before }} → {{ row.after }}</template>
      </el-table-column>
      <el-table-column prop="reason" label="原因" min-width="130" />
      <el-table-column label="時間" width="130">
        <template #default="{ row }">{{ date(row.createdAt) }}</template>
      </el-table-column>
    </el-table>
  </el-drawer>
  <el-dialog v-model="importOpen" title="預覽庫存匯入" width="min(640px, 94vw)">
    <el-alert v-if="importError" :title="importError" type="error" :closable="false" />
    <template v-else>
      <p class="helper-text">確認後，將整批覆寫所選門店的對應庫存並保留紀錄。</p>
      <el-table :data="importRows">
        <el-table-column prop="sku" label="SKU" />
        <el-table-column prop="name" label="商品" />
        <el-table-column prop="before" label="原庫存" />
        <el-table-column prop="quantity" label="匯入庫存" />
      </el-table>
    </template>
    <template #footer>
      <el-button @click="importOpen = false">取消</el-button>
      <el-button
        type="primary"
        :disabled="!!importError || !importRows.length"
        :loading="saving"
        @click="applyImport"
      >
        確認匯入
      </el-button>
    </template>
  </el-dialog>
</template>
