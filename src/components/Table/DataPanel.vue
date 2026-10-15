<script setup>
  defineProps({
    loading: Boolean,
    error: { type: [Object, String], default: null },
    total: { type: Number, default: 0 },
    page: { type: Number, default: 1 },
    pageSize: { type: Number, default: 8 }
  })
  defineEmits(['update:page', 'update:pageSize', 'retry'])
</script>

<template>
  <section class="data-panel">
    <div class="table-toolbar"><slot name="toolbar" /></div>
    <el-skeleton v-if="loading" :rows="6" animated class="panel-skeleton" />
    <div v-else-if="error" class="panel-empty">
      <p>資料暫時無法載入。</p>
      <el-button @click="$emit('retry')">重新載入</el-button>
    </div>
    <template v-else>
      <div class="table-scroll"><slot /></div>
      <div class="table-pagination">
        <span>共 {{ total }} 筆資料</span>
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[8, 16, 32]"
          :total="total"
          layout="prev, pager, next"
          @update:current-page="$emit('update:page', $event)"
          @update:page-size="$emit('update:pageSize', $event)"
        />
      </div>
    </template>
  </section>
</template>
