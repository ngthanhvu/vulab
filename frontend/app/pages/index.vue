<script setup>
useHead({
    title: 'Đang xây dựng — Quay lại sau nhé!',
    link: [
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Space+Grotesk:wght@400;500;600;700&family=Be+Vietnam+Pro:wght@400;700;900&display=swap'
        }
    ]
})

const loading = ref(true)
const showContent = ref(false)

onMounted(() => {
    const timer = setTimeout(() => {
        loading.value = false
        requestAnimationFrame(() => { showContent.value = true })
    }, 700)
    onUnmounted(() => clearTimeout(timer))
})

const stickers = [
    { label: 'HTML', top: '12%', left: '6%', rot: -14, bg: '#00A8E8' },
    { label: 'CSS', top: '20%', left: '86%', rot: 10, bg: '#FF6B35' },
    { label: 'API', top: '70%', left: '4%', rot: 8, bg: '#7B2CBF' },
    { label: 'BUG', top: '80%', left: '90%', rot: -8, bg: '#FF2E63' },
    { label: 'v0.4', top: '46%', left: '92%', rot: -6, bg: '#1A1A2E' },
    { label: '404', top: '8%', left: '46%', rot: 6, bg: '#FFB800' },
]

const tasks = [
    { name: 'Bố cục trang chủ', done: true },
    { name: 'Hệ thống đăng nhập', done: true },
    { name: 'Trang sản phẩm', done: false },
    { name: 'Thanh toán', done: false },
]
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
                    <span>ĐANG XÂY DỰNG</span><span class="marquee__dot">✦</span>
                    <span>SẮP RA MẮT</span><span class="marquee__dot">✦</span>
                    <span>QUAY LẠI SAU NHÉ</span><span class="marquee__dot">✦</span>
                </span>
            </div>
        </div>

        <!-- corner tape -->
        <div class="tape tape--tl" aria-hidden="true">CẨN THẬN — SƠN CÒN ƯỚT</div>
        <div class="tape tape--br" aria-hidden="true">CẨN THẬN — SƠN CÒN ƯỚT</div>

        <!-- floating stickers -->
        <div v-for="s in stickers" :key="s.label" class="sticker"
            :style="{ top: s.top, left: s.left, '--rot': s.rot + 'deg', '--bg': s.bg }" aria-hidden="true">
            {{ s.label }}
        </div>

        <main class="stage">
            <!-- Skeleton loading -->
            <div v-if="loading" class="skeleton-stage" aria-label="Đang tải trang" aria-busy="true">
                <div class="seal-skeleton" aria-hidden="true">
                    <Skeleton circle width="120px" height="120px" />
                </div>
                <Skeleton width="260px" height="22px" rounded="full" class="mb-6" />
                <div class="skeleton-headline">
                    <Skeleton width="min(100%, 320px)" height="clamp(1.7rem, 6.5vh, 4.2rem)" rounded="lg" />
                    <Skeleton width="min(100%, 260px)" height="clamp(1.7rem, 6.5vh, 4.2rem)" rounded="lg" />
                    <Skeleton width="min(100%, 360px)" height="clamp(1.7rem, 6.5vh, 4.2rem)" rounded="lg" />
                </div>
                <Skeleton width="min(100%, 460px)" height="60px" rounded="lg" class="my-4" />
                <div class="skeleton-panel">
                    <div class="skeleton-panel__header">
                        <Skeleton width="180px" height="18px" rounded="full" />
                        <Skeleton width="52px" height="24px" rounded="full" />
                    </div>
                    <Skeleton width="100%" height="12px" rounded="full" class="mb-4" />
                    <div class="skeleton-tasks">
                        <Skeleton v-for="n in 4" :key="n" width="100%" height="20px" rounded="sm" />
                    </div>
                </div>
                <div class="skeleton-notify">
                    <Skeleton width="160px" height="14px" rounded="full" class="mb-2" />
                    <Skeleton width="100%" height="52px" rounded="lg" />
                </div>
            </div>

            <!-- Content -->
            <Transition name="fade-stage">
                <div v-if="!loading" class="content" :class="{ 'content--visible': showContent }">
                    <!-- spinning seal -->
                    <div class="seal" aria-hidden="true">
                        <svg viewBox="0 0 200 200" class="seal__ring">
                            <defs>
                                <path id="sealCircle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                            </defs>
                            <text>
                                <textPath href="#sealCircle" startOffset="0%">
                                    • ĐANG PHÁT TRIỂN • ĐANG PHÁT TRIỂN • ĐANG PHÁT TRIỂN
                                </textPath>
                            </text>
                        </svg>
                        <div class="seal__core">
                            <span class="seal__core-icon">🛠</span>
                        </div>
                    </div>

                    <p class="eyebrow">MỘT SẢN PHẨM ĐANG THÀNH HÌNH</p>

                    <h1 class="headline">
                        <span class="headline__line headline__line--a">TRANG WEB</span>
                        <span class="headline__line headline__line--b">NÀY ĐANG</span>
                        <span class="headline__line headline__line--c">LỚN LÊN<span class="headline__spark">*</span></span>
                    </h1>

                    <p class="lede">
                        Đội ngũ của chúng tôi đang hàn, sơn, gõ phím và đổ thêm cà phê để
                        hoàn thiện từng góc nhỏ. Ghé lại sau — mọi thứ sẽ đẹp hơn, nhanh hơn
                        và (hy vọng) ít lỗi hơn.
                    </p>

                    <div class="panel">
                        <div class="panel__header">
                            <span class="panel__title">TIẾN ĐỘ CÔNG TRƯỜNG</span>
                            <span class="panel__badge">60%</span>
                        </div>
                        <div class="progress">
                            <div class="progress__fill" style="width: 60%" />
                        </div>

                        <ul class="tasks">
                            <li v-for="t in tasks" :key="t.name" class="tasks__item" :class="{ 'tasks__item--done': t.done }">
                                <span class="tasks__box">{{ t.done ? '✓' : '' }}</span>
                                <span>{{ t.name }}</span>
                            </li>
                        </ul>
                    </div>

                    <form class="notify" @submit.prevent>
                        <label class="notify__label" for="email">BÁO CHO TÔI KHI XONG</label>
                        <div class="notify__row">
                            <input id="email" type="email" placeholder="ban@vidu.com" class="notify__input" />
                            <button type="submit" class="notify__button">Đăng ký</button>
                        </div>
                    </form>
                </div>
            </Transition>
        </main>

        <!-- bottom marquee -->
        <div class="marquee marquee--bottom" aria-hidden="true">
            <div class="marquee__track marquee__track--reverse">
                <span v-for="n in 2" :key="n" class="marquee__group">
                    <span>MÃ NGUỒN ĐANG SÔI</span><span class="marquee__dot">✦</span>
                    <span>ĐỪNG NHẤN F5</span><span class="marquee__dot">✦</span>
                    <span>CHÚNG TÔI ĐANG CỐ GẮNG</span><span class="marquee__dot">✦</span>
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
    color: var(--orange);
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
            var(--amber),
            var(--amber) 12px,
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
            var(--orange),
            var(--orange) 10px,
            var(--amber) 10px,
            var(--amber) 20px);
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
    color: #6b6b7a;
}

.tasks__item--done {
    color: var(--ink);
    text-decoration: line-through;
    text-decoration-color: var(--pink);
    text-decoration-thickness: 2px;
}

.tasks__box {
    flex: none;
    width: 20px;
    height: 20px;
    border: 2px solid var(--ink);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    background: var(--blue);
    color: var(--ink);
}

.tasks__item:not(.tasks__item--done) .tasks__box {
    background: #fff;
}

/* notify */
.notify {
    width: 100%;
    max-width: 480px;
    flex: none;
}

.notify__label {
    display: block;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    font-size: clamp(0.65rem, 1.4vh, 0.75rem);
    letter-spacing: 0.1em;
    margin-bottom: clamp(0.4rem, 1vh, 0.6rem);
}

.notify__row {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
}

.notify__input {
    flex: 1 1 220px;
    padding: clamp(0.6rem, 1.4vh, 0.85rem) 1rem;
    border: 3px solid var(--ink);
    border-radius: 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    background: white;
}

.notify__input:focus-visible {
    outline: 3px solid var(--blue);
    outline-offset: 2px;
}

.notify__button {
    flex: 0 0 auto;
    padding: clamp(0.6rem, 1.4vh, 0.85rem) 1.5rem;
    border: 3px solid var(--ink);
    border-radius: 12px;
    background: var(--pink);
    color: white;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    cursor: pointer;
    box-shadow: 4px 4px 0 var(--ink);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.notify__button:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 var(--ink);
}

.notify__button:focus-visible {
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

/* skeleton */
.skeleton-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
    color: var(--ink);
}

.seal-skeleton {
    width: clamp(90px, 15vh, 150px);
    height: clamp(90px, 15vh, 150px);
    margin-bottom: clamp(0.6rem, 1.8vh, 1.75rem);
    display: flex;
    align-items: center;
    justify-content: center;
}

.skeleton-headline {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(0.4rem, 1vh, 0.7rem);
    width: 100%;
    margin-bottom: clamp(0.6rem, 1.6vh, 1.4rem);
}

.skeleton-panel {
    width: 100%;
    max-width: 480px;
    background: white;
    border: 3px solid var(--ink);
    border-radius: 18px;
    box-shadow: 6px 6px 0 var(--ink);
    padding: clamp(0.8rem, 1.8vh, 1.4rem) 1.4rem clamp(0.9rem, 2vh, 1.6rem);
    margin-bottom: clamp(0.8rem, 2vh, 2.2rem);
    text-align: left;
}

.skeleton-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: clamp(0.5rem, 1vh, 0.85rem);
}

.skeleton-tasks {
    display: flex;
    flex-direction: column;
    gap: clamp(0.35rem, 0.9vh, 0.55rem);
}

.skeleton-notify {
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    transition: opacity 0.35s ease;
}

.content--visible {
    opacity: 1;
}

.fade-stage-enter-active,
.fade-stage-leave-active {
    transition: opacity 0.35s ease;
}

.fade-stage-enter-from,
.fade-stage-leave-to {
    opacity: 0;
}

@media (max-width: 480px) {
    .skeleton-panel,
    .skeleton-notify {
        max-width: 100%;
    }
}
</style>