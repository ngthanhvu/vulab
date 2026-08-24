<script setup lang="ts">
interface Props {
  emailAddress: string
  copied: boolean
  loading?: boolean
}

defineProps<Props>()
defineEmits<{
  copy: []
  generate: []
}>()
</script>

<template>
  <div class="rounded-xl border-[3px] border-void bg-paper shadow-chunky p-3 md:p-4 mb-3 shrink-0">
    <div v-if="loading" class="py-2" aria-busy="true" aria-label="Đang tạo địa chỉ email">
      <div class="rounded-xl border-[3px] border-void bg-void p-3 shadow-chunky">
        <div class="flex items-center gap-2 mb-2">
          <Skeleton width="10px" height="10px" circle class="bg-white/20" />
          <Skeleton width="10px" height="10px" circle class="bg-white/20" />
          <Skeleton width="10px" height="10px" circle class="bg-white/20" />
        </div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Skeleton width="min(100%, 320px)" height="24px" rounded="lg" class="bg-white/20" />
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton width="100%" height="32px" rounded="lg" class="sm:w-24 bg-white/20" />
            <Skeleton width="100%" height="32px" rounded="lg" class="sm:w-24 bg-white/20" />
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="rounded-xl border-[3px] border-void bg-void p-3 shadow-chunky">
        <div class="flex items-center gap-2 mb-2">
          <span class="h-2.5 w-2.5 rounded-full bg-[#FF5F57]"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-[#28CA41]"></span>
        </div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <code
            class="font-mono text-volt text-sm md:text-lg font-bold break-all w-full sm:w-auto">{{ emailAddress }}</code>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <NuxtLink :to="`/mail/${encodeURIComponent(emailAddress)}`"
              class="btn btn-sm md:btn-xs border-2 border-volt bg-transparent text-volt font-mono font-bold hover:bg-volt hover:text-void transition-all shadow-chunky-sm flex-1 sm:flex-initial text-center">
              MỞ RIÊNG
            </NuxtLink>
            <button
              class="btn btn-sm md:btn-xs border-2 border-volt bg-transparent text-volt font-mono font-bold hover:bg-volt hover:text-void transition-all shadow-chunky-sm flex-1 sm:flex-initial"
              @click="$emit('copy')">
              {{ copied ? '✓ COPIED' : 'COPY' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
