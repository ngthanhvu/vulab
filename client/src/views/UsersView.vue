<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>Quản lý người dùng</span>
        <el-button type="primary" @click="openCreateDialog">Thêm người dùng</el-button>
      </div>
    </template>

    <el-table :data="users" v-loading="loading" row-key="id" border>
      <el-table-column prop="id" label="#" width="80" align="center" />
      <el-table-column prop="username" label="Tên đăng nhập" align="center" />
      <el-table-column label="Vai trò" align="center">
        <template #default="{ row }">
          <el-tag :type="row.role === 'master_admin' ? 'danger' : 'primary'" effect="dark">
            {{ row.role === 'master_admin' ? 'Master Admin' : 'Admin' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Ngày tạo" align="center">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" width="200" align="center">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">Sửa</el-button>
          <el-button size="small" type="danger" @click="removeUser(row.id)">Xóa</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-position="top">
        <el-form-item label="Tên đăng nhập">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="Mật khẩu">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="Vai trò">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="Admin" value="admin" />
            <el-option label="Master Admin" value="master_admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Hy</el-button>
        <el-button type="primary" @click="saveUser">Lưu</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface User {
  id: number
  username: string
  password: string
  role: string
  createdAt: string
  updatedAt: string
}

const users = ref<User[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('Thêm người dùng')
const editingId = ref<number | null>(null)

const form = ref({
  username: '',
  password: '',
  role: 'admin',
})

function resetForm() {
  form.value = {
    username: '',
    password: '',
    role: 'admin',
  }
}

async function fetchUsers() {
  loading.value = true
  try {
    const res = await fetch('/api/users')
    if (!res.ok) throw new Error('Lấy danh sách thất bại')
    users.value = await res.json()
  } catch (err: any) {
    ElMessage.error(err.message || 'Lỗi khi tải danh sách')
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  editingId.value = null
  dialogTitle.value = 'Thêm người dùng'
  resetForm()
  dialogVisible.value = true
}

function openEditDialog(user: User) {
  editingId.value = user.id
  dialogTitle.value = 'Sửa người dùng'
  form.value = {
    username: user.username,
    password: '',
    role: user.role,
  }
  dialogVisible.value = true
}

async function saveUser() {
  try {
    const url = editingId.value ? `/api/users/${editingId.value}` : '/api/users'
    const method = editingId.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    if (!res.ok) throw new Error('Lưu thất bại')

    ElMessage.success(editingId.value ? 'Cập nhật thành công' : 'Thêm thành công')
    dialogVisible.value = false
    await fetchUsers()
  } catch (err: any) {
    ElMessage.error(err.message || 'Lỗi khi lưu')
  }
}

async function removeUser(id: number) {
  try {
    await ElMessageBox.confirm('Xác nhận xóa người dùng này?', 'Xác nhận', {
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      type: 'warning',
    })

    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Xóa thất bại')

    ElMessage.success('Xóa thành công')
    await fetchUsers()
  } catch (err: any) {
    if (err !== 'cancel') {
      ElMessage.error(err.message || 'Li khi xóa')
    }
  }
}

function formatDate(value: string | Date) {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleString('vi-VN')
}

onMounted(fetchUsers)
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
