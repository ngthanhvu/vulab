<template>
  <div class="login-page">
    <el-card class="login-card" shadow="always">
      <template #header>
        <div class="login-header">
          <h2>Đăng nhập hệ thống</h2>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="loginForm" label-position="top" @submit.prevent="handleLogin">
        <el-form-item label="Tên đăng nhập" prop="username">
          <el-input v-model="form.username" placeholder="Nhập tên đăng nhập" />
        </el-form-item>

        <el-form-item label="Mật khẩu" prop="password">
          <el-input v-model="form.password" type="password" placeholder="Nhập mật khẩu" show-password />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin" class="login-button">
            Đăng nhập
          </el-button>
        </el-form-item>
      </el-form>

      <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()
const loading = ref(false)
const error = ref('')
const loginForm = ref()

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: 'Vui lòng nhập tên đăng nhập', trigger: 'blur' }],
  password: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }],
}

async function handleLogin() {
  error.value = ''
  const valid = await loginForm.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await login({ username: form.username, password: form.password })
    router.push('/')
  } catch (err: any) {
    error.value = err?.message || 'Đăng nhập thất bại'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f2f6fc;
}

.login-card {
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
}

.login-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.login-button {
  width: 100%;
}
</style>
