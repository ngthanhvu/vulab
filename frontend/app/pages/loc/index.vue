<script setup lang="ts">
const input = ref('')
const output = ref('')
const count = ref(0)

function filterData() {
  if (!input.value.trim()) return

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
        <h1 class="text-white text-2xl md:text-3xl font-bold flex items-center gap-3"
          style="font-family: 'Plus Jakarta Sans', sans-serif;">
          <LucideScissors :size="28" />
          Lọc dữ liệu
        </h1>
        <p class="text-white/90 mt-2 text-sm" style="font-family: 'Plus Jakarta Sans', sans-serif;">
          Giữ lại đúng 3 phần đầu của mỗi dòng phân cách bằng dấu |
        </p>
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
        <textarea v-model="output" readonly placeholder="Kết quả sẽ xuất hiện ở đây..."
          class="w-full h-64 p-4 border-2 border-[#dfe6e9] outline-none resize-none text-sm"
          style="font-family: 'JetBrains Mono', monospace; background: #fff;" />
      </div>
    </div>
  </div>
</template>
