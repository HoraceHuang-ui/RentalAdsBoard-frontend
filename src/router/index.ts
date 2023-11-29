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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
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
    }
  ]
})

export default router
