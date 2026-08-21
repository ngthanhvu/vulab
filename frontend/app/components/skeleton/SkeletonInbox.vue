<template>
  <div class="flex flex-col md:flex-row gap-4 mb-4 md:mb-6 flex-1 min-h-95 md:min-h-105">
    <!-- List column -->
    <div class="w-full md:w-80 shrink-0 h-45 md:h-full flex flex-col min-h-0">
      <div class="rounded-2xl border-[3px] border-void bg-paper shadow-chunky overflow-hidden flex flex-col h-full">
        <div class="border-b-[3px] border-void px-4 py-2 bg-base-200 shrink-0">
          <Skeleton width="120px" height="14px" rounded="full" />
        </div>
        <div class="flex-1 p-3 space-y-3">
          <Skeleton v-for="n in 5" :key="n" width="100%" height="48px" rounded="lg" />
        </div>
      </div>
    </div>

    <!-- Detail column -->
    <div class="flex-1 h-82.5 md:h-full min-h-0 flex flex-col">
      <div
        class="rounded-2xl border-[3px] border-void bg-paper shadow-chunky overflow-hidden flex flex-col h-full p-4 md:p-5">
        <Skeleton width="80px" height="22px" rounded="full" class="mb-3" />
        <Skeleton width="min(100%, 420px)" height="28px" rounded="lg" class="mb-4" />
        <Skeleton width="200px" height="14px" rounded="full" class="mb-6" />
        <div class="space-y-3 flex-1">
          <Skeleton v-for="n in 12" :key="n" width="100%" height="14px" rounded="full" />
        </div>
      </div>
    </div>
  </div>
</template>
