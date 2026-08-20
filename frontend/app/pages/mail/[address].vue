<script setup>
const route = useRoute()
const address = computed(() => decodeURIComponent(route.params.address || ''))

const emails = ref([])
const loading = ref(false)
const selected = ref(null)

const selectedEmail = computed(() => {
  if (!emails.value.length || selected.value === null) return null
  return emails.value.find(e => e.uid === selected.value) || null
})

function selectEmail(uid) {
  selected.value = uid
}

function formatDate(d) {
  return new Date(d).toLocaleString('vi-VN')
}

async function fetchInbox() {
  if (!address.value) return
  loading.value = true
  try {
    const res = await fetch(`/api/emails/inbox/${encodeURIComponent(address.value)}`)
    const data = await res.json()
    emails.value = data.emails || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInbox()
  const interval = setInterval(fetchInbox, 5000)
  onUnmounted(() => clearInterval(interval))
})

useHead({
  title: `Inbox ${address.value}`
})
</script>

<template>
  <div class="min-h-screen bg-paper font-body text-void flex flex-col overflow-x-hidden">
    <div class="relative z-20 max-w-6xl mx-auto p-4 md:p-6 pb-8 md:pb-12 flex-1 w-full flex flex-col">
      <div class="mb-3 md:mb-4 shrink-0 flex items-center justify-between">
        <div>
          <NuxtLink to="/mail" class="inline-flex items-center text-xs font-mono text-void/60 hover:text-void mb-1">
            ← TRANG CHỦ TEMP MAIL
          </NuxtLink>
          <h1 class="font-display font-black text-2xl mb-1">TEMP MAIL</h1>
          <p class="font-mono text-sm text-void/60">Inbox của <strong>{{ address }}</strong></p>
        </div>
      </div>

      <div v-if="loading && !emails.length" class="text-center py-12 text-void/40 shrink-0">
        Đang tải...
      </div>

      <div class="flex flex-col md:flex-row gap-4 mb-4 md:mb-6 flex-1 min-h-[380px] md:min-h-[420px]">
        <!-- Inbox list column -->
        <div class="w-full md:w-80 shrink-0 h-[180px] md:h-full flex flex-col min-h-0">
          <div class="rounded-2xl border-[3px] border-void bg-paper shadow-chunky overflow-hidden flex flex-col h-full">
            <div
              class="border-b-[3px] border-void px-4 py-2 font-mono text-xs tracking-widest uppercase text-void/50 bg-base-200 shrink-0">
              INBOX — {{ emails.length }} MAIL
            </div>

            <div v-if="!emails.length" class="flex flex-col items-center justify-center flex-1 p-4 text-void/25">
              <p class="font-mono text-xs tracking-widest uppercase text-center">Đang chờ mail...</p>
            </div>

            <div v-else class="divide-y-[3px] divide-void flex-1 overflow-y-auto hide-scrollbar min-h-0">
              <div v-for="email in emails" :key="email.uid"
                class="cursor-pointer px-4 py-3 hover:bg-volt/10 transition-colors"
                :class="{ 'bg-volt/15 border-l-[3px] border-l-volt': selected === email.uid }"
                @click="selectEmail(email.uid)">
                <div class="flex items-start justify-between gap-1">
                  <span class="text-xs font-bold truncate flex-1 font-body">{{ email.from }}</span>
                  <span class="font-mono text-[10px] text-void/40 whitespace-nowrap ml-1">{{ formatDate(email.date)
                    }}</span>
                </div>
                <div class="text-sm mt-0.5 truncate font-body" :class="{ 'font-bold': !email.seen }">
                  {{ email.subject }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detail column -->
        <div class="flex-1 h-[330px] md:h-full min-h-0 flex flex-col">
          <div class="rounded-2xl border-[3px] border-void bg-paper shadow-chunky overflow-hidden flex flex-col h-full">
            <div v-if="!selectedEmail" class="flex flex-col items-center justify-center h-full py-16 text-void/20">
              <p class="font-mono text-xs tracking-widest uppercase">Chọn email để đọc</p>
            </div>

            <div v-else class="flex flex-col h-full min-h-0 overflow-hidden">
              <div class="p-4 md:p-5 border-b-[3px] border-void shrink-0 bg-paper z-10">
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class="inline-flex items-center rounded-xl border-[3px] border-void px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase font-bold"
                    :class="selectedEmail.seen ? 'bg-base-200 text-void/50' : 'bg-volt text-void'">
                    {{ selectedEmail.seen ? 'ĐÃ ĐỌC' : 'MỚI' }}
                  </span>
                  <span class="font-mono text-[10px] tracking-widest uppercase text-void/40">{{
                    formatDate(selectedEmail.date) }}</span>
                </div>
                <h2 class="font-display font-black text-lg md:text-xl leading-tight mb-2 wrap-break-word">{{
                  selectedEmail.subject }}</h2>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm">
                  <span class="font-bold text-magenta break-all">{{ selectedEmail.from }}</span>
                  <span class="font-mono text-xs text-void/40 break-all">→ {{ address }}</span>
                </div>
              </div>
              <div
                class="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-6 min-h-0 [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full">
                <div v-if="selectedEmail.html" class="prose max-w-none text-sm font-body wrap-break-word"
                  v-html="selectedEmail.html"></div>
                <pre v-else
                  class="whitespace-pre-wrap font-mono text-sm leading-relaxed wrap-break-word">{{ selectedEmail.text }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="relative z-20 mt-auto border-t-[3px] border-void bg-void py-3 shrink-0">
      <div class="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <span class="font-mono text-xs tracking-widest text-paper/40 uppercase">Temp Mail v1</span>
        <span class="font-mono text-xs tracking-widest text-paper/40 uppercase">IMAP PWRD</span>
      </div>
    </div>
  </div>
</template>
