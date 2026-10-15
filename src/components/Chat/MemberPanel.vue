<script setup>
  import { computed, ref, watch } from 'vue'
  import { useDemoData } from '@/hook/useDemoData'
  import { money } from '@/utils/format'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const props = defineProps({
    member: { type: Object, default: null },
    orderId: { type: String, default: '' }
  })
  const { database } = useDemoData()
  const view = ref('summary')
  const selectedId = ref('')
  const orders = computed(
    () => database.value?.orders.filter((order) => order.memberId === props.member?.id) || []
  )
  const selected = computed(() => orders.value.find((order) => order.id === selectedId.value))
  watch(
    () => props.member?.id,
    () => {
      view.value = 'summary'
    }
  )
  function openOrder(id) {
    selectedId.value = id
    view.value = 'order'
  }
</script>

<template>
  <div v-if="member" class="member-panel">
    <header class="member-panel-heading">
      <button
        v-if="view !== 'summary'"
        class="icon-button"
        :aria-label="view === 'order' ? '返回會員訂單' : '返回會員摘要'"
        @click="view = view === 'order' ? 'orders' : 'summary'"
      >
        <AppIcon name="ArrowLeft" :size="16" />
      </button>
      <h2>
        {{
          { summary: '會員資料', detail: '會員詳情', orders: '會員訂單', order: '訂單詳情' }[view]
        }}
      </h2>
    </header>
    <template v-if="view === 'summary'">
      <div class="member-profile">
        <span class="avatar large" :style="{ background: member.color }">
          {{ member.name.slice(-2) }}
        </span>
        <h3>{{ member.name }}</h3>
        <p>會員</p>
      </div>
      <dl class="member-id-row">
        <dt>會員 ID</dt>
        <dd>DEMO-{{ member.id.toUpperCase() }}</dd>
      </dl>
      <div class="member-panel-actions">
        <el-button round type="primary" plain @click="view = 'detail'">會員詳情</el-button>
        <el-button round type="primary" @click="view = 'orders'">訂單</el-button>
      </div>
    </template>
    <template v-else-if="view === 'detail'">
      <dl class="detail-list">
        <dt>姓名</dt>
        <dd>{{ member.name }}</dd>
        <dt>電子信箱</dt>
        <dd>{{ member.email }}</dd>
        <dt>會員等級</dt>
        <dd>{{ member.level }}</dd>
        <dt>訂單數</dt>
        <dd>{{ orders.length }}</dd>
      </dl>
      <h3 class="member-section-title">服務備註</h3>
      <p class="member-note">{{ member.note }}</p>
    </template>
    <template v-else-if="view === 'orders'">
      <button
        v-for="order in orders"
        :key="order.id"
        class="related-order"
        :class="{ 'is-related': order.id === orderId }"
        @click="openOrder(order.id)"
      >
        <span>
          <strong>{{ order.id }}</strong>
          <small>{{ order.items[0]?.name }}</small>
        </span>
        <AppIcon name="ArrowRight" :size="16" />
        <span class="related-bottom">
          <span>{{ order.status }}</span>
          <strong>{{ money(order.total) }}</strong>
        </span>
      </button>
      <el-empty v-if="!orders.length" description="尚無訂單" :image-size="60" />
    </template>
    <template v-else-if="selected">
      <dl class="detail-list">
        <dt>訂單編號</dt>
        <dd>{{ selected.id }}</dd>
        <dt>狀態</dt>
        <dd>{{ selected.status }}</dd>
        <dt>收件人</dt>
        <dd>{{ selected.recipient }}</dd>
      </dl>
      <div v-for="(item, index) in selected.items" :key="index" class="order-line">
        <span>{{ item.name }} × {{ item.quantity }}</span>
        <strong>{{ money(item.price * item.quantity) }}</strong>
      </div>
      <div class="cart-total">
        <span>合計</span>
        <strong>{{ money(selected.total) }}</strong>
      </div>
    </template>
    <p class="helper-text">虛構會員與訂單，僅供展示。</p>
  </div>
</template>
