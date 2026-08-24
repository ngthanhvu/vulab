<script setup lang="ts">
const input = ref('')
const output = ref('')
const count = ref(0)
const processing = ref(false)

function filterData() {
  processing.value = true
  if (!input.value.trim()) {
    output.value = ''
    count.value = 0
    processing.value = false
    return
  }

  const lines = input.value.split(/\r?\n/)

  const result = lines
    .map((line: string) => {
      line = line.trim()
      if (!line) return ''
      return line.split('|').slice(0, 3).join('|')
    })
    .filter((line: string) => line !== '')

  output.value = result.join('\n')
  count.value = result.length
  processing.value = false
}

function copyResult() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
}

function clearAll() {
  input.value = ''
  output.value = ''
  count.value = 0
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f5f5] p-4 md:p-8">
    <div class="max-w-2xl mx-auto">

      <!-- Header -->
      <div class="bg-[#ff6b6b] p-6 mb-6">
        <div v-if="loading" class="flex flex-col gap-3" aria-busy="true" aria-label="Đang tải">
          <Skeleton width="200px" height="36px" rounded="lg" class="bg-white/30" />
          <Skeleton width="min(100%, 320px)" height="18px" rounded="full" class="bg-white/30" />
        </div>
        <template v-else>
          <h1 class="text-white text-2xl md:text-3xl font-bold flex items-center gap-3"
            style="font-family: 'Plus Jakarta Sans', sans-serif;">
            <LucideScissors :size="28" />
            Lọc dữ liệu
          </h1>
          <p class="text-white/90 mt-2 text-sm" style="font-family: 'Plus Jakarta Sans', sans-serif;">
            Giữ lại đúng 3 phần đầu của mỗi dòng phân cách bằng dấu |
          </p>
        </template>
      </div>

      <!-- Input -->
      <div class="mb-4">
        <label class="block text-[#2d3436] text-sm font-semibold mb-2 uppercase tracking-wide"
          style="font-family: 'Plus Jakarta Sans', sans-serif;">
          Dữ liệu đầu vào
        </label>
        <textarea v-model="input" placeholder="123|33|33|2014-11-11 10:11:44"
          class="w-full h-64 p-4 border-2 border-[#dfe6e9] outline-none resize-none text-sm transition-colors focus:border-[#ff6b6b]"
          style="font-family: 'JetBrains Mono', monospace; background: #fff;" />
      </div>

      <!-- Buttons -->
      <div class="flex flex-wrap gap-3 mb-4">
        <button @click="filterData"
          class="px-6 py-3 text-white font-bold text-sm uppercase tracking-wide hover:brightness-110 transition-all"
          style="background: #ff6b6b; font-family: 'Plus Jakarta Sans', sans-serif;">
          <LucideScissors :size="16" class="inline mr-2" />
          Lọc
        </button>
        <button @click="copyResult" :disabled="!output"
          class="px-6 py-3 font-bold text-sm uppercase tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style="background: #1dd1a1; color: white; font-family: 'Plus Jakarta Sans', sans-serif;">
          <LucideCopy :size="16" class="inline mr-2" />
          Copy kết quả
        </button>
        <button @click="clearAll" class="px-6 py-3 font-bold text-sm uppercase tracking-wide transition-all"
          style="background: #576574; color: white; font-family: 'Plus Jakarta Sans', sans-serif;">
          <LucideTrash2 :size="16" class="inline mr-2" />
          Xóa
        </button>
      </div>

      <!-- Count -->
      <div v-if="count > 0" class="mb-4 px-4 py-3"
        style="background: #ffeaa7; font-family: 'Plus Jakarta Sans', sans-serif;">
        <span class="text-[#2d3436] text-sm font-semibold">Đã xử lý {{ count }} dòng</span>
      </div>

      <!-- Output -->
      <div>
        <label class="block text-[#2d3436] text-sm font-semibold mb-2 uppercase tracking-wide"
          style="font-family: 'Plus Jakarta Sans', sans-serif;">
          <LucideClipboardList :size="14" class="inline mr-1" />
          Kết quả
        </label>
        <div v-if="processing" class="w-full h-64 p-4 border-2 border-[#dfe6e9] bg-white rounded-sm"
          aria-busy="true" aria-label="Đang xử lý">
          <div class="flex flex-col gap-3 h-full">
            <Skeleton v-for="n in 8" :key="n" width="100%" height="14px" rounded="full" />
          </div>
        </div>
          <textarea v-else v-model="output" readonly placeholder="Kết quả sẽ xuất hiện ở đây..."
          class="w-full h-64 p-4 border-2 border-[#dfe6e9] outline-none resize-none text-sm"
          style="font-family: 'JetBrains Mono', monospace; background: #fff;" />
      </div>
    </div>
  </div>
</template>
