<script setup>
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
  import { animate, inView, stagger } from 'motion'
  import CaseStudyDemo from '@/components/Showcase/CaseStudyDemo.vue'
  import FeatureCaseTemplate from '@/components/Showcase/FeatureCaseTemplate.vue'
  import ProblemCaseTemplate from '@/components/Showcase/ProblemCaseTemplate.vue'

  defineProps({
    issue: { type: Object, required: true },
    showHeading: { type: Boolean, default: true }
  })

  const studyRoot = ref(null)
  const observerStops = []
  const revealAnimations = []

  function prepareTargets(targets) {
    targets.forEach((target) => {
      target.style.opacity = '0'
      target.style.transform = 'translateY(18px)'
    })
  }

  function observeReveal(container, targets) {
    prepareTargets(targets)
    const stop = inView(
      container,
      () => {
        const animation = animate(
          targets,
          {
            opacity: [0, 1],
            transform: ['translateY(18px)', 'translateY(0)']
          },
          {
            delay: stagger(0.08),
            duration: 0.56,
            ease: [0.22, 1, 0.36, 1]
          }
        )
        revealAnimations.push(animation)
      },
      { amount: 0.14, margin: '0px 0px -8% 0px' }
    )
    observerStops.push(stop)
  }

  onMounted(async () => {
    await nextTick()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    studyRoot.value?.querySelectorAll('[data-case-reveal-group]').forEach((group) => {
      const targets = [...group.querySelectorAll('[data-case-reveal-item]')]
      if (targets.length) observeReveal(group, targets)
    })

    studyRoot.value?.querySelectorAll('[data-case-reveal]').forEach((target) => {
      observeReveal(target, [target])
    })
  })

  onBeforeUnmount(() => {
    observerStops.forEach((stop) => stop())
    revealAnimations.forEach((animation) => animation.stop())
  })
</script>

<template>
  <article
    ref="studyRoot"
    class="issue-study"
    :aria-labelledby="showHeading ? `issue-${issue.id}` : undefined"
  >
    <header v-if="showHeading" class="issue-heading" data-case-reveal>
      <h2 :id="`issue-${issue.id}`">{{ issue.title }}</h2>
      <p v-if="issue.subtitle" class="issue-heading-subtitle">{{ issue.subtitle }}</p>
      <p class="issue-heading-description">{{ issue.description }}</p>
    </header>

    <ProblemCaseTemplate v-if="issue.type !== 'feature'" :issue="issue">
      <template #showcase><CaseStudyDemo :issue="issue" /></template>
    </ProblemCaseTemplate>
    <FeatureCaseTemplate v-else :issue="issue">
      <template #showcase><CaseStudyDemo :issue="issue" /></template>
    </FeatureCaseTemplate>
  </article>
</template>
