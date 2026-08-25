<script setup lang="ts">
import DOMPurify from 'isomorphic-dompurify'

const props = defineProps<{
  title: string
  content: string
  createdAt: string
  updatedAt: string
}>()

const formattedDate = (date: string) => new Date(date).toLocaleString('vi-VN')

const sanitizedContent = computed(() => {
  if (!props.content) return '<p>Không có nội dung</p>'
  return DOMPurify.sanitize(props.content, {
    ADD_ATTR: ['target'],
  })
})
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <header class="border-b border-neutral-200 pb-8">
      <h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
        {{ title || 'Không có tiêu đề' }}
      </h1>
      <div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
        <div class="inline-flex items-center gap-1.5">
          <LucideCalendar class="h-4 w-4" />
          <time :datetime="createdAt">{{ formattedDate(createdAt) }}</time>
        </div>
        <div class="inline-flex items-center gap-1.5">
          <LucideClock class="h-4 w-4" />
          <span>Cập nhật: <time :datetime="updatedAt">{{ formattedDate(updatedAt) }}</time></span>
        </div>
      </div>
    </header>

    <div
      class="prose prose-neutral max-w-none pt-8 text-base leading-8 text-neutral-700"
      v-html="sanitizedContent"
    />
  </article>
</template>
