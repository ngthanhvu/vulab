<script setup lang="ts">
interface Props {
  address: string
}

defineProps<Props>()
</script>

<template>
  <div class="mb-3 md:mb-4 shrink-0 flex items-center justify-between">
    <div>
      <NuxtLink to="/mail" class="inline-flex items-center text-xs font-mono text-void/60 hover:text-void mb-1">
        ← TRANG CHỦ TEMP MAIL
      </NuxtLink>
      <h1 class="font-display font-black text-2xl mb-1">TEMP MAIL</h1>
      <p class="font-mono text-sm text-void/60">Inbox của <strong>{{ address }}</strong></p>
    </div>
  </div>
</template>
