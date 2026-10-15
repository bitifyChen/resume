<script setup>
  import { computed, ref } from 'vue'
  import { asset } from '@/utils/format'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const props = defineProps({ issue: { type: Object, required: true } })
  const imageIndex = ref(0)
  const imageOpen = ref(false)
  const currentImage = computed(() => props.issue.images[imageIndex.value])
</script>

<template>
  <article class="issue-study" :aria-labelledby="`issue-${issue.id}`">
    <header class="issue-heading">
      <h2 :id="`issue-${issue.id}`">{{ issue.title }}</h2>
      <p>{{ issue.description }}</p>
    </header>
    <div class="issue-comparison" aria-label="Before 與 After 操作對照">
      <section class="comparison-before">
        <p class="comparison-label">
          Before
          <span>問題情境</span>
        </p>
        <h3>{{ issue.before.title }}</h3>
        <p>{{ issue.before.description }}</p>
        <ol>
          <li v-for="step in issue.before.steps" :key="step">{{ step }}</li>
        </ol>
      </section>
      <section class="comparison-after">
        <p class="comparison-label">
          After
          <span>目前方案</span>
        </p>
        <h3>{{ issue.after.title }}</h3>
        <p>{{ issue.after.description }}</p>
        <ol>
          <li v-for="step in issue.after.steps" :key="step">{{ step }}</li>
        </ol>
      </section>
    </div>
    <figure class="issue-evidence">
      <div class="evidence-toolbar">
        <span>重製版實際畫面</span>
        <div
          v-if="issue.images.length > 1"
          class="evidence-views"
          role="group"
          aria-label="切換展示畫面"
        >
          <button
            v-for="(shot, index) in issue.images"
            :key="shot.src"
            :aria-pressed="imageIndex === index"
            @click="imageIndex = index"
          >
            {{ shot.label }}
          </button>
        </div>
        <button class="evidence-expand" @click="imageOpen = true">
          <AppIcon name="View" :size="16" />
          放大畫面
        </button>
      </div>
      <button
        class="evidence-image"
        :class="{ 'is-portrait': currentImage.label === '手機' }"
        :aria-label="`放大：${currentImage.alt}`"
        @click="imageOpen = true"
      >
        <img :src="asset(currentImage.src)" :alt="currentImage.alt" width="1440" height="900" />
      </button>
      <figcaption>{{ currentImage.caption }}</figcaption>
    </figure>
    <div class="issue-try">
      <p>{{ issue.try }}</p>
      <RouterLink :to="issue.demo" class="button primary">
        操作 Demo
        <AppIcon name="ArrowRight" :size="17" />
      </RouterLink>
    </div>
    <details class="issue-details">
      <summary>實作細節</summary>
      <dl>
        <template v-for="detail in issue.details" :key="detail.label">
          <dt>{{ detail.label }}</dt>
          <dd>{{ detail.text }}</dd>
        </template>
      </dl>
    </details>
    <el-dialog
      v-model="imageOpen"
      :title="currentImage.label"
      width="min(1440px, 96vw)"
      align-center
      class="evidence-dialog"
    >
      <img :src="asset(currentImage.src)" :alt="currentImage.alt" />
    </el-dialog>
  </article>
</template>
