<template>
  <div class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="aspect-square h-full w-full"
    />
    <span v-else class="flex h-full w-full items-center justify-center text-sm font-medium text-neutral-600">
      {{ fallback }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  fallback?: string
}

defineProps<Props>()
</script>
