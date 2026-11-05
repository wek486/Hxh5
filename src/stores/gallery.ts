import { computed, reactive, ref } from 'vue'
import { hx, type ImageRecord, type Profile, type FollowRecord, type CommentRecord } from '../api/hx'
import { getToken, setToken, mediaUrl } from '../utils/axios'

export const placeholder = '/static/gallery/spring.jpg'
export interface Work extends ImageRecord { avatar: string; ratio: number; publishedAt: string }
export interface GalleryComment extends CommentRecord { own: boolean; pending: boolean }
export const works = reactive<Record<number, Work>>({})
export const profile = ref<Profile>()
export const signedIn = ref(!!getToken())
const likedIds = ref<number[]>([])
export const follows = ref<FollowRecord[]>([])
export const likedWorks = computed(() => likedIds.value.map(id => works[id]).filter(Boolean))
const pending = new Set<string>()
let syncTask: Promise<void> | undefined
let revision = 0

export function cacheWorks(rows: ImageRecord[]) {
  return rows.map(row => {
    const old = works[row.id]
    works[row.id] = {
      ...old, ...row,
      title: row.title || old?.title || '未命名作品',
      avatar: mediaUrl(row.avatarUrl) || old?.avatar || placeholder,
      ratio: row.height ? Math.min(1.65, Math.max(.75, row.height / 300)) : old?.ratio || 1.15,
      publishedAt: row.time || old?.publishedAt || ''
    }
    return row.id
  })
}
export function errorText(error: unknown) { return error instanceof Error ? error.message : '操作失败' }
export function notify(error: unknown) { uni.showToast({ title: errorText(error), icon: 'none' }) }
export function openLogin() { uni.navigateTo({ url: '/pages/login/index' }) }
export function requireLogin() {
  if (signedIn.value) return true
  openLogin()
  return false
}
export function logout() {
  revision++
  setToken('')
  signedIn.value = false
  profile.value = undefined
  likedIds.value = []
  follows.value = []
  syncTask = undefined
}
uni.$on('hx-session-expired', logout)
export async function login(username: string, password: string) {
  const result = await hx.login(username, password)
  logout()
  setToken(result.token)
  signedIn.value = true
}
async function allPages<T>(load: (page: number) => Promise<T[]>, session: number) {
  const rows: T[] = []
  for (let page = 1; session === revision; page++) {
    const batch = await load(page)
    rows.push(...batch)
    if (batch.length < 100) break
  }
  return rows
}
export function syncAccount() {
  if (!signedIn.value) return Promise.resolve()
  if (syncTask) return syncTask
  const session = revision
  syncTask = Promise.all([hx.me(), allPages(hx.likes, session), allPages(hx.follows, session)])
    .then(([me, likes, authors]) => {
      if (session !== revision) return
      profile.value = me
      likedIds.value = cacheWorks(likes.map(row => row.image))
      follows.value = authors
    })
    .finally(() => { if (session === revision) syncTask = undefined })
  return syncTask
}
export function isLiked(id: number) { return likedIds.value.includes(id) }
export function likeCount(work: Work) { return work.likes }
export async function toggleLike(id: number) {
  if (!requireLogin() || pending.has(`like-${id}`)) return
  const key = `like-${id}`, session = revision
  pending.add(key)
  try {
    await (syncTask || (profile.value ? Promise.resolve() : syncAccount()))
    if (session !== revision) return
    const result = await hx.like(id, !isLiked(id))
    if (session !== revision) return
    if (works[id]) works[id].likes = result.likes
    if (profile.value && result.liked !== isLiked(id)) profile.value.likesCount += result.liked ? 1 : -1
    likedIds.value = result.liked ? [id, ...likedIds.value.filter(value => value !== id)] : likedIds.value.filter(value => value !== id)
  } catch (error) { notify(error) }
  finally { pending.delete(key) }
}
export async function toggleFollow(id: number) {
  if (!requireLogin() || pending.has(`follow-${id}`)) return
  const key = `follow-${id}`, session = revision
  pending.add(key)
  try {
    await (syncTask || (profile.value ? Promise.resolve() : syncAccount()))
    if (session !== revision) return
    await hx.follow(id, !follows.value.some(author => author.id === id))
    if (session === revision) await syncAccount()
  } catch (error) { notify(error) }
  finally { pending.delete(key) }
}
export function tabColor(color = '#3478F6') { uni.setTabBarStyle({ selectedColor: color }) }
