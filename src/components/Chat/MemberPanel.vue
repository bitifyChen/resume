<script setup>
  import { computed, ref } from 'vue'
  import { useDemoData } from '@/hook/useDemoData'
  import { money } from '@/utils/format'
  import OrderDetail from '@/components/Shared/OrderDetail.vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const props = defineProps({
    member: { type: Object, default: null },
    orderId: { type: String, default: '' }
  })
  const { database } = useDemoData()
  const orders = computed(
    () => database.value?.orders.filter((order) => order.memberId === props.member?.id) || []
  )
  const related = computed(
    () => orders.value.find((order) => order.id === props.orderId) || orders.value[0]
  )
  const drawer = ref(false)
  const selectedOrder = ref('')
  const openOrder = (id) => {
    selectedOrder.value = id
    drawer.value = true
  }
</script>

<template>
  <div v-if="member" class="member-panel">
    <h2>會員資訊</h2>
    <div class="member-profile">
      <span class="avatar large" :style="{ background: member.color }">
        {{ member.name.slice(-2) }}
      </span>
      <h3>{{ member.name }}</h3>
      <p>{{ member.email }}</p>
      <el-tag size="small" effect="plain">{{ member.level }}</el-tag>
    </div>
    <div class="member-mini-stats">
      <div>
        <strong>{{ orders.length }}</strong>
        <span>訂單數</span>
      </div>
      <div>
        <strong>
          {{
            money(
              orders.reduce((sum, order) => sum + (order.status === '已取消' ? 0 : order.total), 0)
            )
          }}
        </strong>
        <span>累積訂單金額</span>
      </div>
    </div>
    <section class="member-section">
      <h3>關聯訂單</h3>
      <button v-if="related" class="related-order" @click="openOrder(related.id)">
        <span>
          <strong>{{ related.id }}</strong>
          <small>{{ related.items[0]?.name }}</small>
        </span>
        <AppIcon name="ArrowRight" :size="16" />
        <span class="related-bottom">
          <span>{{ related.status }}</span>
          <strong>{{ money(related.total) }}</strong>
        </span>
      </button>
      <p v-else class="muted">尚無訂單</p>
    </section>
    <section class="member-section">
      <h3>服務備註</h3>
      <p class="member-note">{{ member.note }}</p>
    </section>
    <section class="member-section">
      <h3>最近訂單</h3>
      <button
        v-for="order in orders.slice(0, 3)"
        :key="order.id"
        class="recent-order"
        @click="openOrder(order.id)"
      >
        <span>{{ order.id }}</span>
        <AppIcon name="ArrowRight" :size="14" />
      </button>
    </section>
    <p class="helper-text">會員與訂單皆為虛構展示資料。</p>
    <OrderDetail v-model="drawer" :order-id="selectedOrder" />
  </div>
</template>
