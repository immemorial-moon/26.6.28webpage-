import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Forum from '../views/Forum.vue'
import PostDetail from '../views/PostDetail.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/forum',
    name: 'Forum',
    component: Forum
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')  // 懒加载
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('../views/Stats.vue')
  },
  { path: '/post/:id', 
    name: 'PostDetail', 
    component: PostDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
  // 不需要登录就能访问的页面
  const publicPages = ['/', '/login', '/register','/forum']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired) {
    const token = localStorage.getItem('forum_token')
    if (!token) {
      // 未登录，跳转到登录页
      next('/login')
      return
    }
  }
  next()
})

export default router