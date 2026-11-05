<script setup lang="ts">
import { ref } from 'vue'
import { hx } from '../../api/hx'
import { requireLogin, logout, openLogin, notify } from '../../stores/gallery'
const oldPassword = ref(''), newPassword = ref(''), confirmPassword = ref(''), busy = ref(false)
async function submit() {
  if (busy.value || !requireLogin()) return
  if (!oldPassword.value) return notify(new Error('请输入当前密码'))
  if (newPassword.value.length < 8 || newPassword.value.length > 64) return notify(new Error('新密码须为8～64位'))
  if (newPassword.value !== confirmPassword.value) return notify(new Error('两次输入的新密码不一致'))
  busy.value = true
  try {
    await hx.password(oldPassword.value, newPassword.value)
    logout()
    uni.showToast({ title: '密码已修改，请重新登录', icon: 'none' })
    uni.navigateBack({ success: openLogin, fail: () => uni.redirectTo({ url: '/pages/login/index' }) })
  } catch (err) { notify(err) }
  finally { busy.value = false }
}
</script>
<template><view class="page safe-bottom"><view class="intro">设置新的登录密码</view><view class="muted">为你的账号保留一份安心</view><text class="form-label">当前密码</text><uni-easyinput v-model="oldPassword" type="password" placeholder="请输入当前密码" :maxlength="64" /><text class="form-label">新密码</text><uni-easyinput v-model="newPassword" type="password" placeholder="请输入8～64位新密码" :maxlength="64" /><text class="form-label">确认新密码</text><uni-easyinput v-model="confirmPassword" type="password" placeholder="再次输入新密码" :maxlength="64" /><button class="primary save"  :disabled="busy" @tap="submit">确认修改</button></view></template>
<style scoped>.intro{font-size:38rpx;font-weight:600;margin:24rpx 0 16rpx}.save{margin-top:48rpx}</style>
