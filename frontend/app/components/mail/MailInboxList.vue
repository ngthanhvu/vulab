<script setup lang="ts">
import type { Email } from '~/composables/mail/useMailApi'
import { formatTime } from '~/utils/date'

interface Props {
  emails: Email[]
  selected: number | null
  address: string
}

defineProps<Props>()
defineEmits<{
  select: [uid: number]
}>()
</script>

<template>
  <div class="w-full md:w-72 shrink-0 h-60 sm:h-70 md:h-auto flex flex-col min-h-0">
    <div class="rounded-xl border-[3px] border-void bg-paper shadow-chunky overflow-hidden flex flex-col h-full">
      <div
        class="border-b-[3px] border-void px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase text-void/50 bg-base-200 shrink-0">
        INBOX — {{ emails.length }} MAIL
      </div>

      <div v-if="!emails.length" class="flex flex-col items-center justify-center flex-1 p-4 text-void/25">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p class="font-mono text-xs tracking-widest uppercase text-center">Đang chờ mail...</p>
      </div>

      <div v-else class="divide-y-2 divide-void flex-1 overflow-y-auto hide-scrollbar min-h-0">
        <div v-for="(email, i) in emails" :key="email.uid"
          class="cursor-pointer px-3 py-3 sm:py-2.5 hover:bg-volt/10 transition-colors" :class="{
            'bg-volt/15 border-l-[3px] border-l-volt': selected === email.uid,
            'opacity-60': email.seen && selected !== email.uid,
          }" :style="{ transform: Number(i) % 2 === 0 ? 'rotate(0.3deg)' : 'rotate(-0.3deg)' }"
          @click="$emit('select', email.uid)">
          <div class="flex items-start justify-between gap-1">
            <span class="text-xs font-bold truncate flex-1 font-body">{{ email.from }}</span>
            <span class="font-mono text-[10px] text-void/40 whitespace-nowrap ml-1">{{ formatTime(email.date)
              }}</span>
          </div>
          <div class="text-xs mt-0.5 truncate font-body" :class="{ 'font-bold': !email.seen }">
            {{ email.subject }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
