<template>
  <div class="flex flex-col md:flex-row gap-4 flex-1 min-h-0 h-full">
    <!-- List column -->
    <div class="w-full md:w-80 shrink-0 h-45 md:h-full flex flex-col min-h-0">
      <div class="rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col h-full">
        <div class="border-b border-border px-4 py-2 bg-muted shrink-0">
          <Skeleton width="120px" height="14px" rounded="full" />
        </div>
        <div class="flex-1 p-3 space-y-3">
          <Skeleton v-for="n in 5" :key="n" width="100%" height="48px" rounded="lg" />
        </div>
      </div>
    </div>

    <!-- Detail column -->
    <SkeletonEmailDetail />
  </div>
</template>

