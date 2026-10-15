<script setup>
  import { computed, reactive, ref } from 'vue'
  import { useStorefront } from '@/hook/useStorefront'
  import { money, asset } from '@/utils/format'
  import DemoBar from '@/components/Shared/DemoBar.vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import ProductVisual from '@/components/Storefront/ProductVisual.vue'
  import { scrollToElement } from '@/utils/dom'
  const {
    database,
    execute,
    saving,
    isPending,
    error,
    refetch,
    keyword,
    category,
    sort,
    onlyFavorites,
    products,
    cart,
    cartCount,
    total,
    countdown
  } = useStorefront()
  const detailOpen = ref(false)
  const selectedId = ref('')
  const selectedProduct = computed(() =>
    database.value?.products.find((product) => product.id === selectedId.value)
  )
  const quantity = ref(1)
  const cartOpen = ref(false)
  const memberOpen = ref(false)
  const checkoutOpen = ref(false)
  const createdOrder = ref(null)
  const formRef = ref()
  const form = reactive({
    recipient: '林沐晴',
    address: '展示市範例區示意路 8 號',
    payment: '展示錢包'
  })
  const rules = {
    recipient: [{ required: true, whitespace: true, message: '請填寫收件人', trigger: 'blur' }],
    address: [{ required: true, whitespace: true, message: '請填寫展示地址', trigger: 'blur' }]
  }
  const openProduct = (product) => {
    selectedId.value = product.id
    quantity.value = 1
    detailOpen.value = true
  }
  function selectCategory(item) {
    category.value = item
    onlyFavorites.value = false
  }
  async function addToCart() {
    if (
      await execute(
        'cart.add',
        { productId: selectedId.value, quantity: quantity.value },
        '已加入購物袋'
      )
    )
      detailOpen.value = false
  }
  async function checkout() {
    if (!(await formRef.value.validate().catch(() => false))) return
    const next = await execute('checkout', { ...form })
    if (next) {
      createdOrder.value = next.orders[0]
      checkoutOpen.value = false
      cartOpen.value = false
    }
  }
</script>

<template>
  <div class="storefront-app">
    <DemoBar project="storefront" />
    <header class="store-header">
      <RouterLink to="/demo/storefront" class="store-brand">
        日常
        <span>選物</span>
        <small>EVERYDAY EDIT</small>
      </RouterLink>
      <nav aria-label="商品分類">
        <button
          v-for="item in ['全部商品', '日常選物', '通勤配件', '居家生活']"
          :key="item"
          :class="{ active: category === item }"
          @click="selectCategory(item)"
        >
          {{ item }}
        </button>
      </nav>
      <div class="store-header-actions">
        <button
          class="icon-button"
          :aria-label="onlyFavorites ? '顯示全部商品' : '顯示收藏商品'"
          :class="{ active: onlyFavorites }"
          @click="onlyFavorites = !onlyFavorites"
        >
          <AppIcon name="Star" />
        </button>
        <button class="icon-button" aria-label="展示會員資訊" @click="memberOpen = true">
          <AppIcon name="User" />
        </button>
        <button class="cart-trigger" aria-label="開啟購物袋" @click="cartOpen = true">
          <AppIcon name="ShoppingBag" />
          <span>{{ cartCount }}</span>
        </button>
      </div>
    </header>
    <main id="main-content" class="store-main">
      <section class="store-hero">
        <img
          :src="asset('images/everyday.png')"
          alt="保溫瓶、陶瓷杯、帆布袋與耳機的日常用品情境"
          width="1536"
          height="1024"
          fetchpriority="high"
        />
        <div class="store-hero-copy">
          <p class="eyebrow">The everyday collection</p>
          <h1>
            好好挑選，
            <br />
            陪你過日常。
          </h1>
          <p>把喜歡的物件，帶進每一天。</p>
          <a
            href="#store-products"
            class="button primary"
            @click.prevent="scrollToElement('store-products')"
          >
            探索選物
            <AppIcon name="ArrowDown" :size="17" />
          </a>
        </div>
      </section>
      <div class="campaign-bar">
        <div>
          <AppIcon name="ShoppingBag" :size="19" />
          <strong>本日選物企劃</strong>
          <span>精選商品展示價</span>
        </div>
        <div class="campaign-countdown">
          <span>{{ countdown === '00 : 00 : 00' ? '展示活動已結束' : '活動倒數' }}</span>
          <strong>{{ countdown }}</strong>
        </div>
      </div>
      <section id="store-products" class="store-products">
        <div class="store-products-heading">
          <div>
            <h2>
              {{
                onlyFavorites
                  ? '我的收藏'
                  : category === '全部商品'
                    ? '為日常留一點喜歡。'
                    : category
              }}
            </h2>
            <p>虛構商品與價格，體驗完整購物操作。</p>
          </div>
          <div class="store-filters">
            <el-input v-model="keyword" placeholder="搜尋選物" aria-label="搜尋選物" clearable>
              <template #prefix><AppIcon name="Search" :size="16" /></template>
            </el-input>
            <el-select v-model="sort" aria-label="商品排序">
              <el-option
                v-for="item in ['推薦排序', '價格由低到高', '價格由高到低']"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </div>
        </div>
        <el-skeleton v-if="isPending" :rows="8" animated />
        <div v-else-if="error" class="panel-empty">
          <p>無法載入商品</p>
          <el-button @click="refetch">重新載入</el-button>
        </div>
        <div v-else class="store-product-grid">
          <article v-for="product in products" :key="product.id" class="store-product">
            <button
              class="product-image-button"
              :aria-label="`查看${product.name}`"
              @click="openProduct(product)"
            >
              <ProductVisual :product="product" />
              <span v-if="product.stock === 0" class="sold-out">暫時售罄</span>
            </button>
            <button
              class="favorite-button icon-button"
              :aria-label="
                database?.favorites.includes(product.id)
                  ? `取消收藏${product.name}`
                  : `收藏${product.name}`
              "
              :aria-pressed="database?.favorites.includes(product.id)"
              @click="execute('favorite.toggle', { productId: product.id })"
            >
              <AppIcon name="Star" :size="18" />
            </button>
            <div class="store-product-copy">
              <span>{{ product.category }}</span>
              <button @click="openProduct(product)">
                <h3>{{ product.name }}</h3>
              </button>
              <p class="product-english">{{ product.english }}</p>
              <div class="price-line">
                <strong>{{ money(product.price) }}</strong>
                <del>{{ money(product.originalPrice) }}</del>
                <span class="color-dot" :class="product.tone" :aria-label="product.color" />
              </div>
            </div>
          </article>
        </div>
        <el-empty
          v-if="!isPending && !error && !products.length"
          description="沒有符合條件的選物，試試其他分類。"
        />
      </section>
      <footer class="store-footer">
        <span class="store-brand">日常選物</span>
        <p>獨立重製展示。商品、會員、訂單及品牌皆為虛構。</p>
        <RouterLink to="/demo/commerce-admin/orders">
          查看商城後台
          <AppIcon name="ArrowRight" :size="15" />
        </RouterLink>
      </footer>
    </main>
    <el-drawer v-model="detailOpen" title="商品詳情" size="min(480px, 100vw)">
      <template v-if="selectedProduct">
        <ProductVisual :product="selectedProduct" large />
        <span class="product-category-label">{{ selectedProduct.category }}</span>
        <h2>{{ selectedProduct.name }}</h2>
        <p class="muted">{{ selectedProduct.english }}</p>
        <div class="detail-price">
          <strong>{{ money(selectedProduct.price) }}</strong>
          <del>{{ money(selectedProduct.originalPrice) }}</del>
        </div>
        <p class="product-description">{{ selectedProduct.description }}</p>
        <dl class="detail-list">
          <dt>顏色</dt>
          <dd>{{ selectedProduct.color }}</dd>
          <dt>庫存</dt>
          <dd>{{ selectedProduct.stock }} 件</dd>
        </dl>
        <label class="field-label" for="product-quantity">購買數量</label>
        <el-input-number
          id="product-quantity"
          v-model="quantity"
          :min="1"
          :max="Math.max(1, selectedProduct.stock)"
          :precision="0"
          :disabled="selectedProduct.stock === 0"
        />
        <el-button
          class="full-width product-add"
          type="primary"
          :loading="saving"
          :disabled="selectedProduct.stock === 0"
          @click="addToCart"
        >
          {{ selectedProduct.stock ? '加入購物袋' : '暫時售罄' }}
        </el-button>
      </template>
    </el-drawer>
    <el-drawer v-model="cartOpen" title="我的購物袋" size="min(480px, 100vw)">
      <el-empty v-if="!cart.length" description="購物袋還空著，去挑選喜歡的物品吧。" />
      <div v-for="line in cart" :key="line.productId" class="cart-line">
        <span class="product-symbol" :class="line.product.tone">
          <AppIcon :name="line.product.icon" :size="28" />
        </span>
        <div>
          <strong>{{ line.product.name }}</strong>
          <p>{{ money(line.product.price) }}</p>
          <el-input-number
            :model-value="line.quantity"
            size="small"
            :min="0"
            :max="line.product.stock"
            :precision="0"
            :disabled="saving"
            :aria-label="`${line.product.name}數量`"
            @change="
              (value) =>
                value != null && execute('cart.set', { productId: line.productId, quantity: value })
            "
          />
        </div>
        <button
          class="icon-button"
          :aria-label="`移除${line.product.name}`"
          :disabled="saving"
          @click="execute('cart.set', { productId: line.productId, quantity: 0 })"
        >
          <AppIcon name="Delete" :size="17" />
        </button>
      </div>
      <template #footer>
        <template v-if="cart.length">
          <div class="cart-total">
            <span>合計</span>
            <strong>{{ money(total) }}</strong>
          </div>
          <el-button
            type="primary"
            class="full-width"
            :disabled="saving"
            @click="checkoutOpen = true"
          >
            前往展示結帳
          </el-button>
          <p class="helper-text">不會扣款或建立任何真實交易。</p>
        </template>
      </template>
    </el-drawer>
    <el-dialog v-model="checkoutOpen" title="展示結帳" width="min(480px, 94vw)">
      <p class="helper-text">請使用虛構收件資料。已預填展示內容，可直接體驗。</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="收件人" prop="recipient">
          <el-input v-model="form.recipient" maxlength="30" />
        </el-form-item>
        <el-form-item label="展示地址" prop="address">
          <el-input v-model="form.address" maxlength="120" />
        </el-form-item>
        <el-form-item label="付款方式">
          <el-radio-group v-model="form.payment">
            <el-radio-button value="展示錢包">展示錢包</el-radio-button>
            <el-radio-button value="信用卡">信用卡（模擬）</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="cart-total">
        <span>應付金額（示意）</span>
        <strong>{{ money(total) }}</strong>
      </div>
      <template #footer>
        <el-button @click="checkoutOpen = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="checkout">建立展示訂單</el-button>
      </template>
    </el-dialog>
    <el-dialog
      :model-value="!!createdOrder"
      title="展示訂單已建立"
      width="min(460px, 94vw)"
      @update:model-value="(value) => !value && (createdOrder = null)"
    >
      <template v-if="createdOrder">
        <div class="checkout-success">
          <AppIcon name="Check" :size="42" />
          <h2>購物流程完成。</h2>
          <p>{{ createdOrder.id }}</p>
          <strong>{{ money(createdOrder.total) }}</strong>
          <p>前往商城後台，即可看到這筆訂單。</p>
          <RouterLink
            :to="{ path: '/demo/commerce-admin/orders', query: { order: createdOrder.id } }"
            class="button primary"
          >
            到後台查看訂單
            <AppIcon name="ArrowRight" :size="16" />
          </RouterLink>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="memberOpen" title="展示會員" width="min(420px, 94vw)">
      <template v-if="database">
        <h2>{{ database.members[0].name }}</h2>
        <p>{{ database.members[0].email }}</p>
        <el-tag>{{ database.members[0].level }}</el-tag>
        <p class="helper-text">
          展示版使用固定虛構會員，無需登入。會員驗證與真實錢包不在本次展示範圍。
        </p>
      </template>
    </el-dialog>
  </div>
</template>
