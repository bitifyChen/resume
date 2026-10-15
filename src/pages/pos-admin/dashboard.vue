<script setup>
  import { computed, defineAsyncComponent, ref } from 'vue'
  import { useDemoData } from '@/hook/useDemoData'
  import { useSessionStore } from '@/store/useSessionStore'
  import { money, number } from '@/utils/format'
  import { downloadCsv } from '@/utils/csv'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import AccessNotice from '@/components/Shared/AccessNotice.vue'
  const SalesChart = defineAsyncComponent(() => import('@/components/Pos/SalesChart.vue'))
  const { database, allowed, isPending } = useDemoData()
  const session = useSessionStore()
  const period = ref(7)
  const tableOpen = ref(false)
  const multiplier = computed(() =>
    session.storeId === 's1' ? 1 : session.storeId === 's2' ? 0.78 : 0.64
  )
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
  const lowStock = computed(() => inventory.value.filter((item) => item.quantity <= item.threshold))
  const revenue = computed(() => sales.value.reduce((sum, row) => sum + row.revenue, 0))
  const orders = computed(() => sales.value.reduce((sum, row) => sum + row.orders, 0))
  const exportReport = () => {
    if (allowed('reports', 'export'))
      downloadCsv(
        'demo-sales-report.csv',
        ['日期', '營收', '訂單數'],
        sales.value.map((row) => [row.label, row.revenue, row.orders])
      )
  }
</script>

<template>
  <el-skeleton v-if="isPending" :rows="10" animated />
  <AccessNotice v-else-if="!allowed('reports')" />
  <template v-else>
    <div class="page-heading">
      <div>
        <p class="page-context">Retail / Overview</p>
        <h1>掌握門店的每一天。</h1>
        <p>這裡的營運數字皆為虛構資料，供互動展示使用。</p>
      </div>
      <el-radio-group v-model="period" size="small" aria-label="報表期間">
        <el-radio-button :value="7">近 7 天</el-radio-button>
        <el-radio-button :value="14">近 14 天</el-radio-button>
      </el-radio-group>
    </div>
    <div class="metric-grid">
      <article class="metric">
        <div>
          <span>期間營收</span>
          <AppIcon name="ShoppingBag" :size="21" />
        </div>
        <strong>{{ money(revenue) }}</strong>
        <p>{{ period }} 天營收加總 / 展示資料</p>
      </article>
      <article class="metric">
        <div>
          <span>完成訂單</span>
          <AppIcon name="ShoppingCart" :size="21" />
        </div>
        <strong>
          {{ number(orders) }}
          <small>筆</small>
        </strong>
        <p>每日訂單加總 / 展示資料</p>
      </article>
      <article class="metric">
        <div>
          <span>平均客單價</span>
          <AppIcon name="Goods" :size="21" />
        </div>
        <strong>{{ money(orders ? Math.round(revenue / orders) : 0) }}</strong>
        <p>期間營收 ÷ 完成訂單</p>
      </article>
      <article class="metric attention">
        <div>
          <span>低庫存提醒</span>
          <AppIcon name="Box" :size="21" />
        </div>
        <strong>
          {{ lowStock.length }}
          <small>項</small>
        </strong>
        <RouterLink to="/demo/pos-admin/inventory">
          查看待補貨商品
          <AppIcon name="ArrowRight" :size="14" />
        </RouterLink>
      </article>
    </div>
    <div class="dashboard-grid">
      <section class="dashboard-panel sales-panel">
        <header>
          <div>
            <h2>銷售趨勢</h2>
            <p>每日營收與訂單變化</p>
          </div>
          <el-button v-if="allowed('reports', 'export')" text @click="exportReport">
            <AppIcon name="Download" :size="16" />
            匯出
          </el-button>
        </header>
        <SalesChart :rows="sales" />
        <button class="text-button chart-table-toggle" @click="tableOpen = !tableOpen">
          {{ tableOpen ? '收起數值資料' : '檢視數值資料' }}
        </button>
        <el-table v-if="tableOpen" :data="sales" size="small">
          <el-table-column prop="label" label="日期" />
          <el-table-column prop="revenue" label="營收" />
          <el-table-column prop="orders" label="訂單數" />
        </el-table>
      </section>
      <section class="dashboard-panel stock-panel">
        <header>
          <div>
            <h2>待補貨清單</h2>
            <p>庫存已達警戒值</p>
          </div>
          <AppIcon name="Box" :size="20" />
        </header>
        <div v-for="item in lowStock" :key="item.id" class="stock-warning">
          <div>
            <strong>{{ item.name }}</strong>
            <span>{{ item.sku }}</span>
          </div>
          <div>
            <strong>{{ item.quantity }}</strong>
            <span>警戒 {{ item.threshold }}</span>
          </div>
        </div>
        <el-empty v-if="!lowStock.length" description="目前沒有低庫存商品" :image-size="70" />
        <RouterLink to="/demo/pos-admin/inventory" class="stock-manage-link">
          前往庫存管理
          <AppIcon name="ArrowRight" :size="15" />
        </RouterLink>
      </section>
    </div>
    <section class="dashboard-panel">
      <header>
        <div>
          <h2>門店商品概況</h2>
          <p>商品與售價使用獨立的零售假資料。</p>
        </div>
      </header>
      <el-table :data="inventory.slice(0, 5)" empty-text="尚無商品">
        <el-table-column prop="name" label="商品名稱" min-width="160" />
        <el-table-column prop="sku" label="SKU" min-width="110" />
        <el-table-column label="零售價" min-width="120">
          <template #default="{ row }">{{ money(row.price) }}</template>
        </el-table-column>
        <el-table-column prop="quantity" label="現有庫存" min-width="100" />
        <el-table-column label="狀態" min-width="110">
          <template #default="{ row }">
            <el-tag :type="row.quantity <= row.threshold ? 'warning' : 'success'" size="small">
              {{ row.quantity <= row.threshold ? '待補貨' : '庫存正常' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </template>
</template>
