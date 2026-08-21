<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  circle?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  class?: string
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1em',
  circle: false,
  rounded: 'md',
  class: '',
  animated: true,
})

const roundedClass = computed(() => {
  if (props.circle) return 'rounded-full'
  switch (props.rounded) {
    case 'none': return 'rounded-none'
    case 'sm': return 'rounded-sm'
    case 'md': return 'rounded-md'
    case 'lg': return 'rounded-lg'
    case 'xl': return 'rounded-xl'
    case 'full': return 'rounded-full'
    default: return 'rounded-md'
  }
})
</script>

<template>
  <div class="skeleton bg-current/10"
    :class="[roundedClass, { 'animate-pulse': animated, 'skeleton--circle': circle }, props.class]"
    :style="{ width, height }" aria-hidden="true" />
</template>

<style scoped>
.skeleton {
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}

.skeleton--circle {
  aspect-ratio: 1 / 1;
}
</style>
