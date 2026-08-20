<script setup lang="ts">
interface Email {
  uid: number
  subject: string
  from: string
  to: string
  date: string
  text: string
  html: string
  seen: boolean
}

const domains = ref<string[]>([])
const selectedDomain = ref('')
const emailAddress = ref('')
const emails = ref<Email[]>([])
const loading = ref(false)
const selected = ref<number | null>(null)
const generated = ref(false)
const copied = ref(false)
const searchAddress = ref('')

const router = useRouter()

function goToInbox() {
  const address = searchAddress.value.trim().toLowerCase()
  if (!address) return
  router.push(`/mail/${encodeURIComponent(address)}`)
}

const selectedEmail = computed(() => {
  if (!emails.value.length || selected.value === null) return null
  return emails.value.find(e => e.uid === selected.value) || null
})

function selectEmail(uid: number) {
  selected.value = uid
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleString('vi-VN')
}

function formatTime(d: string | Date) {
  const date = new Date(d)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'vừa xong'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return date.toLocaleDateString('vi-VN')
}

async function fetchDomains() {
  try {
    const res = await fetch('/api/emails/domains')
    const list = await res.json()
    domains.value = list
    if (list.length > 0) {
      selectedDomain.value = list[Math.floor(Math.random() * list.length)]
      await generateEmail()
    }
  } catch (e) { console.error(e) }
}

async function generateEmail() {
  loading.value = true
  try {
    const domain = domains.value[Math.floor(Math.random() * domains.value.length)]
    selectedDomain.value = domain
    const res = await fetch(`/api/emails/generate?domain=${domain}`)
    const data = await res.json()
    emailAddress.value = data.address
    generated.value = true
    selected.value = null
    copied.value = false
    await fetchInbox()
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

async function fetchInbox() {
  if (!emailAddress.value) return
  try {
    const res = await fetch(`/api/emails/inbox/${encodeURIComponent(emailAddress.value)}`)
    const data = await res.json()
    emails.value = data.emails || []
  } catch (e) { console.error(e) }
}

function copyEmail() {
  navigator.clipboard.writeText(emailAddress.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

onMounted(() => {
  fetchDomains()
  const interval = setInterval(fetchInbox, 5000)
  onUnmounted(() => clearInterval(interval))
})

useHead({
  title: 'Temp Mail - Tạo email tạm thời'
})
</script>

<template>
  <div class="min-h-screen bg-paper font-body text-void relative overflow-hidden flex flex-col">
    <!-- Grain -->
    <div class="grain-overlay"></div>

    <!-- Background blobs -->
    <div class="fixed -top-32 -right-32 h-96 w-96 rounded-full bg-violet/20 blur-3xl pointer-events-none animate-blob" style="animation-delay: 0s"></div>
    <div class="fixed -bottom-32 -left-32 h-96 w-96 rounded-full bg-magenta/15 blur-3xl pointer-events-none animate-blob" style="animation-delay: -4s"></div>
    <div class="fixed top-1/2 left-1/2 h-72 w-72 rounded-full bg-cyan/10 blur-3xl pointer-events-none animate-blob" style="animation-delay: -8s"></div>

    <!-- Marquee band -->
    <div class="relative w-full bg-volt border-y-[3px] border-void overflow-hidden py-2 z-10">
      <div class="flex whitespace-nowrap animate-marquee">
        <span class="font-mono text-xs tracking-widest uppercase font-bold mx-6">TEMP MAIL ✦ DISPOSABLE EMAIL ✦ BẢO VỆ INBOX CỦA BẠN ✦ NO SPAM ✦</span>
        <span class="font-mono text-xs tracking-widest uppercase font-bold mx-6">TEMP MAIL ✦ DISPOSABLE EMAIL ✦ BẢO VỆ INBOX CỦA BẠN ✦ NO SPAM ✦</span>
      </div>
    </div>

    <!-- Navbar -->
    <div class="relative z-20 border-b-[3px] border-void bg-paper">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center justify-center h-10 w-10 rounded-xl border-[3px] border-void bg-volt shadow-chunky-sm">
            <span class="font-display font-black text-void text-lg">@</span>
          </span>
          <span class="font-display font-black text-xl tracking-tight">TEMP MAIL</span>
        </div>
        <div v-if="generated" class="flex items-center gap-2">
          <button class="btn btn-ghost btn-sm font-mono text-xs tracking-widest uppercase" @click="fetchInbox">
            ↻ refresh
          </button>
          <button class="btn btn-sm font-display font-bold border-[3px] border-void bg-volt text-void hover:-translate-y-0.5 hover:shadow-chunky-volt transition-all shadow-chunky-sm" @click="generateEmail">
            + MỚI
          </button>
        </div>
      </div>
    </div>

    <div class="relative z-20 max-w-6xl mx-auto p-4 md:p-6 pb-8 md:pb-12 flex-1 w-full flex flex-col min-h-0">
      <!-- Generate Section -->
      <div class="rounded-2xl border-[3px] border-void bg-paper shadow-chunky p-5 md:p-6 mb-4 md:mb-6 shrink-0">
        <div v-if="!generated" class="flex items-center justify-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else>
          <div class="rounded-2xl border-[3px] border-void bg-void p-4 shadow-chunky">
            <div class="flex items-center gap-2 mb-3">
              <span class="h-3 w-3 rounded-full bg-[#FF5F57]"></span>
              <span class="h-3 w-3 rounded-full bg-[#FFBD2E]"></span>
              <span class="h-3 w-3 rounded-full bg-[#28CA41]"></span>
            </div>
            <div class="flex items-center justify-between gap-4 flex-wrap">
              <code class="font-mono text-volt text-base md:text-xl font-bold break-all">{{ emailAddress }}</code>
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/mail/${encodeURIComponent(emailAddress)}`"
                  class="btn btn-sm border-[3px] border-volt bg-transparent text-volt font-mono font-bold hover:bg-volt hover:text-void transition-all shadow-chunky-sm"
                >
                  MỞ RIÊNG
                </NuxtLink>
                <button
                  class="btn btn-sm border-[3px] border-volt bg-transparent text-volt font-mono font-bold hover:bg-volt hover:text-void transition-all shadow-chunky-sm"
                  @click="copyEmail"
                >
                  {{ copied ? '✓ COPIED' : 'COPY' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Inbox -->
      <div class="rounded-2xl border-[3px] border-void bg-paper shadow-chunky p-5 md:p-6 mb-4 md:mb-6 shrink-0">
        <label class="font-mono text-xs tracking-widest uppercase font-bold block mb-3">TÌM LẠI INBOX</label>
        <form class="flex flex-col md:flex-row gap-3" @submit.prevent="goToInbox">
          <input
            v-model="searchAddress"
            type="text"
            placeholder="nhập địa chỉ email..."
            class="input input-bordered flex-1 border-[3px] border-void font-mono"
          />
          <button
            type="submit"
            class="btn border-[3px] border-void bg-volt text-void font-bold font-display hover:-translate-y-0.5 hover:shadow-chunky-volt transition-all shadow-chunky-sm"
          >
            MỞ INBOX
          </button>
        </form>
      </div>

      <!-- Inbox -->
      <div v-if="generated" class="flex flex-col md:flex-row gap-4 flex-1 min-h-[380px] md:min-h-[450px] mb-4 md:mb-6">
        <!-- Email List -->
        <div class="w-full md:w-80 shrink-0 h-[250px] md:h-auto flex flex-col min-h-0">
          <div class="rounded-2xl border-[3px] border-void bg-paper shadow-chunky overflow-hidden flex flex-col h-full">
            <div class="border-b-[3px] border-void px-4 py-2 font-mono text-xs tracking-widest uppercase text-void/50 bg-base-200 shrink-0">
              INBOX — {{ emails.length }} MAIL
            </div>

            <div v-if="!emails.length" class="flex flex-col items-center justify-center flex-1 p-4 text-void/25">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p class="font-mono text-xs tracking-widest uppercase text-center">Đang chờ mail...</p>
            </div>

            <div v-else class="divide-y-[3px] divide-void flex-1 overflow-y-auto hide-scrollbar min-h-0">
              <div
                v-for="(email, i) in emails"
                :key="email.uid"
                class="cursor-pointer px-4 py-3 hover:bg-volt/10 transition-colors"
                :class="{
                  'bg-volt/15 border-l-[3px] border-l-volt': selected === email.uid,
                  'opacity-60': email.seen && selected !== email.uid,
                }"
                :style="{ transform: `rotate(${i % 2 === 0 ? 0.3 : -0.3}deg)` }"
                @click="selectEmail(email.uid)"
              >
                <div class="flex items-start justify-between gap-1">
                  <span class="text-xs font-bold truncate flex-1 font-body">{{ email.from }}</span>
                  <span class="font-mono text-[10px] text-void/40 whitespace-nowrap ml-1">{{ formatTime(email.date) }}</span>
                </div>
                <div class="text-sm mt-0.5 truncate font-body" :class="{ 'font-bold': !email.seen }">
                  {{ email.subject }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Email Detail -->
        <div class="flex-1 h-[350px] md:h-auto min-h-0 flex flex-col">
          <div class="rounded-2xl border-[3px] border-void bg-paper shadow-chunky overflow-hidden flex flex-col h-full">
            <div v-if="!selectedEmail" class="flex flex-col items-center justify-center h-full py-16 text-void/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p class="font-mono text-xs tracking-widest uppercase">Chọn email để đọc</p>
            </div>

            <div v-else class="flex flex-col h-full min-h-0 overflow-hidden">
              <div class="p-4 md:p-5 border-b-[3px] border-void shrink-0 bg-paper z-10">
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class="inline-flex items-center rounded-xl border-[3px] border-void px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase font-bold"
                    :class="selectedEmail.seen ? 'bg-base-200 text-void/50' : 'bg-volt text-void'"
                  >
                    {{ selectedEmail.seen ? 'ĐÃ ĐỌC' : 'MỚI' }}
                  </span>
                  <span class="font-mono text-[10px] tracking-widest uppercase text-void/40">{{ formatDate(selectedEmail.date) }}</span>
                </div>
                <h2 class="font-display font-black text-lg md:text-xl leading-tight mb-2 wrap-break-word">{{ selectedEmail.subject }}</h2>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm">
                  <span class="font-bold text-magenta break-all">{{ selectedEmail.from }}</span>
                  <span class="font-mono text-xs text-void/40 break-all">→ {{ emailAddress }}</span>
                </div>
              </div>
              <div class="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-6 min-h-0 [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full">
                <div v-if="selectedEmail.html" class="prose max-w-none text-sm font-body wrap-break-word" v-html="selectedEmail.html"></div>
                <pre v-else class="whitespace-pre-wrap font-mono text-sm leading-relaxed wrap-break-word">{{ selectedEmail.text }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="relative z-20 mt-auto border-t-[3px] border-void bg-void py-4">
      <div class="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <span class="font-mono text-xs tracking-widest text-paper/40 uppercase">Temp Mail v1</span>
        <span class="font-mono text-xs tracking-widest text-paper/40 uppercase">IMAP PWRD</span>
      </div>
    </div>
  </div>
</template>