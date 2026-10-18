<script setup>
  defineProps({ issue: { type: Object, required: true } })
</script>

<template>
  <section
    v-if="issue.story"
    id="case-summary"
    class="case-study-section case-story-section"
    aria-labelledby="case-summary-title"
    data-case-reveal-group
  >
    <header class="case-section-heading" data-case-reveal-item>
      <p class="case-section-label">Case Breakdown</p>
      <h2 id="case-summary-title">我解決了什麼項目</h2>
    </header>
    <dl class="case-story-list">
      <div data-case-reveal-item>
        <dt>問題</dt>
        <dd>{{ issue.story.problem }}</dd>
      </div>
      <div data-case-reveal-item>
        <dt>關鍵技術</dt>
        <dd>{{ issue.story.technology }}</dd>
      </div>
      <div data-case-reveal-item>
        <dt>結果</dt>
        <dd>{{ issue.story.result }}</dd>
      </div>
    </dl>
  </section>
</template>
