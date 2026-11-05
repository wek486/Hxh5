<script setup lang="ts">
import { ref } from 'vue'
import LikeButton from './LikeButton.vue'
import { isLiked, likeCount, type Work } from '../stores/gallery'
defineProps<{ work: Work }>()
defineEmits<{ like: [id: number] }>()
const failed = ref(false)
function open(id: number) { uni.navigateTo({ url: `/pages/detail/index?id=${id}` }) }
</script>
<template><view class="work-card" @tap="open(work.id)"><view class="picture" :style="{ paddingTop: `${work.ratio * 100}%` }"><image v-if="!failed" :src="work.url" mode="aspectFill" lazy-load class="cover" @error="failed = true" /><view v-else class="fallback"><uni-icons type="image" :size="36" color="#A6B4C8" /></view></view><view class="title">{{ work.title }}</view><view class="card-footer"><view class="author"><image :src="work.avatar" mode="aspectFill" class="avatar" /><text class="name">{{ work.author }}</text></view><LikeButton :liked="isLiked(work.id)" :count="likeCount(work)" @toggle="$emit('like', work.id)" /></view></view></template>
<style scoped>.work-card{margin-bottom:30rpx}.picture{position:relative;overflow:hidden;border-radius:18rpx;background:#eff3f8}.cover,.fallback{position:absolute;inset:0;width:100%;height:100%}.fallback{display:flex;align-items:center;justify-content:center}.title{font-size:27rpx;font-weight:600;margin-top:14rpx;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.card-footer{display:flex;align-items:center;justify-content:space-between;margin-top:10rpx;gap:8rpx}.author{display:flex;align-items:center;gap:8rpx;min-width:0}.avatar{width:32rpx;height:32rpx;border-radius:50%;flex-shrink:0}.name{font-size:22rpx;color:#667080;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style>
