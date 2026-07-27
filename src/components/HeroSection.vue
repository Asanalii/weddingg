<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  videoUrl: { type: String, required: true },
  posterUrl: { type: String, default: "" },
  kicker: { type: String, default: "Сіздерді тойымызға шақырамыз" },
  coupleNames: { type: String, default: "Алпамыс & Арайлым" },
  eventIso: { type: String, required: true },
  musicUrl: { type: String, required: true },
});

// «Алпамыс & Арайлым» -> имена в столбик, как в Naz
const groom = computed(() => props.coupleNames.split("&")[0]?.trim() || "");
const bride = computed(() => props.coupleNames || "");

const prettyDate = computed(() => {
  const d = new Date(props.eventIso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day} . ${month} . ${d.getFullYear()}`;
});

/* ---- Видео: перезапуск по окончании (как в Naz) ---- */
const videoRef = ref(null);
const onEnded = () => {
  const v = videoRef.value;
  if (!v) return;
  v.currentTime = 0;
  v.play().catch(() => {});
};

/* ---- Музыка ---- */
const isPlaying = ref(false);
const audioElement = new Audio(props.musicUrl);
audioElement.volume = 0.4;

watch(
  () => props.musicUrl,
  (newUrl) => {
    audioElement.pause();
    audioElement.src = newUrl;
    isPlaying.value = false;
  },
);
audioElement.addEventListener("ended", () => (isPlaying.value = false));

const toggleMusic = async () => {
  if (!isPlaying.value) {
    try {
      await audioElement.play();
      isPlaying.value = true;
    } catch (error) {
      console.error("Play blocked:", error);
    }
    return;
  }
  audioElement.pause();
  isPlaying.value = false;
};

onBeforeUnmount(() => audioElement.pause());
</script>

<template>
  <section class="hero">
    <video
      ref="videoRef"
      class="hero__video"
      :src="videoUrl"
      :poster="posterUrl || undefined"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      aria-hidden="true"
      @ended="onEnded"
    ></video>

    <div class="hero__content">
      <div class="hero__kicker">{{ kicker }}</div>

      <!-- <h1 class="hero__name">{{ groom }}</h1> -->
      <!-- <div class="hero__amp">&amp;</div> -->
      <h1 class="hero__name">{{ bride }}</h1>

      <div class="hero__date t-spaced">{{ prettyDate }}</div>
    </div>

    <!-- круглая кнопка музыки, как в Naz -->
    <button
      class="hero__play"
      type="button"
      @click="toggleMusic"
      :aria-label="isPlaying ? 'Pause music' : 'Play music'"
    >
      <span v-if="!isPlaying">▶</span>
      <span v-else class="hero__pause">❚❚</span>
    </button>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  /* Пропорция самого видео (720×1560) — кадр виден целиком, без обрезки */
  aspect-ratio: 720 / 1560;
  overflow: hidden;
  background: #f1e8d8; /* фолбэк, пока грузится видео (значение из Naz) */
}

.hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Контент поверх видео: пара видна снизу (padding-bottom 22%, как в Naz) */
.hero__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 44px 24px 22%;
  text-align: center;
}

.hero__kicker {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 22px;
  line-height: 1.2;
  color: rgba(42, 50, 54, 0.78);
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.6);
}

.hero__name {
  margin-top: 22px;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 52px;
  line-height: 0.95;
  letter-spacing: 0.04em;
  color: var(--ink);
  text-shadow: 0 3px 10px rgba(255, 255, 255, 0.7);
}
.hero__name + .hero__name {
  margin-top: 0;
}

.hero__amp {
  font-family: var(--font-display);
  font-size: 30px;
  color: rgba(42, 50, 54, 0.4);
  margin: 2px 0;
}

.hero__date {
  margin-top: 14px;
}

/* круглая кнопка play внизу слева */
.hero__play {
  position: fixed;
  left: 22px;
  bottom: 22px;
  z-index: 90;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--rule);
  color: var(--ink);
  font-size: 13px;
  display: grid;
  place-items: center;
  box-shadow: 0 8px 24px rgba(42, 50, 54, 0.18);
  backdrop-filter: blur(6px);
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}
.hero__play:hover {
  transform: translateY(-2px);
  background: #fff;
}
.hero__pause {
  font-size: 10px;
  letter-spacing: 1px;
}
</style>
