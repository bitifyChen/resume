import { computed, ref, watch } from 'vue'

export function useTable(rows, options = {}) {
  const keyword = ref('')
  const filter = ref('全部')
  const page = ref(1)
  const pageSize = ref(8)
  const filtered = computed(() =>
    rows.value.filter((row) => {
      const matchesText = (options.searchKeys || ['name']).some((key) =>
        String(row[key] ?? '')
          .toLowerCase()
          .includes(keyword.value.toLowerCase().trim())
      )
      const matchesFilter =
        filter.value === '全部' || row[options.filterKey || 'status'] === filter.value
      return matchesText && matchesFilter
    })
  )
  const total = computed(() => filtered.value.length)
  const paged = computed(() =>
    filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
  )
  watch([keyword, filter, pageSize], () => {
    page.value = 1
  })
  watch(total, () => {
    page.value = Math.min(page.value, Math.max(1, Math.ceil(total.value / pageSize.value)))
  })
  return { keyword, filter, page, pageSize, filtered, total, paged }
}
