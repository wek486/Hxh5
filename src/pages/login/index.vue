<script setup lang="ts">
import { ref } from 'vue'
import { hx } from '../../api/hx'
import { login, notify } from '../../stores/gallery'
const username = ref(''), password = ref(''), registering = ref(false), busy = ref(false)
async function submit() {
  if (busy.value) return
  if (!username.value.trim() || !password.value) return notify(new Error('请输入用户名和密码'))
  busy.value = true
  try {
    if (registering.value) {
      await hx.register(username.value.trim(), password.value)
      registering.value = false
    }
    await login(username.value.trim(), password.value)
    uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/account/index' }) })
  } catch (err) { notify(err) }
  finally { busy.value = false }
}
</script>

<template>
  <view class="page safe-bottom">
    <view class="section-title">{{ registering ? '注册 HX 账号' : '登录 HX' }}</view>
    <text class="form-label">用户名</text>
    <uni-easyinput v-model="username" placeholder="请输入用户名" />
    <text class="form-label">密码</text>
    <uni-easyinput v-model="password" type="password" placeholder="请输入密码" @confirm="submit" />
    <button class="primary submit" :loading="busy" :disabled="busy" @tap="submit">{{ registering ? '注册并登录' : '登录' }}</button>
    <button class="outline switch" :disabled="busy" @tap="registering = !registering">{{ registering ? '已有账号，去登录' : '没有账号，去注册' }}</button>
  </view>
</template>

<style scoped>
.submit { margin-top: 48rpx; }
.switch { margin-top: 20rpx; }
</style>
