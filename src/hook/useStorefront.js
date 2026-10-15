import { computed, onUnmounted, ref } from 'vue'
import { useDemoData } from './useDemoData'

export function useStorefront() {
  const { database, execute, saving, isPending, error, refetch } = useDemoData()
  const keyword = ref('')
  const category = ref('全部商品')
  const sort = ref('推薦排序')
  const onlyFavorites = ref(false)
  const products = computed(() => {
    const result = (database.value?.products || []).filter(
      (product) =>
        product.status === '上架中' &&
        (category.value === '全部商品' || category.value === product.category) &&
        product.name.includes(keyword.value.trim()) &&
        (!onlyFavorites.value || database.value.favorites.includes(product.id))
    )
    return result.sort((a, b) =>
      sort.value === '價格由低到高'
        ? a.price - b.price
        : sort.value === '價格由高到低'
          ? b.price - a.price
          : Number(b.featured) - Number(a.featured)
    )
  })
  const cart = computed(() =>
    (database.value?.cart || [])
      .map((line) => ({
        ...line,
        product: database.value.products.find((product) => product.id === line.productId)
      }))
      .filter((line) => line.product)
  )
  const cartCount = computed(() => cart.value.reduce((sum, line) => sum + line.quantity, 0))
  const total = computed(() =>
    cart.value.reduce((sum, line) => sum + line.quantity * line.product.price, 0)
  )
  const now = ref(Date.now())
  const timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
  onUnmounted(() => clearInterval(timer))
  const countdown = computed(() => {
    const remaining = Math.max(
      0,
      Math.floor(((database.value?.campaignEndsAt || now.value) - now.value) / 1000)
    )
    return [Math.floor(remaining / 3600), Math.floor((remaining % 3600) / 60), remaining % 60]
      .map((value) => String(value).padStart(2, '0'))
      .join(' : ')
  })
  return {
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
  }
}
