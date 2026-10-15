<script setup>
  import { nextTick, ref, watch } from 'vue'
  import { asset, time } from '@/utils/format'
  const props = defineProps({
    messages: { type: Array, default: () => [] },
    chatId: { type: String, default: '' },
    visible: { type: Boolean, default: true }
  })
  defineEmits(['edit', 'retract'])
  const container = ref()
  watch(
    [() => props.messages.length, () => props.chatId, () => props.visible],
    async () => {
      await nextTick()
      if (container.value) container.value.scrollTop = container.value.scrollHeight
    },
    { immediate: true }
  )
</script>

<template>
  <div ref="container" class="messages-scroll" role="log" aria-label="會話訊息" aria-live="polite">
    <p class="chat-day-marker">展示會話 / 今天</p>
    <article
      v-for="message in messages"
      :key="message.id"
      class="message"
      :class="{ own: message.sender === 'agent', retracted: message.retracted }"
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
        <p v-else>{{ message.text }}</p>
      </div>
      <div class="message-meta">
        <time>{{ time(message.createdAt) }}</time>
        <span v-if="message.edited && !message.retracted">已編輯</span>
        <template v-if="message.sender === 'agent' && !message.retracted">
          <button
            v-if="message.type === 'text'"
            class="text-button"
            @click="$emit('edit', message)"
          >
            編輯
          </button>
          <button class="text-button" @click="$emit('retract', message)">收回</button>
        </template>
      </div>
    </article>
  </div>
</template>
