import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
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
      meta: { title: '產品案例' }
    },
    {
      path: '/demo/storefront',
      name: 'Storefront',
      component: () => import('@/pages/storefront/index.vue'),
      meta: { title: '商城展示', demo: true }
    },
    {
      path: '/demo/commerce-admin',
      component: () => import('@/layouts/admin.vue'),
      meta: { demo: true, system: 'commerce' },
      children: [
        { path: '', redirect: '/demo/commerce-admin/chat' },
        {
          path: 'chat',
          name: 'CommerceChat',
          component: () => import('@/pages/commerce-admin/chat.vue'),
          meta: { title: '客服工作台' }
        },
        {
          path: 'orders',
          name: 'CommerceOrders',
          component: () => import('@/pages/commerce-admin/orders.vue'),
          meta: { title: '訂單管理' }
        },
        {
          path: 'products',
          name: 'CommerceProducts',
          component: () => import('@/pages/commerce-admin/products.vue'),
          meta: { title: '商品管理' }
        }
      ]
    },
    {
      path: '/demo/pos-admin',
      component: () => import('@/layouts/admin.vue'),
      meta: { demo: true, system: 'pos' },
      children: [
        { path: '', redirect: '/demo/pos-admin/dashboard' },
        {
          path: 'dashboard',
          name: 'PosDashboard',
          component: () => import('@/pages/pos-admin/dashboard.vue'),
          meta: { title: '營運總覽' }
        },
        {
          path: 'inventory',
          name: 'PosInventory',
          component: () => import('@/pages/pos-admin/inventory.vue'),
          meta: { title: '商品與庫存' }
        },
        {
          path: 'permissions',
          name: 'PosPermissions',
          component: () => import('@/pages/pos-admin/permissions.vue'),
          meta: { title: '角色權限' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/not-found.vue'),
      meta: { title: '找不到頁面' }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.path !== from.path) return { top: 0 }
  }
})
router.afterEach((to) => {
  document.title = `${to.meta.title} / Chenchen`
})
export default router
