<script setup>
  defineProps({ issue: { type: Object, required: true } })
</script>

<template>
  <section
    id="case-implementation"
    class="case-study-section issue-details"
    aria-labelledby="implementation-title"
    data-case-reveal-group
  >
    <header class="case-section-heading" data-case-reveal-item>
      <p class="case-section-label">Implementation</p>
      <h2 id="implementation-title">實作細節</h2>
    </header>
    <dl>
      <div v-for="detail in issue.details || []" :key="detail.label" data-case-reveal-item>
        <dt>{{ detail.label }}</dt>
        <dd>{{ detail.text }}</dd>
      </div>
    </dl>
  </section>
</template>
