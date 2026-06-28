<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>登录</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input v-model="form.username" type="text" placeholder="用户名" required />
        </div>
        <div class="form-group">
          <input v-model="form.password" type="password" placeholder="密码" required />
        </div>
        <button type="submit" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
        <p>没有账号？<router-link to="/register">立即注册</router-link></p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({ username: '', password: '' })
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    // 登录成功后跳转到之前访问的页面，默认跳转首页
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

// 跳转注册页（保留 redirect 参数）
const goToRegister = () => {
  router.push({ path: '/register', query: { redirect: route.query.redirect } })
}
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 360px;
  text-align: center;
}

.form-group {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 12px;
  background: #111;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
}

a {
  color: #111;
}
</style>