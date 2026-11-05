<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { profile, signedIn, logout, openLogin, syncAccount, tabColor, errorText, placeholder } from '../../stores/gallery'
import { mediaUrl } from '../../utils/axios'
const error = ref('')
async function refresh() {
  error.value = ''
  try { await syncAccount() } catch (err) { error.value = errorText(err) }
}
onShow(() => { tabColor(); void refresh() })
function open(page: string) { uni.navigateTo({ url: `/pages/${page}/index` }) }
function likes() { uni.switchTab({ url: '/pages/likes/index' }) }
function confirmLogout() {
  uni.showModal({ title: '退出登录', content: '确定退出当前账号？', success: result => { if (result.confirm) logout() } })
}
</script>
<template><view><view v-if="!signedIn" class="empty"><button class="primary" @tap="openLogin">登录 / 注册</button></view><view v-else-if="error" class="empty" @tap="refresh">{{ error }} · 点击重试</view><uni-load-more v-else-if="!profile" status="loading" /><view v-else><view class="profile-header"><image class="backdrop" :src="mediaUrl(profile.avatarUrl) || placeholder" mode="aspectFill" /><view class="wash" /><view class="profile"><image class="avatar" :src="mediaUrl(profile.avatarUrl) || placeholder" mode="aspectFill" /><view class="profile-text"><view class="nickname">{{ profile.nickname || profile.username }}</view><view class="bio">{{ profile.bio }}</view></view></view></view><view class="page"><view class="stats"><view @tap="open('follows')"><view class="muted">关注</view><view class="number">{{ profile.followingCount }}</view></view><view @tap="likes"><view class="muted">点赞</view><view class="number">{{ profile.likesCount }}</view></view><view><view class="muted">评论</view><view class="number">{{ profile.commentsCount }}</view></view></view><view class="menu-card"><uni-list :border="false"><uni-list-item title="我的关注" :show-extra-icon="true" :extra-icon="{ type: 'personadd', color: '#303744', size: '22' }" show-arrow clickable @click="open('follows')" /></uni-list></view><view class="menu-card"><uni-list :border="false"><uni-list-item title="编辑资料" :show-extra-icon="true" :extra-icon="{ type: 'compose', color: '#303744', size: '22' }" show-arrow clickable @click="open('profile')" /><uni-list-item title="修改密码" :show-extra-icon="true" :extra-icon="{ type: 'locked', color: '#303744', size: '22' }" show-arrow clickable @click="open('password')" /><uni-list-item title="退出登录" :show-extra-icon="true" :extra-icon="{ type: 'redo', color: '#303744', size: '22' }" show-arrow clickable @click="confirmLogout" /></uni-list></view><view class="demo-note">HX · 收集每一次心动</view></view></view></view></template>
<style scoped>.profile-header{position:relative;height:300rpx;overflow:hidden}.backdrop,.wash{position:absolute;inset:0;width:100%;height:100%}.backdrop{opacity:.48}.wash{background:linear-gradient(180deg,rgba(255,255,255,.05),#fff)}.profile{position:absolute;left:36rpx;right:36rpx;bottom:28rpx;display:flex;align-items:center;gap:24rpx}.avatar{width:142rpx;height:142rpx;border:6rpx solid #fff;border-radius:50%;flex-shrink:0}.profile-text{min-width:0}.nickname{font-size:42rpx;font-weight:700}.bio{font-size:25rpx;color:#697383;margin-top:10rpx;line-height:1.6;word-break:break-all}.stats{display:flex;justify-content:space-around;text-align:center;padding:12rpx 0 48rpx}.stats>view{flex:1;border-right:1rpx solid #edf0f5}.stats>view:last-child{border:none}.number{font-size:40rpx;font-weight:650;margin-top:10rpx}.menu-card{overflow:hidden;border:1rpx solid #edf0f5;border-radius:28rpx;margin-bottom:24rpx;box-shadow:0 8rpx 32rpx rgba(35,58,92,.04)}</style>
