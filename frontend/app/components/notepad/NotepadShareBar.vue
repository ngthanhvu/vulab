<script setup lang="ts">
const props = defineProps<{
  url: string
}>()

const copied = ref(false)

function copy() {
  if (!props.url) return
  navigator.clipboard.writeText(props.url).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}
</script>

<template>
  <div class="rounded-lg border border-neutral-200 bg-white p-3 flex items-center gap-2">
    <div class="flex-1 min-w-0">
      <p class="text-xs font-medium text-neutral-500 mb-0.5">Link chia sẻ</p>
      <p class="text-sm text-neutral-900 truncate">{{ url }}</p>
    </div>
    <button
      class="inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
      @click="copy"
    >
      <LucideCopy class="h-4 w-4 mr-1.5" />
      <span>{{ copied ? 'Đã copy' : 'Copy' }}</span>
    </button>
  </div>
</template>
