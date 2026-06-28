<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo 和站点名称（可选，目前隐藏） -->
      <!--
      <div class="logo-area" @click="goHome">
        <span class="logo"></span>
        <span class="site-name">同人网站</span>
      </div>
      -->
      
      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          首页
        </router-link>
        <router-link to="/forum" class="nav-link" :class="{ active: $route.path === '/forum' }">
          论坛
        </router-link>
      </nav>

      <!-- 用户状态区域（未实现登录） -->
      <div class="user-area">
        <div v-if="isLoggedIn" class="user-status logged">
          <span class="user-icon">👤</span>
          <span class="user-text">{{ nickname }}</span>
          <button @click="handleLogout" class="user-btn logout-btn">退出</button>
        </div>
        <div v-else class="user-status">
          <span class="user-icon">👤</span>
          <span class="user-text guest" @click="goToLogin">未登录</span>
          <div class="auth-buttons">
            <button @click="goToLogin" class="user-btn login-btn">登录</button>
            <button @click="goToRegister" class="user-btn register-btn">注册</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const nickname = computed(() => userStore.nickname)

// 跳转首页（保留以备后续启用 Logo）
const goHome = () => {
  router.push('/')
}

// 跳转登录页
const goToLogin = () => {
  // 保存当前路径，登录后跳转回来
  router.push({ path: '/login', query: { redirect: route.fullPath } })
}

// 跳转注册页
const goToRegister = () => {
  router.push({ path: '/register', query: { redirect: route.fullPath } })
}

// 退出登录
const handleLogout = async () => {
  await userStore.logout()
  alert('已退出登录')
  // 刷新当前页面
  router.go(0)
}
</script>

<style scoped>
/* ---------- 顶栏容器（中性简约） ---------- */
.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeef2;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(0px);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

/* ---------- Logo 区域（目前隐藏，保留样式） ---------- */
.logo-area {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.logo-area:hover {
  opacity: 0.7;
}

.logo {
  font-size: 24px;
}

.site-name {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0;
  color: #111;
}

/* ---------- 导航菜单 ---------- */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  color: #3a3a3a;
  text-decoration: none;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 450;
  border-radius: 40px;
  transition: all 0.2s ease;
  background-color: transparent;
}

.nav-link:hover {
  background-color: #f2f4f6;
  color: #000;
}

.nav-link.active {
  background-color: #111;
  color: white;
  font-weight: 470;
}

/* ---------- 用户区域 ---------- */
.user-area {
  display: flex;
  align-items: center;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 100px;
  background-color: #f5f7f9;
  font-size: 14px;
  color: #1f1f1f;
  transition: background 0.2s;
}

.user-status.logged {
  background-color: #eef2f5;
}

.user-icon {
  font-size: 16px;
  opacity: 0.8;
}

.user-text {
  font-weight: 460;
  color: #222;
}

.user-btn {
  background: none;
  border: none;
  padding: 4px 12px;
  border-radius: 32px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 460;
  transition: all 0.2s ease;
  margin-left: 4px;
}

.login-btn {
  background-color: #111;
  color: white;
}

.login-btn:hover {
  background-color: #333;
  transform: translateY(-1px);
}

.logout-btn {
  background-color: transparent;
  color: #555;
  border: 1px solid #ddd;
}

.logout-btn:hover {
  background-color: #f5f5f5;
  border-color: #bbb;
}

/* ---------- 响应式 ---------- */
@media (max-width: 680px) {
  .header-container {
    padding: 0 16px;
    height: 56px;
    gap: 12px;
  }
  .nav-link {
    padding: 6px 12px;
    font-size: 14px;
  }
  .user-status {
    padding: 4px 10px;
    gap: 6px;
  }
  .user-text {
    font-size: 12px;
  }
  .user-btn {
    padding: 3px 10px;
    font-size: 11px;
  }
}

@media (max-width: 520px) {
  .header-container {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 16px;
  }
  .nav-menu {
    order: 1;
    width: 100%;
    justify-content: center;
  }
  .user-area {
    order: 2;
  }
}
</style>