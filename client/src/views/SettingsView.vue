<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>Cài đặt</span>
      </div>
    </template>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="Thông tin hệ thống" name="system">
        <el-card shadow="never" v-loading="loading.system">
          <template #header>
            <div class="card-header">
              <span>Thông tin máy chủ</span>
              <el-button type="primary" size="small" @click="fetchSystem" :loading="loading.system">Làm mới</el-button>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Hostname"> {{ system.platform.hostname }} </el-descriptions-item>
            <el-descriptions-item label="Platform"> {{ system.platform.type }} {{ system.platform.arch }} </el-descriptions-item>
            <el-descriptions-item label="Release"> {{ system.platform.release }} </el-descriptions-item>
            <el-descriptions-item label="CPU"> {{ system.cpu.model }} ({{ system.cpu.cores }} cores) </el-descriptions-item>
            <el-descriptions-item label="Memory"> {{ system.memory.formatted.used }} / {{ system.memory.formatted.total }} </el-descriptions-item>
            <el-descriptions-item label="Uptime"> {{ system.uptime.formatted }} </el-descriptions-item>
            <el-descriptions-item label="Timestamp"> {{ systemTimestamp }} </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="Đổi mật khẩu" name="password">
        <el-card shadow="never" style="max-width: 500px;">
          <template #header>
            <span>Đổi mật khẩu</span>
          </template>
          <el-form :model="passwordForm" label-position="top">
            <el-form-item label="Mật khẩu hiện tại">
              <el-input v-model="passwordForm.currentPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="Mật khẩu mới">
              <el-input v-model="passwordForm.newPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="Xác nhận mật khẩu mới">
              <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitChangePassword" :loading="loading.password">Lưu</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="Cấu hình chung" name="app">
        <el-card shadow="never" style="max-width: 500px;">
          <template #header>
            <span>Cấu hình ứng dụng</span>
          </template>
          <el-form :model="settingsForm" label-position="top">
            <el-form-item label="Tên ứng dụng">
              <el-input v-model="settingsForm.appName" />
            </el-form-item>
            <el-form-item label="Ngôn ngữ">
              <el-select v-model="settingsForm.language" style="width: 100%">
                <el-option label="Tiếng Việt" value="vi" />
                <el-option label="English" value="en" />
              </el-select>
            </el-form-item>
            <el-form-item label="Múi giờ">
              <el-select v-model="settingsForm.timezone" style="width: 100%">
                <el-option label="Asia/Ho_Chi_Minh" value="Asia/Ho_Chi_Minh" />
                <el-option label="UTC" value="UTC" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitSettings" :loading="loading.settings">Lưu</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSettings } from '@/composables/useSettings'

interface SystemInfo {
  uptime: { seconds: number; formatted: string }
  memory: {
    total: number
    used: number
    free: number
    percentage: number
    formatted: { total: string; used: string; free: string }
  }
  cpu: { model: string; cores: number; loadAverage: number[] }
  platform: { type: string; release: string; arch: string; hostname: string }
  timestamp: string
}

const { getSettings, updateSettings, changePassword } = useSettings()

const activeTab = ref('system')
const loading = ref({
  system: false,
  password: false,
  settings: false,
})

const system = ref<SystemInfo>({
  uptime: { seconds: 0, formatted: '-' },
  memory: { total: 0, used: 0, free: 0, percentage: 0, formatted: { total: '-', used: '-', free: '-' } },
  cpu: { model: '', cores: 0, loadAverage: [] },
  platform: { type: '', release: '', arch: '', hostname: '' },
  timestamp: '',
})

const systemTimestamp = computed(() => {
  if (!system.value.timestamp) return '-'
  return new Date(system.value.timestamp).toLocaleString('vi-VN')
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const settingsForm = ref({
  appName: 'Admin Dashboard',
  language: 'vi',
  timezone: 'Asia/Ho_Chi_Minh',
})

async function fetchSystem() {
  loading.value.system = true
  try {
    const res = await fetch('/api/admin/system')
    if (!res.ok) throw new Error('Lấy thông tin hệ thống thất bại')
    system.value = await res.json()
  } catch (err: any) {
    ElMessage.error(err.message || 'Lỗi khi tải thông tin hệ thống')
  } finally {
    loading.value.system = false
  }
}

async function fetchSettings() {
  loading.value.settings = true
  try {
    const settings = await getSettings()
    settingsForm.value = {
      appName: settings.appName || 'Admin Dashboard',
      language: settings.language || 'vi',
      timezone: settings.timezone || 'Asia/Ho_Chi_Minh',
    }
  } catch (err: any) {
    ElMessage.error(err.message || 'Li khi tải cấu hình')
  } finally {
    loading.value.settings = false
  }
}

async function submitChangePassword() {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    ElMessage.warning('Vui lòng nhập đầy đủ mật khẩu')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.warning('Mật khẩu mới không khớp')
    return
  }

  loading.value.password = true
  try {
    await changePassword(passwordForm.value.currentPassword, passwordForm.value.newPassword)
    ElMessage.success('Đổi mật khẩu thành công')
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err: any) {
    ElMessage.error(err.message || 'Đổi mật khẩu thất bại')
  } finally {
    loading.value.password = false
  }
}

async function submitSettings() {
  loading.value.settings = true
  try {
    await updateSettings({ ...settingsForm.value })
    ElMessage.success('Cập nhật cấu hình thành công')
  } catch (err: any) {
    ElMessage.error(err.message || 'Cập nhật cấu hình thất bại')
  } finally {
    loading.value.settings = false
  }
}

onMounted(() => {
  fetchSystem()
  fetchSettings()
})
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
