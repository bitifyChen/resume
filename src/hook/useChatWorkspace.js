import { computed, ref, watch } from 'vue'
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
        const matchesMessage = chat.messages.some((message) =>
          String(message.text || '').toLowerCase().includes(term)
        )
        return (
          (!term ||
            `${chat.member?.name} ${chat.subject}`.toLowerCase().includes(term) ||
            matchesMessage) &&
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
  const retract = async (message) => {
    await execute(
      'chat.retract',
      { id: selectedId.value, messageId: message.id },
      '已收回訊息'
    )
  }
  const simulate = () => {
    const target = database.value?.conversations.find(
      (chat) => chat.id !== selectedId.value && chat.status === '處理中'
    )
    if (target) execute('chat.receive', { id: target.id }, '另一則會話收到一則模擬訊息')
  }
  const simulateActive = async () => {
    const id = selectedId.value
    if (!id || !active.value) return
    if (await execute('chat.receive', { id }, '目前對話收到一則即時訊息')) {
      await execute('chat.read', { id })
    }
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
    retract,
    simulate,
    simulateActive,
    execute,
    saving,
    isPending,
    error,
    refetch
  }
}
