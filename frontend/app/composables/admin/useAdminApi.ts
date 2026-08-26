export interface SystemMemory {
  total: number
  used: number
  free: number
  percentage: number
  formatted: {
    total: string
    used: string
    free: string
  }
}

export interface SystemCpu {
  model: string
  cores: number
  loadAverage: number[]
}

export interface SystemUptime {
  seconds: number
  formatted: string
}

export interface SystemPlatform {
  type: string
  release: string
  arch: string
  hostname: string
}

export interface SystemInfo {
  uptime: SystemUptime
  memory: SystemMemory
  cpu: SystemCpu
  platform: SystemPlatform
  timestamp: string
}

export function useAdminApi() {
  async function fetchSystemInfo(): Promise<SystemInfo> {
    const res = await fetch('/api/admin/system')
    if (!res.ok) {
      throw new Error(`Failed to fetch system info: ${res.status}`)
    }
    return res.json()
  }

  return {
    fetchSystemInfo,
  }
}
