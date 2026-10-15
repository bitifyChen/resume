<script setup>
  import { asset } from '@/utils/format'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  defineProps({ product: { type: Object, required: true }, large: Boolean })
</script>

<template>
  <div class="product-visual" :class="[product.tone, { large }]">
    <img
      v-if="['p1', 'p2', 'p3', 'p4', 'p5'].includes(product.id)"
      :src="asset('images/everyday.png')"
      alt="日常用品商品情境示意"
      loading="lazy"
      width="1536"
      height="1024"
      :class="`product-crop-${product.id}`"
    />
    <AppIcon v-else :name="product.icon" :size="large ? 110 : 64" />
  </div>
</template>
