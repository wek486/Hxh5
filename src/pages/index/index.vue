<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onPageScroll } from '@dcloudio/uni-app'
import SearchBar from '../../components/SearchBar.vue'
import FeedFilters from '../../components/FeedFilters.vue'
import ImageGrid from '../../components/ImageGrid.vue'
import EmptyState from '../../components/EmptyState.vue'
import { useFeed } from '../../stores/useFeed'
import { toggleLike, tabColor, syncAccount } from '../../stores/gallery'
const { category, sort, list, loading, error, more, load } = useFeed()
onLoad(() => load(true))
onShow(() => { tabColor(); syncAccount().catch(() => {}) })
onPullDownRefresh(() => load(true))
onReachBottom(() => load())
const showBackToTop = ref(false)

onPageScroll(({ scrollTop }) => {
  showBackToTop.value = scrollTop >= 480
})

function backToTop() {
  uni.pageScrollTo({ scrollTop: 0, duration: 300 })
}

function search(keyword: string) {
  if (keyword) uni.navigateTo({ url: `/pages/search/index?keyword=${encodeURIComponent(keyword)}` })
}
</script>
<template>
  <view class="page">
    <SearchBar @search="search" />
    <FeedFilters v-model:category="category" v-model:sort="sort" />
    <ImageGrid :items="list" @like="toggleLike" />
    <view v-if="error" class="empty" @tap="load(!list.length)">{{ error }} · 点击重试</view>
    <uni-load-more v-else-if="loading || list.length" :status="loading ? 'loading' : more ? 'more' : 'noMore'" @clickLoadMore="load()" />
    <EmptyState v-else title="暂无相关作品" description="试试其他关键词或分类" />
    <button v-if="showBackToTop" class="back-to-top" aria-label="返回顶部" @tap="backToTop">
      <uni-icons type="arrow-up" color="#FFFFFF" :size="20" />
      <text>顶部</text>
    </button>
  </view>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 24rpx;
  bottom: calc(24rpx + var(--window-bottom, 0px) + env(safe-area-inset-bottom));
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rpx;
  width: 96rpx;
  height: 96rpx;
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #3478F6;
  color: #FFFFFF;
  font-size: 20rpx;
  line-height: 1;
  box-shadow: 0 8rpx 24rpx rgba(52, 120, 246, 0.28);
}

.back-to-top::after {
  border: 0;
}
</style>
