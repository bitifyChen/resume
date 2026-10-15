<template>
  <section class="access-notice">
    <el-result
      icon="info"
      title="目前角色沒有檢視權限"
      sub-title="使用右上角的角色選單切換為系統管理員，或開啟可使用的功能。"
    >
      <template #extra>
        <RouterLink to="/demo/pos-admin/inventory" class="button secondary">
          查看商品與庫存
        </RouterLink>
      </template>
    </el-result>
  </section>
</template>
