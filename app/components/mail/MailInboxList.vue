<script setup lang="ts">
import type { Email } from '~/composables/mail/useMailApi'
import { formatTime } from '~/utils/date'

interface Props {
  emails: Email[]
  selected: number | null
  address: string
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
      class="border-b border-border px-3 py-2 font-mono text-[11px] tracking-widest uppercase text-muted-foreground bg-muted shrink-0 flex items-center justify-between">
      <span>INBOX — {{ emails.length }} MAIL</span>
      <span class="inline-flex items-center justify-center w-4 h-4" aria-live="polite" aria-busy="true">
        <svg v-if="loading" class="animate-spin w-3.5 h-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
      </span>
    </div>

    <div v-if="loading && !emails.length" class="p-3 space-y-3 flex-1 overflow-y-auto min-h-0">
      <div v-for="n in 5" :key="n" class="p-3 rounded-lg border border-border/50 space-y-2">
        <Skeleton width="60%" height="12px" rounded="sm" />
        <Skeleton width="90%" height="14px" rounded="sm" />
      </div>
    </div>

    <div v-else-if="!emails.length" class="flex flex-col items-center justify-center flex-1 p-4 text-muted-foreground/50">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <p class="font-mono text-xs tracking-widest uppercase text-center">Đang chờ mail...</p>
    </div>

    <div v-else class="divide-y divide-border flex-1 overflow-y-auto hide-scrollbar min-h-0">
      <div v-for="(email, i) in emails" :key="email.uid"
        class="cursor-pointer px-3 py-3 sm:py-2.5 hover:bg-accent transition-colors" :class="{
          'bg-accent border-l-[3px] border-l-primary': selected === email.uid,
          'opacity-60': email.seen && selected !== email.uid,
        }" :style="{ transform: Number(i) % 2 === 0 ? 'rotate(0.3deg)' : 'rotate(-0.3deg)' }"
        @click="$emit('select', email.uid)">
        <div class="flex items-start justify-between gap-1">
          <span class="text-xs font-bold truncate flex-1 font-body">{{ email.from }}</span>
          <span class="font-mono text-[10px] text-muted-foreground whitespace-nowrap ml-1">{{ formatTime(email.date)
            }}</span>
        </div>
        <div class="text-xs mt-0.5 truncate font-body" :class="{ 'font-bold': !email.seen }">
          {{ email.subject }}
        </div>
      </div>
    </div>
  </div>
</template>
