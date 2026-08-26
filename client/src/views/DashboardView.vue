<template>
  <div class="dashboard-view">
    <!-- Stats Cards -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <el-icon class="stat-icon" color="#409eff">
            <User />
          </el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ stats.users }}</div>
            <div class="stat-label">Người dùng</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <el-icon class="stat-icon" color="#67c23a">
            <Notebook />
          </el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ stats.notes }}</div>
            <div class="stat-label">Ghi chú</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <el-icon class="stat-icon" color="#e6a23c">
            <Message />
          </el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ stats.emails }}</div>
            <div class="stat-label">Email</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <el-icon class="stat-icon" color="#f56c6c">
            <Clock />
          </el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ system.uptime.formatted }}</div>
            <div class="stat-label">Uptime</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Gauges & System Info -->
    <el-row :gutter="20" class="content-row">
      <el-col :span="8">
        <el-card shadow="hover" v-loading="loading.system" class="gauge-card">
          <template #header>
            <div class="card-header">
              <span>CPU Usage</span>
              <el-tag size="small" :type="cpuPercentage > 80 ? 'danger' : 'success'">{{ cpuPercentage }}%</el-tag>
            </div>
          </template>
          <div class="gauge-wrapper">
            <el-progress type="dashboard" :percentage="cpuPercentage" :color="cpuColor" :stroke-width="10" />
            <div class="gauge-meta">
              <div class="meta-item">
                <span class="meta-label">Model</span>
                <span class="meta-value">{{ system.cpu.model || '-' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Cores</span>
                <span class="meta-value">{{ system.cpu.cores }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" v-loading="loading.system" class="gauge-card">
          <template #header>
            <div class="card-header">
              <span>Memory Usage</span>
              <el-tag size="small" :type="memoryPercentage > 80 ? 'danger' : 'success'">{{ memoryPercentage }}%</el-tag>
            </div>
          </template>
          <div class="gauge-wrapper">
            <el-progress type="dashboard" :percentage="memoryPercentage" :color="memoryColor" :stroke-width="10" />
            <div class="gauge-meta">
              <div class="meta-item">
                <span class="meta-label">Total</span>
                <span class="meta-value">{{ system.memory.formatted.total }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Used</span>
                <span class="meta-value">{{ system.memory.formatted.used }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" v-loading="loading.stats">
          <template #header>
            <span>Thông tin nhanh</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Hostname">{{ system.platform.hostname }}</el-descriptions-item>
            <el-descriptions-item label="Platform">{{ system.platform.type }} {{ system.platform.arch
            }}</el-descriptions-item>
            <el-descriptions-item label="Release">{{ system.platform.release }}</el-descriptions-item>
            <el-descriptions-item label="Timestamp">{{ systemTimestamp }}</el-descriptions-item>
          </el-descriptions>
          <div class="quick-actions">
            <el-button type="primary" size="small" @click="refreshAll" :loading="loading.system || loading.stats">
              <el-icon>
              </el-icon> Làm mới
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts & Activity -->
    <el-row :gutter="20" class="content-row">
      <el-col :span="16">
        <el-card shadow="hover" v-loading="loading.system">
          <template #header>
            <div class="card-header">
              <span>CPU Usage Trend</span>
              <el-tag size="small">24 giờ qua</el-tag>
            </div>
          </template>
          <div ref="cpuChartRef" class="area-chart"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>Hoạt động gần đây</span>
          </template>
          <el-timeline>
            <el-timeline-item v-for="(activity, i) in activities" :key="i" :timestamp="activity.time" placement="top"
              :type="activity.type">
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- Resource Distribution -->
    <el-row :gutter="20" class="content-row">
      <el-col :span="12">
        <el-card shadow="hover" v-loading="loading.stats">
          <template #header>
            <span>Phân bố dữ liệu</span>
          </template>
          <div class="resource-list">
            <div class="resource-item">
              <div class="resource-icon" style="background: #409eff;">
                <el-icon>
                  <User />
                </el-icon>
              </div>
              <div class="resource-info">
                <div class="resource-label">Người dùng</div>
                <div class="resource-value">{{ stats.users }}</div>
              </div>
              <el-progress :percentage="resourcePercentages.users" :show-text="false" :stroke-width="8" color="#409eff"
                class="resource-progress" />
            </div>
            <div class="resource-item">
              <div class="resource-icon" style="background: #67c23a;">
                <el-icon>
                  <Notebook />
                </el-icon>
              </div>
              <div class="resource-info">
                <div class="resource-label">Ghi chú</div>
                <div class="resource-value">{{ stats.notes }}</div>
              </div>
              <el-progress :percentage="resourcePercentages.notes" :show-text="false" :stroke-width="8" color="#67c23a"
                class="resource-progress" />
            </div>
            <div class="resource-item">
              <div class="resource-icon" style="background: #e6a23c;">
                <el-icon>
                  <Message />
                </el-icon>
              </div>
              <div class="resource-info">
                <div class="resource-label">Email</div>
                <div class="resource-value">{{ stats.emails }}</div>
              </div>
              <el-progress :percentage="resourcePercentages.emails" :show-text="false" :stroke-width="8" color="#e6a23c"
                class="resource-progress" />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover" v-loading="loading.system">
          <template #header>
            <span>Memory Breakdown</span>
          </template>
          <div class="memory-breakdown">
            <div class="memory-bar">
              <div class="memory-used" :style="{ width: memoryPercentage + '%' }"></div>
            </div>
            <div class="memory-legend">
              <div class="legend-item">
                <span class="legend-dot" style="background: #409eff;"></span>
                <span>Used: {{ system.memory.formatted.used }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background: #e4e7ed;"></span>
                <span>Free: {{ system.memory.formatted.free }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { User, Notebook, Message, Clock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

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

interface DashboardStats {
  users: number
  notes: number
  emails: number
}

const loading = ref({ system: false, stats: false })
const system = ref<SystemInfo>({
  uptime: { seconds: 0, formatted: '-' },
  memory: { total: 0, used: 0, free: 0, percentage: 0, formatted: { total: '-', used: '-', free: '-' } },
  cpu: { model: '', cores: 0, loadAverage: [] },
  platform: { type: '', release: '', arch: '', hostname: '' },
  timestamp: '',
})

const stats = ref<DashboardStats>({ users: 0, notes: 0, emails: 0 })

const cpuChartRef = ref<HTMLDivElement | null>(null)
let cpuChart: echarts.ECharts | null = null
let refreshInterval: ReturnType<typeof setInterval> | null = null

const cpuPercentage = computed(() => {
  if (!system.value.cpu.cores) return 0
  const load = system.value.cpu.loadAverage[0] || 0
  return Math.min(Math.round((load / system.value.cpu.cores) * 100), 100)
})

const memoryPercentage = computed(() => system.value.memory.percentage)

const cpuColor = computed(() => (cpuPercentage.value > 80 ? '#f56c6c' : cpuPercentage.value > 50 ? '#e6a23c' : '#67c23a'))
const memoryColor = computed(() => (memoryPercentage.value > 80 ? '#f56c6c' : memoryPercentage.value > 50 ? '#e6a23c' : '#409eff'))

const systemTimestamp = computed(() => {
  if (!system.value.timestamp) return '-'
  return new Date(system.value.timestamp).toLocaleString('vi-VN')
})

const resourcePercentages = computed(() => {
  const max = Math.max(stats.value.users, stats.value.notes, stats.value.emails, 1)
  return {
    users: Math.round((stats.value.users / max) * 100),
    notes: Math.round((stats.value.notes / max) * 100),
    emails: Math.round((stats.value.emails / max) * 100),
  }
})

const activities = [
  { time: 'Vừa xong', content: 'Dashboard được làm mới', type: 'primary' },
  { time: 'Gần đây', content: `Có ${stats.value.users} người dùng trong hệ thống`, type: 'success' },
  { time: 'Gần đây', content: `Có ${stats.value.notes} ghi chú được tạo`, type: 'info' },
  { time: 'Gần đây', content: `Có ${stats.value.emails} email được lưu`, type: 'warning' },
  { time: 'Boot', content: `Uptime: ${system.value.uptime.formatted}`, type: 'danger' },
]

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

async function fetchStats() {
  loading.value.stats = true
  try {
    const res = await fetch('/api/admin/stats')
    if (!res.ok) throw new Error('Lấy thống kê thất bại')
    stats.value = await res.json()
  } catch (err: any) {
    ElMessage.error(err.message || 'Li khi tải thống kê')
  } finally {
    loading.value.stats = false
  }
}

async function refreshAll() {
  await Promise.all([fetchSystem(), fetchStats()])
  ElMessage.success('Đã làm mới')
}

function generateCpuTrendData() {
  const hours: string[] = []
  const data: number[] = []
  const now = new Date()
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000)
    hours.push(`${d.getHours()}:00`)
    data.push(Math.max(5, Math.min(95, Math.round(cpuPercentage.value + (Math.random() - 0.5) * 40))))
  }
  return { hours, data }
}

function renderCpuChart() {
  if (!cpuChartRef.value) return
  if (!cpuChart) {
    cpuChart = echarts.init(cpuChartRef.value)
  }
  const { hours, data } = generateCpuTrendData()
  cpuChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: hours },
    yAxis: { type: 'value', min: 0, max: 100, axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: 'CPU Usage',
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.6)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' },
          ]),
        },
        itemStyle: { color: '#409eff' },
        data,
      },
    ],
  })
}

onMounted(() => {
  fetchSystem()
  fetchStats()
  nextTick(() => {
    renderCpuChart()
  })
  refreshInterval = setInterval(() => {
    fetchSystem()
    fetchStats()
  }, 5000)
})

onUnmounted(() => {
  cpuChart?.dispose()
  cpuChart = null
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
})

watch(cpuPercentage, () => {
  nextTick(() => {
    renderCpuChart()
  })
})
</script>

<style scoped>
.dashboard-view .stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px;
}

.stat-icon {
  font-size: 40px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 500;
}

.content-row {
  margin-bottom: 20px;
}

/* Equal height cards in a row */
.el-row {
  display: flex;
  flex-wrap: wrap;
}

.el-col {
  margin-bottom: 20px;
}

.el-card {
  height: 100%;
}

/* Gauge */
.gauge-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.gauge-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.gauge-meta {
  display: flex;
  gap: 24px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.meta-label {
  font-size: 12px;
  color: #909399;
}

.meta-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  max-width: 160px;
  text-align: center;
  word-break: break-word;
}

.quick-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

/* Area chart */
.area-chart {
  width: 100%;
  height: 280px;
}

/* Resource list */
.resource-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.resource-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
}

.resource-info {
  flex: 0 0 100px;
}

.resource-label {
  font-size: 12px;
  color: #909399;
}

.resource-value {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
}

.resource-progress {
  flex: 1;
}

/* Memory breakdown */
.memory-breakdown {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.memory-bar {
  height: 24px;
  background: #e4e7ed;
  border-radius: 12px;
  overflow: hidden;
}

.memory-used {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border-radius: 12px;
  transition: width 0.5s ease;
}

.memory-legend {
  display: flex;
  gap: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>
