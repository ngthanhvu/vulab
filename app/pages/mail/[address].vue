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
    <div class="relative z-20 max-w-6xl mx-auto p-4 md:p-6 pb-8 md:pb-12 flex-1 w-full flex flex-col">
      <MailAddressHeader :address="address" />

      <div v-if="mail.loading && !mail.emails.length" class="shrink-0">
        <SkeletonInbox />
      </div>

      <div class="flex flex-col md:flex-row gap-4 mb-4 md:mb-6 flex-1 min-h-95 md:min-h-105">
        <MailAddressInboxList
          :emails="mail.emails"
          :selected="mail.selected"
          @select="mail.selectEmail"
        />
        <MailAddressEmailDetail :email="mail.selectedEmail" :address="address" />
      </div>
    </div>

    <MailPageFooter />
  </MailShell>
</template>
