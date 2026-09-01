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
  <div class="flex-1 h-82.5 md:h-full min-h-0 flex flex-col">
    <div class="rounded-2xl border-[3px] border-void bg-paper shadow-chunky overflow-hidden flex flex-col h-full">
      <div v-if="!email" class="flex flex-col items-center justify-center h-full py-16 text-void/20">
        <p class="font-mono text-xs tracking-widest uppercase">Chọn email để đọc</p>
      </div>

      <div v-else class="flex flex-col h-full min-h-0 overflow-hidden">
        <div class="p-4 md:p-5 border-b-[3px] border-void shrink-0 bg-paper z-10">
          <div class="flex items-center gap-2 mb-2">
            <span
              class="inline-flex items-center rounded-xl border-[3px] border-void px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase font-bold"
              :class="email.seen ? 'bg-base-200 text-void/50' : 'bg-volt text-void'">
              {{ email.seen ? 'ĐÃ ĐC' : 'MỚI' }}
            </span>
            <span class="font-mono text-[10px] tracking-widest uppercase text-void/40">{{ formatDate(email.date)
              }}</span>
          </div>
          <h2 class="font-display font-black text-lg md:text-xl leading-tight mb-2 wrap-break-word">{{ email.subject
            }}</h2>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm">
            <span class="font-bold text-magenta break-all">{{ email.from }}</span>
            <span class="font-mono text-xs text-void/40 break-all">→ {{ address }}</span>
          </div>
        </div>
        <div
          class="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-6 min-h-0 [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full">
          <div v-if="email.html" class="prose max-w-none text-sm font-body wrap-break-word" v-html="email.html"></div>
          <pre v-else
            class="whitespace-pre-wrap font-mono text-sm leading-relaxed wrap-break-word">{{ email.text }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
