<script setup lang="ts">
import { ref } from 'vue'
import { mediaUrl } from '../utils/axios'
import { placeholder, type GalleryComment } from '../stores/gallery'
defineProps<{ comments: GalleryComment[] }>()
const emit = defineEmits<{ submit: [content: string]; remove: [id: number] }>()
const content = ref('')
function submit() { if (content.value.trim()) emit('submit', content.value.trim()) }
function clear() { content.value = '' }
defineExpose({ clear })
</script>
<template><view class="comments"><view class="section-title">评论（{{ comments.length }}）</view><view v-for="comment in comments" :key="comment.id" class="comment"><image class="avatar" src="/static/gallery/spring.jpg" mode="aspectFill" /><view class="body"><view class="row between"><text class="name">{{ comment.username }}</text><text v-if="comment.own" class="delete" @tap="$emit('remove', comment.id)">删除</text></view><view class="content">{{ comment.content }}</view><view class="muted time">{{ comment.createdAt }}<text v-if="comment.pending"> · 待审核（仅自己可见）</text><text v-else-if="comment.status === 'REJECTED'"> · 审核未通过</text></view></view></view><view class="composer"><uni-easyinput v-model="content" type="textarea" placeholder="分享你的想法…" :maxlength="500" :auto-height="true" :input-border="false" :styles="{ backgroundColor: '#F2F4F7' }" /><view class="row between composer-footer"><text class="muted">{{ content.length }}/500</text><button class="primary send" :disabled="!content.trim()" @tap="submit">发布</button></view><view class="notice"><uni-icons type="info" :size="14" color="#939BAB" /><text>评论审核后公开</text></view></view></view></template>
<style scoped>.comments{border-top:1rpx solid #edf0f5;padding-top:32rpx}.comment{display:flex;gap:18rpx;padding:30rpx 0;border-bottom:1rpx solid #f3f4f6}.avatar{width:64rpx;height:64rpx;border-radius:50%;flex-shrink:0}.body{flex:1;min-width:0}.name{font-size:25rpx;font-weight:600}.content{font-size:26rpx;line-height:1.8;margin:10rpx 0;white-space:pre-wrap;word-break:break-all}.time{font-size:21rpx}.delete{font-size:23rpx;color:#949cab}.composer{padding-top:28rpx}.composer-footer{margin-top:16rpx}.send{margin:0;font-size:25rpx;line-height:64rpx;padding:0 34rpx}.notice{display:flex;gap:8rpx;justify-content:center;align-items:center;font-size:23rpx;color:#939bab;margin-top:18rpx}</style>
