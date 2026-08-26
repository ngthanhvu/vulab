import { ref, computed } from 'vue'
import type { Router } from 'vue-router'

interface LoginPayload {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    username: string
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || ''
const TOKEN_KEY = 'admin_token'
const isAuthenticated = ref(!!localStorage.getItem(TOKEN_KEY))

export function useAuth() {
  const token = computed(() => localStorage.getItem(TOKEN_KEY))
  const loggedIn = computed(() => isAuthenticated.value && !!token.value)

  function setToken(newToken: string) {
    localStorage.setItem(TOKEN_KEY, newToken)
    isAuthenticated.value = true
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY)
    isAuthenticated.value = false
  }

  async function login(payload: LoginPayload): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Đăng nhập thất bại' }))
      throw new Error(error.message || 'Đăng nhập thất bại')
    }

    const data: LoginResponse = await response.json()
    setToken(data.token)
  }

  function logout(router?: Router) {
    clearToken()
    if (router) {
      router.push('/login')
    } else {
      window.location.href = '/login'
    }
  }

  function getAuthHeaders(): Record<string, string> {
    const t = token.value
    return t ? { Authorization: `Bearer ${t}` } : {}
  }

  return {
    isAuthenticated: loggedIn,
    token,
    login,
    logout,
    setToken,
    clearToken,
    getAuthHeaders,
  }
}
