<template>
  <component
    :is="as"
    :class="classes"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  as?: string
}

const { variant = 'default', size = 'default', as = 'button' } = defineProps<Props>()

const classes = computed(() => {
  const base = 'btn inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium'
  const variants: Record<string, string> = {
    default: 'btn-neutral',
    destructive: 'btn-error',
    outline: 'btn-outline btn-neutral',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    link: 'btn-link',
  }
  const sizes: Record<string, string> = {
    default: '',
    sm: 'btn-sm',
    lg: 'btn-lg',
    icon: 'btn-square btn-sm',
  }
  return `${base} ${variants[variant]} ${sizes[size]}`
})
</script>
