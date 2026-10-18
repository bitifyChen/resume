<script setup>
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { animate } from 'motion'
  import { asset } from '@/utils/format'
  import AppIcon from '@/components/Shared/AppIcon.vue'

  const props = defineProps({ issue: { type: Object, required: true } })
  const imageIndex = ref(0)
  const playing = ref(false)
  const reducedMotion = ref(false)
  const imageElement = ref(null)
  const images = computed(() => props.issue.images ?? [])
  const currentImage = computed(() => images.value[imageIndex.value] ?? images.value[0])
  const hasCarousel = computed(() => images.value.length > 1)
  let timer
  let motionQuery
  let imageAnimation

  function stopTimer() {
    window.clearInterval(timer)
    timer = undefined
  }

  function startTimer() {
    stopTimer()
    if (!playing.value || reducedMotion.value || !hasCarousel.value) return
    timer = window.setInterval(() => {
      imageIndex.value = (imageIndex.value + 1) % images.value.length
    }, 5200)
  }

  function setImage(index) {
    imageIndex.value = (index + images.value.length) % images.value.length
    startTimer()
  }

  function togglePlayback() {
    playing.value = !playing.value
    startTimer()
  }

  function pauseForAttention() {
    stopTimer()
  }

  function resumeAfterAttention(event) {
    if (event?.currentTarget?.contains(event.relatedTarget)) return
    startTimer()
  }

  function syncMotionPreference(event) {
    reducedMotion.value = event.matches
    if (event.matches) {
      playing.value = false
      stopTimer()
      imageAnimation?.stop()
    }
  }

  onMounted(() => {
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.value = motionQuery.matches
    playing.value = !motionQuery.matches
    motionQuery.addEventListener('change', syncMotionPreference)
    startTimer()
  })

  onBeforeUnmount(() => {
    stopTimer()
    imageAnimation?.stop()
    motionQuery?.removeEventListener('change', syncMotionPreference)
  })

  watch(imageIndex, async () => {
    imageAnimation?.stop()
    if (reducedMotion.value) return
    await new Promise((resolve) => requestAnimationFrame(resolve))
    if (!imageElement.value) return
    imageAnimation = animate(
      imageElement.value,
      { opacity: [0.55, 1], transform: ['scale(0.99)', 'scale(1)'] },
      { duration: 0.36, ease: [0.22, 1, 0.36, 1] }
    )
  })
</script>

<template>
  <div class="case-walkthrough">
    <div v-if="hasCarousel" class="walkthrough-actions">
      <button
        class="walkthrough-toggle"
        type="button"
        :disabled="reducedMotion"
        :aria-pressed="playing"
        :aria-label="reducedMotion ? '系統已減少動態' : playing ? '暫停圖片輪播' : '播放圖片輪播'"
        :title="reducedMotion ? '系統已減少動態' : playing ? '暫停圖片輪播' : '播放圖片輪播'"
        @click="togglePlayback"
      >
        <AppIcon :name="playing ? 'VideoPause' : 'VideoPlay'" :size="18" />
      </button>
    </div>

    <div
      class="walkthrough-content"
      @mouseenter="pauseForAttention"
      @mouseleave="resumeAfterAttention"
      @focusin="pauseForAttention"
      @focusout="resumeAfterAttention"
    >
      <figure class="walkthrough-screen" :class="{ 'is-portrait': currentImage.label === '手機' }">
        <div class="walkthrough-stage">
          <img
            ref="imageElement"
            class="walkthrough-image"
            :src="asset(currentImage.src)"
            :alt="currentImage.alt"
          />
        </div>
        <figcaption v-if="hasCarousel">
          <div class="walkthrough-controls" role="group" aria-label="圖片輪播">
            <button
              class="walkthrough-arrow"
              type="button"
              aria-label="上一張圖片"
              @click="setImage(imageIndex - 1)"
            >
              <AppIcon name="ArrowLeft" :size="16" />
            </button>
            <div class="walkthrough-indicators">
              <button
                v-for="(image, index) in images"
                :key="image.src"
                type="button"
                :aria-label="`查看第 ${index + 1} 張圖片`"
                :aria-current="imageIndex === index ? 'true' : undefined"
                @click="setImage(index)"
              />
            </div>
            <button
              class="walkthrough-arrow"
              type="button"
              aria-label="下一張圖片"
              @click="setImage(imageIndex + 1)"
            >
              <AppIcon name="ArrowRight" :size="16" />
            </button>
          </div>
        </figcaption>
      </figure>
    </div>
  </div>
</template>
