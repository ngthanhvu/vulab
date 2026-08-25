<template>
  <header class="border-b border-neutral-200 bg-white">
    <div class="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <LucideFileText class="h-5 w-5 text-neutral-600" />
        <span class="text-sm font-semibold text-neutral-900">Notepad</span>
      </div>
      <slot />
    </div>
  </header>
</template>
