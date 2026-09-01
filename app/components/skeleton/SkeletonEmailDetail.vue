<template>
  <div class="flex-1 h-full min-h-0 flex flex-col">
    <div class="rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col h-full p-4 md:p-5 space-y-4">
      <div class="flex items-center gap-2">
        <Skeleton width="60px" height="20px" rounded="md" />
        <Skeleton width="120px" height="14px" rounded="sm" />
      </div>
      <Skeleton width="min(100%, 420px)" height="24px" rounded="md" />
      <Skeleton width="220px" height="14px" rounded="sm" />
      <div class="border-t border-border pt-4 space-y-3 flex-1">
        <Skeleton v-for="n in 6" :key="n" width="100%" height="14px" rounded="sm" />
      </div>
    </div>
  </div>
</template>
