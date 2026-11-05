<script setup lang="ts">
import { computed } from 'vue'
import WorkCard from './WorkCard.vue'
import type { Work } from '../stores/gallery'
const props = defineProps<{ items: Work[] }>()
defineEmits<{ like: [id: number] }>()
const columns = computed(() => {
  const columns: Work[][] = [[], []], heights = [0, 0]
  props.items.forEach(work => { const index = heights[0]! <= heights[1]! ? 0 : 1; columns[index]!.push(work); heights[index] = heights[index]! + work.ratio + .32 })
  return columns
})
</script>
<template><view class="grid"><view v-for="(column, index) in columns" :key="index" class="column"><WorkCard v-for="work in column" :key="work.id" :work="work" @like="$emit('like', $event)" /></view></view></template>
<style scoped>.grid{display:flex;justify-content:space-between;align-items:flex-start}.column{width:48.4%;min-width:0}</style>
