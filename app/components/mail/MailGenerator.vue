<script setup lang="ts">
interface Props {
  emailAddress: string
  copied: boolean
  loading?: boolean
}

defineProps<Props>()
defineEmits<{
  copy: []
  generate: []
}>()
</script>

<template>
  <div class="rounded-xl border bg-card p-3 md:p-4 shrink-0 shadow-sm">
    <div v-if="loading" class="py-2" aria-busy="true" aria-label="Đang tạo địa chỉ email">
      <div class="rounded-xl border bg-card p-3 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          <Skeleton width="10px" height="10px" circle class="bg-current/10" />
          <Skeleton width="10px" height="10px" circle class="bg-current/10" />
          <Skeleton width="10px" height="10px" circle class="bg-current/10" />
        </div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Skeleton width="min(100%, 320px)" height="24px" rounded="lg" class="bg-current/10" />
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton width="100%" height="32px" rounded="lg" class="sm:w-24 bg-current/10" />
            <Skeleton width="100%" height="32px" rounded="lg" class="sm:w-24 bg-current/10" />
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="rounded-xl border bg-card p-3 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          <span class="h-2.5 w-2.5 rounded-full bg-red-500"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-green-500"></span>
        </div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <code
            class="font-mono text-foreground text-sm md:text-lg font-bold break-all w-full sm:w-auto">{{ emailAddress }}</code>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <NuxtLink :to="`/mail/${encodeURIComponent(emailAddress)}`"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground flex-1 sm:flex-initial text-center">
              MỞ RIÊNG
            </NuxtLink>
            <button
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs bg-primary text-primary-foreground shadow hover:bg-primary/90 flex-1 sm:flex-initial"
              @click="$emit('copy')">
              {{ copied ? '✓ COPIED' : 'COPY' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
