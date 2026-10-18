<script setup>
  import { nextTick, ref, watch } from 'vue'
  import { useChatWorkspace } from '@/hook/useChatWorkspace'
  import { time } from '@/utils/format'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import MessageList from '@/components/Chat/MessageList.vue'
  import MemberPanel from '@/components/Chat/MemberPanel.vue'
  const {
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
  } = useChatWorkspace()
  const memberOpen = ref(false)
  const panelVisible = ref(true)
  const searchOpen = ref(false)
  const composerInput = ref(null)
  const editDialogOpen = ref(false)
  const editingMessage = ref(null)
  const editDraft = ref('')

  function openEditDialog(message) {
    editingMessage.value = message
    editDraft.value = message.text || ''
    editDialogOpen.value = true
  }

  async function saveEditedMessage() {
    const message = editingMessage.value
    const text = editDraft.value.trim()
    if (!message || !text || text.length > 2000 || saving.value) return
    const result = await execute(
      'chat.edit',
      { id: selectedId.value, messageId: message.id, text },
      '訊息已編輯'
    )
    if (result) {
      editDialogOpen.value = false
      editingMessage.value = null
      editDraft.value = ''
    }
  }

  function resizeComposer() {
    const input = composerInput.value
    if (!input) return
    input.style.height = 'auto'
    input.style.height = `${Math.min(input.scrollHeight, 150)}px`
  }
  function onEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault()
      send()
    }
  }
  watch(draft, async () => {
    await nextTick()
    resizeComposer()
  })
</script>

<template>
  <h1 class="sr-only">客服工作台</h1>
  <el-skeleton v-if="isPending" :rows="12" animated class="panel-skeleton" />
  <div v-else-if="error" class="panel-empty">
    <p>無法載入會話</p>
    <el-button @click="refetch">重新載入</el-button>
  </div>
  <div
    v-else
    class="chat-workspace"
    :class="{ 'mobile-detail': mobileDetail, 'member-hidden': !panelVisible }"
  >
    <section class="conversation-panel">
      <div class="conversation-panel-header">
        <div class="conversation-filters" role="group" aria-label="會話篩選">
          <button
            v-for="tab in [
              { value: '全部', label: '全部聊天' },
              { value: '我的', label: '我的聊天' }
            ]"
            :key="tab.value"
            :class="{ active: filter === tab.value }"
            :aria-pressed="filter === tab.value"
            @click="filter = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
        <el-button
          circle
          plain
          type="primary"
          size="small"
          :aria-label="searchOpen ? '收起搜尋' : '搜尋會話'"
          @click="searchOpen = !searchOpen"
        >
          <AppIcon :name="searchOpen ? 'ArrowLeft' : 'Search'" :size="14" />
        </el-button>
      </div>
      <div v-if="searchOpen" class="conversation-search">
        <el-input v-model="keyword" placeholder="搜尋會員、對話或訊息" aria-label="搜尋會話" clearable>
          <template #prefix><AppIcon name="Search" :size="16" /></template>
        </el-input>
        <div class="conversation-filters">
          <button
            :class="{ active: filter === '未讀' }"
            :aria-pressed="filter === '未讀'"
            @click="filter = filter === '未讀' ? '全部' : '未讀'"
          >
            僅顯示未讀
          </button>
        </div>
      </div>
      <div class="conversation-list">
        <button
          v-for="chat in conversations"
          :key="chat.id"
          class="conversation-item"
          :class="{ selected: selectedId === chat.id }"
          @click="select(chat.id)"
        >
          <span class="avatar" :style="{ background: chat.member?.color }">
            {{ chat.member?.name.slice(-2) }}
          </span>
          <span class="conversation-text">
            <span class="conversation-top">
              <strong>{{ chat.member?.name }}</strong>
              <time>{{ time(chat.messages.at(-1)?.createdAt) }}</time>
            </span>
            <span class="conversation-preview">
              {{
                chat.messages.at(-1)?.retracted
                  ? '訊息已收回'
                  : chat.messages.at(-1)?.type === 'image'
                    ? '[圖片]'
                    : chat.messages.at(-1)?.text
              }}
            </span>
            <span class="conversation-bottom">
              <span>{{ chat.assignedTo ? `客服：${chat.assignedTo}` : '尚未指派' }}</span>
              <AppIcon v-if="chat.pinned" name="Star" :size="12" />
              <span v-if="chat.unread" class="unread-badge">{{ chat.unread }}</span>
            </span>
          </span>
        </button>
        <el-empty v-if="!conversations.length" description="沒有符合條件的會話" :image-size="70" />
      </div>
      <div class="conversation-footer">
        <span>本機模擬訊息</span>
        <el-button text size="small" :disabled="saving" @click="simulate">
          <AppIcon name="Plus" :size="12" />
          模擬新訊息
        </el-button>
      </div>
    </section>
    <section v-if="active" class="chat-room">
      <header class="chat-room-header">
        <button
          class="icon-button mobile-chat-back"
          aria-label="返回會話列表"
          @click="mobileDetail = false"
        >
          <AppIcon name="ArrowLeft" />
        </button>
        <span class="avatar chat-room-avatar" :style="{ background: member?.color }">
          {{ member?.name.slice(-2) }}
        </span>
        <div class="chat-person">
          <strong>{{ member?.name }}</strong>
          <span>
            {{ active.status }} /
            {{ active.assignedTo ? `客服：${active.assignedTo}` : '尚未指派' }}
          </span>
        </div>
        <div class="chat-header-actions">
          <el-button plain size="small" :disabled="saving" @click="simulateActive">
            模擬即時來訊
          </el-button>
          <button
            class="icon-button"
            :aria-label="active.pinned ? '取消釘選' : '釘選會話'"
            :class="{ 'is-pinned': active.pinned }"
            :disabled="saving"
            @click="execute('chat.pin', { id: active.id })"
          >
            <AppIcon name="Star" :size="18" />
          </button>
          <el-dropdown
            trigger="click"
            @command="
              (agent) =>
                execute(
                  'chat.assign',
                  { id: active.id, agent: agent === 'unassigned' ? null : agent },
                  '指派已更新'
                )
            "
          >
            <el-button size="small" type="primary" round>
              指派
              <AppIcon name="ArrowDown" :size="12" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="agent in ['我', '承翰', '怡君']"
                  :key="agent"
                  :command="agent"
                >
                  {{ agent === '我' ? '加入會話（我）' : agent }}
                </el-dropdown-item>
                <el-dropdown-item command="unassigned">取消指派</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            class="chat-close-button"
            size="small"
            :disabled="saving"
            @click="
              execute('chat.status', {
                id: active.id,
                status: active.status === '處理中' ? '已結案' : '處理中'
              })
            "
          >
            {{ active.status === '處理中' ? '結案' : '重新開啟' }}
          </el-button>
          <button
            class="icon-button mobile-member-button"
            aria-label="查看會員資訊"
            @click="memberOpen = true"
          >
            <AppIcon name="User" :size="18" />
          </button>
          <button
            class="icon-button desktop-member-toggle"
            :aria-label="panelVisible ? '收合會員面板' : '展開會員面板'"
            @click="panelVisible = !panelVisible"
          >
            <AppIcon name="Grid" :size="17" />
          </button>
        </div>
      </header>
      <MessageList
        :messages="active.messages"
        :chat-id="active.id"
        :visible="mobileDetail"
        :keyword="keyword"
        @edit="openEditDialog"
        @retract="retract"
      />
      <div v-if="!canReply" class="chat-reply-notice">
        <span>
          {{
            active.status === '已結案'
              ? '此會話已結案，重新開啟後即可回覆。'
              : '加入會話後，即可回覆會員。'
          }}
        </span>
        <el-button
          v-if="active.status !== '已結案'"
          size="small"
          :loading="saving"
          @click="execute('chat.assign', { id: active.id, agent: '我' })"
        >
          加入會話
        </el-button>
      </div>
      <form class="chat-composer" @submit.prevent="send()">
        <el-dropdown trigger="click">
          <button type="button" class="chat-composer-add" aria-label="傳送展示圖片">
            <AppIcon name="Plus" :size="18" />
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="send('image')">傳送展示圖片</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="chat-composer-main">
          <textarea
            ref="composerInput"
            v-model="draft"
            rows="1"
            :maxlength="2000"
            :disabled="!canReply"
            placeholder="輸入訊息..."
            aria-label="回覆訊息"
            @input="resizeComposer"
            @keydown="(event) => event.key === 'Enter' && onEnter(event)"
          />
          <div class="chat-composer-actions">
            <span class="composer-help">Enter 傳送・Shift + Enter 換行</span>
            <button
              type="submit"
              class="chat-send-button"
              :disabled="!canReply || saving || !draft.trim()"
            >
              傳送 <AppIcon name="ArrowRight" :size="15" />
            </button>
          </div>
        </div>
      </form>
    </section>
    <el-empty v-else description="選擇一則會話開始處理" />
    <aside v-if="panelVisible" class="chat-member-sidebar">
      <MemberPanel :member="member" :order-id="active?.orderId" />
    </aside>
  </div>
  <el-dialog
    v-model="editDialogOpen"
    title="編輯訊息"
    width="min(520px, calc(100vw - 32px))"
    class="chat-message-dialog"
    append-to-body
    align-center
    :close-on-click-modal="false"
    @closed="editingMessage = null"
  >
    <label class="chat-edit-label" for="chat-message-edit">訊息內容</label>
    <textarea
      id="chat-message-edit"
      v-model="editDraft"
      class="chat-edit-textarea"
      rows="5"
      maxlength="2000"
      placeholder="輸入訊息內容"
    />
    <p class="chat-edit-counter">{{ editDraft.length }} / 2000</p>
    <template #footer>
      <div class="chat-edit-actions">
        <el-button @click="editDialogOpen = false">取消</el-button>
        <el-button
          type="primary"
          :loading="saving"
          :disabled="!editDraft.trim() || editDraft.length > 2000"
          @click="saveEditedMessage"
        >
          儲存
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-drawer v-model="memberOpen" title="會員資訊" size="min(360px, 100vw)">
    <MemberPanel :member="member" :order-id="active?.orderId" />
  </el-drawer>
</template>
