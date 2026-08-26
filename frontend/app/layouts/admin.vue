<template>
  <div class="min-h-screen bg-base-100 text-base-content flex" data-theme="neutral">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-72 -translate-x-full transform border-r border-base-300 bg-base-100 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0"
      :class="{ 'translate-x-0': sidebarOpen }">
      <AdminSidebar @close="sidebarOpen = false" />
    </aside>

    <!-- Overlay -->
    <div class="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden" :class="{ hidden: !sidebarOpen }"
      @click="sidebarOpen = false" />

    <!-- Main -->
    <div class="flex min-h-screen flex-1 flex-col">
      <header
        class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-base-300 bg-base-100/90 px-4 backdrop-blur">
        <button class="btn btn-ghost btn-square lg:hidden" @click="sidebarOpen = true">
          <LucideMenu class="h-5 w-5" />
        </button>
        <span class="font-bold lg:hidden">Admin</span>
        <div class="ml-auto flex items-center gap-3">
          <span class="text-sm text-base-content/60">admin@thanhvu.net</span>
          <div class="avatar">
            <div class="w-10 rounded-full">
              <img alt="Tailwind-CSS-Avatar-component"
                src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const sidebarOpen = ref(false)
</script>
