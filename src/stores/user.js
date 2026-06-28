import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 环境自适应 API 地址
const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:3000'   // 本地开发
  : '/api'                     // 生产环境（通过 Nginx 代理）

console.log('当前环境:', import.meta.env.DEV ? '开发环境' : '生产环境')
console.log('API_BASE:', API_BASE)

export const useUserStore = defineStore('user', () => {
  // 从 localStorage 恢复登录状态
  const token = ref(localStorage.getItem('forum_token') || '')
  const user = ref(JSON.parse(localStorage.getItem('forum_user') || 'null'))

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const nickname = computed(() => user.value?.nickname || '')
  const username = computed(() => user.value?.username || '')

  // 保存登录状态到 localStorage
  const setAuth = (newToken, userData) => {
    token.value = newToken
    user.value = userData
    localStorage.setItem('forum_token', newToken)
    localStorage.setItem('forum_user', JSON.stringify(userData))
  }

  // 清除登录状态
  const clearAuth = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('forum_token')
    localStorage.removeItem('forum_user')
  }

  // 登录（修复：使用 API_BASE）
  const login = async (username, password) => {
    const url = `${API_BASE}/api/auth/login`
    console.log('登录请求URL:', url)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.message)
    }

    setAuth(result.data.token, {
      id: result.data.id,
      username: result.data.username,
      nickname: result.data.nickname
    })

    return result
  }

  // 注册（修复：使用 API_BASE）
  const register = async (username, nickname, password) => {
    const url = `${API_BASE}/api/auth/register`
    console.log('注册请求URL:', url)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, nickname, password })
    })

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.message)
    }

    setAuth(result.data.token, {
      id: result.data.id,
      username: result.data.username,
      nickname: result.data.nickname
    })

    return result
  }

  // 退出
  const logout = () => {
    clearAuth()
  }

  // 验证当前 token 是否有效
  const verifyToken = async () => {
    if (!token.value) return false

    try {
      const url = `${API_BASE}/api/auth/me`
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token.value}` }
      })
      const result = await response.json()
      return result.success
    } catch {
      return false
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    nickname,
    username,
    login,
    register,
    logout,
    verifyToken,
    setAuth,
    clearAuth
  }
})