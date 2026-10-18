<script setup>
  import { computed } from 'vue'
  import { asset } from '@/utils/format'
  import { sortTechnologies } from '@/utils/technologyOrder'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import ContentStatusBadge from '@/components/Showcase/ContentStatusBadge.vue'
  const props = defineProps({
    project: { type: Object, required: true },
    collection: { type: String, default: 'project' }
  })
  const projectPath = computed(() =>
    props.collection === 'side-project'
      ? `/side-projects/${props.project.slug}`
      : `/projects/${props.project.slug}`
  )
  const isSideProject = computed(() => props.collection === 'side-project')
  const previewImage = computed(() => props.project.image || props.project.gallery?.[0]?.src)
  const previewAlt = computed(
    () => props.project.imageAlt || props.project.gallery?.[0]?.alt || props.project.title
  )
  const featuredHighlights = computed(() =>
    (props.project.highlights || []).filter((item) => item.featured).slice(0, 2)
  )
</script>

<template>
  <article class="project-entry">
    <RouterLink
      :to="projectPath"
      class="project-entry-preview"
      :class="{ 'project-entry-preview--cover-top': project.imageFit === 'cover-top' }"
      :aria-label="`前往${project.title}專案`"
    >
      <img
        v-if="previewImage"
        :src="asset(previewImage)"
        :alt="previewAlt"
        width="1440"
        height="900"
        loading="lazy"
      />
      <span v-else-if="isSideProject" class="project-entry-placeholder" aria-hidden="true"></span>
    </RouterLink>
    <div class="project-entry-content">
      <div v-if="isSideProject" class="project-entry-status">
        <ContentStatusBadge v-if="project.contentStatus === 0" :status="project.contentStatus" />
        <span v-if="project.featured" class="project-entry-featured" role="img" aria-label="精選 Side Project">
          <AppIcon name="StarFilled" :size="16" />
        </span>
      </div>
      <h3>
        <RouterLink :to="projectPath">
          {{ project.title }}
          <AppIcon name="ArrowRight" :size="21" />
        </RouterLink>
      </h3>
      <p class="project-entry-summary">{{ project.summary }}</p>
      <ul v-if="isSideProject && featuredHighlights.length" class="project-entry-highlights">
        <li v-for="item in featuredHighlights" :key="item.id">{{ item.title }}</li>
      </ul>
      <ul v-if="isSideProject && project.technologies?.length" class="project-entry-technologies">
        <li v-for="technology in sortTechnologies(project.technologies).slice(0, 5)" :key="technology">
          {{ technology }}
        </li>
      </ul>
    </div>
  </article>
</template>
