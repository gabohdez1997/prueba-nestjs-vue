import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

// Guard para rutas protegidas
const requireAuth = (to: any, from: any, next: any) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    next()
  } else {
    next('/login')
  }
}

// Guard para rutas de invitados (login/register)
const requireGuest = (to: any, from: any, next: any) => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    next()
  } else {
    next('/dashboard')
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: requireGuest
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: requireGuest
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      beforeEnter: requireAuth
    }
  ],
})

export default router
