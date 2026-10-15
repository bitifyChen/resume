<script setup>
  import { computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useSessionStore } from '@/store/useSessionStore'
  import { useDemoData } from '@/hook/useDemoData'
  import DemoBar from '@/components/Shared/DemoBar.vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const session = useSessionStore()
  const route = useRoute()
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
  watch(
    () => route.fullPath,
    () => {
      session.sidebarOpen = false
    }
  )
</script>

<template>
  <div class="admin-app" :class="{ 'pos-app': isPos }">
    <DemoBar :project="isPos ? 'pos-admin' : 'commerce-admin'" />
    <div class="admin-frame">
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
        <span class="sidebar-section-label">{{ isPos ? '門店營運' : '商城管理' }}</span>
        <nav aria-label="後台功能">
          <RouterLink v-for="link in links" :key="link.path" :to="`${basePath}/${link.path}`">
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
            {{ isPos ? '前往商城後台' : '前往 POS 後台' }}
          </RouterLink>
          <RouterLink to="/demo/storefront">
            <AppIcon name="ShoppingBag" :size="18" />
            前往商城
          </RouterLink>
          <p>獨立重製 / 虛構品牌</p>
        </div>
      </aside>
      <div class="admin-workspace">
        <header class="admin-topbar">
          <div class="topbar-location">
            <button
              class="icon-button mobile-menu"
              aria-label="開啟導覽"
              @click="session.sidebarOpen = !session.sidebarOpen"
            >
              <AppIcon name="Menu" />
            </button>
            <span>{{ isPos ? 'POS 後台' : '商城後台' }}</span>
            <span class="breadcrumb-divider">/</span>
            <strong>{{ route.meta.title }}</strong>
          </div>
          <div class="topbar-actions">
            <template v-if="isPos">
              <label class="sr-only" for="store-switch">展示門店</label>
              <el-select
                id="store-switch"
                v-model="session.storeId"
                aria-label="展示門店"
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
            <span v-else class="agent-indicator">客服 / 我</span>
            <span class="avatar avatar-self">{{ isPos ? '陳' : '我' }}</span>
          </div>
        </header>
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
