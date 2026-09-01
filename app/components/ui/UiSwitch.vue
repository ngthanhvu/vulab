<template>
  <input
    type="checkbox"
    class="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-border bg-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
    :checked="modelValue"
    @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
}

const { modelValue } = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
</script>
