<script setup lang="ts">
import type { Email } from '~/composables/mail/useMailApi'
import { formatDate } from '~/utils/date'

interface Props {
  emails: Email[]
  selected: number | null
  loading?: boolean
}

defineProps<Props>()
defineEmits<{
  select: [uid: number]
}>()
</script>

<template>
  <div class="flex flex-col h-full min-h-0">
    <div
      class="border-b border-border px-4 py-2 font-mono text-xs tracking-widest uppercase text-muted-foreground bg-muted shrink-0 flex items-center justify-between">
      <span>INBOX — {{ emails.length }} MAIL</span>
      <span v-if="loading" class="animate-pulse text-[10px] text-primary">ĐANG TẢI...</span>
    </div>

    <div v-if="loading && !emails.length" class="p-3 space-y-3 flex-1 overflow-y-auto min-h-0">
      <div v-for="n in 5" :key="n" class="p-3 rounded-lg border border-border/50 space-y-2">
        <Skeleton width="60%" height="12px" rounded="sm" />
        <Skeleton width="90%" height="14px" rounded="sm" />
      </div>
    </div>

    <div v-else-if="!emails.length" class="flex flex-col items-center justify-center flex-1 p-4 text-muted-foreground/50">
      <p class="font-mono text-xs tracking-widest uppercase text-center">Đang chờ mail...</p>
    </div>

    <div v-else class="divide-y divide-border flex-1 overflow-y-auto hide-scrollbar min-h-0">
      <div v-for="email in emails" :key="email.uid"
        class="cursor-pointer px-4 py-3 hover:bg-accent transition-colors"
        :class="{ 'bg-accent border-l-[3px] border-l-primary': selected === email.uid }"
        @click="$emit('select', email.uid)">
        <div class="flex items-start justify-between gap-1">
          <span class="text-xs font-bold truncate flex-1 font-body">{{ email.from }}</span>
          <span class="font-mono text-[10px] text-muted-foreground whitespace-nowrap ml-1">{{ formatDate(email.date)
            }}</span>
        </div>
        <div class="text-sm mt-0.5 truncate font-body" :class="{ 'font-bold': !email.seen }">
          {{ email.subject }}
        </div>
      </div>
    </div>
  </div>
</template>
