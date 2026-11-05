<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import LikeButton from '../../components/LikeButton.vue'
import CommentPanel from '../../components/CommentPanel.vue'
import EmptyState from '../../components/EmptyState.vue'
import { hx } from '../../api/hx'
import { works, cacheWorks, profile, follows, toggleLike, isLiked, likeCount, toggleFollow, requireLogin, syncAccount, notify, errorText, type GalleryComment } from '../../stores/gallery'
const id = ref(0), commentPanel = ref<InstanceType<typeof CommentPanel> | null>(null)
const work = computed(() => works[id.value])
const comments = ref<GalleryComment[]>([]), total = ref(0), error = ref(''), commentError = ref('')
const loading = ref(false), posting = ref(false)
let page = 0, generation = 0
const followed = computed(() => follows.value.some(author => author.id === work.value?.authorId))
onLoad(options => { id.value = Number(options?.id) })
onShow(refresh)
async function refresh() {
  if (!Number.isSafeInteger(id.value) || id.value < 1) { error.value = '作品不存在'; return }
  error.value = ''
  if (!work.value) {
    try { cacheWorks([await hx.image(id.value)]) }
    catch (err) { error.value = errorText(err); return }
  }
  await syncAccount().catch(notify)
  await loadComments(true)
}
async function loadComments(reset = false) {
  if (loading.value && !reset) return
  const current = ++generation
  const next = reset ? 1 : page + 1
  if (reset) { comments.value = []; total.value = 0 }
  loading.value = true
  commentError.value = ''
  try {
    const result = await hx.comments(id.value, next)
    if (current !== generation) return
    const rows = result.records.map(row => ({
      ...row, own: row.userId === profile.value?.id, pending: row.status === 'PENDING'
    }))
    comments.value = reset ? rows : [...comments.value, ...rows]
    total.value = result.total
    page = next
  } catch (err) { if (current === generation) commentError.value = errorText(err) }
  finally { if (current === generation) loading.value = false }
}
function preview() { if (work.value) uni.previewImage({ urls: [work.value.url] }) }
async function submitComment(content: string) {
  if (posting.value || !requireLogin()) return
  posting.value = true
  try {
    await hx.postComment(id.value, content)
    commentPanel.value?.clear()
    uni.showToast({ title: '已提交，审核后公开', icon: 'none' })
    await loadComments(true)
  } catch (err) { notify(err) }
  finally { posting.value = false }
}
function removeComment(commentId: number) {
  uni.showModal({ title: '删除评论', content: '确定删除这条评论？', async success(result) {
    if (!result.confirm || !requireLogin()) return
    try { await hx.deleteComment(commentId); await loadComments(true) }
    catch (err) { notify(err) }
  } })
}
</script>
<template><view v-if="work" class="safe-bottom"><image class="artwork" :src="work.url" mode="widthFix" @tap="preview" /><view class="page"><view class="title">{{ work.title }}</view><view class="row between author-row"><view class="row author"><image :src="work.avatar" class="avatar" mode="aspectFill" /><view><view class="author-name">{{ work.author }}</view><view v-if="work.publishedAt" class="muted date">发布于 {{ work.publishedAt }}</view></view></view><button v-if="work.authorId && (!profile || work.authorUserId !== profile.id)" class="outline follow" @tap="toggleFollow(work.authorId)">{{ followed ? '已关注' : '关注' }}</button></view><view class="like-row"><view class="like-pill"><LikeButton :liked="isLiked(work.id)" :count="likeCount(work)" @toggle="toggleLike(work.id)" /></view></view><CommentPanel ref="commentPanel" :comments="comments" @submit="submitComment" @remove="removeComment" /><view v-if="commentError" class="empty" @tap="loadComments(true)">{{ commentError }} · 点击重试</view>
      <uni-load-more v-else-if="loading || comments.length < total" :status="loading ? 'loading' : 'more'" @clickLoadMore="loadComments()" /></view></view><EmptyState v-else-if="error" :title="error"><button class="outline" size="mini" @tap="refresh">重试</button></EmptyState><uni-load-more v-else status="loading" /></template>
<style scoped>.artwork{display:block;width:100%;background:#f1f4f8;max-height:1000rpx}.title{font-size:38rpx;font-weight:700;line-height:1.5}.author-row{margin-top:28rpx}.author{gap:16rpx}.avatar{width:70rpx;height:70rpx;border-radius:50%}.author-name{font-size:26rpx;font-weight:600}.date{font-size:21rpx;margin-top:6rpx}.follow{margin:0;font-size:24rpx;padding:0 28rpx;line-height:52rpx}.description{font-size:27rpx;line-height:1.9;margin-top:26rpx}.like-row{text-align:center;padding:28rpx 0 34rpx}.like-pill{display:inline-flex;border:1rpx solid #e1e6ef;border-radius:40rpx;padding:0 30rpx}</style>
