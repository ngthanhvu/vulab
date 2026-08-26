<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const { variant = 'default' } = defineProps<Props>()

const classes = computed(() => {
  const base = 'badge text-xs font-medium'
  const variants: Record<string, string> = {
    default: 'badge-neutral',
    secondary: 'badge-ghost',
    destructive: 'badge-error',
    outline: 'badge-outline',
    success: 'badge-success',
  }
  return `${base} ${variants[variant]}`
})
</script>
