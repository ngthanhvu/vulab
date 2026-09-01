<script setup lang="ts">
import type { Email } from '~/composables/mail/useMailApi'
import { formatDate } from '~/utils/date'

interface Props {
  emails: Email[]
  selected: number | null
}

defineProps<Props>()
defineEmits<{
  select: [uid: number]
}>()
</script>

<template>
  <div class="w-full md:w-80 shrink-0 h-45 md:h-full flex flex-col min-h-0">
    <div class="rounded-2xl border-[3px] border-void bg-paper shadow-chunky overflow-hidden flex flex-col h-full">
      <div
        class="border-b-[3px] border-void px-4 py-2 font-mono text-xs tracking-widest uppercase text-void/50 bg-base-200 shrink-0">
        INBOX — {{ emails.length }} MAIL
      </div>

      <div v-if="!emails.length" class="flex flex-col items-center justify-center flex-1 p-4 text-void/25">
        <p class="font-mono text-xs tracking-widest uppercase text-center">Đang chờ mail...</p>
      </div>

      <div v-else class="divide-y-[3px] divide-void flex-1 overflow-y-auto hide-scrollbar min-h-0">
        <div v-for="email in emails" :key="email.uid"
          class="cursor-pointer px-4 py-3 hover:bg-volt/10 transition-colors"
          :class="{ 'bg-volt/15 border-l-[3px] border-l-volt': selected === email.uid }"
          @click="$emit('select', email.uid)">
          <div class="flex items-start justify-between gap-1">
            <span class="text-xs font-bold truncate flex-1 font-body">{{ email.from }}</span>
            <span class="font-mono text-[10px] text-void/40 whitespace-nowrap ml-1">{{ formatDate(email.date)
              }}</span>
          </div>
          <div class="text-sm mt-0.5 truncate font-body" :class="{ 'font-bold': !email.seen }">
            {{ email.subject }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
