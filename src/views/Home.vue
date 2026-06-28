<template>
  <div class="home">
    <!-- 中性简约风格的主视觉区 -->
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">欢迎来到个人站点</h1>
        <p class="hero-subtitle">这里放点文字显得有设计感</p>
        <div class="hero-buttons">
          <router-link to="/forum" class="btn-primary">
            进入论坛
          </router-link>
          <button @click="showFeatureTip" class="btn-secondary">
            了解更多
          </button>
        </div>
      </div>
    </div>

    <!-- 功能区块 -->
    <div class="section">
      <h2 class="section-title">功能</h2>
      <div class="cards-grid">
        <div class="card" @click="navigateTo('/forum')">
          <div class="card-icon">(·A·)</div>
          <h3 class="card-title">互动论坛</h3>
          <p class="card-desc">发表留言，参与讨论。</p>
        </div>
        <div class="card" @click="navigateTo('/stats')">
          <div class="card-icon">(QAQ)</div>
          <h3 class="card-title">数据统计</h3>
          <p class="card-desc">网站分析与洞察。</p>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}

const showFeatureTip = () => {
  alert('该功能正在开发中，敬请期待！')
}


</script>

<style scoped>
/* ---------- 全局重置 ---------- */
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1a1a1a;
  background-color: #ffffff;
}

/* ---------- 辅助/动画 ---------- */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.home {
  animation: fadeIn 0.4s ease-out;
}

/* ---------- 主视觉 (中性极简) ---------- */
.hero {
  background-color: #f5f5f5;
  border-radius: 24px;
  padding: 64px 32px;
  margin-bottom: 80px;
  text-align: center;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 44px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 16px 0;
  color: #111;
}

.hero-subtitle {
  font-size: 18px;
  line-height: 1.5;
  color: #555;
  margin: 0 0 32px 0;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 10px 28px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 40px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: none;
  display: inline-block;
  font-family: inherit;
}

.btn-primary {
  background-color: #111;
  color: white;
}

.btn-primary:hover {
  background-color: #333;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: transparent;
  color: #444;
  border: 1px solid #ccc;
}

.btn-secondary:hover {
  border-color: #888;
  background-color: #fafafa;
  transform: translateY(-1px);
}

/* ---------- 通用区块 ---------- */
.section {
  margin-bottom: 72px;
}

.section-title {
  font-size: 24px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 32px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #eaeaea;
  text-align: left;
  letter-spacing: -0.2px;
}

/* ---------- 卡片网格 (中性克制) ---------- */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

.card {
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: #d0d0d0;
  background-color: #fefefe;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
}

.card-icon {
  font-size: 40px;
  margin-bottom: 20px;
  opacity: 0.8;
}

.card-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 10px 0;
  color: #111;
}

.card-desc {
  font-size: 14px;
  line-height: 1.5;
  color: #5c5c5c;
  margin: 0;
}

/* ---------- 动态列表 ---------- */
.activity-list {
  border: 1px solid #f0f0f0;
  border-radius: 20px;
  background: #fff;
  overflow: hidden;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background-color: #fafafa;
}

.activity-icon {
  font-size: 22px;
  opacity: 0.6;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin: 0 0 6px 0;
  font-size: 15px;
  color: #2c2c2c;
}

.activity-time {
  font-size: 12px;
  color: #8c8c8c;
  letter-spacing: 0.2px;
}

/* ---------- 移动端适配 ---------- */
@media (max-width: 768px) {
  .home {
    padding: 24px 16px;
  }
  .hero {
    padding: 48px 20px;
    margin-bottom: 56px;
  }
  .hero-title {
    font-size: 32px;
  }
  .hero-subtitle {
    font-size: 16px;
  }
  .section {
    margin-bottom: 56px;
  }
  .section-title {
    font-size: 20px;
  }
  .card {
    padding: 24px 16px;
  }
  .activity-item {
    padding: 16px;
  }
}
</style>