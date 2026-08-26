<template>
  <div class="shrink-0 bg-neutral-200" :class="orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'">
  </div>
</template>

<script setup lang="ts">
interface Props {
  orientation?: 'horizontal' | 'vertical'
}

withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
})
</script>
