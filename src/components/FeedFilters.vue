<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({ category: { type: String, default: '' }, sort: { type: String, default: 'news' } })
const emit = defineEmits<{ 'update:category': [value: string]; 'update:sort': [value: string] }>()
const categories = ['全部', '二次元', 'cosplay'], categoryValues = ['', '二次元', 'cosplay']
const sorts = ['最新', '热门', '推荐'], sortValues = ['news', 'popular', 'recommended']
const categoryIndex = computed(() => Math.max(0, categoryValues.indexOf(props.category)))
const sortIndex = computed(() => Math.max(0, sortValues.indexOf(props.sort)))
function changeCategory(event: { currentIndex: number }) { emit('update:category', categoryValues[event.currentIndex]!) }
function changeSort(event: { currentIndex: number }) { emit('update:sort', sortValues[event.currentIndex]!) }
</script>
<template><view class="filters"><uni-segmented-control :current="categoryIndex" :values="categories" style-type="text" active-color="#3478F6" @clickItem="changeCategory" /><view class="sort"><uni-segmented-control :current="sortIndex" :values="sorts" style-type="text" active-color="#3478F6" @clickItem="changeSort" /></view></view></template>
<style scoped>.filters{padding:8rpx 0 20rpx}.sort{margin-top:12rpx;padding-top:12rpx;border-top:1rpx solid #f1f3f6}</style>
