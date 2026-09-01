<script setup lang="ts">
import type { Email } from '~/composables/mail/useMailApi'
import { formatDate } from '~/utils/date'

interface Props {
  email: Email | null
  address: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex-1 h-90 sm:h-105 md:h-auto min-h-0 flex flex-col">
    <div class="rounded-xl border-[3px] border-void bg-paper shadow-chunky overflow-hidden flex flex-col h-full">
      <div v-if="!email" class="flex flex-col items-center justify-center h-full py-12 text-void/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p class="font-mono text-xs tracking-widest uppercase">Chọn email để đọc</p>
      </div>

      <div v-else class="flex flex-col h-full min-h-0 overflow-hidden">
        <div class="p-3 md:p-4 border-b-[3px] border-void shrink-0 bg-paper z-10">
          <div class="flex items-center gap-2 mb-1.5">
            <span
              class="inline-flex items-center rounded-lg border-2 border-void px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase font-bold"
              :class="email.seen ? 'bg-base-200 text-void/50' : 'bg-volt text-void'">
              {{ email.seen ? 'ĐÃ ĐC' : 'MỚI' }}
            </span>
            <span class="font-mono text-[10px] tracking-widest uppercase text-void/40">{{
              formatDate(email.date) }}</span>
          </div>
          <h2 class="font-display font-black text-base md:text-lg leading-tight mb-1 wrap-break-word">{{ email.subject
            }}</h2>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
            <span class="font-bold text-magenta break-all">{{ email.from }}</span>
            <span class="font-mono text-[11px] text-void/40 break-all">→ {{ address }}</span>
          </div>
        </div>
        <div
          class="flex-1 overflow-y-auto overflow-x-auto p-3 md:p-5 min-h-0 [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full">
          <div v-if="email.html" class="prose max-w-none text-sm font-body wrap-break-word" v-html="email.html"></div>
          <pre v-else
            class="whitespace-pre-wrap font-mono text-sm leading-relaxed wrap-break-word">{{ email.text }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
