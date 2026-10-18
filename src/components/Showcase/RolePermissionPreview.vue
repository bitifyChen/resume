<script setup>
  import { computed, ref, watch } from 'vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'

  const actionColumns = [
    { id: 'read', label: '讀取' },
    { id: 'create', label: '新增' },
    { id: 'update', label: '更新' },
    { id: 'delete', label: '刪除' }
  ]

  const modules = [
    { id: 'product', label: '商品資料', icon: 'Goods' },
    { id: 'inventory', label: '庫存管理', icon: 'Box' },
    { id: 'order', label: '訂單管理', icon: 'ShoppingBag' },
    { id: 'manager', label: '帳號管理', icon: 'User' }
  ]

  const roles = ref([
    {
      id: 'manager',
      name: '商家主管',
      description: '管理商品、庫存與訂單',
      permissions: {
        product: ['read', 'create', 'update'],
        inventory: ['read', 'create', 'update'],
        order: ['read', 'update'],
        manager: []
      }
    },
    {
      id: 'partner',
      name: '商家夥伴',
      description: '處理商品與日常訂單',
      permissions: {
        product: ['read'],
        inventory: ['read'],
        order: ['read', 'update'],
        manager: []
      }
    },
    {
      id: 'account-admin',
      name: '帳號管理員',
      description: '維護後台帳號與角色',
      permissions: {
        product: [],
        inventory: [],
        order: [],
        manager: ['read', 'create', 'update', 'delete']
      }
    }
  ])

  const selectedRoleId = ref('manager')
  const assignedRoleIds = ref(['manager'])
  const activeModuleId = ref('product')

  const selectedRole = computed(() =>
    roles.value.find((role) => role.id === selectedRoleId.value)
  )

  const effectivePermissionSet = computed(() => {
    const result = new Set()
    roles.value
      .filter((role) => assignedRoleIds.value.includes(role.id))
      .forEach((role) => {
        Object.entries(role.permissions).forEach(([moduleId, actions]) => {
          actions.forEach((action) => result.add(`${moduleId}_${action}`))
        })
      })
    return result
  })

  const visibleModules = computed(() =>
    modules.filter((module) => effectivePermissionSet.value.has(`${module.id}_read`))
  )

  const activeModule = computed(() =>
    modules.find((module) => module.id === activeModuleId.value) || modules[0]
  )

  const roleSummary = computed(() => {
    const names = roles.value
      .filter((role) => assignedRoleIds.value.includes(role.id))
      .map((role) => role.name)
    return names.length ? names.join('＋') : '尚未指派角色'
  })

  const moduleRows = {
    product: [
      ['隨行保溫瓶', 'RT-001', '生活用品', '啟用'],
      ['城市帆布袋', 'RT-002', '居家收納', '啟用'],
      ['晨間陶瓷杯', 'RT-003', '生活用品', '停用']
    ],
    inventory: [
      ['隨行保溫瓶', 'RT-001', '12', '庫存正常'],
      ['城市帆布袋', 'RT-002', '4', '待補貨'],
      ['晨間陶瓷杯', 'RT-003', '18', '庫存正常']
    ],
    order: [
      ['ORD-2026-0182', '林怡安', 'NT$ 1,360', '待處理'],
      ['ORD-2026-0179', '周子晴', 'NT$ 680', '已完成'],
      ['ORD-2026-0176', '許博文', 'NT$ 1,170', '配送中']
    ],
    manager: [
      ['陳怡君', '商家主管', '中央店', '啟用'],
      ['林柏宇', '商家夥伴', '中央店', '啟用'],
      ['張雅雯', '帳號管理員', '總部', '啟用']
    ]
  }

  const tableHeaders = computed(() => {
    const headers = {
      product: ['商品名稱', 'SKU', '分類', '狀態'],
      inventory: ['商品名稱', 'SKU', '現有庫存', '庫存狀態'],
      order: ['訂單編號', '會員', '金額', '狀態'],
      manager: ['使用者', '角色', '範圍', '狀態']
    }
    return headers[activeModuleId.value]
  })

  const tableRows = computed(() => moduleRows[activeModuleId.value])

  function hasPermission(moduleId, action) {
    return effectivePermissionSet.value.has(`${moduleId}_${action}`)
  }

  function toggleRolePermission(moduleId, action) {
    const role = selectedRole.value
    if (!role) return

    const current = new Set(role.permissions[moduleId])
    if (current.has(action)) {
      current.delete(action)
      if (action === 'read') current.clear()
    } else {
      current.add(action)
      if (action !== 'read') current.add('read')
    }

    role.permissions[moduleId] = [...current]
  }

  function toggleAssignedRole(roleId) {
    const current = new Set(assignedRoleIds.value)
    if (current.has(roleId)) current.delete(roleId)
    else current.add(roleId)
    assignedRoleIds.value = [...current]
  }

  watch(
    visibleModules,
    (items) => {
      if (!items.some((item) => item.id === activeModuleId.value)) {
        activeModuleId.value = items[0]?.id || 'dashboard'
      }
    },
    { deep: true }
  )
</script>

<template>
  <div class="role-permission-preview">
    <header class="permission-preview-header">
      <div>
        <small>POS 後台／角色與權限</small>
        <h3>角色權限設定與登入結果</h3>
      </div>
      <div class="permission-user">
        <span class="permission-avatar">陳</span>
        <span><strong>陳怡君</strong><small>{{ roleSummary }}</small></span>
      </div>
    </header>

    <div class="permission-demo-grid">
      <section class="role-config-panel" aria-labelledby="role-config-title">
        <div class="panel-heading">
          <div>
            <small>ROLE CONFIGURATION</small>
            <h4 id="role-config-title">角色權限設定</h4>
          </div>
          <span>{{ selectedRole?.description }}</span>
        </div>

        <div class="role-selector" role="tablist" aria-label="選擇要編輯的角色">
          <button
            v-for="role in roles"
            :key="role.id"
            type="button"
            :aria-selected="selectedRoleId === role.id"
            @click="selectedRoleId = role.id"
          >
            {{ role.name }}
          </button>
        </div>

        <div class="permission-matrix" role="table" aria-label="角色 CRUD 權限">
          <div class="permission-matrix-row is-header" role="row">
            <span role="columnheader">資料項目</span>
            <span v-for="action in actionColumns" :key="action.id" role="columnheader">{{ action.label }}</span>
          </div>
          <div v-for="module in modules" :key="module.id" class="permission-matrix-row" role="row">
            <span class="permission-module" role="cell">
              <AppIcon :name="module.icon" :size="16" />
              {{ module.label }}
            </span>
            <label v-for="action in actionColumns" :key="action.id" role="cell">
              <input
                type="checkbox"
                :checked="selectedRole?.permissions[module.id]?.includes(action.id)"
                :aria-label="`${selectedRole?.name} ${module.label} ${action.label}`"
                @change="toggleRolePermission(module.id, action.id)"
              />
            </label>
          </div>
        </div>

        <p class="permission-hint">啟用新增、更新或刪除時，同步保留該資料的讀取權限。</p>
      </section>

      <section class="permission-result-panel" aria-labelledby="permission-result-title">
        <div class="panel-heading">
          <div>
            <small>EFFECTIVE PERMISSIONS</small>
            <h4 id="permission-result-title">模擬登入結果</h4>
          </div>
          <span>{{ effectivePermissionSet.size }} 項有效權限</span>
        </div>

        <div class="assigned-roles" aria-label="目前使用者綁定的角色">
          <span>綁定角色</span>
          <button
            v-for="role in roles"
            :key="role.id"
            type="button"
            :aria-pressed="assignedRoleIds.includes(role.id)"
            @click="toggleAssignedRole(role.id)"
          >
            <AppIcon :name="assignedRoleIds.includes(role.id) ? 'Check' : 'Plus'" :size="13" />
            {{ role.name }}
          </button>
        </div>

        <div class="permission-admin-frame">
          <aside class="permission-sidebar" aria-label="依路由權限產生的側邊欄">
            <div class="permission-sidebar-brand"><AppIcon name="Grid" :size="18" /></div>
            <button type="button" class="is-home" :aria-current="activeModuleId === 'dashboard' ? 'page' : undefined" @click="activeModuleId = 'dashboard'">
              <AppIcon name="House" :size="16" /><span>營運總覽</span>
            </button>
            <button
              v-for="module in visibleModules"
              :key="module.id"
              type="button"
              :aria-current="activeModuleId === module.id ? 'page' : undefined"
              @click="activeModuleId = module.id"
            >
              <AppIcon :name="module.icon" :size="16" /><span>{{ module.label }}</span>
            </button>
          </aside>

          <main class="permission-workspace">
            <template v-if="activeModuleId === 'dashboard'">
              <div class="permission-empty-state">
                <AppIcon name="Grid" :size="28" />
                <strong>營運總覽</strong>
                <p v-if="assignedRoleIds.length">請從側邊欄選擇目前角色可以進入的頁面。</p>
                <p v-else>目前未綁定角色，因此不顯示需要權限的頁面。</p>
              </div>
            </template>
            <template v-else>
              <header class="workspace-heading">
                <div>
                  <small>中央店／{{ activeModule.label }}</small>
                  <h5>{{ activeModule.label }}</h5>
                </div>
                <div class="workspace-actions">
                  <button v-if="hasPermission(activeModule.id, 'create')" type="button"><AppIcon name="Plus" :size="13" />新增</button>
                  <button v-if="hasPermission(activeModule.id, 'update')" type="button"><AppIcon name="Edit" :size="13" />更新</button>
                  <button v-if="hasPermission(activeModule.id, 'delete')" type="button" class="is-danger"><AppIcon name="Delete" :size="13" />刪除</button>
                </div>
              </header>

              <div class="permission-result-note">
                <span>Route Meta</span>
                <code>{{ activeModule.id }}_read</code>
                <span>頁內操作由 v-permission 控制</span>
              </div>

              <div class="permission-data-table" role="table" :aria-label="`${activeModule.label}虛構資料`">
                <div class="permission-data-row is-header" role="row">
                  <span v-for="header in tableHeaders" :key="header" role="columnheader">{{ header }}</span>
                </div>
                <div v-for="(row, rowIndex) in tableRows" :key="rowIndex" class="permission-data-row" role="row">
                  <span v-for="(cell, cellIndex) in row" :key="cellIndex" role="cell">{{ cell }}</span>
                </div>
              </div>
            </template>
          </main>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
  .role-permission-preview {
    overflow: hidden;
    border: 1px solid #d7dce2;
    background: #f4f7fb;
    color: #273142;
    font-family: 'Noto Sans TC', sans-serif;
  }

  .permission-preview-header,
  .permission-user,
  .panel-heading,
  .permission-module,
  .assigned-roles,
  .workspace-heading,
  .workspace-actions,
  .permission-result-note {
    display: flex;
    align-items: center;
  }

  .permission-preview-header {
    justify-content: space-between;
    gap: 24px;
    padding: 17px 20px;
    border-bottom: 1px solid #d7dce2;
    background: #fff;
  }

  .permission-preview-header small,
  .panel-heading small,
  .permission-workspace small {
    color: #7f8998;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .permission-preview-header h3,
  .panel-heading h4,
  .workspace-heading h5 {
    margin: 3px 0 0;
    line-height: 1.25;
  }

  .permission-preview-header h3 {
    font-size: 18px;
  }

  .permission-user {
    gap: 9px;
  }

  .permission-avatar {
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    border-radius: 50%;
    background: #dce3ec;
    color: #24364d;
    font-size: 12px;
    font-weight: 800;
  }

  .permission-user > span:last-child {
    display: grid;
    gap: 1px;
    font-size: 11px;
  }

  .permission-user small {
    color: #7f8998;
    font-size: 9px;
  }

  .permission-demo-grid {
    display: grid;
    grid-template-columns: minmax(390px, 0.85fr) minmax(520px, 1.15fr);
    min-height: 610px;
  }

  .role-config-panel,
  .permission-result-panel {
    min-width: 0;
    padding: 20px;
  }

  .role-config-panel {
    border-right: 1px solid #d7dce2;
    background: #fff;
  }

  .panel-heading {
    justify-content: space-between;
    gap: 15px;
  }

  .panel-heading h4 {
    font-size: 15px;
  }

  .panel-heading > span {
    color: #7f8998;
    font-size: 10px;
    text-align: right;
  }

  .role-selector {
    display: flex;
    margin-top: 16px;
    border-bottom: 1px solid #d7dce2;
  }

  .role-selector button {
    flex: 1;
    padding: 9px 7px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: #6d7684;
    font-size: 11px;
    white-space: nowrap;
  }

  .role-selector button[aria-selected='true'] {
    border-bottom-color: #24364d;
    color: #24364d;
    font-weight: 750;
  }

  .permission-matrix {
    margin-top: 14px;
    border: 1px solid #d7dce2;
    background: #fff;
  }

  .permission-matrix-row {
    display: grid;
    grid-template-columns: minmax(125px, 1.5fr) repeat(4, minmax(45px, 0.65fr));
    min-height: 52px;
    border-bottom: 1px solid #e7eaee;
  }

  .permission-matrix-row:last-child {
    border-bottom: 0;
  }

  .permission-matrix-row > span,
  .permission-matrix-row > label {
    display: grid;
    place-items: center;
    border-right: 1px solid #e7eaee;
    font-size: 11px;
  }

  .permission-matrix-row > :last-child {
    border-right: 0;
  }

  .permission-matrix-row.is-header {
    min-height: 38px;
    background: #eef1f4;
    color: #657080;
    font-weight: 700;
  }

  .permission-matrix-row .permission-module {
    justify-content: start;
    grid-template-columns: 18px 1fr;
    gap: 7px;
    padding: 0 12px;
    color: #303b4b;
    font-weight: 650;
  }

  .permission-matrix input {
    width: 15px;
    height: 15px;
    margin: 0;
    accent-color: #24364d;
  }

  .permission-hint {
    margin: 10px 0 0;
    color: #7f8998;
    font-size: 10px;
    line-height: 1.6;
  }

  .permission-result-panel {
    background: #f4f7fb;
  }

  .assigned-roles {
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 16px;
  }

  .assigned-roles > span {
    margin-right: 2px;
    color: #657080;
    font-size: 10px;
    font-weight: 700;
  }

  .assigned-roles button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    border: 1px solid #c8ced6;
    border-radius: 4px;
    background: #fff;
    color: #657080;
    font-size: 10px;
    white-space: nowrap;
  }

  .assigned-roles button[aria-pressed='true'] {
    border-color: #24364d;
    background: #24364d;
    color: #fff;
  }

  .permission-admin-frame {
    display: grid;
    grid-template-columns: 106px minmax(0, 1fr);
    min-height: 452px;
    margin-top: 14px;
    overflow: hidden;
    border: 1px solid #cfd5dd;
    background: #fff;
  }

  .permission-sidebar {
    padding: 12px 8px;
    background: #24364d;
    color: #cbd5e1;
  }

  .permission-sidebar-brand {
    display: grid;
    width: 30px;
    height: 30px;
    margin: 0 5px 13px;
    place-items: center;
    border: 1px solid rgb(255 255 255 / 24%);
    color: #fff;
  }

  .permission-sidebar button {
    display: grid;
    grid-template-columns: 18px 1fr;
    gap: 6px;
    width: 100%;
    min-height: 35px;
    padding: 7px 8px;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    font-size: 10px;
    text-align: left;
  }

  .permission-sidebar button[aria-current='page'] {
    background: #fff;
    color: #24364d;
    font-weight: 750;
  }

  .permission-workspace {
    min-width: 0;
    padding: 16px;
  }

  .workspace-heading {
    justify-content: space-between;
    gap: 12px;
  }

  .workspace-heading h5 {
    font-size: 15px;
  }

  .workspace-actions {
    justify-content: flex-end;
    gap: 6px;
  }

  .workspace-actions button {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 6px 8px;
    border: 1px solid #24364d;
    border-radius: 4px;
    background: #24364d;
    color: #fff;
    font-size: 9px;
    white-space: nowrap;
  }

  .workspace-actions button.is-danger {
    border-color: #c45656;
    background: #fff;
    color: #c45656;
  }

  .permission-result-note {
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 13px;
    padding: 8px 10px;
    border-left: 3px solid #6baed6;
    background: #eef7fc;
    color: #5d6876;
    font-size: 9px;
  }

  .permission-result-note span:first-child {
    font-weight: 800;
  }

  .permission-result-note code {
    padding: 2px 4px;
    background: #fff;
    color: #24364d;
    font-size: 9px;
  }

  .permission-data-table {
    margin-top: 14px;
    overflow-x: auto;
    border: 1px solid #d7dce2;
  }

  .permission-data-row {
    display: grid;
    grid-template-columns: 1.35fr repeat(3, minmax(70px, 1fr));
    min-width: 400px;
    border-bottom: 1px solid #e7eaee;
  }

  .permission-data-row:last-child {
    border-bottom: 0;
  }

  .permission-data-row span {
    padding: 10px 9px;
    border-right: 1px solid #e7eaee;
    color: #566171;
    font-size: 9px;
  }

  .permission-data-row span:last-child {
    border-right: 0;
  }

  .permission-data-row.is-header {
    background: #eef1f4;
    font-weight: 750;
  }

  .permission-empty-state {
    display: grid;
    min-height: 400px;
    place-content: center;
    justify-items: center;
    color: #738093;
    text-align: center;
  }

  .permission-empty-state strong {
    margin-top: 8px;
    color: #303b4b;
    font-size: 14px;
  }

  .permission-empty-state p {
    max-width: 230px;
    margin: 5px 0 0;
    font-size: 10px;
    line-height: 1.6;
  }

  button,
  input {
    cursor: pointer;
  }

  button:focus-visible,
  input:focus-visible {
    outline: 2px solid #4f8fbd;
    outline-offset: 2px;
  }

  @media (max-width: 1040px) {
    .permission-demo-grid {
      grid-template-columns: 1fr;
    }

    .role-config-panel {
      border-right: 0;
      border-bottom: 1px solid #d7dce2;
    }
  }

  @media (max-width: 620px) {
    .permission-preview-header,
    .panel-heading,
    .workspace-heading {
      align-items: flex-start;
      flex-direction: column;
    }

    .permission-user {
      align-self: stretch;
    }

    .role-config-panel,
    .permission-result-panel {
      padding: 14px;
    }

    .role-selector {
      overflow-x: auto;
    }

    .role-selector button {
      min-width: 96px;
    }

    .permission-matrix {
      overflow-x: auto;
    }

    .permission-matrix-row {
      min-width: 430px;
    }

    .permission-admin-frame {
      grid-template-columns: 64px minmax(0, 1fr);
    }

    .permission-sidebar button {
      place-items: center;
      grid-template-columns: 1fr;
    }

    .permission-sidebar button span {
      display: none;
    }

    .workspace-actions {
      justify-content: flex-start;
    }
  }
</style>
