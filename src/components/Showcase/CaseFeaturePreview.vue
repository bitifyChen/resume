<script setup>
  import { computed, onBeforeUnmount, ref } from 'vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import RealtimeChatDemo from '@/components/Showcase/RealtimeChatDemo.vue'
  import ProductReviewDiffPreview from '@/components/Showcase/ProductReviewDiffPreview.vue'
  import RolePermissionPreview from '@/components/Showcase/RolePermissionPreview.vue'

  defineProps({ issue: { type: Object, required: true } })
  const authStep = ref('email')
  const locale = ref('tw')
  const syncing = ref(false)
  const synced = ref(false)
  let syncTimer

  const localeJson = computed(() => {
    const values = {
      tw: ['商品管理', '儲存變更', '庫存不足'],
      en: ['Products', 'Save changes', 'Low stock'],
      vi: ['Sản phẩm', 'Lưu thay đổi', 'Sắp hết hàng']
    }[locale.value]
    return `{\n  "product.title": "${values[0]}",\n  "common.save": "${values[1]}",\n  "stock.low": "${values[2]}"\n}`
  })

  function runSync() {
    window.clearTimeout(syncTimer)
    syncing.value = true
    synced.value = false
    syncTimer = window.setTimeout(() => {
      syncing.value = false
      synced.value = true
    }, 700)
  }

  onBeforeUnmount(() => window.clearTimeout(syncTimer))
</script>

<template>
  <div class="case-feature-preview">
    <RealtimeChatDemo v-if="issue.previewType === 'realtime-chat'" />
    <ProductReviewDiffPreview v-else-if="issue.previewType === 'product-review-diff'" />
    <RolePermissionPreview v-else-if="issue.previewType === 'role-permission'" />
    <template v-else>
    <div v-if="issue.previewType === 'two-factor-auth'" class="auth-preview">
      <div class="auth-preview-context">
        <span>後台登入</span>
        <h3>密碼通過後，仍要完成必要驗證</h3>
        <p>依 API 回傳的驗證條件，決定顯示 Email、Google Authenticator 或兩者。</p>
        <div class="auth-flow-list">
          <button type="button" :aria-current="authStep === 'email' ? 'step' : undefined" @click="authStep = 'email'">確認 Email</button>
          <button type="button" :aria-current="authStep === 'code' ? 'step' : undefined" @click="authStep = 'code'">輸入驗證碼</button>
          <button type="button" :aria-current="authStep === 'done' ? 'step' : undefined" @click="authStep = 'done'">完成登入</button>
        </div>
      </div>
      <div class="auth-dialog" aria-live="polite">
        <template v-if="authStep === 'email'">
          <small>安全驗證</small>
          <h3>確認收件信箱</h3>
          <label><span>Email</span><input value="ke***@example.com" disabled /></label>
          <button type="button" @click="authStep = 'code'">寄送驗證碼</button>
        </template>
        <template v-else-if="authStep === 'code'">
          <small>安全驗證</small>
          <h3>輸入 6 位數代碼</h3>
          <div class="auth-code" aria-label="虛構驗證碼"><span>4</span><span>8</span><span>2</span><span>1</span><span>6</span><span>0</span></div>
          <p>Email 與 Google 驗證可依帳號需求組合。</p>
          <button type="button" @click="authStep = 'done'">提交驗證</button>
        </template>
        <template v-else>
          <div class="auth-success"><AppIcon name="CircleCheck" :size="34" /></div>
          <h3>驗證完成</h3>
          <p>通過必要條件後才建立後台登入狀態。</p>
          <button type="button" @click="authStep = 'email'">重新查看</button>
        </template>
      </div>
    </div>

    <div v-else class="locale-preview">
      <div class="locale-sheet">
        <header><strong>Google Sheet</strong><span>翻譯維護入口</span></header>
        <table>
          <thead><tr><th>key</th><th>tw</th><th>en</th><th>vi</th></tr></thead>
          <tbody>
            <tr><td>product.title</td><td>商品管理</td><td>Products</td><td>Sản phẩm</td></tr>
            <tr><td>common.save</td><td>儲存變更</td><td>Save changes</td><td>Lưu thay đổi</td></tr>
            <tr><td>stock.low</td><td>庫存不足</td><td>Low stock</td><td>Sắp hết hàng</td></tr>
          </tbody>
        </table>
      </div>
      <div class="locale-transform">
        <button type="button" :disabled="syncing" @click="runSync">
          <AppIcon :name="synced ? 'Check' : 'Download'" :size="16" />
          {{ syncing ? '同步中' : synced ? '已產生 JSON' : '同步 JSON' }}
        </button>
        <span>欄位展平與語系拆檔</span>
      </div>
      <div class="locale-json">
        <header>
          <strong>src/lang/{{ locale }}.json</strong>
          <div>
            <button v-for="item in ['tw', 'en', 'vi']" :key="item" type="button" :aria-pressed="locale === item" @click="locale = item">{{ item }}</button>
          </div>
        </header>
        <pre>{{ localeJson }}</pre>
        <footer><span>商城前台</span><span>商城後台</span></footer>
      </div>
    </div>
    </template>
  </div>
</template>
