<template>
  <div class="post-detail-container">
    <div v-if="loading" class="loading-state">加载中...</div>
    <div v-else-if="!post" class="empty-state">帖子不存在</div>
    <div v-else>
      <!-- 帖子内容 -->
      <div class="post-content">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <span class="post-author">{{ post.nickname || post.username }}</span>
          <span class="post-time">{{ formatFullTime(post.created_at) }}</span>
          <span class="post-stats">👁️ {{ post.view_count }} 浏览</span>
        </div>
        <div class="post-body">{{ post.content }}</div>
      </div>

      <!-- 回复列表 -->
      <div class="replies-section">
        <h3>回复 ({{ replies.length }})</h3>
        <div v-if="replies.length === 0" class="empty-replies">
          暂无回复，抢沙发！
        </div>
        <div v-else class="replies-list">
          <div v-for="reply in replies" :key="reply.id" class="reply-item">
            <div class="reply-header">
              <strong>{{ reply.nickname || reply.username }}</strong>
              <span class="reply-time">{{ formatFullTime(reply.created_at) }}</span>
            </div>
            <div class="reply-body">{{ reply.content }}</div>
          </div>
        </div>
      </div>

      <!-- 回复表单 -->
      <div class="reply-form" v-if="userStore.isLoggedIn">
        <h4>发表回复</h4>
        <textarea 
          v-model="replyContent" 
          placeholder="写下你的回复..." 
          rows="4"
          class="reply-textarea"
        ></textarea>
        <button @click="submitReply" :disabled="replying" class="reply-btn">
          {{ replying ? '提交中...' : '提交回复' }}
        </button>
      </div>
      <div v-else class="login-tip">
        <router-link to="/login">登录</router-link> 后参与讨论
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : '/api'

const postId = route.params.id
const post = ref(null)
const replies = ref([])
const loading = ref(false)
const replying = ref(false)
const replyContent = ref('')

// 加载帖子详情
const loadPost = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/api/posts/${postId}`)
    const result = await response.json()
    if (result.success) {
      post.value = result.data.post
      replies.value = result.data.replies
    } else {
      alert('帖子不存在')
      router.push('/forum')
    }
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}

// 提交回复
const submitReply = async () => {
  if (!replyContent.value.trim()) {
    alert('请输入回复内容')
    return
  }
  
  replying.value = true
  try {
    const response = await fetch(`${API_BASE}/api/posts/${postId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ content: replyContent.value })
    })
    
    const result = await response.json()
    if (result.success) {
      replyContent.value = ''
      await loadPost() // 重新加载帖子，刷新回复列表
    } else {
      alert(result.message)
    }
  } catch (error) {
    alert('回复失败')
  } finally {
    replying.value = false
  }
}

// 格式化完整时间
const formatFullTime = (time) => {
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.post-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.post-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.post-title {
  font-size: 26px;
  font-weight: 500;
  margin: 0 0 16px 0;
}

.post-meta {
  font-size: 13px;
  color: #888;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.post-body {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.replies-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.replies-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
}

.reply-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-header {
  margin-bottom: 8px;
  display: flex;
  gap: 12px;
  align-items: baseline;
  flex-wrap: wrap;
}

.reply-header strong {
  color: #111;
}

.reply-time {
  font-size: 12px;
  color: #999;
}

.reply-body {
  font-size: 15px;
  line-height: 1.5;
  color: #444;
}

.reply-form {
  background: white;
  border-radius: 16px;
  padding: 30px;
}

.reply-form h4 {
  margin: 0 0 16px 0;
}

.reply-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}

.reply-btn {
  margin-top: 16px;
  padding: 10px 24px;
  background: #111;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
}

.login-tip {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 16px;
}

.login-tip a {
  color: #111;
  text-decoration: none;
  font-weight: 500;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty-replies {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>