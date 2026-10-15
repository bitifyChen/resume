import { computed, ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useDemoData } from './useDemoData'

export function useChatWorkspace() {
  const { database, execute, saving, isPending, error, refetch } = useDemoData()
  const selectedId = ref('c1')
  const keyword = ref('')
  const filter = ref('全部')
  const draft = ref('')
  const mobileDetail = ref(false)
  const active = computed(() =>
    database.value?.conversations.find((chat) => chat.id === selectedId.value)
  )
  const member = computed(() =>
    database.value?.members.find((item) => item.id === active.value?.memberId)
  )
  const conversations = computed(() =>
    (database.value?.conversations || [])
      .map((chat) => ({
        ...chat,
        member: database.value.members.find((item) => item.id === chat.memberId)
      }))
      .filter((chat) => {
        const term = keyword.value.trim().toLowerCase()
        return (
          (!term || `${chat.member?.name} ${chat.subject}`.toLowerCase().includes(term)) &&
          (filter.value !== '我的' || chat.assignedTo === '我') &&
          (filter.value !== '未讀' || chat.unread > 0)
        )
      })
      .sort(
        (a, b) =>
          Number(b.pinned) - Number(a.pinned) ||
          (b.messages.at(-1)?.createdAt || 0) - (a.messages.at(-1)?.createdAt || 0)
      )
  )
  const canReply = computed(
    () => active.value?.assignedTo === '我' && active.value?.status === '處理中'
  )
  watch(
    () => active.value?.id,
    (id) => {
      draft.value = ''
      if (id && active.value.unread) execute('chat.read', { id })
    },
    { immediate: true }
  )
  const select = (id) => {
    const wasSelected = selectedId.value === id
    selectedId.value = id
    mobileDetail.value = true
    if (wasSelected && active.value?.unread) execute('chat.read', { id })
  }
  const send = async (messageType = 'text') => {
    if (!canReply.value || saving.value || (messageType === 'text' && !draft.value.trim())) return
    const text = draft.value
    if (await execute('chat.send', { id: selectedId.value, text, messageType })) {
      if (draft.value === text) draft.value = ''
    }
  }
  const edit = async (message) => {
    let result
    try {
      result = await ElMessageBox.prompt('修改這則展示訊息。', '編輯訊息', {
        inputValue: message.text,
        inputType: 'textarea',
        confirmButtonText: '儲存',
        cancelButtonText: '取消',
        inputValidator: (value) => (value?.trim() && value.length <= 2000) || '請輸入 1 到 2000 字'
      })
    } catch {
      return
    }
    await execute(
      'chat.edit',
      { id: selectedId.value, messageId: message.id, text: result.value },
      '訊息已編輯'
    )
  }
  const retract = async (message) => {
    const chatId = selectedId.value
    try {
      await ElMessageBox.confirm('收回後，會話中將保留收回提示。', '收回訊息', {
        confirmButtonText: '收回',
        cancelButtonText: '取消'
      })
    } catch {
      return
    }
    await execute('chat.retract', { id: chatId, messageId: message.id }, '已收回訊息')
  }
  const simulate = () => {
    const target = database.value?.conversations.find(
      (chat) => chat.id !== selectedId.value && chat.status === '處理中'
    )
    if (target) execute('chat.receive', { id: target.id }, '另一則會話收到一則模擬訊息')
  }
  return {
    database,
    active,
    member,
    selectedId,
    keyword,
    filter,
    draft,
    mobileDetail,
    conversations,
    canReply,
    select,
    send,
    edit,
    retract,
    simulate,
    execute,
    saving,
    isPending,
    error,
    refetch
  }
}
