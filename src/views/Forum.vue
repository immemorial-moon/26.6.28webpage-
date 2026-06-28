<template>
  <div class="forum-container">
    <div class="forum-header">
      <h1>论坛</h1>
      <button @click="showCreateModal = true" class="create-post-btn">
        ✍️ 发布新帖子
      </button>
    </div>

    <!-- 帖子列表 -->
    <div class="posts-list">
      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else-if="posts.length === 0" class="empty-state">
        暂无帖子，快来发布第一篇吧！
      </div>
      <div v-else>
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="post-item"
          @click="viewPost(post.id)"
        >
          <div class="post-title">{{ post.title }}</div>
          <div class="post-meta">
            <span class="post-author">{{ post.nickname || post.username }}</span>
            <span class="post-time">{{ formatTime(post.created_at) }}</span>
            <span class="post-stats">
               {{ post.reply_count || 0 }} 回复 |  {{ post.view_count || 0 }} 浏览
            </span>
          </div>
          <div class="post-preview">{{ truncate(post.content, 150) }}</div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
      >上一页</button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
      >下一页</button>
    </div>

    <!-- 发帖弹窗 -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content">
        <h2>发布新帖子</h2>
        <input 
          v-model="newPost.title" 
          type="text" 
          placeholder="标题" 
          class="modal-input"
          maxlength="100"
        />
        <textarea 
          v-model="newPost.content" 
          placeholder="内容" 
          rows="6" 
          class="modal-textarea"
        ></textarea>
        <div class="modal-buttons">
          <button @click="showCreateModal = false" class="cancel-btn">取消</button>
          <button @click="createPost" :disabled="creating" class="submit-btn">
            {{ creating ? '发布中...' : '发布' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : '/api'

const posts = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)

const showCreateModal = ref(false)
const creating = ref(false)
const newPost = ref({ title: '', content: '' })

// 加载帖子列表
const loadPosts = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/api/posts?page=${currentPage.value}&pageSize=20`)
    const result = await response.json()
    if (result.success) {
      posts.value = result.data
      totalPages.value = Math.ceil(result.total / 20)
    }
  } catch (error) {
    console.error('加载帖子失败:', error)
  } finally {
    loading.value = false
  }
}

// 查看帖子
const viewPost = (postId) => {
  router.push(`/post/${postId}`)
}

// 发布帖子
const createPost = async () => {
  if (!userStore.isLoggedIn) {
    alert('请先登录')
    router.push('/login')
    return
  }
  
  if (!newPost.value.title.trim()) {
    alert('请输入标题')
    return
  }
  
  if (!newPost.value.content.trim()) {
    alert('请输入内容')
    return
  }
  
  creating.value = true
  try {
    const response = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({
        title: newPost.value.title,
        content: newPost.value.content
      })
    })
    
    const result = await response.json()
    if (result.success) {
      showCreateModal.value = false
      newPost.value = { title: '', content: '' }
      await loadPosts()
    } else {
      alert(result.message)
    }
  } catch (error) {
    alert('发布失败')
  } finally {
    creating.value = false
  }
}

// 切换页面
const changePage = (page) => {
  currentPage.value = page
  loadPosts()
}

// 格式化时间
const formatTime = (time) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

// 截断文本
const truncate = (text, length) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.forum-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
}

.forum-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 500;
}

.create-post-btn {
  padding: 10px 20px;
  background: #111;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-size: 14px;
}

.create-post-btn:hover {
  background: #333;
}

.post-item {
  background: white;
  border: 1px solid #eef2f5;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.post-item:hover {
  border-color: #ddd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.post-title {
  font-size: 18px;
  font-weight: 500;
  color: #111;
  margin-bottom: 8px;
}

.post-meta {
  font-size: 13px;
  color: #888;
  margin-bottom: 10px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.post-preview {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
  align-items: center;
}

.pagination button {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
}

.modal-content h2 {
  margin: 0 0 20px 0;
}

.modal-input, .modal-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.modal-textarea {
  resize: vertical;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 10px 20px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.submit-btn {
  padding: 10px 20px;
  background: #111;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>