<script setup lang="ts">
defineProps({ title: { type: String, default: '这里暂时空空的' }, description: { type: String, default: '去发现更多喜欢的作品吧' }, icon: { type: String, default: 'images' } })
</script>
<template><view class="empty-state"><uni-icons :type="icon" :size="44" color="#C8D2E2" /><view class="empty-title">{{ title }}</view><view class="empty-description">{{ description }}</view><slot /></view></template>
<style scoped>.empty-state{text-align:center;padding:100rpx 24rpx}.empty-title{font-weight:600;margin-top:24rpx}.empty-description{font-size:24rpx;color:#8b94a3;margin:16rpx 0 28rpx}</style>
