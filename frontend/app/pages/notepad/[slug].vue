<script setup lang="ts">
const route = useRoute()
const notepad = useNotepadStore()

const slug = computed(() => route.params.slug as string)

onMounted(() => {
  if (slug.value) {
    notepad.loadNote(slug.value)
  }
})

watch(() => route.params.slug, (newSlug) => {
  if (newSlug && typeof newSlug === 'string') {
    notepad.loadNote(newSlug)
  }
})

const origin = useState('notepadOrigin', () => '')

onMounted(() => {
  origin.value = window.location.origin
})

const shareUrl = computed(() => {
  if (origin.value && notepad.note) {
    return `${origin.value}/notepad/${notepad.note.slug}`
  }
  return ''
})

useHead({
  title: () => notepad.note?.title || 'Notepad',
})
</script>

<template>
  <NotepadShell>
    <NotepadHeader>
      <NuxtLink
        to="/notepad"
        class="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        <LucideArrowLeft class="h-4 w-4 mr-1" />
        Ghi chú mới
      </NuxtLink>
    </NotepadHeader>

    <main class="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
      <div v-if="notepad.loading" class="text-sm text-neutral-500">Đang tải...</div>

      <template v-else-if="notepad.note">
        <NotepadShareBar :url="shareUrl" class="mb-6" />
        <NotepadViewer
          :title="notepad.note.title"
          :content="notepad.note.content"
          :created-at="notepad.note.createdAt"
          :updated-at="notepad.note.updatedAt"
        />
      </template>

      <div v-else-if="notepad.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ notepad.error }}
      </div>
    </main>
  </NotepadShell>
</template>
