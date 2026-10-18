<script setup>
  import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { asset, time } from '@/utils/format'
  import { formatChatMessageHtml } from '@/utils/chatMessageHtml'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const props = defineProps({
    messages: { type: Array, default: () => [] },
    chatId: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    keyword: { type: String, default: '' }
  })
  const emit = defineEmits(['edit', 'retract'])
  const container = ref()
  const menuMessage = ref(null)
  const menuPosition = ref({ x: 0, y: 0 })

  function openMenu(event, message) {
    if (message.sender !== 'agent' || message.retracted) return
    const width = 168
    const height = message.type === 'text' ? 92 : 52
    menuPosition.value = {
      x: Math.max(8, Math.min(event.clientX, window.innerWidth - width - 8)),
      y: Math.max(8, Math.min(event.clientY, window.innerHeight - height - 8))
    }
    menuMessage.value = message
  }

  function closeMenu() {
    menuMessage.value = null
  }

  function onDocumentPointerDown(event) {
    if (event.target.closest('.chat-message-menu, .message-action-trigger')) return
    closeMenu()
  }

  function onDocumentKeydown(event) {
    if (event.key === 'Escape') closeMenu()
  }

  function editMessage() {
    const message = menuMessage.value
    closeMenu()
    if (message) emit('edit', message)
  }

  function retractMessage() {
    const message = menuMessage.value
    closeMenu()
    if (message) emit('retract', message)
  }

  watch(
    [() => props.messages.length, () => props.chatId, () => props.visible],
    async () => {
      await nextTick()
      if (container.value) container.value.scrollTop = container.value.scrollHeight
    },
    { immediate: true }
  )
  onMounted(() => {
    document.addEventListener('pointerdown', onDocumentPointerDown)
    document.addEventListener('keydown', onDocumentKeydown)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
    document.removeEventListener('keydown', onDocumentKeydown)
  })
</script>

<template>
  <div ref="container" class="messages-scroll" role="log" aria-label="會話訊息" aria-live="polite">
    <p class="chat-day-marker">展示會話 / 今天</p>
    <article
      v-for="message in messages"
      :key="message.id"
      class="message"
      :class="{ own: message.sender === 'agent', retracted: message.retracted }"
      @contextmenu.prevent="openMenu($event, message)"
    >
      <span class="message-sender">{{ message.sender === 'agent' ? '我' : '會員' }}</span>
      <div class="message-bubble">
        <p v-if="message.retracted" class="retract-text">此訊息已收回</p>
        <el-image
          v-else-if="message.type === 'image'"
          :src="asset('images/everyday.png')"
          :preview-src-list="[asset('images/everyday.png')]"
          preview-teleported
          fit="cover"
          alt="虛構商品情境展示照片"
          class="chat-image"
        />
        <!-- Content is escaped before the helper adds only controlled mark/link tags. -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-else v-html="formatChatMessageHtml(message.text, keyword)"></p>
      </div>
      <div class="message-meta">
        <time>{{ time(message.createdAt) }}</time>
        <span v-if="message.edited && !message.retracted">已編輯</span>
        <button
          v-if="message.sender === 'agent' && !message.retracted"
          type="button"
          class="message-action-trigger"
          aria-label="訊息操作"
          aria-haspopup="menu"
          @click.stop="openMenu($event, message)"
        >
          <AppIcon name="MoreFilled" :size="16" />
        </button>
      </div>
    </article>
  </div>
  <Teleport to="body">
    <div
      v-if="menuMessage"
      class="chat-message-menu"
      role="menu"
      aria-label="訊息操作"
      :style="{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }"
    >
      <button v-if="menuMessage.type === 'text'" type="button" role="menuitem" @click="editMessage">
        編輯訊息
      </button>
      <button type="button" role="menuitem" @click="retractMessage">收回訊息</button>
    </div>
  </Teleport>
</template>
