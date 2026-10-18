<template>
  <section
    id="case-showcase"
    class="case-study-section case-showcase"
    aria-labelledby="case-showcase-title"
    data-case-reveal-group
  >
    <header class="case-section-heading" data-case-reveal-item>
      <p class="case-section-label">Showcase</p>
      <h2 id="case-showcase-title">展示</h2>
    </header>
    <div class="case-showcase-content" data-case-reveal-item>
      <slot />
    </div>
  </section>
</template>
