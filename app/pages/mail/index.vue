<script setup lang="ts">
const mail = useMailStore()
const router = useRouter()

function goToInbox() {
  const address = mail.searchAddress.trim().toLowerCase()
  if (!address) return
  router.push(`/mail/${encodeURIComponent(address)}`)
}

onMounted(() => {
  mail.fetchDomains()
  const interval = setInterval(() => mail.fetchInbox(undefined, true), 5000)
  onUnmounted(() => clearInterval(interval))
})

useHead({
  title: 'Temp Mail - Tạo email tạm thời'
})
</script>

<template>
  <MailShell>
    <MailPageHeader :show-actions="mail.generated" @refresh="mail.fetchInbox" @generate="mail.generateEmail" />

    <div class="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
      <!-- Left sidebar: inbox list -->
      <aside
        class="w-full md:w-80 md:fixed md:left-0 md:top-0 md:h-screen md:z-10 shrink-0 border-b md:border-b-0 md:border-r border-border bg-card overflow-hidden flex flex-col">
        <MailInboxList :emails="mail.emails" :selected="mail.selected" :address="mail.emailAddress"
          :loading="mail.loading" @select="mail.selectEmail" />
      </aside>

      <!-- Main content -->
      <main class="flex-1 flex flex-col min-h-0 overflow-y-auto p-3 md:p-4 gap-3 bg-background md:pl-80">
        <MailGenerator :email-address="mail.emailAddress" :copied="mail.copied" :loading="!mail.generated"
          @copy="mail.copyEmail" @generate="mail.generateEmail" />

        <!-- <MailSearchInbox v-model:search-address="mail.searchAddress" @submit="goToInbox" /> -->

        <div v-if="mail.generated" class="flex-1 min-h-0">
          <MailEmailDetail :email="mail.selectedEmail" :address="mail.emailAddress" />
        </div>
        <SkeletonEmailDetail v-else aria-busy="true" aria-label="Đang tải email" />
      </main>
    </div>

    <MailPageFooter class="md:pl-80" />
  </MailShell>
</template>
