<script setup>
  import { computed, nextTick, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import ProductDetail from '@/components/Storefront/ProductDetail.vue'
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
  const route = useRoute()
  const router = useRouter()
  const selectedId = computed(() => String(route.query.product || ''))
  const detailOpen = computed(() => !!selectedId.value)
  const selectedProduct = computed(() =>
    database.value?.products.find((product) => product.id === selectedId.value)
  )
  const quantity = ref(1)
  const cartOpen = ref(false)
  const memberOpen = ref(false)
  const serviceOpen = ref(false)
  const checkoutOpen = ref(false)
  const createdOrder = ref(null)
  const bannerIndex = ref(0)
  const newPage = ref(0)
  const menuOpen = ref(true)
  const hoverCategory = ref('')
  const categories = ['日常選物', '通勤配件', '居家生活']
  const banners = [
    { title: '日常好物，輕鬆入手', subtitle: '精選生活用品・本週推薦', label: '日常選物' },
    { title: '通勤路上，一起出發', subtitle: '隨行配件・每日實用選擇', label: '通勤配件' },
    { title: '把生活，過成喜歡的樣子', subtitle: '居家用品・本週新上架', label: '居家生活' }
  ]
  const newProducts = computed(() =>
    (database.value?.products.filter((item) => item.status === '上架中') || []).slice(
      newPage.value * 2,
      newPage.value * 2 + 2
    )
  )
  const hotProducts = computed(() =>
    (database.value?.products.filter((item) => item.status === '上架中') || []).slice(0, 8)
  )
  async function browseCategory(item) {
    selectCategory(item)
    if (detailOpen.value) await router.push({ path: '/demo/storefront' })
    await nextTick()
    scrollToElement('store-products')
  }
  function showFavorites(toggle = false) {
    onlyFavorites.value = toggle ? !onlyFavorites.value : true
    scrollToElement('store-products')
  }
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
  async function openProduct(product) {
    quantity.value = 1
    await router.push({ path: '/demo/storefront', query: { product: product.id } })
    await nextTick()
    scrollToElement('main-content')
  }
  async function closeProduct() {
    await router.push({ path: '/demo/storefront' })
    await nextTick()
    scrollToElement('main-content')
  }
  function selectCategory(item) {
    category.value = item
    onlyFavorites.value = false
  }
  async function addToCart(action = 'cart') {
    if (
      await execute(
        'cart.add',
        { productId: selectedId.value, quantity: quantity.value },
        '已加入購物車'
      )
    ) {
      closeProduct()
      if (action === 'buy') {
        cartOpen.value = true
        checkoutOpen.value = true
      }
    }
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
    <div class="store-utility">
      <div>
        <span>歡迎來到日常選物</span>
        <button @click="memberOpen = true">展示會員</button>
        <button @click="showFavorites(true)">我的收藏</button>
        <RouterLink to="/demo/commerce-admin/chat">客服中心</RouterLink>
      </div>
    </div>
    <header class="store-header">
      <RouterLink to="/demo/storefront" class="store-brand">
        日常
        <span>選物</span>
        <small>EVERYDAY EDIT</small>
      </RouterLink>
      <div class="mall-header-search">
        <el-select v-model="category" aria-label="搜尋分類">
          <el-option
            v-for="item in ['全部商品', ...categories]"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
        <span class="mall-search-type">商品</span>
        <el-input
          v-model="keyword"
          placeholder="輸入你想找的商品"
          aria-label="搜尋選物"
          clearable
          @keyup.enter="scrollToElement('store-products')"
        />
        <button aria-label="搜尋商品" @click="scrollToElement('store-products')">
          <AppIcon name="Search" :size="19" />
        </button>
      </div>
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
        <button class="cart-trigger" aria-label="開啟購物車" @click="cartOpen = true">
          <AppIcon name="ShoppingCart" :size="25" />
          <span>購物車（{{ cartCount }}）</span>
        </button>
      </div>
    </header>
    <main id="main-content" class="store-main">
      <template v-if="detailOpen">
        <nav class="mall-detail-breadcrumb" aria-label="商品導覽">
          <button @click="closeProduct">商城首頁</button>
          <span>/</span>
          <span>{{ selectedProduct?.category || '商品' }}</span>
          <span>/</span>
          <strong>{{ selectedProduct?.name || '商品詳情' }}</strong>
        </nav>
        <ProductDetail
          v-if="selectedProduct"
          v-model:quantity="quantity"
          :product="selectedProduct"
          :saving="saving"
          @add="addToCart"
        />
        <el-empty v-else description="找不到此展示商品">
          <el-button @click="closeProduct">返回商城</el-button>
        </el-empty>
      </template>
      <div v-else>
        <div class="mall-category-bar">
          <button
            class="mall-category-title"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <AppIcon name="Menu" :size="17" />
            全站商品分類
          </button>
          <nav aria-label="商品分類">
            <button
              v-for="(item, index) in ['全部商品', ...categories]"
              :key="item"
              :class="['mall-category-tab', `tab-${index}`, { active: category === item }]"
              @click="browseCategory(item)"
            >
              {{ item }}
            </button>
          </nav>
          <span>本週新品</span>
        </div>
        <section class="mall-main-banner" @mouseleave="hoverCategory = ''">
          <aside v-if="menuOpen" class="mall-mega-menu">
            <button
              v-for="item in categories"
              :key="item"
              @mouseenter="hoverCategory = item"
              @focus="hoverCategory = item"
              @click="browseCategory(item)"
            >
              {{ item }}
              <AppIcon name="ArrowRight" :size="12" />
            </button>
            <button @click="showFavorites()">
              我的收藏
              <AppIcon name="Star" :size="12" />
            </button>
          </aside>
          <div v-if="hoverCategory" class="mall-mega-children">
            <strong>{{ hoverCategory }}</strong>
            <button
              v-for="product in database?.products.filter(
                (item) => item.category === hoverCategory
              )"
              :key="product.id"
              @click="openProduct(product)"
            >
              {{ product.name }}
              <AppIcon name="ArrowRight" :size="12" />
            </button>
            <button @click="browseCategory(hoverCategory)">查看全部商品</button>
          </div>
          <div class="mall-banner-stage" :class="`banner-${bannerIndex}`">
            <img
              :src="asset('images/everyday.png')"
              alt="虛構生活用品活動圖片"
              width="1536"
              height="1024"
              fetchpriority="high"
            />
            <div class="mall-banner-copy">
              <p>{{ banners[bannerIndex].subtitle }}</p>
              <h1>{{ banners[bannerIndex].title }}</h1>
              <button @click="browseCategory(banners[bannerIndex].label)">
                立即選購
                <AppIcon name="ArrowRight" :size="16" />
              </button>
            </div>
            <div class="mall-banner-pagination">
              <button
                v-for="(_, index) in banners"
                :key="index"
                :aria-label="`第 ${index + 1} 張活動`"
                :aria-pressed="index === bannerIndex"
                @click="bannerIndex = index"
              />
            </div>
          </div>
          <aside class="mall-new-products">
            <header>
              <span>新品推薦</span>
              <div>
                <button
                  v-for="index in 3"
                  :key="index"
                  :class="{ active: newPage === index - 1 }"
                  :aria-label="`新品第 ${index} 頁`"
                  @click="newPage = index - 1"
                >
                  {{ index }}
                </button>
              </div>
            </header>
            <button
              v-for="product in newProducts"
              :key="product.id"
              class="mall-new-product"
              @click="openProduct(product)"
            >
              <ProductVisual :product="product" />
              <strong>{{ product.name }}</strong>
              <span>{{ money(product.price) }}</span>
            </button>
          </aside>
        </section>
        <nav class="mall-mobile-categories" aria-label="手機商品分類">
          <button v-for="(item, index) in categories" :key="item" @click="browseCategory(item)">
            <span><AppIcon :name="['ShoppingBag', 'Goods', 'House'][index]" :size="26" /></span>
            {{ item }}
          </button>
          <button @click="showFavorites()">
            <span><AppIcon name="Star" :size="26" /></span>
            我的收藏
          </button>
        </nav>
        <section class="mall-hot-section">
          <h2>Top10 熱銷榜</h2>
          <div class="mall-hot-products">
            <button
              v-for="(product, index) in hotProducts"
              :key="product.id"
              @click="openProduct(product)"
            >
              <span class="hot-rank">{{ String(index + 1).padStart(2, '0') }}</span>
              <ProductVisual :product="product" />
              <strong>{{ product.name }}</strong>
            </button>
          </div>
        </section>
        <div class="campaign-bar">
          <div>
            <AppIcon name="ShoppingBag" :size="19" />
            <strong>限時活動</strong>
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
                  onlyFavorites ? '我的收藏' : category === '全部商品' ? '精選商品推薦' : category
                }}
              </h2>
              <p>虛構商品與價格，體驗完整購物操作。</p>
            </div>
            <div class="store-filters">
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
      </div>
      <footer class="store-footer">
        <span class="store-brand">日常選物</span>
        <p>獨立重製展示。商品、會員、訂單及品牌皆為虛構。</p>
        <RouterLink to="/demo/commerce-admin/orders">
          查看商城後台
          <AppIcon name="ArrowRight" :size="15" />
        </RouterLink>
      </footer>
    </main>
    <nav class="mall-mobile-tabbar" aria-label="商城主要導覽">
      <button :class="{ active: !detailOpen }" @click="closeProduct">
        <AppIcon name="House" :size="24" />
        首頁
      </button>
      <button @click="browseCategory('全部商品')">
        <AppIcon name="Grid" :size="24" />
        商品
      </button>
      <button @click="memberOpen = true">
        <AppIcon name="User" :size="24" />
        會員中心
      </button>
      <button @click="cartOpen = true">
        <AppIcon name="ShoppingCart" :size="24" />
        <span v-if="cartCount" class="mobile-cart-badge">{{ cartCount }}</span>
        購物車
      </button>
      <button @click="serviceOpen = true">
        <AppIcon name="ChatDotRound" :size="24" />
        聊天
      </button>
    </nav>
    <el-dialog v-model="serviceOpen" title="客服功能展示" width="min(420px, 94vw)">
      <p>目前公開版著重展示管理員處理客服問題的工作流程，尚未重現消費者聊天室。</p>
      <p class="helper-text">可以前往後台，以虛構會話體驗指派、回覆、會員與訂單查詢。</p>
      <RouterLink class="button primary" to="/demo/commerce-admin/chat">
        體驗客服工作台
        <AppIcon name="ArrowRight" :size="16" />
      </RouterLink>
    </el-dialog>
    <el-drawer v-model="cartOpen" title="我的購物車" size="min(480px, 100vw)">
      <el-empty v-if="!cart.length" description="購物車還空著，去挑選喜歡的物品吧。" />
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
