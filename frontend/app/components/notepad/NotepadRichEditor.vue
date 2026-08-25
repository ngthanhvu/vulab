<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = shallowRef<Editor | null>(null)

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        defaultProtocol: 'https',
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết note...',
      }),
    ],
    content: props.modelValue || '<p></p>',
    editorProps: {
      attributes: {
        class: 'min-h-[320px] outline-none',
      },
    },
    onUpdate: ({ editor: ed }) => {
      emit('update:modelValue', ed.getHTML())
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value || '<p></p>', false)
    }
  },
)

function setLink() {
  if (!editor.value) return
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('Nhập URL', previousUrl)
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="editor" class="flex flex-wrap items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1.5">
      <button type="button" :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('bold') }]" title="Bold"
        @click="editor.chain().focus().toggleBold().run()">
        <LucideBold class="h-4 w-4" />
      </button>
      <button type="button" :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('italic') }]" title="Italic"
        @click="editor.chain().focus().toggleItalic().run()">
        <LucideItalic class="h-4 w-4" />
      </button>
      <button type="button" :disabled="!editor.can().chain().focus().toggleUnderline().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('underline') }]" title="Underline"
        @click="editor.chain().focus().toggleUnderline().run()">
        <LucideUnderline class="h-4 w-4" />
      </button>
      <button type="button" :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('strike') }]" title="Strikethrough"
        @click="editor.chain().focus().toggleStrike().run()">
        <LucideStrikethrough class="h-4 w-4" />
      </button>
      <button type="button" :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('code') }]" title="Inline code"
        @click="editor.chain().focus().toggleCode().run()">
        <LucideCode class="h-4 w-4" />
      </button>

      <div class="separator" />

      <button type="button" :class="['toolbar-btn', { 'is-active': editor.isActive('heading', { level: 1 }) }]"
        title="Heading 1" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
        <span class="text-xs font-bold">H1</span>
      </button>
      <button type="button" :class="['toolbar-btn', { 'is-active': editor.isActive('heading', { level: 2 }) }]"
        title="Heading 2" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
        <span class="text-xs font-bold">H2</span>
      </button>
      <button type="button" :class="['toolbar-btn', { 'is-active': editor.isActive('heading', { level: 3 }) }]"
        title="Heading 3" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
        <span class="text-xs font-bold">H3</span>
      </button>

      <div class="separator" />

      <button type="button" :class="['toolbar-btn', { 'is-active': editor.isActive('bulletList') }]" title="Bullet list"
        @click="editor.chain().focus().toggleBulletList().run()">
        <LucideList class="h-4 w-4" />
      </button>
      <button type="button" :class="['toolbar-btn', { 'is-active': editor.isActive('orderedList') }]"
        title="Ordered list" @click="editor.chain().focus().toggleOrderedList().run()">
        <LucideListOrdered class="h-4 w-4" />
      </button>
      <button type="button" :class="['toolbar-btn', { 'is-active': editor.isActive('codeBlock') }]" title="Code block"
        @click="editor.chain().focus().toggleCodeBlock().run()">
        <LucideSquareCode class="h-4 w-4" />
      </button>
      <button type="button" :class="['toolbar-btn', { 'is-active': editor.isActive('blockquote') }]" title="Blockquote"
        @click="editor.chain().focus().toggleBlockquote().run()">
        <LucideQuote class="h-4 w-4" />
      </button>

      <div class="separator" />

      <button type="button" :class="['toolbar-btn', { 'is-active': editor.isActive('link') }]" title="Link"
        @click="setLink">
        <LucideLink class="h-4 w-4" />
      </button>
      <button type="button" :disabled="!editor.can().chain().focus().undo().run()" class="toolbar-btn" title="Undo"
        @click="editor.chain().focus().undo().run()">
        <LucideUndo class="h-4 w-4" />
      </button>
      <button type="button" :disabled="!editor.can().chain().focus().redo().run()" class="toolbar-btn" title="Redo"
        @click="editor.chain().focus().redo().run()">
        <LucideRedo class="h-4 w-4" />
      </button>
    </div>

    <div
      class="rounded-md border border-neutral-200 bg-white px-3 py-2.5 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-400/20">
      <EditorContent v-if="editor" :editor="editor" class="notepad-editor" />
      <div v-else class="min-h-[320px] text-sm text-neutral-400">
        Đang tải trình soạn thảo...
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.toolbar-btn {
  @apply rounded p-1.5 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent;
}

.toolbar-btn.is-active {
  @apply bg-neutral-100 text-neutral-900;
}

.separator {
  @apply mx-1 h-4 w-px bg-neutral-200;
}

.notepad-editor :deep(.tiptap) {
  min-height: 320px;
  outline: none;
}

.notepad-editor :deep(.tiptap p) {
  margin: 0 0 0.75rem 0;
  line-height: 1.625;
}

.notepad-editor :deep(.tiptap p:last-child) {
  margin-bottom: 0;
}

.notepad-editor :deep(.tiptap p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #a1a1aa;
  pointer-events: none;
  height: 0;
  font-size: 0.875rem;
  line-height: 1.5rem;
}

.notepad-editor :deep(.tiptap h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1rem 0 0.75rem 0;
  line-height: 1.25;
}

.notepad-editor :deep(.tiptap h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.75rem 0 0.5rem 0;
  line-height: 1.3;
}

.notepad-editor :deep(.tiptap h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0.75rem 0 0.5rem 0;
  line-height: 1.35;
}

.notepad-editor :deep(.tiptap ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin: 0 0 0.75rem 0;
}

.notepad-editor :deep(.tiptap ol) {
  list-style-type: decimal;
  padding-left: 1.25rem;
  margin: 0 0 0.75rem 0;
}

.notepad-editor :deep(.tiptap li) {
  margin: 0.25rem 0;
}

.notepad-editor :deep(.tiptap blockquote) {
  border-left: 3px solid #d4d4d4;
  padding-left: 1rem;
  margin: 0.75rem 0;
  color: #525252;
}

.notepad-editor :deep(.tiptap pre) {
  background: #171717;
  color: #f5f5f5;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin: 0.75rem 0;
  overflow-x: auto;
}

.notepad-editor :deep(.tiptap pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.notepad-editor :deep(.tiptap code) {
  background: #f5f5f5;
  color: #171717;
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
}

.notepad-editor :deep(.tiptap a) {
  color: #2563eb;
  text-decoration: underline;
}

.notepad-editor :deep(.tiptap hr) {
  border: none;
  border-top: 1px solid #e5e5e5;
  margin: 1rem 0;
}
</style>
