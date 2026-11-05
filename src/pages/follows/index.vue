<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import EmptyState from '../../components/EmptyState.vue'
import { follows, signedIn, openLogin, syncAccount, toggleFollow, errorText, placeholder } from '../../stores/gallery'
import { mediaUrl } from '../../utils/axios'
const error = ref(''), loading = ref(false)
async function refresh() {
  error.value = ''
  loading.value = true
  try { await syncAccount() } catch (err) { error.value = errorText(err) }
  finally { loading.value = false }
}
onShow(refresh)
function search(name: string) { uni.navigateTo({ url: `/pages/search/index?keyword=${encodeURIComponent(name)}` }) }
</script>
<template>
  <view class="page">
    <EmptyState v-if="!signedIn" title="登录后查看关注"><button class="outline" size="mini" @tap="openLogin">去登录</button></EmptyState>
    <view v-else-if="error" class="empty" @tap="refresh">{{ error }} · 点击重试</view>
    <uni-load-more v-else-if="loading" status="loading" />
    <EmptyState v-else-if="!follows.length" title="还没有关注的作者" />
    <view v-for="author in follows" :key="author.id" class="panel">
      <view class="row between">
        <view class="row author" @tap="search(author.name)">
          <image :src="mediaUrl(author.avatarUrl) || placeholder" class="avatar" mode="aspectFill" />
          <view class="section-title">{{ author.name }}</view>
        </view>
        <button class="outline followed" @tap="toggleFollow(author.id)">已关注</button>
      </view>
      <view v-if="author.coverUrl" class="previews" @tap="search(author.name)"><image :src="author.coverUrl" mode="aspectFill" /></view>
    </view>
  </view>
</template>
<style scoped>.author{gap:18rpx;min-width:0;flex:1}.avatar{width:80rpx;height:80rpx;border-radius:50%;flex-shrink:0}.bio{font-size:21rpx;margin-top:8rpx}.followed{margin:0 0 0 12rpx;line-height:52rpx;font-size:23rpx;padding:0 20rpx}.previews{display:flex;gap:14rpx;margin-top:24rpx}.previews image{width:30%;height:150rpx;border-radius:12rpx}</style>
