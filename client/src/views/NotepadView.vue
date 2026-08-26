<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>Quản lý ghi chú</span>
      </div>
    </template>

    <el-table :data="notes" v-loading="loading" row-key="slug" border>
      <el-table-column prop="slug" label="Slug" align="center" />
      <el-table-column prop="title" label="Tiêu đề" align="center" />
      <el-table-column prop="url" label="Đường dẫn" align="center">
        <template #default="{ row }">
          <a :href="row.url" target="_blank" class="note-link">{{ row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Ngày tạo" align="center">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

interface Note {
  slug: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  url: string
}

const notes = ref<Note[]>([])
const loading = ref(false)

async function fetchNotes() {
  loading.value = true
  try {
    const res = await fetch('/api/notepad')
    if (!res.ok) throw new Error('Lấy danh sách thất bại')
    notes.value = await res.json()
  } catch (err: any) {
    ElMessage.error(err.message || 'Lỗi khi tải danh sách')
  } finally {
    loading.value = false
  }
}

function formatDate(value: string | Date) {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleString('vi-VN')
}

onMounted(fetchNotes)
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.note-link {
  color: #409eff;
  text-decoration: none;
}

.note-link:hover {
  text-decoration: underline;
}
</style>
