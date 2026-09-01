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
  <div class="flex-1 h-full min-h-0 flex flex-col">
    <div class="rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col h-full">
      <div v-if="!email" class="flex flex-col items-center justify-center h-full py-16 text-muted-foreground/30">
        <p class="font-mono text-xs tracking-widest uppercase">Chọn email để đọc</p>
      </div>

      <div v-else class="flex flex-col h-full min-h-0 overflow-hidden">
        <div class="p-4 md:p-5 border-b border-border shrink-0 bg-card z-10">
          <div class="flex items-center gap-2 mb-2">
            <span
              class="inline-flex items-center rounded-xl border border-border px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase font-bold"
              :class="email.seen ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'">
              {{ email.seen ? 'ĐÃ ĐC' : 'MI' }}
            </span>
            <span class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">{{ formatDate(email.date)
              }}</span>
          </div>
          <h2 class="font-display font-black text-lg md:text-xl leading-tight mb-2 wrap-break-word">{{ email.subject
            }}</h2>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm">
            <span class="font-bold text-foreground break-all">{{ email.from }}</span>
            <span class="font-mono text-xs text-muted-foreground break-all">→ {{ address }}</span>
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
