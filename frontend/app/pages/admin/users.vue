<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold">Users</h1>
      <p class="text-sm text-base-content/60">Manage user accounts and permissions.</p>
    </div>

    <UiCard>
      <UiCardHeader>
        <div class="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <UiCardTitle>All users</UiCardTitle>
            <UiCardDescription>There are 1,204 registered users.</UiCardDescription>
          </div>
          <div class="flex items-center gap-2">
            <UiInput placeholder="Search users..." class="w-full sm:w-64" />
            <UiButton size="sm">Add user</UiButton>
          </div>
        </div>
      </UiCardHeader>
      <UiCardContent>
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>
                  <div class="flex items-center gap-3">
                    <UiAvatar :fallback="user.initials" />
                    <div>
                      <p class="font-medium">{{ user.name }}</p>
                      <p class="text-xs text-base-content/60">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="capitalize">{{ user.role }}</td>
                <td>
                  <UiBadge :variant="user.status === 'active' ? 'default' : 'secondary'">
                    {{ user.status }}
                  </UiBadge>
                </td>
                <td class="text-base-content/60">{{ user.joined }}</td>
                <td class="text-right">
                  <UiButton variant="ghost" size="icon">
                    <LucideMoreHorizontal class="h-4 w-4" />
                  </UiButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiCardContent>
      <UiCardFooter>
        <div class="flex w-full items-center justify-between">
          <p class="text-sm text-base-content/60">Showing 5 of 1,204 users</p>
          <div class="join">
            <UiButton variant="outline" size="sm" class="join-item">Previous</UiButton>
            <UiButton variant="outline" size="sm" class="join-item">Next</UiButton>
          </div>
        </div>
      </UiCardFooter>
    </UiCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Admin - Users',
})

const users = [
  { id: 1, name: 'Nguyen Van A', initials: 'NA', email: 'user1@example.com', role: 'admin', status: 'active', joined: '2024-08-20' },
  { id: 2, name: 'Tran Thi B', initials: 'TB', email: 'user2@example.com', role: 'user', status: 'active', joined: '2024-08-21' },
  { id: 3, name: 'Le Van C', initials: 'LC', email: 'user3@example.com', role: 'user', status: 'inactive', joined: '2024-08-22' },
  { id: 4, name: 'Pham Thi D', initials: 'PD', email: 'user4@example.com', role: 'user', status: 'active', joined: '2024-08-23' },
  { id: 5, name: 'Hoang Van E', initials: 'HE', email: 'user5@example.com', role: 'editor', status: 'active', joined: '2024-08-24' },
]
</script>
