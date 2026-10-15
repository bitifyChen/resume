<script setup>
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useDemoData } from '@/hook/useDemoData'
  import { useTable } from '@/hook/useTable'
  import { money, date } from '@/utils/format'
  import { downloadCsv } from '@/utils/csv'
  import DataPanel from '@/components/Table/DataPanel.vue'
  import OrderDetail from '@/components/Shared/OrderDetail.vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const route = useRoute()
  const { database, isPending, error, refetch } = useDemoData()
  const rows = computed(() =>
    (database.value?.orders || []).map((order) => ({
      ...order,
      member: database.value.members.find((member) => member.id === order.memberId)?.name
    }))
  )
  const { keyword, filter, page, pageSize, paged, total, filtered } = useTable(rows, {
    searchKeys: ['id', 'member', 'recipient']
  })
  const detailOpen = ref(false)
  const selectedId = ref('')
  const open = (id) => {
    selectedId.value = id
    detailOpen.value = true
  }
  watch(
    () => route.query.order,
    (id) => {
      if (typeof id === 'string') open(id)
    },
    { immediate: true }
  )
  const exportRows = () =>
    downloadCsv(
      'demo-commerce-orders.csv',
      ['訂單編號', '會員', '金額', '狀態', '付款方式'],
      filtered.value.map((order) => [
        order.id,
        order.member,
        order.total,
        order.status,
        order.payment
      ])
    )
</script>

<template>
  <div class="page-heading">
    <div>
      <p class="page-context">Commerce / Orders</p>
      <h1>訂單管理</h1>
      <p>從會員訂單到出貨狀態，一次掌握。</p>
    </div>
    <el-button @click="exportRows">
      <AppIcon name="Download" :size="16" />
      匯出訂單
    </el-button>
  </div>
  <div class="summary-strip">
    <div>
      <span>全部訂單</span>
      <strong>{{ rows.length }}</strong>
    </div>
    <div>
      <span>待出貨</span>
      <strong>{{ rows.filter((row) => row.status === '待出貨').length }}</strong>
    </div>
    <div>
      <span>已完成</span>
      <strong>{{ rows.filter((row) => row.status === '已完成').length }}</strong>
    </div>
    <p>可至商城建立一筆展示訂單，回到此處查詢。</p>
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
        placeholder="訂單編號、會員或收件人"
        aria-label="搜尋訂單"
        clearable
        class="search-input"
      >
        <template #prefix><AppIcon name="Search" :size="16" /></template>
      </el-input>
      <el-select v-model="filter" aria-label="訂單狀態" class="filter-select">
        <el-option
          v-for="status in ['全部', '待出貨', '處理中', '配送中', '已完成', '已取消']"
          :key="status"
          :value="status"
          :label="status === '全部' ? '全部狀態' : status"
        />
      </el-select>
    </template>
    <el-table
      :data="paged"
      row-key="id"
      empty-text="沒有符合條件的訂單"
      @row-click="(row) => open(row.id)"
    >
      <el-table-column prop="id" label="訂單編號" min-width="190">
        <template #default="{ row }">
          <button class="table-link" @click.stop="open(row.id)">{{ row.id }}</button>
        </template>
      </el-table-column>
      <el-table-column prop="member" label="會員" min-width="110" />
      <el-table-column label="訂單金額" min-width="120">
        <template #default="{ row }">{{ money(row.total) }}</template>
      </el-table-column>
      <el-table-column label="狀態" min-width="110">
        <template #default="{ row }">
          <el-tag
            :type="
              row.status === '已完成' ? 'success' : row.status === '已取消' ? 'info' : 'warning'
            "
            effect="light"
          >
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="payment" label="付款方式" min-width="110" />
      <el-table-column label="建立時間" min-width="150">
        <template #default="{ row }">{{ date(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column width="65">
        <template #default="{ row }">
          <el-button text aria-label="檢視訂單" @click.stop="open(row.id)">
            <AppIcon name="ArrowRight" :size="16" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </DataPanel>
  <OrderDetail v-model="detailOpen" :order-id="selectedId" />
</template>
