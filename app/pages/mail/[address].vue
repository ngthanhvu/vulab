<script setup>
const route = useRoute()
const address = computed(() => decodeURIComponent(route.params.address || ''))

const mail = useMailStore()

onMounted(() => {
  if (address.value) {
    mail.setEmailAddress(address.value)
    mail.fetchInbox(address.value)
  }
  const interval = setInterval(() => {
    if (address.value) mail.fetchInbox(address.value)
  }, 5000)
  onUnmounted(() => clearInterval(interval))
})

useHead({
  title: `Inbox ${address.value}`
})
</script>

<template>
  <MailShell>
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <MailAddressHeader :address="address" />

      <div class="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        <!-- Left sidebar -->
        <aside class="w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-border bg-card overflow-hidden flex flex-col">
          <MailAddressInboxList
            :emails="mail.emails"
            :selected="mail.selected"
            :loading="mail.loading"
            @select="mail.selectEmail"
          />
        </aside>

        <!-- Main content -->
        <main class="flex-1 flex flex-col min-h-0 overflow-hidden p-3 md:p-4 bg-background">
          <MailAddressEmailDetail :email="mail.selectedEmail" :address="address" />
        </main>
      </div>
    </div>

    <MailPageFooter />
  </MailShell>
</template>
