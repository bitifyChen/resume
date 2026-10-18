<script setup>
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import Typed from 'typed.js'
  import AppIcon from '@/components/Shared/AppIcon.vue'

  const route = useRoute()
  const activeHomeSection = ref('About Me')
  const typewriterHost = ref(null)
  let sectionObserver
  let pageContentObserver
  let typed

  const sectionLabel = computed(() => {
    if (route.name === 'Home') return activeHomeSection.value
    if (route.name === 'CaseStudy') return 'Case Study'
    if (route.name === 'Project') return 'Project'
    if (route.name === 'SideProject') return 'Side Project'
    if (route.name === 'NotFound') return '404'
    return ''
  })

  const wordmarkLabel = computed(() =>
    sectionLabel.value ? `Chenchen / ${sectionLabel.value}` : 'Chenchen 展示首頁'
  )

  function renderSectionLabel() {
    const host = typewriterHost.value
    typed?.destroy()
    if (!host) return

    host.replaceChildren()
    if (!sectionLabel.value) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      host.textContent = sectionLabel.value
      return
    }

    typed = new Typed(host, {
      strings: [sectionLabel.value],
      typeSpeed: 45,
      showCursor: false,
      autoInsertCss: false,
      contentType: 'null'
    })
  }

  const homeSectionIds = [
    ['about-me', 'About Me'],
    ['case-study', 'Case Study'],
    ['selected-work', 'Project'],
    ['side-project', 'Side Project'],
    ['more-side-project', 'More Side Project']
  ]

  function getHomeSections() {
    return homeSectionIds
      .map(([id, label]) => ({ element: document.getElementById(id), label }))
      .filter(({ element }) => element)
  }

  function syncActiveHomeSection(sections) {
    const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0
    const readingLine = Math.max(headerBottom + 1, window.innerHeight * 0.35)
    const atPageBottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - Math.max(4, window.innerHeight * 0.01)
    const activeSection = atPageBottom
      ? sections.at(-1)
      : sections.filter(({ element }) => element.getBoundingClientRect().top <= readingLine).at(-1)

    activeHomeSection.value = activeSection?.label || sections[0]?.label || 'About Me'
  }

  function attachHomeSectionObserver() {
    if (route.name !== 'Home') return false

    const sections = getHomeSections()
    if (!sections.length) return false

    pageContentObserver?.disconnect()
    pageContentObserver = null
    syncActiveHomeSection(sections)

    const headerHeight = Math.ceil(document.querySelector('.site-header')?.getBoundingClientRect().height || 0)
    const readingLine = Math.max(headerHeight + 1, Math.round(window.innerHeight * 0.35))
    const bottomInset = Math.max(0, Math.round(window.innerHeight - readingLine))

    sectionObserver = new IntersectionObserver(
      () => syncActiveHomeSection(sections),
      { rootMargin: `-${headerHeight}px 0px -${bottomInset}px 0px`, threshold: 0 }
    )

    sections.forEach(({ element }) => sectionObserver.observe(element))
    return true
  }

  function startHomeSectionTracking() {
    stopHomeSectionTracking()
    if (route.name !== 'Home') return

    if (attachHomeSectionObserver()) return

    pageContentObserver = new MutationObserver(() => {
      if (attachHomeSectionObserver()) pageContentObserver?.disconnect()
    })
    pageContentObserver.observe(document.getElementById('app') || document.body, {
      childList: true,
      subtree: true
    })
  }

  function stopHomeSectionTracking() {
    sectionObserver?.disconnect()
    sectionObserver = null
    pageContentObserver?.disconnect()
    pageContentObserver = null
  }

  function handleViewportResize() {
    if (route.name === 'Home') startHomeSectionTracking()
  }

  watch(sectionLabel, renderSectionLabel, { flush: 'post' })

  watch(
    () => [route.path, route.name],
    async () => {
      stopHomeSectionTracking()
      if (route.name !== 'Home') return

      activeHomeSection.value = 'About Me'
      await nextTick()
      startHomeSectionTracking()
    },
    { flush: 'post' }
  )

  onMounted(() => {
    renderSectionLabel()
    startHomeSectionTracking()
    window.addEventListener('resize', handleViewportResize, { passive: true })
  })

  onBeforeUnmount(() => {
    stopHomeSectionTracking()
    window.removeEventListener('resize', handleViewportResize)
    typed?.destroy()
  })
</script>

<template>
  <header class="site-header page-container">
    <RouterLink to="/" class="wordmark" :aria-label="wordmarkLabel">
      Chenchen 2023→Now
      <span class="wordmark-divider" aria-hidden="true">/</span>
      <span ref="typewriterHost" class="wordmark-section" aria-hidden="true"></span>
    </RouterLink>
    <nav aria-label="主要導覽">
      <RouterLink to="/" class="site-nav-home">作品總覽</RouterLink>
      <a href="https://chenchenworkshop.com/project" target="_blank" rel="noopener noreferrer">
        過往作品
        <AppIcon name="ArrowRight" :size="14" />
      </a>
    </nav>
  </header>
</template>
