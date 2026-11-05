<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import SearchBar from '../../components/SearchBar.vue'
import FeedFilters from '../../components/FeedFilters.vue'
import ImageGrid from '../../components/ImageGrid.vue'
import EmptyState from '../../components/EmptyState.vue'
import { useFeed } from '../../stores/useFeed'
import { toggleLike } from '../../stores/gallery'
const { keyword, category, sort, list, loading, error, more, load } = useFeed(true)
function search(value: string) {
  if (keyword.value === value) void load(true)
  else keyword.value = value
}
onLoad(options => {
  const value = options?.keyword || ''
  try { search(decodeURIComponent(value)) } catch { search(value) }
})
</script>
<template>
  <view class="page">
    <SearchBar :initial-value="keyword" @search="search" />
    <FeedFilters v-model:category="category" v-model:sort="sort" />
    <ImageGrid :items="list" @like="toggleLike" />
    <view v-if="error" class="empty" @tap="load(!list.length)">{{ error }} · 点击重试</view>
    <uni-load-more v-else-if="loading || list.length" :status="loading ? 'loading' : more ? 'more' : 'noMore'" @clickLoadMore="load()" />
    <EmptyState v-else title="暂无相关作品" description="试试其他关键词或分类" />
  </view>
</template>
<style scoped>.summary{padding:12rpx 0 28rpx;font-size:23rpx}</style>
