import { onBeforeUnmount, ref, watch } from 'vue'
import { normalizeDashboard, moveDashboard } from '@/utils/dashboard'

export function useDashboardLayout(storeId) {
  const cards = ref(normalizeDashboard())
  const editMode = ref(false)
  const dragging = ref('')
  const grid = ref()
  let finishResize = () => {}
  watch(
    storeId,
    (id) => {
      finishResize()
      try {
        cards.value = normalizeDashboard(JSON.parse(localStorage.getItem(`resume-dashboard-${id}`)))
      } catch {
        cards.value = normalizeDashboard()
      }
    },
    { immediate: true }
  )
  watch(
    cards,
    (value) => {
      try {
        localStorage.setItem(`resume-dashboard-${storeId.value}`, JSON.stringify(value))
      } catch {
        /* Layout still works when storage is unavailable. */
      }
    },
    { deep: true }
  )
  function move(from, to) {
    cards.value = moveDashboard(cards.value, from, to)
  }
  function drop(id) {
    move(dragging.value, id)
    dragging.value = ''
  }
  function nudge(id, direction) {
    const index = cards.value.findIndex((card) => card.id === id)
    const target = cards.value[index + direction]
    if (target) move(id, target.id)
  }
  function resize(event, card) {
    if (!editMode.value || !grid.value) return
    finishResize()
    const x = event.clientX,
      y = event.clientY,
      cols = card.cols,
      rows = card.rows
    const column = (grid.value.clientWidth + 16) / 12
    const pointerId = event.pointerId
    const update = (next) => {
      if (next.pointerId !== pointerId) return
      card.cols = Math.max(2, Math.min(12, cols + Math.round((next.clientX - x) / column)))
      card.rows = Math.max(1, Math.min(6, rows + Math.round((next.clientY - y) / 136)))
    }
    finishResize = () => {
      window.removeEventListener('pointermove', update)
      window.removeEventListener('pointerup', finishResize)
      window.removeEventListener('pointercancel', finishResize)
    }
    window.addEventListener('pointermove', update)
    window.addEventListener('pointerup', finishResize, { once: true })
    window.addEventListener('pointercancel', finishResize, { once: true })
  }
  onBeforeUnmount(() => finishResize())
  return {
    cards,
    editMode,
    dragging,
    grid,
    drop,
    nudge,
    resize,
    reset: () => {
      cards.value = normalizeDashboard()
    }
  }
}
