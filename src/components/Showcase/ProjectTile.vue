<script setup>
  import { computed } from 'vue'
  import { asset } from '@/utils/format'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const props = defineProps({ project: { type: Object, required: true } })
  const external = computed(() => /^https?:/.test(props.project.demo))
  const targetProps = computed(() =>
    external.value
      ? { href: props.project.demo, target: '_blank', rel: 'noopener noreferrer' }
      : { to: props.project.demo }
  )
</script>

<template>
  <article class="project-entry">
    <component
      :is="external ? 'a' : 'RouterLink'"
      v-bind="targetProps"
      class="project-entry-preview"
      :aria-label="`操作${project.title}`"
    >
      <img
        v-if="project.image"
        :src="asset(project.image)"
        :alt="project.imageAlt"
        width="1440"
        height="900"
        loading="lazy"
      />
    </component>
    <div class="project-entry-content">
      <h3>
        <component :is="external ? 'a' : 'RouterLink'" v-bind="targetProps">
          {{ project.title }}
          <AppIcon name="ArrowRight" :size="21" />
        </component>
      </h3>
      <p class="project-entry-summary">{{ project.summary }}</p>
      <RouterLink v-if="project.slug" class="project-case-link" :to="`/projects/${project.slug}`">
        專案案例
      </RouterLink>
    </div>
  </article>
</template>
