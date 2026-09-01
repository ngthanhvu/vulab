<script setup lang="ts">
interface Props {
  showActions?: boolean
}

defineProps<Props>()
defineEmits<{
  refresh: []
  generate: []
}>()
</script>

<template>
  <header class="relative z-20 border-b bg-card shrink-0">
    <div class="w-full px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span
          class="inline-flex items-center justify-center h-9 w-9 rounded-lg border bg-primary shadow-sm">
          <span class="font-display font-black text-primary-foreground text-base">@</span>
        </span>
        <span class="font-display font-black text-lg tracking-tight">TEMP MAIL</span>
      </div>
      <div v-if="showActions" class="flex items-center gap-2">
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          @click="$emit('refresh')">
          ↻ refresh
        </button>
        <button
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
          @click="$emit('generate')">
          + MỚI
        </button>
      </div>
    </div>
  </header>
</template>
