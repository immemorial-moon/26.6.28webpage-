<template>
  <div class="stats-container">
    <div class="stats-header">
      <h1>数据统计</h1>
      <p>网站访问数据分析</p>
    </div>

    <div class="stats-grid">
      <!-- 总访问人数卡片 -->
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <div class="stat-value">{{ totalVisits }}</div>
          <div class="stat-label">总访问人数</div>
        </div>
      </div>

      <!-- 今日访问人数卡片 -->
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <div class="stat-value">{{ todayVisits }}</div>
          <div class="stat-label">今日访问人数</div>
        </div>
      </div>
    </div>

    <div class="stats-note">
      <p>※ 统计数据从 2025年5月2日 开始记录</p>
      <p>※ 每个独立访客每天只计数一次</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const totalVisits = ref(0)
const todayVisits = ref(0)
const loading = ref(true)

const loadStats = async () => {
  try {
    const API_BASE = import.meta.env.DEV 
      ? 'http://localhost:3000' 
      : '/api'
    
    const response = await fetch(`${API_BASE}/api/stats/get`)
    const result = await response.json()
    
    if (result.success) {
      totalVisits.value = result.data.total
      todayVisits.value = result.data.today
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.stats-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.stats-header {
  text-align: center;
  margin-bottom: 48px;
}

.stats-header h1 {
  font-size: 32px;
  font-weight: 500;
  color: #111;
  margin-bottom: 8px;
}

.stats-header p {
  color: #666;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 48px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 36px;
  font-weight: 600;
  color: #111;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

.stats-note {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 16px 20px;
}

.stats-note p {
  font-size: 13px;
  color: #888;
  margin: 4px 0;
}

@media (max-width: 600px) {
  .stats-container {
    padding: 24px 16px;
  }
  
  .stats-header h1 {
    font-size: 28px;
  }
  
  .stat-card {
    padding: 24px 20px;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .stat-icon {
    font-size: 36px;
  }
}
</style>