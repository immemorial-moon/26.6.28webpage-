<template>
  <div id="app">
    <!-- 顶栏组件 -->
    <AppHeader />
    
    <!-- 路由视图 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import { onMounted } from 'vue'

// 记录访问
const recordVisit = async () => {
  try {
    const API_BASE = import.meta.env.DEV 
      ? 'http://localhost:3000' 
      : '/api'
    
    await fetch(`${API_BASE}/api/stats/record`, {
      method: 'POST'
    })
  } catch (error) {
    console.error('记录访问失败:', error)
  }
}

onMounted(() => {
  recordVisit()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
}
</style>