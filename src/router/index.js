import { createRouter, createWebHistory } from 'vue-router'

const HOME_SCROLL_KEY = 'portfolio-home-scroll-position'
const detailRouteNames = new Set(['CaseStudy', 'Project', 'SideProject'])

function rememberHomeScroll() {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY))
}

function consumeHomeScroll() {
  if (typeof window === 'undefined') return null

  const storedPosition = window.sessionStorage.getItem(HOME_SCROLL_KEY)
  window.sessionStorage.removeItem(HOME_SCROLL_KEY)
  if (!storedPosition) return null

  const top = Number(storedPosition)
  return Number.isFinite(top) ? Math.max(0, top) : null
}

const localRoutes = import.meta.env.DEV
  ? [
      {
        path: '/admin',
        name: 'ContentAdmin',
        component: () => import('@/pages/admin/index.vue'),
        meta: { title: '案例內容編輯器', localEditor: true }
      }
    ]
  : []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/index.vue'),
      meta: { title: 'Product Engineering' }
    },
    {
      path: '/projects/:slug',
      name: 'Project',
      component: () => import('@/pages/projects/detail.vue'),
      meta: { title: 'Project 詳情' }
    },
    {
      path: '/side-projects/:slug',
      name: 'SideProject',
      component: () => import('@/pages/projects/detail.vue'),
      meta: { title: 'Side Project 詳情' }
    },
    {
      path: '/case-studies/:id',
      name: 'CaseStudy',
      component: () => import('@/pages/case-studies/detail.vue'),
      meta: { title: 'Case Study' }
    },
    ...localRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/not-found.vue'),
      meta: { title: '找不到頁面' }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      if (to.name === 'Home') consumeHomeScroll()
      return savedPosition
    }

    if (to.name === 'Home' && detailRouteNames.has(from.name)) {
      const top = consumeHomeScroll()
      if (top !== null) return { left: 0, top }
    }

    if (to.path !== from.path) return { top: 0 }
  }
})

router.beforeEach((to, from) => {
  if (from.name === 'Home' && detailRouteNames.has(to.name)) rememberHomeScroll()
})

router.afterEach((to) => {
  document.title = `${to.meta.title} / Chenchen`
})
export default router
