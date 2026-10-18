<script setup>
  import { ref } from 'vue'
  import { money } from '@/utils/format'
  import ProductVisual from './ProductVisual.vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  defineProps({ product: { type: Object, required: true }, saving: Boolean })
  const quantity = defineModel('quantity', { type: Number, default: 1 })
  defineEmits(['add'])
  const tab = ref('商品詳情')
</script>

<template>
  <article class="mall-product-detail">
    <div class="mall-detail-gallery">
      <ProductVisual :product="product" large />
      <div class="mall-detail-thumbnails"><ProductVisual :product="product" /></div>
    </div>
    <div class="mall-detail-info">
      <h1>{{ product.name }}</h1>
      <p class="mall-detail-description">{{ product.description }}</p>
      <div class="mall-detail-price">
        <span>售價</span>
        <del>{{ money(product.originalPrice) }}</del>
        <span>優惠價</span>
        <strong>{{ money(product.price) }}</strong>
      </div>
      <dl class="detail-list">
        <dt>商品編號</dt>
        <dd>{{ product.sku }}</dd>
        <dt>商品分類</dt>
        <dd>{{ product.category }}</dd>
        <dt>規格</dt>
        <dd>
          <span class="mall-detail-option">
            {{ product.color }}
            <AppIcon name="Check" :size="12" />
          </span>
        </dd>
        <dt>數量</dt>
        <dd>
          <el-input-number
            v-model="quantity"
            :min="1"
            :max="Math.max(1, product.stock)"
            :precision="0"
            :disabled="!product.stock"
            aria-label="購買數量"
          />
          <span class="mall-detail-stock">庫存 {{ product.stock }} 件</span>
        </dd>
      </dl>
      <div class="mall-detail-purchase">
        <el-button
          type="primary"
          plain
          :disabled="!product.stock"
          :loading="saving"
          @click="$emit('add', 'cart')"
        >
          <AppIcon name="ShoppingCart" :size="19" />
          加入購物車
        </el-button>
        <el-button
          type="primary"
          :disabled="!product.stock"
          :loading="saving"
          @click="$emit('add', 'buy')"
        >
          {{ product.stock ? '立即購買' : '暫時售罄' }}
        </el-button>
      </div>
      <p class="helper-text">展示商品與價格，不提供真實付款或配送。</p>
    </div>
    <div class="mall-detail-shop">
      <AppIcon name="House" :size="30" />
      <h2>日常選物示範店</h2>
      <p>商品與商家資訊均為虛構</p>
      <span>服務時間 09:00-18:00</span>
    </div>
    <section class="mall-detail-more">
      <div class="mall-detail-tabs">
        <button
          v-for="name in ['商品詳情', '購物說明']"
          :key="name"
          :class="{ active: tab === name }"
          @click="tab = name"
        >
          {{ name }}
        </button>
      </div>
      <template v-if="tab === '商品詳情'">
        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <dl class="detail-list">
          <dt>顏色</dt>
          <dd>{{ product.color }}</dd>
          <dt>用途</dt>
          <dd>{{ product.category }} / 示範商品</dd>
        </dl>
      </template>
      <p v-else>
        本網站為履歷互動展示。可體驗商品選購與模擬結帳，不需登入，也不會扣款。請勿填入真實個人或付款資料。
      </p>
    </section>
  </article>
</template>
