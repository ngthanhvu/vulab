<script setup>
const props = defineProps({
    error: {
        type: Object,
        default: () => ({ statusCode: 500, statusMessage: 'Lỗi không xác định' })
    }
})

useHead({
    title: `Lỗi ${props.error?.statusCode || ''} — Có gì đó sai sai`,
    link: [
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Space+Grotesk:wght@400;500;600;700&family=Be+Vietnam+Pro:wght@400;700;900&display=swap'
        }
    ]
})

const code = computed(() => props.error?.statusCode || 500)
const isNotFound = computed(() => code.value === 404)

const heading = computed(() => (isNotFound.value ? 'KHÔNG THẤY' : 'TRỤC TRẶC'))
const subheading = computed(() => (isNotFound.value ? 'TRANG NÀY' : 'KỸ THUẬT'))

const message = computed(() => {
    if (props.error?.statusMessage) return props.error.statusMessage
    return isNotFound.value
        ? 'Trang bạn tìm có lẽ đã bị dời đi, đổi tên, hoặc chưa từng tồn tại.'
        : 'Máy chủ vừa vấp một viên gạch. Đội kỹ thuật đã được báo, đang xử lý.'
})

const suggestions = [
    { name: 'Kiểm tra lại đường dẫn', done: false },
    { name: 'Quay về trang chủ', done: false },
    { name: 'Thử tải lại trang', done: false },
]

const stickers = [
    { label: 'ERR', top: '12%', left: '6%', rot: -14, bg: '#00A8E8' },
    { label: 'OOPS', top: '20%', left: '86%', rot: 10, bg: '#FF6B35' },
    { label: `${code.value}`, top: '70%', left: '4%', rot: 8, bg: '#7B2CBF' },
    { label: 'BUG', top: '80%', left: '90%', rot: -8, bg: '#FF2E63' },
    { label: 'v0.4', top: '46%', left: '92%', rot: -6, bg: '#1A1A2E' },
    { label: '!!!', top: '8%', left: '46%', rot: 6, bg: '#FFB800' },
]

function goHome() {
    clearError({ redirect: '/' })
}

function reload() {
    if (import.meta.client) window.location.reload()
}
</script>

<template>
    <div class="page">
        <!-- textured backdrop -->
        <div class="grain" aria-hidden="true" />
        <div class="dots" aria-hidden="true" />

        <!-- top marquee -->
        <div class="marquee marquee--top" aria-hidden="true">
            <div class="marquee__track">
                <span v-for="n in 2" :key="n" class="marquee__group">
                    <span>CÓ GÌ ĐÓ SAI SAI</span><span class="marquee__dot">✦</span>
                    <span>LỖI {{ code }}</span><span class="marquee__dot">✦</span>
                    <span>ĐANG TÌM ĐƯỜNG VỀ</span><span class="marquee__dot">✦</span>
                </span>
            </div>
        </div>

        <!-- corner tape -->
        <div class="tape tape--tl" aria-hidden="true">KHU VỰC LỖI — CẨN THẬN</div>
        <div class="tape tape--br" aria-hidden="true">KHU VỰC LỖI — CẨN THẬN</div>

        <!-- floating stickers -->
        <div v-for="s in stickers" :key="s.label" class="sticker"
            :style="{ top: s.top, left: s.left, '--rot': s.rot + 'deg', '--bg': s.bg }" aria-hidden="true">
            {{ s.label }}
        </div>

        <main class="stage">
            <!-- spinning seal -->
            <div class="seal" aria-hidden="true">
                <svg viewBox="0 0 200 200" class="seal__ring">
                    <defs>
                        <path id="sealCircle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                    </defs>
                    <text>
                        <textPath href="#sealCircle" startOffset="0%">
                            • LỖI HỆ THỐNG • LỖI HỆ THỐNG • LỖI HỆ THỐNG
                        </textPath>
                    </text>
                </svg>
                <div class="seal__core">
                    <span class="seal__core-icon">⚠</span>
                </div>
            </div>

            <p class="eyebrow">MÃ LỖI {{ code }}</p>

            <h1 class="headline">
                <span class="headline__line headline__line--a">{{ heading }}</span>
                <span class="headline__line headline__line--b">{{ subheading }}</span>
                <span class="headline__line headline__line--c">RỒI<span class="headline__spark">*</span></span>
            </h1>

            <p class="lede">{{ message }}</p>

            <div class="panel">
                <div class="panel__header">
                    <span class="panel__title">BẠN CÓ THỂ THỬ</span>
                    <span class="panel__badge">{{ code }}</span>
                </div>
                <div class="progress">
                    <div class="progress__fill" style="width: 100%" />
                </div>

                <ul class="tasks">
                    <li v-for="t in suggestions" :key="t.name" class="tasks__item">
                        <span class="tasks__box" />
                        <span>{{ t.name }}</span>
                    </li>
                </ul>
            </div>

            <div class="actions">
                <button type="button" class="actions__button actions__button--primary" @click="goHome">
                    Về trang chủ
                </button>
                <button type="button" class="actions__button actions__button--ghost" @click="reload">
                    Tải lại trang
                </button>
            </div>
        </main>

        <!-- bottom marquee -->
        <div class="marquee marquee--bottom" aria-hidden="true">
            <div class="marquee__track marquee__track--reverse">
                <span v-for="n in 2" :key="n" class="marquee__group">
                    <span>ĐỘI KỸ THUẬT ĐANG XỬ LÝ</span><span class="marquee__dot">✦</span>
                    <span>THỬ LẠI SAU NHÉ</span><span class="marquee__dot">✦</span>
                    <span>XIN LỖI VÌ SỰ BẤT TIỆN</span><span class="marquee__dot">✦</span>
                </span>
            </div>
        </div>
    </div>
</template>

<style>
html,
body,
#__nuxt {
    height: 100%;
    margin: 0;
    overflow: hidden;
}
</style>

<style scoped>
* {
    box-sizing: border-box;
}

.page {
    --ink: #1a1a2e;
    --paper: #ffe14d;
    --pink: #ff2e63;
    --blue: #00a8e8;
    --purple: #7b2cbf;
    --orange: #ff6b35;
    --amber: #ffb800;

    position: relative;
    height: 100vh;
    height: 100dvh;
    width: 100%;
    overflow: hidden;
    background: var(--paper);
    color: var(--ink);
    font-family: 'Space Grotesk', sans-serif;
    isolation: isolate;
    display: flex;
    flex-direction: column;
}

.dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(var(--ink) 1.4px, transparent 1.4px);
    background-size: 26px 26px;
    opacity: 0.14;
    pointer-events: none;
}

.grain {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
    mix-blend-mode: multiply;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* marquee */
.marquee {
    position: relative;
    z-index: 3;
    flex: none;
    width: 100%;
    overflow: hidden;
    background: var(--ink);
    color: var(--paper);
    border-bottom: 3px solid var(--ink);
    padding: clamp(5px, 1.1vh, 10px) 0;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    font-size: clamp(0.6rem, 1.4vw, 0.9rem);
    letter-spacing: 0.06em;
}

.marquee--bottom {
    border-bottom: none;
    border-top: 3px solid var(--ink);
}

.marquee__track {
    display: flex;
    width: max-content;
    animation: scroll-left 22s linear infinite;
}

.marquee__track--reverse {
    animation-name: scroll-right;
}

.marquee__group {
    display: flex;
    align-items: center;
    gap: 1.4rem;
    padding-right: 1.4rem;
    white-space: nowrap;
}

.marquee__dot {
    color: var(--pink);
}

@keyframes scroll-left {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-50%);
    }
}

@keyframes scroll-right {
    from {
        transform: translateX(-50%);
    }

    to {
        transform: translateX(0);
    }
}

/* tape */
.tape {
    position: absolute;
    z-index: 4;
    background: repeating-linear-gradient(45deg,
            var(--pink),
            var(--pink) 12px,
            var(--ink) 12px,
            var(--ink) 24px);
    color: transparent;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    font-size: 0.55rem;
    letter-spacing: 0.1em;
    padding: 6px 0;
    width: 260px;
    text-align: center;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
    user-select: none;
}

.tape--tl {
    top: 46px;
    left: -70px;
    transform: rotate(-45deg);
}

.tape--br {
    bottom: 46px;
    right: -70px;
    transform: rotate(-45deg);
}

/* stickers */
.sticker {
    position: absolute;
    z-index: 4;
    transform: rotate(var(--rot));
    background: var(--bg);
    color: var(--paper);
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    font-size: 0.72rem;
    letter-spacing: 0.05em;
    padding: 8px 14px;
    border: 3px solid var(--ink);
    border-radius: 999px;
    box-shadow: 4px 4px 0 var(--ink);
    display: none;
}

@media (min-width: 900px) {
    .sticker {
        display: inline-block;
    }
}

/* stage */
.stage {
    position: relative;
    z-index: 2;
    flex: 1 1 auto;
    min-height: 0;
    max-width: 760px;
    width: 100%;
    margin: 0 auto;
    padding: clamp(0.75rem, 2.2vh, 1.75rem) 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
}

/* seal */
.seal {
    position: relative;
    width: clamp(90px, 15vh, 150px);
    height: clamp(90px, 15vh, 150px);
    margin-bottom: clamp(0.6rem, 1.8vh, 1.75rem);
    filter: drop-shadow(4px 4px 0 var(--ink));
    flex: none;
}

.seal__ring {
    width: 100%;
    height: 100%;
    animation: spin 16s linear infinite;
}

.seal__ring text {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    font-size: 11.5px;
    fill: var(--ink);
    letter-spacing: 1px;
}

.seal__core {
    position: absolute;
    inset: 26px;
    background: var(--pink);
    border: 3px solid var(--ink);
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.seal__core-icon {
    font-size: 2.4rem;
    color: var(--amber);
    transform: rotate(-8deg);
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: reduce) {

    .seal__ring,
    .marquee__track {
        animation: none;
    }
}

.eyebrow {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    font-size: clamp(0.6rem, 1.3vh, 0.75rem);
    letter-spacing: 0.22em;
    background: var(--ink);
    color: var(--paper);
    padding: 5px 14px;
    border-radius: 999px;
    margin: 0 0 clamp(0.6rem, 1.6vh, 1.4rem);
    flex: none;
}

.headline {
    margin: 0 0 clamp(0.6rem, 1.6vh, 1.4rem);
    line-height: 0.92;
    font-family: 'Fraunces', serif;
    flex: none;
}

.headline__line {
    display: block;
    font-size: clamp(1.7rem, 6.5vh, 4.2rem);
    font-weight: 900;
}

.headline__line--a {
    color: var(--ink);
}

.headline__line--b {
    color: var(--paper);
    -webkit-text-stroke: 2px var(--ink);
    font-style: italic;
}

.headline__line--c {
    color: var(--pink);
    text-shadow: 4px 4px 0 var(--ink);
}

.headline__spark {
    color: var(--amber);
    -webkit-text-stroke: 0;
}

.lede {
    max-width: 44ch;
    font-size: clamp(0.8rem, 1.9vh, 1.05rem);
    line-height: 1.5;
    margin: 0 0 clamp(0.8rem, 2vh, 2.4rem);
    flex: none;
}

/* panel */
.panel {
    width: 100%;
    max-width: 480px;
    background: white;
    border: 3px solid var(--ink);
    border-radius: 18px;
    box-shadow: 6px 6px 0 var(--ink);
    padding: clamp(0.8rem, 1.8vh, 1.4rem) 1.4rem clamp(0.9rem, 2vh, 1.6rem);
    margin-bottom: clamp(0.8rem, 2vh, 2.2rem);
    text-align: left;
    flex: none;
}

.panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: clamp(0.5rem, 1vh, 0.85rem);
}

.panel__title {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    font-size: clamp(0.7rem, 1.5vh, 0.85rem);
    letter-spacing: 0.06em;
}

.panel__badge {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    font-size: clamp(0.7rem, 1.5vh, 0.85rem);
    color: white;
    background: var(--purple);
    border: 2px solid var(--ink);
    border-radius: 999px;
    padding: 2px 10px;
}

.progress {
    height: 12px;
    border-radius: 999px;
    background: repeating-linear-gradient(45deg,
            #fff,
            #fff 8px,
            #f0f0f0 8px,
            #f0f0f0 16px);
    border: 2px solid var(--ink);
    overflow: hidden;
    margin-bottom: clamp(0.6rem, 1.4vh, 1.1rem);
}

.progress__fill {
    height: 100%;
    background: repeating-linear-gradient(45deg,
            var(--pink),
            var(--pink) 10px,
            var(--orange) 10px,
            var(--orange) 20px);
}

.tasks {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: clamp(0.35rem, 0.9vh, 0.55rem);
}

.tasks__item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    font-size: clamp(0.78rem, 1.7vh, 0.92rem);
    color: var(--ink);
}

.tasks__box {
    flex: none;
    width: 20px;
    height: 20px;
    border: 2px solid var(--ink);
    border-radius: 5px;
    background: var(--blue);
}

/* actions */
.actions {
    width: 100%;
    max-width: 480px;
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    justify-content: center;
    flex: none;
}

.actions__button {
    flex: 1 1 180px;
    padding: clamp(0.6rem, 1.4vh, 0.85rem) 1.4rem;
    border: 3px solid var(--ink);
    border-radius: 12px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    cursor: pointer;
    box-shadow: 4px 4px 0 var(--ink);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.actions__button--primary {
    background: var(--pink);
    color: white;
}

.actions__button--ghost {
    background: white;
    color: var(--ink);
}

.actions__button:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 var(--ink);
}

.actions__button:focus-visible {
    outline: 3px solid var(--blue);
    outline-offset: 2px;
}

@media (max-width: 480px) {
    .tape {
        width: 200px;
    }
}

/* very short viewports: keep the message, drop the extras so nothing overflows */
@media (max-height: 620px) {
    .marquee {
        display: none;
    }

    .tape {
        display: none;
    }

    .seal {
        width: clamp(56px, 11vh, 90px);
        height: clamp(56px, 11vh, 90px);
        margin-bottom: 0.6rem;
    }

    .seal__core {
        inset: 16px;
    }

    .seal__core-icon {
        font-size: 1.5rem;
    }

    .lede {
        display: none;
    }

    .panel {
        padding: 0.7rem 1.1rem 0.85rem;
    }

    .tasks__item:nth-child(n + 3) {
        display: none;
    }
}

@media (max-height: 460px) {
    .eyebrow {
        display: none;
    }

    .panel {
        display: none;
    }
}
</style>