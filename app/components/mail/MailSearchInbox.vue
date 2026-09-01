<script setup lang="ts">
const searchAddress = defineModel<string>('searchAddress', { required: true })
defineEmits<{
  submit: []
}>()
</script>

<template>
  <div class="rounded-xl border bg-card p-3 md:p-4 shrink-0 shadow-sm">
    <label class="font-mono text-[11px] tracking-widest uppercase font-bold block mb-1.5 text-muted-foreground">TÌM LẠI INBOX</label>
    <form class="flex flex-col md:flex-row gap-2" @submit.prevent="$emit('submit')">
      <input v-model="searchAddress" type="text" placeholder="nhập địa chỉ email..."
        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex-1 font-mono text-xs h-14 md:h-8 max-md:py-1.25 max-md:px-2.5" />
      <button type="submit"
        class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 w-full md:w-auto">
        MỞ INBOX
      </button>
    </form>
  </div>
</template>
