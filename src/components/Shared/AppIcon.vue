<script setup>
  import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Bell,
    Box,
    ChatDotRound,
    Check,
    CircleCheck,
    Close,
    Collection,
    Delete,
    Download,
    Edit,
    Goods,
    Grid,
    House,
    Menu,
    MoreFilled,
    Picture,
    Plus,
    Search,
    Setting,
    ShoppingBag,
    ShoppingCart,
    Star,
    Switch,
    Upload,
    User,
    View
  } from '@element-plus/icons-vue'
  defineProps({
    name: { type: String, default: 'ArrowRight' },
    size: { type: [Number, String], default: 20 }
  })
  const icons = {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Bell,
    Box,
    ChatDotRound,
    Check,
    CircleCheck,
    Close,
    Collection,
    Delete,
    Download,
    Edit,
    Goods,
    Grid,
    House,
    Menu,
    MoreFilled,
    Picture,
    Plus,
    Search,
    Setting,
    ShoppingBag,
    ShoppingCart,
    Star,
    Switch,
    Upload,
    User,
    View
  }
</script>

<template>
  <el-icon :size="size" aria-hidden="true"><component :is="icons[name] || ArrowRight" /></el-icon>
</template>
