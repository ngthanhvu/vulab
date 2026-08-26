import { useAuth } from './useAuth'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export interface AppSettings {
  appName?: string
  language?: string
  timezone?: string
  [key: string]: string | undefined
}

export function useSettings() {
  const { getAuthHeaders } = useAuth()

  async function getSettings(): Promise<AppSettings> {
    const res = await fetch(`${API_BASE_URL}/api/settings`, {
      headers: { ...getAuthHeaders() },
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Lấy cấu hình thất bại' }))
      throw new Error(error.message || 'Lấy cấu hình thất bại')
    }
    return res.json()
  }

  async function updateSettings(settings: AppSettings): Promise<AppSettings> {
    const res = await fetch(`${API_BASE_URL}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(settings),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Cập nhật cấu hình thất bại' }))
      throw new Error(error.message || 'Cập nhật cấu hình thất bại')
    }
    return res.json()
  }

  async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Đổi mật khẩu thất bại' }))
      throw new Error(error.message || 'Đổi mật khẩu thất bại')
    }
  }

  return {
    getSettings,
    updateSettings,
    changePassword,
  }
}
