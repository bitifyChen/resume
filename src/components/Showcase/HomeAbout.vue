<script setup>
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
  import { animate, stagger } from 'motion'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import { scrollToElement } from '@/utils/dom'

  const aboutRoot = ref(null)
  const animations = []

  function prepareReveal(targets, distance = 22) {
    targets.forEach((target) => {
      target.style.opacity = '0'
      target.style.transform = `translateY(${distance}px)`
    })
  }

  function reveal(targets, options = {}) {
    const animation = animate(
      targets,
      {
        opacity: [0, 1],
        transform: ['translateY(22px)', 'translateY(0)']
      },
      {
        delay: stagger(options.stagger ?? 0.08, { start: options.delay ?? 0 }),
        duration: options.duration ?? 0.68,
        ease: [0.22, 1, 0.36, 1]
      }
    )
    animations.push(animation)
  }

  function goTo(id) {
    scrollToElement(id)
  }

  onMounted(async () => {
    await nextTick()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const introTargets = [...aboutRoot.value.querySelectorAll('[data-about-intro]')]
    const pathTargets = [...aboutRoot.value.querySelectorAll('[data-about-path]')]

    prepareReveal([...introTargets, ...pathTargets])
    reveal(introTargets, { stagger: 0.1 })
    reveal(pathTargets, { delay: 0.42, stagger: 0.08 })
  })

  onBeforeUnmount(() => {
    animations.forEach((animation) => animation.stop())
  })
</script>

<template>
  <section
    id="about-me"
    ref="aboutRoot"
    class="portfolio-about"
    aria-labelledby="about-intro-title"
  >
    <div class="portfolio-about-intro">
      <div class="portfolio-about-stage">
        <div class="about-intro-copy">
          <p class="about-kicker" data-about-intro>Chenchen / Frontend Engineer</p>
          <h1 id="about-intro-title" data-about-intro>About Me</h1>
          <p class="about-intro-summary" data-about-intro>
            我出生於台南，個性真誠、踏實，也樂於學習新的事物。從國小到國中進入美術資優班，參與並共同籌辦多次公開畫展，讓我很早便習慣觀察細節、整理想法，再透過反覆練習把作品完成。
          </p>
        </div>

        <div class="about-profile-copy">
          <p data-about-intro>
            這段經歷讓我相信，成長不只來自課本，真正重要的是對未知保持好奇，並願意持續學習。成為前端工程師後，我把這份觀察力與動手實作的習慣帶進產品開發。
          </p>
          <p data-about-intro>
            工作上，我參與商城前台、商城後台與 POS
            後台，處理公開頁面、即時聊天、訂單流程、資料表單、權限與營運介面；工作之外，也持續製作
            PWA、資料自動化、地圖與桌面應用。面對每個需求，我會先理解使用情境，再建立清楚、可維護且能持續擴充的前端結構。
          </p>
          <dl class="about-profile-facts" data-about-intro>
            <div>
              <dt>Focus</dt>
              <dd>Vue 前端、營運後台、產品互動</dd>
            </div>
            <div>
              <dt>Practice</dt>
              <dd>觀察、拆解、實作、迭代</dd>
            </div>
            <div>
              <dt>Explore</dt>
              <dd>PWA、資料自動化、GIS、桌面應用</dd>
            </div>
          </dl>
        </div>
      </div>

      <nav class="about-paths" aria-label="作品瀏覽建議">
        <button
          type="button"
          class="about-path-entry is-case-study"
          data-about-path
          @click="goTo('case-study')"
        >
          <span class="about-path-arrow"><AppIcon name="ArrowLeft" :size="25" /></span>
          <span class="about-path-copy">
            <span class="about-path-meta">Case Study</span>
            <strong class="about-path-title">看我如何解決問題</strong>
          </span>
        </button>
        <button
          type="button"
          class="about-path-entry is-project"
          data-about-path
          @click="goTo('selected-work')"
        >
          <span class="about-path-copy">
            <span class="about-path-meta">Project</span>
            <strong class="about-path-title">看我負責的產品與系統</strong>
          </span>
          <span class="about-path-arrow"><AppIcon name="ArrowRight" :size="25" /></span>
        </button>
      </nav>
    </div>
  </section>
</template>
