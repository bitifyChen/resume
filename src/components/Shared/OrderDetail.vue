<script setup>
  import { computed } from 'vue'
  import { useDemoData } from '@/hook/useDemoData'
  import { money, date } from '@/utils/format'
  const props = defineProps({ modelValue: Boolean, orderId: { type: String, default: '' } })
  const emit = defineEmits(['update:modelValue'])
  const { database, execute, saving } = useDemoData()
  const order = computed(() => database.value?.orders.find((item) => item.id === props.orderId))
  const member = computed(() =>
    database.value?.members.find((item) => item.id === order.value?.memberId)
  )
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    title="訂單詳情"
    size="min(480px, 100vw)"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="order">
      <div class="drawer-heading">
        <span class="muted">{{ order.id }}</span>
        <el-tag>{{ order.status }}</el-tag>
      </div>
      <h2 class="drawer-title">{{ money(order.total) }}</h2>
      <p class="muted">{{ date(order.createdAt) }} / {{ order.source }}</p>
      <el-divider />
      <dl class="detail-list">
        <dt>會員</dt>
        <dd>{{ member?.name }}</dd>
        <dt>收件人</dt>
        <dd>{{ order.recipient }}</dd>
        <dt>收件地址</dt>
        <dd>{{ order.address }}</dd>
        <dt>付款方式</dt>
        <dd>{{ order.payment }}</dd>
      </dl>
      <el-divider />
      <div v-for="(item, index) in order.items" :key="index" class="order-line">
        <div>
          <strong>{{ item.name }}</strong>
          <p class="muted">{{ money(item.price) }} × {{ item.quantity }}</p>
        </div>
        <strong>{{ money(item.price * item.quantity) }}</strong>
      </div>
      <el-button
        v-if="order.status === '待出貨'"
        type="primary"
        class="full-width"
        :loading="saving"
        @click="execute('order.ship', { id: order.id }, '已標記為配送中')"
      >
        標記為已出貨
      </el-button>
      <p class="helper-text">展示操作，不會觸發物流或通知。</p>
    </template>
    <el-empty v-else description="找不到這筆訂單" />
  </el-drawer>
</template>
