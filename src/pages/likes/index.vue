<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import ImageGrid from '../../components/ImageGrid.vue'
import EmptyState from '../../components/EmptyState.vue'
import { likedWorks, toggleLike, tabColor, signedIn, openLogin, syncAccount, errorText } from '../../stores/gallery'
const error = ref(''), loading = ref(false)
async function refresh() {
  error.value = ''
  loading.value = true
  try { await syncAccount() } catch (err) { error.value = errorText(err) }
  finally { loading.value = false }
}
onShow(() => { tabColor('#EF4444'); void refresh() })
function discover() { uni.switchTab({ url: '/pages/index/index' }) }
</script>
<template>
  <view class="page">
    <view class="subtitle">收集每一次心动</view>
    <EmptyState v-if="!signedIn" icon="heart" title="登录后查看我的点赞"><button class="outline" size="mini" @tap="openLogin">去登录</button></EmptyState>
    <view v-else-if="error" class="empty" @tap="refresh">{{ error }} · 点击重试</view>
    <uni-load-more v-else-if="loading" status="loading" />
    <ImageGrid v-else-if="likedWorks.length" :items="likedWorks" @like="toggleLike" />
    <EmptyState v-else icon="heart" title="还没有点赞的作品"><button class="outline" size="mini" @tap="discover">去发现</button></EmptyState>
  </view>
</template>
<style scoped>.subtitle{display:flex;align-items:center;justify-content:center;gap:20rpx;padding:18rpx 0 42rpx;color:#8b93a0;font-size:25rpx}.line{width:44rpx;height:1rpx;background:#cbd2dc}</style>
