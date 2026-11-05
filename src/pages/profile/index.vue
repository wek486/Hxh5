<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { hx, type Profile } from '../../api/hx'
import { mediaUrl, uploadAvatar } from '../../utils/axios'
import { profile, requireLogin, notify, placeholder } from '../../stores/gallery'
const nickname = ref(''), bio = ref(''), busy = ref(false)
onLoad(() => {
  nickname.value = profile.value?.nickname || profile.value?.username || ''
  bio.value = profile.value?.bio || ''
})
async function save() {
  if (busy.value || !requireLogin()) return
  if (!nickname.value.trim()) { notify(new Error('请输入昵称')); return }
  busy.value = true
  try {
    profile.value = await hx.updateProfile(nickname.value.trim(), bio.value.trim())
    uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/account/index' }) })
  } catch (err) { notify(err) }
  finally { busy.value = false }
}
function chooseAvatar() {
  if (busy.value || !requireLogin()) return
  uni.chooseImage({ count: 1, sizeType: ['compressed'], async success(result) {
    const path = result.tempFilePaths[0]
    if (!path) return
    busy.value = true
    try { profile.value = await uploadAvatar<Profile>(path) }
    catch (err) { notify(err) }
    finally { busy.value = false }
  } })
}
</script>
<template><view class="page safe-bottom"><view class="avatar-area"><image :src="mediaUrl(profile?.avatarUrl) || placeholder" mode="aspectFill" class="avatar" /><button class="outline" size="mini" :disabled="busy" @tap="chooseAvatar">更换头像</button></view><text class="form-label">昵称</text><uni-easyinput v-model="nickname" placeholder="给自己起一个昵称" :maxlength="32" /><text class="form-label">简介</text><uni-easyinput v-model="bio" type="textarea" placeholder="介绍一下自己吧" :maxlength="200" /><view class="counter muted">{{ bio.length }}/200</view><button class="primary save"  :disabled="busy" @tap="save">保存修改</button></view></template>
<style scoped>.avatar-area{text-align:center;padding:36rpx}.avatar{width:150rpx;height:150rpx;border-radius:50%;display:block;margin:0 auto 18rpx}.counter{text-align:right;margin-top:12rpx}.save{margin-top:48rpx}</style>
