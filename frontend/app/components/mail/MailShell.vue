<template>
  <div class="min-h-screen bg-paper font-body text-void relative overflow-x-hidden flex flex-col">
    <div class="grain-overlay"></div>

    <div class="fixed -top-32 -right-32 h-96 w-96 rounded-full bg-violet/20 blur-3xl pointer-events-none animate-blob"
      style="animation-delay: 0s"></div>
    <div
      class="fixed -bottom-32 -left-32 h-96 w-96 rounded-full bg-magenta/15 blur-3xl pointer-events-none animate-blob"
      style="animation-delay: -4s"></div>
    <div class="fixed top-1/2 left-1/2 h-72 w-72 rounded-full bg-cyan/10 blur-3xl pointer-events-none animate-blob"
      style="animation-delay: -8s"></div>

    <slot />
  </div>
</template>
