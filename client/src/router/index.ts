import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Đăng nhập', public: true },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { title: 'Trang chủ', requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/UsersView.vue'),
    meta: { title: 'Người dùng', requiresAuth: true },
  },
  {
    path: '/notepad',
    name: 'Notepad',
    component: () => import('@/views/NotepadView.vue'),
    meta: { title: 'Ghi chú', requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: 'Cài đặt', requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Auth guard middleware: redirect to /login if not authenticated
router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()
  const isPublic = to.meta?.public === true

  if (!isPublic && !isAuthenticated.value) {
    return next('/login')
  }

  if (to.path === '/login' && isAuthenticated.value) {
    return next('/')
  }

  next()
})

// Set <title> on navigation
router.beforeEach((to) => {
  const appTitle = 'Admin'
  const pageTitle = (to.meta?.title as string) ?? ''
  document.title = pageTitle ? `${pageTitle} | ${appTitle}` : appTitle
})

export default router
