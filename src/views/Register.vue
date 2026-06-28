<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>注册</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <input v-model="form.username" type="text" placeholder="用户名（登录用）" required />
        </div>
        <div class="form-group">
          <input v-model="form.nickname" type="text" placeholder="昵称（显示用）" required />
        </div>
        <div class="form-group">
          <input v-model="form.password" type="password" placeholder="密码（至少6位）" required />
        </div>
        <button type="submit" :disabled="loading">{{ loading ? '注册中...' : '注册' }}</button>
        <p>已有账号？<router-link to="/login">立即登录</router-link></p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({ username: '', nickname: '', password: '' })
const loading = ref(false)

const handleRegister = async () => {
  if (form.password.length < 6) {
    alert('密码至少6位')
    return
  }
  loading.value = true
  try {
    await userStore.register(form.username, form.nickname, form.password)
    alert('注册成功！')
    router.push('/')
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 与 Login.vue 样式相同 */
.auth-container { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
.auth-card { background: white; padding: 40px; border-radius: 16px; width: 100%; max-width: 360px; text-align: center; }
.form-group { margin-bottom: 16px; }
input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
button { width: 100%; padding: 12px; background: #111; color: white; border: none; border-radius: 40px; cursor: pointer; }
a { color: #111; }
</style>