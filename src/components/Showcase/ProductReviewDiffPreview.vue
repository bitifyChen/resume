<script setup>
  import { computed, ref } from 'vue'

  const view = ref('diff')
  const reviewState = ref('pending')
  const rejectReason = ref('')

  const statusText = computed(() => {
    if (reviewState.value === 'approved') return '已通過'
    if (reviewState.value === 'rejected') return '已退回'
    return '重新送審'
  })

  function approve() {
    reviewState.value = 'approved'
  }

  function reject() {
    if (!rejectReason.value.trim()) return
    reviewState.value = 'rejected'
  }

  function resetReview() {
    reviewState.value = 'pending'
    rejectReason.value = ''
  }
</script>

<template>
  <div class="product-review-preview">
    <header class="review-preview-header">
      <div>
        <small>商品審核／PRD-2026-018</small>
        <div class="review-preview-title">
          <h3>輕量隨行保溫杯</h3>
          <span :class="`is-${reviewState}`">{{ statusText }}</span>
        </div>
      </div>
      <div class="review-preview-tabs" role="tablist" aria-label="商品審核展示">
        <button type="button" :aria-selected="view === 'diff'" @click="view = 'diff'">差異比較</button>
        <button type="button" :aria-selected="view === 'review'" @click="view = 'review'">審核操作</button>
      </div>
    </header>

    <section v-if="view === 'diff'" class="review-diff-panel">
      <div class="review-diff-heading">
        <div>
          <small>VERSION COMPARISON</small>
          <h4>本次與前次上架版本差異</h4>
        </div>
        <div class="review-diff-legend" aria-label="差異顏色說明">
          <span class="is-old">－ 原資料</span>
          <span class="is-new">＋ 新資料</span>
        </div>
      </div>

      <div class="review-field">
        <strong>商品名稱</strong>
        <div class="review-change-stack">
          <span class="is-old">－ 隨行保溫杯</span>
          <span class="is-new">＋ 輕量隨行保溫杯</span>
        </div>
      </div>

      <div class="review-field">
        <strong>商品規格</strong>
        <div class="review-spec-table" role="table" aria-label="商品規格版本差異">
          <div class="review-spec-row is-head" role="row">
            <span>規格</span><span>售價</span><span>重量</span><span>狀態</span>
          </div>
          <div class="review-spec-row" role="row">
            <span>晨霧灰 500 ml</span><span>NT$ 680</span><span>310 g</span><span>未異動</span>
          </div>
          <div class="review-spec-row is-removed" role="row">
            <span>－ 暖沙色 350 ml</span><span>－ NT$ 560</span><span>－ 270 g</span><span>已移除</span>
          </div>
          <div class="review-spec-row is-added" role="row">
            <span>＋ 暖沙色 500 ml</span><span>＋ NT$ 720</span><span>＋ 305 g</span><span>新規格</span>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="review-action-panel" aria-live="polite">
      <template v-if="reviewState === 'pending'">
        <article class="review-decision is-approve">
          <div>
            <small>APPROVE</small>
            <h4>通過商品審核</h4>
            <p>確認本次異動內容後，將商品資料更新為最新版本。</p>
          </div>
          <button type="button" @click="approve">通過審核</button>
        </article>
        <article class="review-decision is-reject">
          <div>
            <small>RETURN FOR REVISION</small>
            <h4>退回修改</h4>
            <p>填寫原因後退回申請，讓提交者依說明調整內容。</p>
          </div>
          <label>
            <span>退回原因</span>
            <textarea v-model="rejectReason" rows="3" placeholder="例如：請補充新規格的材質說明"></textarea>
          </label>
          <button type="button" :disabled="!rejectReason.trim()" @click="reject">確認退回</button>
        </article>
      </template>
      <div v-else class="review-result">
        <small>REVIEW UPDATED</small>
        <h4>{{ reviewState === 'approved' ? '商品審核已通過' : '商品已退回修改' }}</h4>
        <p>{{ reviewState === 'approved' ? '審核狀態已更新，可回到差異頁再次檢視內容。' : `退回原因：${rejectReason}` }}</p>
        <button type="button" @click="resetReview">重設展示</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .product-review-preview {
    min-height: 560px;
    border: 1px solid #dcdfe6;
    background: #fff;
    color: #303133;
    font-family: 'Noto Sans TC', sans-serif;
  }

  .review-preview-header,
  .review-diff-heading,
  .review-preview-title,
  .review-diff-legend,
  .review-decision {
    display: flex;
    align-items: center;
  }

  .review-preview-header {
    justify-content: space-between;
    gap: 24px;
    padding: 18px 22px;
    border-bottom: 1px solid #dcdfe6;
  }

  small {
    color: #909399;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .review-preview-title {
    gap: 10px;
    margin-top: 4px;
  }

  h3,
  h4,
  p {
    margin: 0;
  }

  h3 {
    font-size: 19px;
  }

  h4 {
    font-size: 16px;
  }

  .review-preview-title span {
    padding: 3px 9px;
    border: 1px solid #e6a23c;
    border-radius: 999px;
    color: #b87300;
    font-size: 11px;
    font-weight: 700;
  }

  .review-preview-title span.is-approved {
    border-color: #67c23a;
    color: #4c9b2b;
  }

  .review-preview-title span.is-rejected {
    border-color: #f56c6c;
    color: #c45656;
  }

  .review-preview-tabs {
    display: flex;
    border-bottom: 1px solid #dcdfe6;
  }

  .review-preview-tabs button {
    padding: 9px 13px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: #606266;
    font-size: 12px;
  }

  .review-preview-tabs button[aria-selected='true'] {
    border-bottom-color: #303133;
    color: #303133;
    font-weight: 700;
  }

  .review-diff-panel,
  .review-action-panel {
    padding: 22px;
  }

  .review-diff-heading {
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .review-diff-legend {
    gap: 6px;
  }

  .review-diff-legend span {
    padding: 5px 8px;
    font-size: 11px;
    font-weight: 700;
  }

  .is-old,
  .review-spec-row.is-removed {
    background: #f9e8e8;
    color: #8a1a27;
  }

  .is-new,
  .review-spec-row.is-added {
    background: #dafee4;
    color: #0a6d20;
  }

  .review-field {
    margin-top: 18px;
  }

  .review-field > strong {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
  }

  .review-change-stack {
    border: 1px solid #dcdfe6;
  }

  .review-change-stack span {
    display: block;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 700;
  }

  .review-spec-table {
    overflow: hidden;
    border: 1px solid #dcdfe6;
  }

  .review-spec-row {
    display: grid;
    grid-template-columns: 1.5fr repeat(3, minmax(80px, 1fr));
    border-bottom: 1px solid #ebeef5;
    color: #606266;
  }

  .review-spec-row:last-child {
    border-bottom: 0;
  }

  .review-spec-row span {
    padding: 10px 12px;
    border-right: 1px solid #ebeef5;
    font-size: 12px;
  }

  .review-spec-row span:last-child {
    border-right: 0;
  }

  .review-spec-row.is-head {
    background: #f5f7fa;
    color: #606266;
    font-weight: 700;
  }

  .review-decision {
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    padding: 18px;
    border-left: 5px solid;
    border-radius: 4px;
  }

  .review-decision + .review-decision {
    margin-top: 18px;
  }

  .review-decision.is-approve {
    border-color: #67c23a;
    background: #f0f9eb;
  }

  .review-decision.is-reject {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(240px, 0.7fr) auto;
    border-color: #e6a23c;
    background: #fdf6ec;
  }

  .review-decision p,
  .review-result p {
    margin-top: 6px;
    color: #606266;
    font-size: 12px;
    line-height: 1.7;
  }

  .review-decision label span {
    display: block;
    margin-bottom: 5px;
    font-size: 11px;
    font-weight: 700;
  }

  textarea {
    width: 100%;
    resize: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background: #fff;
    padding: 8px 10px;
    color: #303133;
    font: inherit;
    font-size: 12px;
  }

  .review-decision button,
  .review-result button {
    align-self: center;
    min-width: 88px;
    padding: 8px 13px;
    border: 1px solid #606266;
    border-radius: 999px;
    background: #fff;
    color: #303133;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }

  .review-decision button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .review-result {
    display: grid;
    min-height: 330px;
    place-content: center;
    justify-items: center;
    text-align: center;
  }

  .review-result button {
    margin-top: 18px;
  }

  @media (max-width: 760px) {
    .product-review-preview {
      min-height: 620px;
    }

    .review-preview-header,
    .review-diff-heading {
      align-items: flex-start;
      flex-direction: column;
    }

    .review-preview-tabs {
      width: 100%;
    }

    .review-preview-tabs button {
      flex: 1;
    }

    .review-spec-table {
      overflow-x: auto;
    }

    .review-spec-row {
      min-width: 580px;
    }

    .review-decision,
    .review-decision.is-reject {
      display: grid;
      grid-template-columns: 1fr;
    }

    .review-decision button {
      justify-self: start;
    }
  }
</style>
