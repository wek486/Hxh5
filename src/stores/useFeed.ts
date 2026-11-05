import { computed, ref, watch } from 'vue'
import { hx } from '../api/hx'
import { cacheWorks, works, errorText } from './gallery'

export function useFeed(search = false) {
  const keyword = ref(''), category = ref(''), sort = ref('news')
  const ids = ref<number[]>([]), loading = ref(false), error = ref(''), more = ref(!search)
  let offset = 0, generation = 0
  const list = computed(() => ids.value.map(id => works[id]).filter(Boolean))
  async function load(reset = false) {
    if (!reset && (loading.value || !more.value)) return
    const current = ++generation
    if (reset) { ids.value = []; offset = 0; more.value = !search }
    loading.value = true
    error.value = ''
    try {
      const rows = search && keyword.value
        ? await hx.search(keyword.value, category.value, sort.value === 'recommended' ? 'relevance' : sort.value)
        : await hx.feed(category.value, sort.value, offset)
      if (current !== generation) return
      ids.value = [...new Set([...ids.value, ...cacheWorks(rows)])]
      offset += rows.length
      more.value = !search && rows.length === 60
    } catch (err) {
      if (current === generation) error.value = errorText(err)
    } finally {
      if (current === generation) { loading.value = false; uni.stopPullDownRefresh() }
    }
  }
  watch([keyword, category, sort], () => load(true))
  return { keyword, category, sort, list, loading, error, more, load }
}
