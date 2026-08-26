<template>
  <div class="flex h-full flex-col">
    <div class="flex h-16 items-center border-b border-base-300 px-4">
      <NuxtLink to="/" class="flex items-center gap-2 text-lg font-bold">
        <span
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral text-neutral-content text-sm font-bold">TV</span>
        <span>Admin</span>
      </NuxtLink>
    </div>

    <nav class="flex-1 overflow-y-auto p-3 space-y-1">
      <NuxtLink to="/admin" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        :class="route.path === '/admin' ? 'bg-neutral text-neutral-content' : 'hover:bg-base-200'"
        @click="$emit('close')">
        <LucideLayoutDashboard class="h-4 w-4" />
        Dashboard
      </NuxtLink>

      <NuxtLink to="/admin/users"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        :class="isActive('/admin/users') ? 'bg-neutral text-neutral-content' : 'hover:bg-base-200'"
        @click="$emit('close')">
        <LucideUsers class="h-4 w-4" />
        Users
      </NuxtLink>

      <NuxtLink to="/admin/settings"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        :class="isActive('/admin/settings') ? 'bg-neutral text-neutral-content' : 'hover:bg-base-200'"
        @click="$emit('close')">
        <LucideSettings class="h-4 w-4" />
        Settings
      </NuxtLink>
    </nav>

    <div class="border-t border-base-300 p-3">
      <NuxtLink to="/" class="btn btn-ghost btn-block justify-start gap-2 normal-case">
        <LucideArrowLeft class="h-4 w-4" />
        Back to site
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
const route = useRoute()

function isActive(path) {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>
