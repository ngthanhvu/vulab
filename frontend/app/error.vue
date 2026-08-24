<template>
    <div class="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
        <!-- Nội dung chính -->
        <main class="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <!-- Nhãn nhỏ -->
            <span
                class="mb-8 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                Lỗi {{ statusCode }}
            </span>
            <!-- Mã lỗi to -->
            <div class="mb-4 text-7xl sm:text-8xl font-bold tracking-tight text-neutral-200">
                {{ statusCode }}
            </div>
            <!-- Tiêu đề -->
            <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
                {{ title }}
            </h1>
            <!-- Mô tả -->
            <p class="mt-4 max-w-md text-sm sm:text-base text-neutral-500 leading-relaxed">
                {{ description }}
            </p>
            <!-- Chi tiết lỗi (tuỳ chọn, hữu ích khi dev) -->
            <p v-if="errorMessage && isDev"
                class="mt-3 max-w-lg rounded-lg bg-neutral-100 px-4 py-2 text-xs text-neutral-400 font-mono wrap-break-word border border-gray-200">
                {{ errorMessage }}
            </p>
            <!-- Nút hành động -->
            <div class="mt-10 flex flex-col sm:flex-row items-center gap-3">
                <button type="button"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                    @click="handleGoHome">
                    <LucideHome class="h-4 w-4" />
                    Về trang chủ
                </button>
            </div>
        </main>
        <!-- Footer -->
        <footer class="py-6 text-center text-xs text-neutral-400">
            &copy; {{ currentYear }} thanhvu.net. Mọi quyền được bảo lưu.
        </footer>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    error: {
        type: Object,
        default: () => ({}),
    },
})

const isDev = import.meta.dev

const statusCode = computed(() => props.error?.statusCode || 500)
const errorMessage = computed(() => props.error?.message || '')

const title = computed(() => {
    if (statusCode.value === 404) return "Không tìm thấy trang"
    if (statusCode.value === 403) return "Bạn không có quyền truy cập"
    return "Đã có lỗi xảy ra"
})

const description = computed(() => {
    if (statusCode.value === 404) {
        return "Trang bạn đang tìm có thể đã bị xoá, đổi tên hoặc không tồn tại."
    }

    if (statusCode.value === 403) {
        return "Bạn cần quyền truy cập phù hợp để xem nội dung này."
    }

    return "Đã xảy ra sự cố ngoài ý muốn. Vui lòng thử lại hoặc quay về trang chủ."
})

useHead({
    title: () => title.value,
})

function handleGoHome() {
    clearError({ redirect: "/" })
}
const currentYear = new Date().getFullYear()
</script>