<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="mt-1 text-sm text-base-content/60">Overview of system and available routes.</p>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center gap-2 text-sm text-base-content/60">
      <span class="loading loading-spinner loading-sm" />
      Loading system info...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="rounded-lg bg-error/10 p-4 text-error">
      {{ error }}
    </div>

    <!-- Stats -->
    <div v-if="system" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <UiCard>
        <UiCardHeader>
          <UiCardDescription>Uptime</UiCardDescription>
          <UiCardTitle class="text-2xl">{{ system.uptime.formatted }}</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <p class="text-xs text-base-content/60">{{ Math.floor(system.uptime.seconds) }} seconds</p>
        </UiCardContent>
      </UiCard>

      <UiCard>
        <UiCardHeader>
          <UiCardDescription>Memory Usage</UiCardDescription>
          <UiCardTitle class="text-2xl">{{ system.memory.percentage }}%</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <p class="text-xs text-base-content/60">
            {{ system.memory.formatted.used }} / {{ system.memory.formatted.total }}
          </p>
        </UiCardContent>
      </UiCard>

      <UiCard>
        <UiCardHeader>
          <UiCardDescription>CPU Cores</UiCardDescription>
          <UiCardTitle class="text-2xl">{{ system.cpu.cores }}</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <p class="text-xs text-base-content/60">{{ system.cpu.model }}</p>
        </UiCardContent>
      </UiCard>

      <UiCard>
        <UiCardHeader>
          <UiCardDescription>Platform</UiCardDescription>
          <UiCardTitle class="text-2xl">{{ system.platform.type }}</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <p class="text-xs text-base-content/60">
            {{ system.platform.arch }} · {{ system.platform.release }}
          </p>
        </UiCardContent>
      </UiCard>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Routes -->
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Routes</UiCardTitle>
          <UiCardDescription>Available pages and features.</UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <ul class="space-y-2">
            <li
              v-for="route in routes"
              :key="route.path"
            >
              <NuxtLink
                :to="route.path"
                class="flex items-center gap-3 rounded-lg border border-base-300 p-3 transition-colors hover:bg-base-200"
              >
                <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral text-neutral-content">
                  <component :is="route.icon" class="h-4 w-4" />
                </span>
                <div>
                  <p class="font-medium">{{ route.name }}</p>
                  <p class="text-xs text-base-content/60">{{ route.path }}</p>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </UiCardContent>
      </UiCard>

      <!-- Server details -->
      <UiCard v-if="system">
        <UiCardHeader>
          <UiCardTitle>Server Info</UiCardTitle>
          <UiCardDescription>Detailed system information.</UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <dl class="space-y-3">
            <div class="flex justify-between text-sm">
              <dt class="text-base-content/60">Hostname</dt>
              <dd class="font-medium">{{ system.platform.hostname }}</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-base-content/60">CPU</dt>
              <dd class="font-medium">{{ system.cpu.model }}</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-base-content/60">Load Average</dt>
              <dd class="font-medium">{{ system.cpu.loadAverage.map((v) => v.toFixed(2)).join(', ') }}</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-base-content/60">Free Memory</dt>
              <dd class="font-medium">{{ system.memory.formatted.free }}</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-base-content/60">Last Updated</dt>
              <dd class="font-medium">{{ formatDate(system.timestamp) }}</dd>
            </div>
          </dl>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>

<script setup>
import { useAdminApi } from '~/composables/admin/useAdminApi'
import { formatDate } from '~/utils/date'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Admin Dashboard',
})

const { fetchSystemInfo } = useAdminApi()
const system = ref(null)
const pending = ref(true)
const error = ref(null)

const routes = [
  { name: 'Home', path: '/', icon: 'LucideHome' },
  { name: 'Mail', path: '/mail', icon: 'LucideMail' },
  { name: 'Notepad', path: '/notepad', icon: 'LucideNotebookText' },
  { name: 'Location', path: '/loc', icon: 'LucideMapPin' },
  { name: 'Admin', path: '/admin', icon: 'LucideShield' },
]

onMounted(async () => {
  try {
    system.value = await fetchSystemInfo()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load system info'
  } finally {
    pending.value = false
  }
})
</script>
