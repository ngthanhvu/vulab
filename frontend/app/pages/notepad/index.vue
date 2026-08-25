<script setup lang="ts">
const notepad = useNotepadStore()
const router = useRouter()

async function save() {
  await notepad.createNote()
  if (notepad.note) {
    await router.push(`/notepad/${notepad.note.slug}`)
  }
}

useHead({
  title: 'Notepad - Ghi chú nhanh',
})
</script>

<template>
  <NotepadShell>
    <NotepadHeader />

    <main class="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-neutral-900">Ghi chú mới</h1>
        <p class="mt-1 text-sm text-neutral-500">
          Viết nội dung và nhấn lưu để nhận link chia sẻ.
        </p>
      </div>

      <NotepadEditor v-model:title="notepad.title" v-model:content="notepad.content" :loading="notepad.loading"
        @save="save" />

      <p v-if="notepad.error" class="mt-4 text-sm text-red-600">
        {{ notepad.error }}
      </p>
    </main>
  </NotepadShell>
</template>
