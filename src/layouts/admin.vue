<script setup>
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSessionStore } from '@/store/useSessionStore'
  import { useDemoData } from '@/hook/useDemoData'
  import DemoBar from '@/components/Shared/DemoBar.vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const session = useSessionStore()
  const route = useRoute()
  const router = useRouter()
  const collapsed = ref(true)
  const visited = ref([])
  const { database, allowed } = useDemoData()
  const isPos = computed(() => route.meta.system === 'pos')
  const links = computed(() =>
    isPos.value
      ? [
          { label: '營運總覽', path: 'dashboard', icon: 'Grid', module: 'reports' },
          { label: '商品與庫存', path: 'inventory', icon: 'Box', module: 'inventory' },
          { label: '角色權限', path: 'permissions', icon: 'Setting', module: 'team' }
        ].filter((item) => allowed(item.module))
      : [
          { label: '客服工作台', path: 'chat', icon: 'ChatDotRound' },
          { label: '訂單管理', path: 'orders', icon: 'ShoppingCart' },
          { label: '商品管理', path: 'products', icon: 'Goods' }
        ]
  )
  const basePath = computed(() => (isPos.value ? '/demo/pos-admin' : '/demo/commerce-admin'))
  const currentLink = computed(() => links.value.find((link) => route.path.endsWith(link.path)))
  const tabs = computed(() =>
    visited.value.filter((tab) =>
      links.value.some((link) => tab.path === `${basePath.value}/${link.path}`)
    )
  )
  function toggleSidebar() {
    if (window.matchMedia('(max-width: 767px)').matches) session.sidebarOpen = !session.sidebarOpen
    else collapsed.value = !collapsed.value
  }
  function closeTab(path) {
    const index = tabs.value.findIndex((tab) => tab.path === path)
    const adjacent = tabs.value[index - 1] || tabs.value[index + 1]
    visited.value = visited.value.filter((tab) => tab.path !== path)
    if (route.path === path && adjacent) router.push(adjacent.path)
  }
  watch(
    () => route.fullPath,
    () => {
      session.sidebarOpen = false
      if (!visited.value.some((tab) => tab.path === route.path)) {
        visited.value.push({ path: route.path, label: route.meta.title })
      }
    },
    { immediate: true }
  )
</script>

<template>
  <div class="admin-app" :class="{ 'pos-app': isPos }">
    <DemoBar :project="isPos ? 'pos-admin' : 'commerce-admin'" />
    <div class="admin-frame" :class="{ 'nav-collapsed': collapsed }">
      <button
        v-if="session.sidebarOpen"
        class="sidebar-backdrop"
        aria-label="關閉導覽"
        @click="session.sidebarOpen = false"
      />
      <aside class="admin-sidebar" :class="{ 'is-open': session.sidebarOpen }">
        <RouterLink :to="basePath" class="admin-brand">
          <span class="brand-mark">
            <AppIcon :name="isPos ? 'Grid' : 'Collection'" :size="22" />
          </span>
          <div>
            <strong>{{ isPos ? '青川零售' : '日常選物' }}</strong>
            <small>{{ isPos ? 'RETAIL OPERATIONS' : 'COMMERCE CONSOLE' }}</small>
          </div>
        </RouterLink>
        <span class="sidebar-section-label">{{ isPos ? '商家營運' : '商城管理' }}</span>
        <nav aria-label="後台功能">
          <RouterLink
            v-for="link in links"
            :key="link.path"
            :to="`${basePath}/${link.path}`"
            :title="link.label"
            :aria-label="link.label"
          >
            <AppIcon :name="link.icon" :size="19" />
            <span>{{ link.label }}</span>
            <span v-if="link.path === 'chat'" class="nav-count">
              {{ database?.conversations.reduce((sum, chat) => sum + chat.unread, 0) || 0 }}
            </span>
          </RouterLink>
        </nav>
        <div class="sidebar-bottom">
          <RouterLink :to="isPos ? '/demo/commerce-admin/chat' : '/demo/pos-admin/dashboard'">
            <AppIcon name="Switch" :size="18" />
            <span>{{ isPos ? '前往商城後台' : '前往 POS 後台' }}</span>
          </RouterLink>
          <RouterLink to="/demo/storefront">
            <AppIcon name="ShoppingBag" :size="18" />
            <span>前往商城</span>
          </RouterLink>
          <p>獨立重製 / 虛構品牌</p>
        </div>
      </aside>
      <div class="admin-workspace">
        <header class="admin-topbar">
          <div class="topbar-location">
            <button
              class="icon-button admin-menu-toggle"
              aria-label="展開或收合導覽"
              :aria-expanded="session.sidebarOpen || !collapsed"
              @click="toggleSidebar"
            >
              <AppIcon name="Menu" />
            </button>
          </div>
          <div class="admin-page-title">
            <AppIcon :name="currentLink?.icon || 'Grid'" :size="19" />
            <strong>{{ route.meta.title }}</strong>
          </div>
          <div class="topbar-actions">
            <template v-if="isPos">
              <label class="sr-only" for="store-switch">展示商家</label>
              <el-select
                id="store-switch"
                v-model="session.storeId"
                aria-label="展示商家"
                class="store-switch"
              >
                <el-option
                  v-for="store in database?.stores || []"
                  :key="store.id"
                  :value="store.id"
                  :label="store.name"
                />
              </el-select>
              <el-select v-model="session.roleId" aria-label="展示角色" class="role-switch">
                <el-option
                  v-for="role in database?.roles || []"
                  :key="role.id"
                  :value="role.id"
                  :label="role.name"
                />
              </el-select>
            </template>
            <span v-else class="agent-indicator">
              <AppIcon name="Bell" :size="18" />
              展示管理員
            </span>
            <span class="avatar avatar-self">{{ isPos ? '陳' : '我' }}</span>
          </div>
        </header>
        <div class="admin-routebar">
          <nav class="admin-breadcrumb" aria-label="麵包屑">
            <span>{{ isPos ? 'POS 後台' : '商城後台' }}</span>
            <span>/</span>
            <strong>{{ route.meta.title }}</strong>
          </nav>
          <nav class="admin-tabs" aria-label="已開啟頁面">
            <div
              v-for="tab in tabs"
              :key="tab.path"
              class="admin-tab"
              :class="{ active: route.path === tab.path }"
            >
              <RouterLink :to="tab.path">{{ tab.label }}</RouterLink>
              <button
                v-if="tabs.length > 1"
                :aria-label="`關閉${tab.label}頁籤`"
                @click="closeTab(tab.path)"
              >
                <AppIcon name="Close" :size="12" />
              </button>
            </div>
          </nav>
        </div>
        <main
          id="main-content"
          class="admin-main"
          :class="{ 'chat-main': route.name === 'CommerceChat' }"
        >
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>
