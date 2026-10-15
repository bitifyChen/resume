<script setup>
  import { computed, defineAsyncComponent, ref, toRef } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useDemoData } from '@/hook/useDemoData'
  import { useSessionStore } from '@/store/useSessionStore'
  import { useDashboardLayout } from '@/hook/useDashboardLayout'
  import { money, number } from '@/utils/format'
  import { downloadCsv } from '@/utils/csv'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import AccessNotice from '@/components/Shared/AccessNotice.vue'
  const SalesChart = defineAsyncComponent(() => import('@/components/Pos/SalesChart.vue'))
  const { database, allowed, isPending } = useDemoData()
  const session = useSessionStore()
  const { cards, editMode, dragging, grid, drop, nudge, resize, reset } = useDashboardLayout(
    toRef(session, 'storeId')
  )
  const period = ref(7)
  const tableOpen = ref(false)
  const store = computed(() => database.value?.stores.find((item) => item.id === session.storeId))
  const multiplier = computed(() => ({ s1: 1, s2: 0.78, s3: 0.64 })[session.storeId] || 1)
  const sales = computed(() =>
    (database.value?.sales.slice(-period.value) || []).map((row) => ({
      ...row,
      revenue: Math.round(row.revenue * multiplier.value),
      orders: Math.round(row.orders * multiplier.value)
    }))
  )
  const inventory = computed(
    () => database.value?.inventory.filter((item) => item.storeId === session.storeId) || []
  )
  const today = computed(() => sales.value.at(-1) || { revenue: 0, orders: 0 })
  const receipts = computed(() =>
    inventory.value.slice(0, 7).map((item, index) => ({
      id: `POS-${session.storeId.toUpperCase()}-${1086 - index}`,
      time: `14:${String(52 - index * 7).padStart(2, '0')}`,
      name: item.name,
      total: item.price * ((index % 3) + 1),
      payment: index % 2 ? '現金' : '信用卡',
      status: '已完成'
    }))
  )
  const documents = computed(() =>
    Object.fromEntries(
      ['purchaseOrders', 'returnOrders', 'transferOrders', 'damageOrders'].map((id, group) => [
        id,
        inventory.value.slice(group, group + 2).map((item, index) => ({
          id: `${['PUR', 'RET', 'TRF', 'DMG'][group]}-${session.storeId.toUpperCase()}-${2008 - index}`,
          name: item.name,
          quantity: group === 0 ? 20 - index * 5 : index + 2,
          status: index ? '已完成' : '待處理'
        }))
      ])
    )
  )
  function exportReport() {
    if (allowed('reports', 'export'))
      downloadCsv(
        'demo-sales-report.csv',
        ['日期', '營收', '訂單數'],
        sales.value.map((row) => [row.label, row.revenue, row.orders])
      )
  }
  async function copyStore() {
    try {
      await navigator.clipboard.writeText(`DEMO-${session.storeId.toUpperCase()}`)
      ElMessage.success('已複製展示門店 ID')
    } catch {
      ElMessage.info(`展示門店 ID：DEMO-${session.storeId.toUpperCase()}`)
    }
  }
</script>

<template>
  <el-skeleton v-if="isPending" :rows="10" animated />
  <AccessNotice v-else-if="!allowed('reports')" />
  <template v-else>
    <header class="pos-dashboard-hero">
      <div>
        <h1>{{ store?.name }}</h1>
        <button class="text-button store-copy" @click="copyStore">
          門店 ID：DEMO-{{ session.storeId.toUpperCase() }}
          <AppIcon name="Collection" :size="12" />
        </button>
      </div>
      <div class="heading-actions">
        <el-button :type="editMode ? 'primary' : 'default'" @click="editMode = !editMode">
          <AppIcon :name="editMode ? 'Check' : 'Edit'" :size="15" />
          {{ editMode ? '完成編輯' : '編輯看板' }}
        </el-button>
        <el-button @click="reset">重設排列</el-button>
      </div>
    </header>
    <p v-if="editMode" class="dashboard-edit-hint" role="status">
      拖曳標題重新排序，拖曳右下角調整尺寸；也可使用各卡片的左右按鈕排序。排列依門店儲存在本機。
    </p>
    <div ref="grid" class="pos-widget-grid" :class="{ 'is-editing': editMode }">
      <article
        v-for="card in cards"
        :key="card.id"
        class="pos-widget"
        :class="{
          'is-metric': card.id.startsWith('today') || card.id === 'productSpecs',
          'is-dragging': dragging === card.id
        }"
        :style="{ '--cols': card.cols, '--rows': card.rows }"
        @dragover.prevent
        @drop.prevent="drop(card.id)"
      >
        <header
          class="pos-widget-heading"
          :draggable="editMode"
          @dragstart="dragging = card.id"
          @dragend="dragging = ''"
        >
          <h2>{{ card.title }}</h2>
          <div v-if="editMode" class="widget-edit-actions">
            <button
              class="icon-button"
              :aria-label="`向前移動${card.title}`"
              @click="nudge(card.id, -1)"
            >
              <AppIcon name="ArrowLeft" :size="13" />
            </button>
            <button
              class="icon-button"
              :aria-label="`向後移動${card.title}`"
              @click="nudge(card.id, 1)"
            >
              <AppIcon name="ArrowRight" :size="13" />
            </button>
          </div>
          <AppIcon v-else-if="card.id === 'todayOrders'" name="ShoppingCart" :size="18" />
          <AppIcon v-else-if="card.id === 'todayRevenue'" name="ShoppingBag" :size="18" />
          <AppIcon v-else-if="card.id === 'productSpecs'" name="Goods" :size="18" />
        </header>
        <div class="pos-widget-body">
          <template v-if="card.id === 'todayOrders'">
            <strong class="widget-value">
              {{ number(today.orders) }}
              <small>筆</small>
            </strong>
            <p class="widget-caption">今日完成訂單</p>
          </template>
          <template v-else-if="card.id === 'todayRevenue'">
            <strong class="widget-value">{{ money(today.revenue) }}</strong>
            <p class="widget-caption">今日銷售金額</p>
          </template>
          <template v-else-if="card.id === 'productSpecs'">
            <strong class="widget-value">
              {{ inventory.length }}
              <small>項</small>
            </strong>
            <RouterLink to="/demo/pos-admin/inventory" class="widget-caption">
              查看商品與庫存
            </RouterLink>
          </template>
          <template v-else-if="card.id === 'recentOrders'">
            <el-table :data="receipts" size="small" height="100%">
              <el-table-column prop="id" label="訂單編號" min-width="155" />
              <el-table-column prop="time" label="時間" width="70" />
              <el-table-column label="金額" width="100">
                <template #default="{ row }">{{ money(row.total) }}</template>
              </el-table-column>
              <el-table-column prop="payment" label="付款方式" width="85" />
              <el-table-column prop="status" label="狀態" width="80">
                <template #default="{ row }">
                  <el-tag type="success" size="small">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else-if="card.id === 'salesTrend'">
            <div class="chart-controls">
              <el-radio-group v-model="period" size="small" aria-label="報表期間">
                <el-radio-button :value="7">近 7 天</el-radio-button>
                <el-radio-button :value="14">近 14 天</el-radio-button>
              </el-radio-group>
              <el-button
                v-if="allowed('reports', 'export')"
                text
                size="small"
                @click="exportReport"
              >
                匯出
              </el-button>
              <button class="text-button" @click="tableOpen = !tableOpen">
                {{ tableOpen ? '趨勢圖' : '數值資料' }}
              </button>
            </div>
            <el-table v-if="tableOpen" :data="sales" size="small" height="calc(100% - 38px)">
              <el-table-column prop="label" label="日期" />
              <el-table-column prop="revenue" label="營收" />
              <el-table-column prop="orders" label="訂單數" />
            </el-table>
            <SalesChart v-else :rows="sales" />
          </template>
          <template v-else>
            <el-table :data="documents[card.id]" size="small" height="100%">
              <el-table-column prop="id" label="單據編號" min-width="150" />
              <el-table-column prop="name" label="商品" min-width="120" />
              <el-table-column prop="quantity" label="數量" width="65" />
              <el-table-column label="狀態" width="85">
                <template #default="{ row }">
                  <el-tag :type="row.status === '待處理' ? 'warning' : 'success'" size="small">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <button
          v-if="editMode"
          class="widget-resize"
          :aria-label="`調整${card.title}尺寸`"
          @pointerdown.prevent="resize($event, card)"
          @keydown.right.prevent="card.cols = Math.min(12, card.cols + 1)"
          @keydown.left.prevent="card.cols = Math.max(2, card.cols - 1)"
          @keydown.down.prevent="card.rows = Math.min(6, card.rows + 1)"
          @keydown.up.prevent="card.rows = Math.max(1, card.rows - 1)"
        >
          <AppIcon name="Edit" :size="13" />
        </button>
      </article>
    </div>
    <p class="dashboard-data-note">
      營收、訂單與單據均為虛構資料；單據區為唯讀摘要，展示看板編排與資料呈現。
    </p>
  </template>
</template>
