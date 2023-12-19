import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView/HomeView.vue')
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('../views/ManageView/ManageView.vue')
    },
    {
      path: '/post',
      name: 'post',
      component: () => import('../views/PostView/PostView.vue')
    },
    {
      path: '/details',
      name: 'details',
      component: () => import('../views/PostDetailsView/PostDetailsView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView/AdminView.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView/ChatView.vue')
    }
  ]
})

export default router
