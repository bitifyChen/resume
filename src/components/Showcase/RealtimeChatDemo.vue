<script setup>
  import { nextTick, ref } from 'vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import AdminChatWorkspace from '@/pages/commerce-admin/chat.vue'

  const view = ref('storefront')
  const chatOpen = ref(false)
  const unread = ref(1)
  const draft = ref('')
  const messageList = ref(null)
  const faqItems = [
    {
      question: '如何查詢訂單？',
      answer: '登入會員中心後，前往「我的訂單」即可查看目前進度。'
    },
    {
      question: '商品多久會出貨？',
      answer: '一般商品會在 1 至 2 個工作天內出貨，實際進度可在訂單頁查看。'
    },
    {
      question: '可以辦理退換貨嗎？',
      answer: '商品到貨後 7 天內可提出申請，請保留完整包裝與配件。'
    }
  ]
  let nextMessageId = 3
  const messages = ref([
    { id: 1, from: 'member', text: '想請問訂單大約什麼時候會出貨？', time: '14:02' },
    { id: 2, from: 'agent', text: '您好，已為您確認，預計明天寄出。', time: '14:03' }
  ])

  function appendMessage(from, text, extra = {}) {
    messages.value.push({
      id: nextMessageId++,
      from,
      text,
      time: new Intl.DateTimeFormat('zh-TW', { hour: '2-digit', minute: '2-digit' }).format(
        new Date()
      ),
      ...extra
    })
  }

  function openChat() {
    chatOpen.value = !chatOpen.value
    if (chatOpen.value) unread.value = 0
    scrollToLatest()
  }

  function receiveMessage() {
    appendMessage('member', '了解，謝謝！請問寄出後會收到通知嗎？')
    if (chatOpen.value) unread.value = 0
    else unread.value += 1
    scrollToLatest()
  }

  function sendMessage() {
    const text = draft.value.trim()
    if (!text) return
    appendMessage('member', text)
    draft.value = ''
    scrollToLatest()
  }

  function chooseFaq(item) {
    appendMessage('member', item.question)
    appendMessage('agent', item.answer, { isFaqAnswer: true })
    unread.value = 0
    scrollToLatest()
  }

  async function scrollToLatest() {
    await nextTick()
    if (messageList.value) messageList.value.scrollTop = messageList.value.scrollHeight
  }
</script>

<template>
  <div class="realtime-chat-demo">
    <ul class="realtime-chat-highlights" aria-label="功能亮點">
      <li><strong>即時同步</strong><span>未讀數與客服會話更新</span></li>
      <li><strong>訊息管理</strong><span>編輯、收回與自動捲動</span></li>
      <li><strong>關鍵字搜尋</strong><span>命中高亮、網址可點擊</span></li>
      <li><strong>常見問答</strong><span>選題後顯示預設答覆</span></li>
    </ul>

    <div class="realtime-chat-controls">
      <div class="realtime-chat-tabs" role="tablist" aria-label="聊天介面">
        <button type="button" role="tab" :aria-selected="view === 'storefront'" @click="view = 'storefront'">
          商城前台
        </button>
        <button type="button" role="tab" :aria-selected="view === 'admin'" @click="view = 'admin'">
          客服後台
        </button>
      </div>
      <button
        v-if="view === 'storefront'"
        type="button"
        class="realtime-chat-incoming"
        @click="receiveMessage"
      >
        <AppIcon name="Plus" :size="15" /> 模擬會員來訊
      </button>
      <span v-else class="realtime-chat-live-label"><span></span>即時事件示意</span>
    </div>

    <div v-if="view === 'storefront'" class="realtime-chat-storefront">
      <header class="realtime-store-header">
        <div class="realtime-store-brand"><span>青</span><strong>青川選物</strong></div>
        <nav aria-label="商城導覽"><span>日常選物</span><span>生活配件</span><span>會員服務</span></nav>
        <button type="button" aria-label="購物袋"><AppIcon name="ShoppingBag" :size="18" /></button>
      </header>
      <div class="realtime-store-content">
        <div class="realtime-store-intro">
          <span>EVERYDAY GOODS</span>
          <h3>把喜歡的日常，<br />慢慢帶回家。</h3>
          <p>從選物到售後，訊息都留在同一個入口。</p>
        </div>
        <div class="realtime-store-products" aria-label="虛構商品">
          <article><div class="realtime-product-art bottle"></div><small>隨行保溫瓶</small><strong>NT$ 680</strong></article>
          <article><div class="realtime-product-art cup"></div><small>晨間陶瓷杯</small><strong>NT$ 420</strong></article>
          <article><div class="realtime-product-art tote"></div><small>城市帆布袋</small><strong>NT$ 490</strong></article>
        </div>
      </div>
      <Transition name="realtime-chat-pop">
        <section v-if="chatOpen" class="realtime-chat-window" aria-label="線上客服對話">
          <header>
            <span class="realtime-chat-agent-avatar">青</span>
            <span><strong>青川客服</strong><small>通常會即時回覆</small></span>
            <button type="button" aria-label="關閉聊天" @click="openChat"><AppIcon name="Close" :size="18" /></button>
          </header>
          <div ref="messageList" class="realtime-chat-messages" role="log" aria-live="polite">
            <p class="realtime-chat-date">今天</p>
            <article v-for="message in messages" :key="message.id" :class="message.from">
              <span v-if="message.isFaqAnswer" class="realtime-chat-answer-label">常見問題答覆</span>
              <p>{{ message.text }}</p><time>{{ message.time }}</time>
            </article>
          </div>
          <div class="realtime-chat-faq" aria-label="常見問題；選取後顯示對應的預設答覆">
            <p>常見問題 <span>選擇後顯示預設答覆</span></p>
            <button v-for="item in faqItems" :key="item.question" type="button" @click="chooseFaq(item)">
              {{ item.question }}
            </button>
          </div>
          <form class="realtime-chat-composer" @submit.prevent="sendMessage">
            <input v-model="draft" aria-label="輸入訊息" placeholder="輸入訊息…" />
            <button type="submit" aria-label="傳送訊息" :disabled="!draft.trim()"><AppIcon name="ArrowRight" :size="18" /></button>
          </form>
        </section>
      </Transition>
      <button
        type="button"
        class="realtime-chat-launcher"
        :aria-expanded="chatOpen"
        :aria-label="chatOpen ? '關閉客服對話' : '開啟客服對話'"
        @click="openChat"
      >
        <AppIcon :name="chatOpen ? 'Close' : 'ChatDotRound'" :size="23" />
        <span v-if="unread" class="realtime-chat-unread">{{ unread > 99 ? '99+' : unread }}</span>
      </button>
    </div>

    <div v-else class="admin-main chat-main realtime-chat-admin-shell">
      <AdminChatWorkspace />
    </div>
  </div>
</template>

<style scoped>
  .realtime-chat-demo { display: grid; gap: 18px; }
  .realtime-chat-demo-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; }
  .realtime-chat-demo-heading .case-section-label { margin: 0 0 8px; }
  .realtime-chat-demo-heading h2 { margin: 0; font-size: clamp(22px, 3vw, 32px); letter-spacing: -.035em; }
  .realtime-chat-demo-heading > div > p:last-child { margin: 8px 0 0; color: var(--muted); font-size: 13px; }
  .realtime-chat-local-note { flex: 0 0 auto; color: var(--muted); font-size: 11px; }
  .realtime-chat-highlights { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; margin: 0; padding: 1px; list-style: none; background: var(--line); }
  .realtime-chat-highlights li { display: grid; gap: 5px; min-width: 0; padding: 13px 15px; background: var(--surface); }
  .realtime-chat-highlights strong { font-size: 12px; font-weight: 680; }
  .realtime-chat-highlights span { color: var(--muted); font-size: 10px; line-height: 1.5; }
  .realtime-chat-controls { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .realtime-chat-tabs { display: inline-flex; gap: 4px; padding: 4px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-muted); }
  .realtime-chat-tabs button { min-height: 36px; padding: 7px 14px; border: 0; border-radius: 5px; background: transparent; color: var(--muted); font-size: 12px; font-weight: 650; }
  .realtime-chat-tabs button[aria-selected='true'] { background: var(--surface); color: var(--ink); box-shadow: 0 1px 3px #1417161a; }
  .realtime-chat-incoming { display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 7px 12px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); color: var(--ink); font-size: 12px; }
  .realtime-chat-incoming:hover { background: var(--accent-soft); }
  .realtime-chat-live-label { display: inline-flex; align-items: center; gap: 7px; color: var(--muted); font-size: 11px; }
  .realtime-chat-live-label > span { width: 7px; height: 7px; border-radius: 50%; background: #3b8c62; }
  .realtime-chat-storefront { position: relative; min-height: 600px; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: #f8f8f5; color: #1f2522; }
  .realtime-store-header { display: flex; align-items: center; min-height: 70px; padding: 0 32px; border-bottom: 1px solid #e4e6e0; background: #fff; }
  .realtime-store-brand { display: flex; align-items: center; gap: 9px; font-size: 14px; letter-spacing: .08em; }
  .realtime-store-brand > span { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 50%; background: var(--ink); color: var(--surface); font-size: 13px; }
  .realtime-store-header nav { display: flex; gap: 32px; margin: 0 auto; color: #6c736e; font-size: 11px; }
  .realtime-store-header > button { display: grid; width: 34px; height: 34px; place-items: center; border: 0; background: transparent; color: inherit; }
  .realtime-store-content { padding: 44px clamp(20px, 6vw, 76px) 52px; }
  .realtime-store-intro > span { color: #78847c; font-size: 9px; letter-spacing: .2em; }
  .realtime-store-intro h3 { margin: 12px 0 10px; font-size: clamp(26px, 4vw, 42px); line-height: 1.35; letter-spacing: -.04em; }
  .realtime-store-intro p { margin: 0; color: #727a74; font-size: 12px; }
  .realtime-store-products { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-top: 36px; }
  .realtime-store-products article { display: grid; gap: 7px; min-width: 0; font-size: 11px; }
  .realtime-store-products small { color: #626a64; }
  .realtime-store-products strong { font-size: 11px; font-weight: 650; }
  .realtime-product-art { position: relative; display: grid; height: 150px; place-items: center; overflow: hidden; background: #e8ebe4; }
  .realtime-product-art::before { content: ''; position: absolute; width: 54%; height: 70%; border-radius: 48% 48% 20% 20%; background: #899589; }
  .realtime-product-art.bottle::before { width: 31%; height: 75%; border-radius: 12px 12px 16px 16px; background: #738778; }
  .realtime-product-art.bottle::after { content: ''; position: absolute; top: 13%; width: 14%; height: 10%; border-radius: 4px; background: #4e6053; }
  .realtime-product-art.cup::before { width: 45%; height: 54%; border-radius: 5px 5px 20px 20px; background: #ded6c5; }
  .realtime-product-art.cup::after { content: ''; position: absolute; width: 14%; height: 23%; margin-left: 40%; border: 5px solid #ded6c5; border-left: 0; border-radius: 0 20px 20px 0; }
  .realtime-product-art.tote::before { width: 45%; height: 50%; margin-top: 16%; border-radius: 4px; background: #aca797; }
  .realtime-product-art.tote::after { content: ''; position: absolute; width: 21%; height: 19%; margin-top: -30%; border: 4px solid #aca797; border-bottom: 0; border-radius: 16px 16px 0 0; }
  .realtime-chat-launcher { position: absolute; right: 24px; bottom: 24px; display: grid; width: 54px; height: 54px; place-items: center; border: 0; border-radius: 50%; background: var(--ink); color: var(--surface); box-shadow: 0 7px 22px #1b211d33; }
  .realtime-chat-unread { position: absolute; top: -5px; right: -5px; display: grid; min-width: 21px; height: 21px; place-items: center; padding: 0 5px; border: 2px solid #f8f8f5; border-radius: 20px; background: #d44b3f; color: #fff; font-size: 10px; font-weight: 700; }
  .realtime-chat-window { position: absolute; z-index: 2; right: 24px; bottom: 91px; display: flex; flex-direction: column; width: min(350px, calc(100% - 32px)); height: 440px; border: 1px solid #dedfd9; border-radius: 12px; background: #fff; box-shadow: 0 14px 40px #20262026; overflow: hidden; }
  .realtime-chat-window > header { display: flex; align-items: center; gap: 10px; min-height: 62px; padding: 10px 14px; border-bottom: 1px solid #eceee9; }
  .realtime-chat-agent-avatar { display: grid; width: 35px; height: 35px; place-items: center; border-radius: 50%; background: var(--ink); color: #fff; font-size: 13px; }
  .realtime-chat-window > header strong, .realtime-chat-window > header small { display: block; }
  .realtime-chat-window > header strong { font-size: 12px; }
  .realtime-chat-window > header small { margin-top: 3px; color: #818982; font-size: 10px; }
  .realtime-chat-window > header button { display: grid; width: 30px; height: 30px; place-items: center; margin-left: auto; border: 0; background: transparent; color: #707770; }
  .realtime-chat-messages { flex: 1; display: flex; flex-direction: column; gap: 13px; padding: 15px; overflow: auto; background: #fbfbf9; }
  .realtime-chat-date { align-self: center; margin: 0 0 3px; color: #8b928c; font-size: 9px; }
  .realtime-chat-messages article { max-width: 84%; }
  .realtime-chat-messages article.member { align-self: flex-start; }
  .realtime-chat-messages article.agent { align-self: flex-end; text-align: right; }
  .realtime-chat-messages article p { margin: 0; padding: 10px 12px; border: 1px solid #e8e9e5; border-radius: 2px 10px 10px; background: #fff; color: #303732; font-size: 11px; line-height: 1.7; text-align: left; }
  .realtime-chat-messages article.agent p { border-color: #e5ebe4; border-radius: 10px 2px 10px 10px; background: #edf2ec; }
  .realtime-chat-messages time { display: block; margin-top: 4px; color: #9aa09b; font-size: 9px; }
  .realtime-chat-answer-label { display: block; margin-bottom: 4px; color: #657c69; font-size: 9px; text-align: left; }
  .realtime-chat-faq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 8px 12px 10px; border-top: 1px solid #eceee9; background: #fff; }
  .realtime-chat-faq p { flex-basis: 100%; margin: 0; color: #465149; font-size: 10px; font-weight: 650; }
  .realtime-chat-faq p span { margin-left: 5px; color: #919991; font-size: 9px; font-weight: 400; }
  .realtime-chat-faq button { max-width: 100%; padding: 5px 9px; border: 1px solid #e2e6e0; border-radius: 15px; background: #fff; color: #58615a; font: inherit; font-size: 9px; text-align: left; }
  .realtime-chat-faq button:hover { border-color: #aab9ab; background: #f5f8f4; }
  .realtime-chat-composer { display: flex; align-items: center; gap: 8px; min-height: 55px; padding: 8px 12px; border-top: 1px solid #eceee9; }
  .realtime-chat-composer input { min-width: 0; flex: 1; height: 36px; padding: 0 10px; border: 1px solid #e2e5df; border-radius: 6px; background: #fff; color: #222; font: inherit; font-size: 11px; }
  .realtime-chat-composer button { display: grid; width: 34px; height: 34px; place-items: center; border: 0; border-radius: 6px; background: var(--ink); color: #fff; }
  .realtime-chat-composer button:disabled { opacity: .42; }
  .realtime-chat-pop-enter-active, .realtime-chat-pop-leave-active { transition: opacity .18s ease, transform .18s ease; }
  .realtime-chat-pop-enter-from, .realtime-chat-pop-leave-to { opacity: 0; transform: translateY(8px); }
  .admin-main.chat-main.realtime-chat-admin-shell { width: 100%; height: 680px; min-height: 0; padding: 0; overflow: hidden; }
  @media (max-width: 767px) {
    .realtime-chat-demo-heading { align-items: flex-start; flex-direction: column; gap: 10px; }
    .realtime-chat-highlights { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .realtime-chat-controls { align-items: flex-start; flex-direction: column; }
    .realtime-store-header { min-height: 58px; padding-inline: 14px; }
    .realtime-store-header nav { gap: 10px; font-size: 9px; }
    .realtime-chat-storefront { min-height: 540px; }
    .realtime-store-content { padding: 32px 16px 42px; }
    .realtime-store-products { gap: 9px; margin-top: 28px; }
    .realtime-product-art { height: 100px; }
    .realtime-store-products small, .realtime-store-products strong { font-size: 9px; }
    .realtime-chat-launcher { right: 14px; bottom: 14px; width: 48px; height: 48px; }
    .realtime-chat-window { right: 10px; bottom: 72px; width: calc(100% - 20px); height: 420px; }
    .admin-main.chat-main.realtime-chat-admin-shell { height: 680px; }
    .admin-main.chat-main.realtime-chat-admin-shell .chat-workspace { height: 100%; min-height: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .realtime-chat-pop-enter-active, .realtime-chat-pop-leave-active { transition: none; }
  }
</style>
