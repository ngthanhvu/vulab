<template>
  <router-view v-if="isLoginPage" />
  <el-container v-else class="dashboard">
    <!-- Sidebar -->
    <el-aside :width="isCollapsed ? '64px' : '220px'" class="sidebar">
      <div class="logo">
        <span v-if="!isCollapsed">Admin Dashboard</span>
        <span v-else></span>
      </div>

        <el-menu :default-active="activeItem" :collapse="isCollapsed" background-color="#304156" text-color="#bfcbd9"
        active-text-color="#409eff" @select="(index: string) => router.push(index)">
        <el-menu-item index="/">
          <el-icon>
            <House />
          </el-icon>
          <template #title>Trang chủ</template>
        </el-menu-item>

        <el-menu-item index="/users">
          <el-icon>
            <User />
          </el-icon>
          <template #title>Người dùng</template>
        </el-menu-item>

        <el-menu-item index="/notepad">
          <el-icon>
            <Notebook />
          </el-icon>
          <template #title>Ghi chú</template>
        </el-menu-item>

        <el-menu-item index="/settings">
          <el-icon>
            <Setting />
          </el-icon>
          <template #title>Cài đặt</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- Header -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapsed = !isCollapsed">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.prevent="goHome">Trang chủ</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPage }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-badge value="3" :max="99">
            <el-icon>
              <Bell />
            </el-icon>
          </el-badge>
          <el-dropdown trigger="click">
            <div class="user-info">
              <el-avatar :size="32" class="user-avatar">A</el-avatar>
              <span class="username">Admin</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="User">Hồ sơ</el-dropdown-item>
                <el-dropdown-item icon="Setting">Cài đặt</el-dropdown-item>
                <el-dropdown-item divided icon="SwitchButton" @click="logout(router)">Đăng xuất</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- Main Content -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import {
  House,
  User,
  Notebook,
  Setting,
  Bell,
  Fold,
  Expand,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()
const isCollapsed = ref(false)

const isLoginPage = computed(() => route?.path === '/login')

// Active menu item for el-menu
const activeItem = computed(() => route?.path ?? '/')

const currentPage = computed(() => {
  const map: Record<string, string> = {
    '/': 'Trang chủ',
    '/users': 'Người dùng',
    '/notepad': 'Ghi chú',
    '/settings': 'Cài đặt',
  }
  return map[activeItem.value] || ''
})

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.dashboard {
  height: 100vh;
}

/* ── Sidebar ─────────────────────────────────── */
.sidebar {
  background: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar .logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
}

.sidebar :deep(.el-menu) {
  border-right: none;
}

/* ── Header ──────────────────────────────────── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0 20px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
}

.collapse-btn:hover {
  color: #409eff;
}

.header-right .el-icon {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-avatar {
  background: #409eff;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

.username {
  font-size: 14px;
  color: #303133;
}

/* ── Main Content ────────────────────────────── */
.main-content {
  background: #f0f2f5;
  padding: 20px;
}

.el-header {
  padding: 0 20px;
}
</style>
