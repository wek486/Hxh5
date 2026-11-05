<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps({ initialValue: { type: String, default: '' } })
const emit = defineEmits<{ search: [keyword: string] }>()
const keyword = ref(props.initialValue)
watch(() => props.initialValue, value => { keyword.value = value })
function search() { emit('search', keyword.value.trim()) }
</script>
<template><uni-search-bar v-model="keyword" placeholder="搜索作品、作者" bg-color="#F2F4F7" :radius="100" cancel-button="none" @confirm="search" @clear="emit('search', '')" /></template>
