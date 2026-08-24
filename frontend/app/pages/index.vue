<template>
    <div class="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
        <!-- Nội dung chính -->
        <main class="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <!-- Nhãn nhỏ -->
            <span
                class="mb-8 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-medium tracking-wide text-green-700">
                <span class="relative flex h-2 w-2">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-40">
                    </span>
                    <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Đang triển khai
            </span>

            <!-- Icon minh họa (Lucide) -->
            <div class="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <LucideConstruction class="h-8 w-8 text-neutral-400" stroke-width="1.5" />
            </div>

            <!-- Tiêu đề -->
            <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
                Trang đang được xây dựng
            </h1>

            <!-- Mô tả -->
            <p class="mt-4 max-w-md text-sm sm:text-base text-neutral-500 leading-relaxed">
                Chúng tôi đang hoàn thiện trang này để mang đến trải nghiệm tốt nhất.
                Vui lòng quay lại sau ít lâu nữa nhé.
            </p>

            <!-- Liên hệ -->
            <form class="mt-10 w-full max-w-xl">
                <div class="relative w-full">
                    <input type="email" placeholder="Email của bạn" required
                        class="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-4 pr-44 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none" />
                    <button type="submit"
                        class="absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus:outline-none">
                        Gửi
                    </button>
                </div>
            </form>
        </main>

        <!-- Footer -->
        <footer class="py-6 text-center text-xs text-neutral-400">
            &copy; {{ currentYear }} thanhvu.net. Mọi quyền được bảo lưu.
        </footer>
    </div>
</template>

<script setup>
useHead({
    title: "Đang xây dựng",
})

const currentYear = new Date().getFullYear()
</script>