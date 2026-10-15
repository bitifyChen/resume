<script setup>
  import { computed, reactive, ref } from 'vue'
  import { useDemoData } from '@/hook/useDemoData'
  import { useTable } from '@/hook/useTable'
  import { money } from '@/utils/format'
  import DataPanel from '@/components/Table/DataPanel.vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const { database, isPending, error, refetch, execute, saving } = useDemoData()
  const rows = computed(() => database.value?.products || [])
  const { keyword, filter, page, pageSize, paged, total } = useTable(rows, {
    searchKeys: ['name', 'sku']
  })
  const drawer = ref(false)
  const formRef = ref()
  const form = reactive({ id: '', name: '', price: 0, stock: 0, status: '上架中' })
  const rules = {
    name: [{ required: true, whitespace: true, message: '請輸入商品名稱', trigger: 'blur' }],
    price: [{ type: 'number', min: 1, message: '售價須大於 0', trigger: 'change' }],
    stock: [{ type: 'integer', min: 0, message: '庫存須為非負整數', trigger: 'change' }]
  }
  const edit = (row) => {
    Object.assign(form, {
      id: row.id,
      name: row.name,
      price: row.price,
      stock: row.stock,
      status: row.status
    })
    drawer.value = true
  }
  async function save() {
    if (!(await formRef.value.validate().catch(() => false))) return
    if (await execute('product.save', { ...form }, '商品已更新，商城將同步顯示'))
      drawer.value = false
  }
</script>

<template>
  <div class="page-heading">
    <div>
      <p class="page-context">Commerce / Products</p>
      <h1>商品管理</h1>
      <p>維護上架資訊，讓消費者看到正確的商品與庫存。</p>
    </div>
    <RouterLink to="/demo/storefront" class="button secondary">
      前往商城
      <AppIcon name="ArrowRight" :size="16" />
    </RouterLink>
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
        aria-label="搜尋商品"
        placeholder="商品名稱或 SKU"
        clearable
        class="search-input"
      >
        <template #prefix><AppIcon name="Search" :size="16" /></template>
      </el-input>
      <el-select v-model="filter" aria-label="上架狀態" class="filter-select">
        <el-option
          v-for="status in ['全部', '上架中', '已下架']"
          :key="status"
          :value="status"
          :label="status === '全部' ? '全部狀態' : status"
        />
      </el-select>
    </template>
    <el-table :data="paged" row-key="id" empty-text="沒有符合條件的商品">
      <el-table-column label="商品" min-width="230">
        <template #default="{ row }">
          <div class="product-cell">
            <span class="product-symbol" :class="row.tone">
              <AppIcon :name="row.icon" :size="24" />
            </span>
            <div>
              <strong>{{ row.name }}</strong>
              <small>{{ row.sku }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="分類" min-width="120" />
      <el-table-column label="售價" min-width="110">
        <template #default="{ row }">{{ money(row.price) }}</template>
      </el-table-column>
      <el-table-column prop="stock" label="庫存" width="90" />
      <el-table-column label="上架狀態" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === '上架中' ? 'success' : 'info'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }"><el-button text @click="edit(row)">編輯</el-button></template>
      </el-table-column>
    </el-table>
  </DataPanel>
  <el-drawer v-model="drawer" title="編輯商品" size="min(440px, 100vw)">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item label="商品名稱" prop="name">
        <el-input v-model="form.name" maxlength="60" />
      </el-form-item>
      <el-form-item label="售價（TWD）" prop="price">
        <el-input-number v-model="form.price" :min="1" :precision="0" :max="999999" />
      </el-form-item>
      <el-form-item label="庫存數量" prop="stock">
        <el-input-number v-model="form.stock" :min="0" :precision="0" :max="999999" />
      </el-form-item>
      <el-form-item label="上架狀態">
        <el-radio-group v-model="form.status">
          <el-radio-button value="上架中">上架中</el-radio-button>
          <el-radio-button value="已下架">已下架</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <p class="helper-text">修改會反映至展示商城，不影響 POS 的獨立庫存。</p>
    <template #footer>
      <el-button @click="drawer = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="save">儲存商品</el-button>
    </template>
  </el-drawer>
</template>
