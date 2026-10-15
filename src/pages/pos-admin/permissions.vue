<script setup>
  import { computed, ref, watch } from 'vue'
  import { useDemoData } from '@/hook/useDemoData'
  import { permissionModules } from '@/mock/seed'
  import AccessNotice from '@/components/Shared/AccessNotice.vue'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const { database, isPending, execute, saving, allowed } = useDemoData()
  const selectedId = ref('manager')
  const selected = computed(() =>
    database.value?.roles.find((role) => role.id === selectedId.value)
  )
  const draft = ref({})
  watch(
    selected,
    (role) => {
      if (role) draft.value = JSON.parse(JSON.stringify(role.permissions))
    },
    { immediate: true }
  )
  const actions = [
    { id: 'view', name: '檢視' },
    { id: 'edit', name: '編輯' },
    { id: 'export', name: '匯出' }
  ]
  const editable = computed(() => allowed('team', 'edit') && selectedId.value !== 'admin')
  function toggle(module, action, checked) {
    const next = new Set(draft.value[module] || [])
    if (checked) {
      next.add(action)
      next.add('view')
    } else {
      next.delete(action)
      if (action === 'view') next.clear()
    }
    draft.value = { ...draft.value, [module]: [...next] }
  }
  const save = () =>
    execute(
      'role.save',
      { id: selectedId.value, permissions: JSON.parse(JSON.stringify(draft.value)) },
      '角色權限已儲存，可在右上角切換角色體驗'
    )
</script>

<template>
  <el-skeleton v-if="isPending" :rows="8" animated />
  <AccessNotice v-else-if="!allowed('team')" />
  <template v-else>
    <div class="page-heading">
      <div>
        <p class="page-context">Retail / Permissions</p>
        <h1>讓每個角色，各司其職。</h1>
        <p>設定功能存取範圍，再切換角色驗證操作差異。</p>
      </div>
    </div>
    <div class="permissions-layout">
      <aside class="role-list">
        <h2>工作角色</h2>
        <button
          v-for="role in database?.roles || []"
          :key="role.id"
          :class="{ active: selectedId === role.id }"
          @click="selectedId = role.id"
        >
          <AppIcon name="User" :size="20" />
          <span>
            <strong>{{ role.name }}</strong>
            <small>
              {{
                role.id === 'admin' ? '完整管理' : role.id === 'manager' ? '門店營運' : '基本查詢'
              }}
            </small>
          </span>
          <AppIcon name="ArrowRight" :size="14" />
        </button>
      </aside>
      <section class="permission-panel">
        <header>
          <h2>{{ selected?.name }}</h2>
          <p>{{ selected?.description }}</p>
        </header>
        <el-table :data="permissionModules" row-key="id">
          <el-table-column prop="name" label="功能模組" min-width="110" />
          <el-table-column
            v-for="action in actions"
            :key="action.id"
            :label="action.name"
            min-width="60"
            align="center"
          >
            <template #default="{ row }">
              <el-checkbox
                :model-value="draft[row.id]?.includes(action.id) || false"
                :disabled="!editable"
                :aria-label="`${row.name}${action.name}`"
                @change="(value) => toggle(row.id, action.id, value)"
              />
            </template>
          </el-table-column>
        </el-table>
        <div class="permission-footer">
          <p>
            {{
              selectedId === 'admin'
                ? '保留系統管理員的完整權限，方便隨時回到管理介面。'
                : '啟用編輯或匯出時，將同時啟用檢視。關閉檢視會一併關閉其他權限。'
            }}
          </p>
          <el-button v-if="editable" type="primary" :loading="saving" @click="save">
            儲存權限
          </el-button>
        </div>
      </section>
    </div>
    <el-alert
      title="此為本機角色切換展示，正式系統的授權仍需由後端驗證。"
      type="info"
      :closable="false"
      show-icon
      class="permission-disclaimer"
    />
  </template>
</template>
