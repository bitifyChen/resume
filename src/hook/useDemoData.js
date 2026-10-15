import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ElMessage } from 'element-plus'
import { demoApi } from '@/api/demo'
import { can } from '@/mock/operations'
import { useSessionStore } from '@/store/useSessionStore'

export function useDemoData() {
  const session = useSessionStore()
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['demo', 'snapshot'], queryFn: demoApi.snapshot })
  const mutation = useMutation({
    mutationFn: demoApi.execute,
    onSuccess: (data) => queryClient.setQueryData(['demo', 'snapshot'], data)
  })
  const execute = async (type, payload = {}, successMessage) => {
    try {
      const result = await mutation.mutateAsync({ type, payload, roleId: session.roleId })
      if (successMessage) ElMessage.success(successMessage)
      return result
    } catch (error) {
      ElMessage.error(error.message || '操作失敗，請再試一次')
      return null
    }
  }
  const allowed = (module, action = 'view') =>
    !!query.data.value && can(query.data.value, session.roleId, module, action)
  return {
    ...query,
    database: query.data,
    execute,
    saving: computed(() => mutation.isPending.value),
    allowed
  }
}
