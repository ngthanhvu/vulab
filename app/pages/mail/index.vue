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
  const interval = setInterval(() => mail.fetchInbox(), 5000)
  onUnmounted(() => clearInterval(interval))
})

useHead({
  title: 'Temp Mail - Tạo email tạm thời'
})
</script>

<template>
  <MailShell>
    <MailPageHeader :show-actions="mail.generated" @refresh="mail.fetchInbox" @generate="mail.generateEmail" />

    <div class="relative z-20 max-w-6xl mx-auto px-4 py-3 md:py-4 flex-1 w-full flex flex-col">
      <MailGenerator
        :email-address="mail.emailAddress"
        :copied="mail.copied"
        :loading="!mail.generated"
        @copy="mail.copyEmail"
        @generate="mail.generateEmail"
      />

      <MailSearchInbox v-model:search-address="mail.searchAddress" @submit="goToInbox" />

      <div v-if="mail.generated" class="flex flex-col md:flex-row gap-3 mb-3 flex-1 min-h-95 md:min-h-105">
        <MailInboxList
          :emails="mail.emails"
          :selected="mail.selected"
          :address="mail.emailAddress"
          @select="mail.selectEmail"
        />
        <MailEmailDetail :email="mail.selectedEmail" :address="mail.emailAddress" />
      </div>
      <SkeletonInbox v-else class="shrink-0" aria-busy="true" aria-label="Đang tải inbox" />
    </div>

    <MailPageFooter />
  </MailShell>
</template>
