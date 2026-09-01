<script setup lang="ts">
interface Props {
  showActions?: boolean
}

defineProps<Props>()
defineEmits<{
  refresh: []
  generate: []
}>()
</script>

<template>
  <div class="relative w-full bg-volt border-y-[3px] border-void overflow-hidden py-1.5 z-10 shrink-0">
    <div class="flex whitespace-nowrap animate-marquee">
      <span class="font-mono text-xs tracking-widest uppercase font-bold mx-6">TEMP MAIL ✦ DISPOSABLE EMAIL ✦ BẢO VỆ
        INBOX CA BẠN ✦ NO SPAM ✦</span>
      <span class="font-mono text-xs tracking-widest uppercase font-bold mx-6">TEMP MAIL ✦ DISPOSABLE EMAIL ✦ BẢO VỆ
        INBOX CỦA BẠN ✦ NO SPAM ✦</span>
    </div>
  </div>

  <div class="relative z-20 border-b-[3px] border-void bg-paper shrink-0">
    <div class="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span
          class="inline-flex items-center justify-center h-9 w-9 rounded-xl border-[3px] border-void bg-volt shadow-chunky-sm">
          <span class="font-display font-black text-void text-base">@</span>
        </span>
        <span class="font-display font-black text-lg tracking-tight">TEMP MAIL</span>
      </div>
      <div v-if="showActions" class="flex items-center gap-2">
        <button class="btn btn-ghost btn-sm md:btn-xs font-mono text-xs tracking-widest uppercase"
          @click="$emit('refresh')">
          ↻ refresh
        </button>
        <button
          class="btn btn-sm md:btn-xs font-display font-bold border-2 border-void bg-volt text-void hover:-translate-y-0.5 hover:shadow-chunky-volt transition-all shadow-chunky-sm px-3 py-1"
          @click="$emit('generate')">
          + MỚI
        </button>
      </div>
    </div>
  </div>
</template>
