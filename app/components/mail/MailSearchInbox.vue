<script setup lang="ts">
const searchAddress = defineModel<string>('searchAddress', { required: true })
defineEmits<{
  submit: []
}>()
</script>

<template>
  <div class="rounded-xl border-[3px] border-void bg-paper shadow-chunky p-3 md:p-4 mb-3 shrink-0">
    <label class="font-mono text-[11px] tracking-widest uppercase font-bold block mb-1.5">TÌM LẠI INBOX</label>
    <form class="flex flex-col md:flex-row gap-2" @submit.prevent="$emit('submit')">
      <input v-model="searchAddress" type="text" placeholder="nhập địa chỉ email..."
        class="input input-md md:input-sm input-bordered flex-1 border-2 border-void font-mono text-xs h-14 md:h-8 w-full max-md:py-1.25 max-md:px-2.5" />
      <button type="submit"
        class="btn btn-sm border-2 border-void bg-volt text-void font-bold font-display hover:-translate-y-0.5 hover:shadow-chunky-volt transition-all shadow-chunky-sm w-full md:w-auto">
        MỞ INBOX
      </button>
    </form>
  </div>
</template>
