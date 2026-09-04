<script setup lang="ts">
interface Props {
  address: string
}

defineProps<Props>()
</script>

<template>
  <div class="relative z-20 shrink-0 flex items-center justify-between border-b bg-card px-4 py-3">
    <div>
      <NuxtLink to="/mail" class="inline-flex items-center text-xs font-mono text-muted-foreground hover:text-foreground mb-1">
        ← TRANG CHỦ TEMP MAIL
      </NuxtLink>
      <h1 class="font-display font-black text-2xl mb-1">TEMP MAIL</h1>
      <p class="font-mono text-sm text-muted-foreground">Inbox của <strong>{{ address }}</strong></p>
    </div>
  </div>
</template>
