<template>
  <div class="max-w-3xl space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold">Settings</h1>
      <p class="mt-1 text-sm text-base-content/60">Manage your application preferences.</p>
    </div>

    <UiCard>
      <UiCardHeader>
        <UiCardTitle>General</UiCardTitle>
        <UiCardDescription>Update your site information.</UiCardDescription>
      </UiCardHeader>
      <UiCardContent class="space-y-4">
        <div class="form-control">
          <label class="label"><span class="label-text">Site name</span></label>
          <UiInput value="ThanhVu" />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">Site URL</span></label>
          <UiInput value="https://thanhvu.net" />
        </div>
      </UiCardContent>
      <UiCardFooter>
        <UiButton variant="outline">Cancel</UiButton>
        <UiButton>Save changes</UiButton>
      </UiCardFooter>
    </UiCard>

    <UiCard>
      <UiCardHeader>
        <UiCardTitle>Preferences</UiCardTitle>
        <UiCardDescription>Configure system-wide behavior.</UiCardDescription>
      </UiCardHeader>
      <UiCardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Maintenance mode</p>
            <p class="text-xs text-base-content/60">Temporarily disable public access.</p>
          </div>
          <UiSwitch v-model="maintenanceMode" />
        </div>
        <div class="divider"></div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Email notifications</p>
            <p class="text-xs text-base-content/60">Receive daily summary emails.</p>
          </div>
          <UiSwitch v-model="emailNotifications" />
        </div>
      </UiCardContent>
      <UiCardFooter>
        <UiButton variant="outline">Cancel</UiButton>
        <UiButton>Save changes</UiButton>
      </UiCardFooter>
    </UiCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Admin - Settings',
})

const maintenanceMode = ref(false)
const emailNotifications = ref(true)
</script>
