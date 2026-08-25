<script setup lang="ts">
const props = defineProps<{
  title: string
  content: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:title', value: string): void
  (e: 'update:content', value: string): void
  (e: 'save'): void
}>()

const titleModel = computed({
  get: () => props.title,
  set: (value) => emit('update:title', value),
})

const contentModel = computed({
  get: () => props.content,
  set: (value) => emit('update:content', value),
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <label for="note-title" class="block text-sm font-medium text-neutral-700 mb-1.5">
        Tiêu đề
      </label>
      <input id="note-title" v-model="titleModel" type="text" placeholder="Nhập tiêu đề..."
        class="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400/20" />
    </div>

    <div>
      <label class="block text-sm font-medium text-neutral-700 mb-1.5">
        Nội dung
      </label>
      <ClientOnly>
        <NotepadRichEditor v-model="contentModel" />
        <template #fallback>
          <div class="rounded-md border border-neutral-200 bg-white px-3 py-2.5 min-h-[320px] text-sm text-neutral-400">
            Đang tải trình soạn thảo...
          </div>
        </template>
      </ClientOnly>
    </div>

    <button :disabled="loading"
      class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="emit('save')">
      <LucideSave class="h-4 w-4 mr-2" />
      <span>Lưu note</span>
    </button>
  </div>
</template>
