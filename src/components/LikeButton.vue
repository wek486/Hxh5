<script setup lang="ts">
defineProps({ liked: { type: Boolean, default: false }, count: { type: Number, default: 0 } })
defineEmits<{ toggle: [] }>()
</script>
<template><view class="like" :class="{ selected: liked }" @tap.stop="$emit('toggle')"><uni-icons :type="liked ? 'heart-filled' : 'heart'" :color="liked ? '#EF4444' : '#7B8190'" :size="19" /><text>{{ count }}</text></view></template>
<style scoped>.like{display:inline-flex;align-items:center;gap:6rpx;color:#707784;font-size:23rpx;padding:8rpx 0 8rpx 8rpx;flex-shrink:0}.selected{color:#ef4444}</style>
