<script setup>
  import { computed, ref, watch } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/css'
  import { asset } from '@/utils/format'

  const props = defineProps({
    images: { type: Array, default: () => [] },
    title: { type: String, default: 'Side Project' }
  })

  const activeIndex = ref(0)
  const mainSwiper = ref(null)
  const thumbnailSwiper = ref(null)
  const hasImages = computed(() => props.images.length > 0)

  const setMainSwiper = (swiper) => {
    mainSwiper.value = swiper
  }

  const setThumbnailSwiper = (swiper) => {
    thumbnailSwiper.value = swiper
  }

  const syncActiveSlide = (swiper) => {
    activeIndex.value = swiper.realIndex
    thumbnailSwiper.value?.slideTo(swiper.realIndex)
  }

  const showImage = (index) => {
    mainSwiper.value?.slideTo(index)
  }

  watch(
    () => props.images.length,
    (length) => {
      if (!length || activeIndex.value >= length) activeIndex.value = 0
      mainSwiper.value?.slideTo(activeIndex.value, 0)
      thumbnailSwiper.value?.update()
    }
  )
</script>

<template>
  <section
    class="side-project-gallery"
    role="region"
    aria-roledescription="carousel"
    :aria-label="`${title} 專案畫面`"
  >
    <div class="side-project-gallery-stage">
      <Swiper
        v-if="hasImages"
        class="side-project-gallery-main"
        :slides-per-view="1"
        :speed="280"
        :watch-overflow="true"
        @swiper="setMainSwiper"
        @slide-change="syncActiveSlide"
      >
        <SwiperSlide v-for="image in images" :key="image.src">
          <img :src="asset(image.src)" :alt="image.alt" width="1440" height="900" />
        </SwiperSlide>
      </Swiper>
      <div v-else class="side-project-gallery-placeholder" aria-hidden="true"></div>
    </div>

    <div v-if="hasImages" class="side-project-gallery-navigation">
      <Swiper
        class="side-project-gallery-thumbnails"
        :slides-per-view="'auto'"
        :space-between="8"
        :watch-slides-progress="true"
        :watch-overflow="true"
        @swiper="setThumbnailSwiper"
      >
        <SwiperSlide v-for="(image, index) in images" :key="image.src">
          <button
            type="button"
            :class="{ 'is-active': index === activeIndex }"
            :aria-label="`查看第 ${index + 1} 張圖片：${image.alt}`"
            :aria-current="index === activeIndex ? 'true' : undefined"
            @click="showImage(index)"
          >
            <img :src="asset(image.src)" :alt="image.alt" width="160" height="100" loading="lazy" />
          </button>
        </SwiperSlide>
      </Swiper>

      <p class="side-project-gallery-count" aria-live="polite">
        {{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(images.length).padStart(2, '0') }}
      </p>
    </div>
  </section>
</template>
