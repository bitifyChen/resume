<script setup>
  import { computed } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import { useDemoData } from '@/hook/useDemoData'
  import { useSessionStore } from '@/store/useSessionStore'
  import AppIcon from './AppIcon.vue'
  const props = defineProps({ project: { type: String, required: true } })
  const { execute, saving } = useDemoData()
  const session = useSessionStore()
  const casePath = computed(() => `/projects/${props.project}`)
  async function reset() {
    try {
      await ElMessageBox.confirm(
        '將清除本展示網站內的訂單、會話操作及庫存異動，恢復初始假資料。',
        '重設展示資料',
        { confirmButtonText: '重設資料', cancelButtonText: '取消', type: 'warning' }
      )
    } catch {
      return
    }
    await execute('reset', {}, '已恢復初始展示資料')
    session.roleId = 'admin'
    session.storeId = 's1'
  }
</script>

<template>
  <div class="demo-bar">
    <RouterLink :to="casePath">
      <AppIcon name="ArrowLeft" :size="14" />
      <span>返回案例</span>
    </RouterLink>
    <span class="demo-label">
      互動展示
      <span class="demo-label-detail">/ 虛構資料，不產生真實交易</span>
    </span>
    <div class="demo-actions">
      <button class="text-button" :disabled="saving" @click="reset">重設資料</button>
    </div>
  </div>
</template>
