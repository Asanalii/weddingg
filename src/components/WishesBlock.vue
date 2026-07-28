<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  title: { type: String, default: "Тілектер" },
  subtitle: { type: String, default: "Жас жұбайларға тілек қалдырыңыз." },
  openButton: { type: String, default: "Тілек қалдыру" },
  modalTitle: { type: String, default: "Тілек қалдыру" },
  modalSubtitle: {
    type: String,
    default: "Жас жұбайларға жылы сөздер жазыңыз.",
  },
  nameLabel: { type: String, default: "Атыңыз" },
  wishLabel: { type: String, default: "Тілегіңіз" },
  closeText: { type: String, default: "Жабу" },
  buttonText: { type: String, default: "Жіберу" },
  sendingText: { type: String, default: "Жіберілуде…" },
  sentText: { type: String, default: "Рақмет! Тілегіңіз қабылданды ✓" },
  errorText: { type: String, default: "Қате шықты. Қайталап көріңіз." },
  lang: { type: String, default: "kk" },
  bg: { type: String, required: true },
});

const isOpen = ref(false);
const wishName = ref("");
const wishText = ref("");
const isSubmitting = ref(false);
const isSent = ref(false);
const isError = ref(false);

const openModal = () => {
  isError.value = false;
  isOpen.value = true;
};
const closeModal = () => {
  if (isSubmitting.value) return;
  isOpen.value = false;
};

// Блокируем прокрутку страницы, пока открыта модалка
watch(isOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});

// Тот же Apps Script, что и для анкеты
const SHEETS_URL = import.meta.env.VITE_SHEETS_URL;
const TG_TOKEN = import.meta.env.VITE_TG_TOKEN;
const TG_CHAT_ID = import.meta.env.VITE_TG_CHAT_ID;

const sendTelegram = async (data) => {
  if (!TG_TOKEN || !TG_CHAT_ID) return;
  const lines = [
    "💌 <b>Жаңа тілек / Новое пожелание</b>",
    "",
    `👤 <b>Кімнен:</b> ${data.name}`,
    `✨ ${data.wish}`,
  ];
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: lines.join("\n"),
        parse_mode: "HTML",
      }),
    });
  } catch (err) {
    console.warn("Telegram notify failed (не критично):", err);
  }
};

const submitWish = async () => {
  if (!wishName.value.trim() || !wishText.value.trim()) return;

  isSubmitting.value = true;
  isSent.value = false;
  isError.value = false;

  const payload = {
    type: "wish", // Apps Script кладёт запись на лист «Тілектер»
    name: wishName.value.trim(),
    wish: wishText.value.trim(),
    lang: props.lang,
  };

  try {
    if (!SHEETS_URL) throw new Error("SHEETS_URL is not set");
    await Promise.all([
      fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      }),
      sendTelegram(payload),
    ]);
    isSent.value = true;
    wishName.value = "";
    wishText.value = "";
    isOpen.value = false;
  } catch (err) {
    console.error("Wish submit failed:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="hsec wishes" :style="{ backgroundImage: `url('${bg}')` }">
    <h2 class="hsec__title t-script wishes__title" v-reveal="{ from: 'left' }">
      {{ title }}
    </h2>
    <p class="wishes__subtitle t-body" v-reveal="{ delay: 130 }">
      {{ subtitle }}
    </p>

    <!-- Тёмная кнопка-пилюля, как в Naz -->
    <button
      class="wishes__open"
      v-reveal="{ from: 'zoom', delay: 240 }"
      type="button"
      @click="openModal"
    >
      <svg class="wishes__mail" viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        />
        <path
          d="M3.5 6.5 12 13l8.5-6.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        />
      </svg>
      <span>{{ openButton }}</span>
    </button>

    <p v-if="isSent" class="wishes__status">{{ sentText }}</p>

    <!-- Модальное окно, как в Naz -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="wmodal"
        role="dialog"
        aria-modal="true"
        @click.self="closeModal"
      >
        <div class="wmodal__card">
          <div class="wmodal__title">{{ modalTitle }}</div>
          <p class="wmodal__subtitle">{{ modalSubtitle }}</p>

          <form class="wmodal__form" @submit.prevent="submitWish">
            <label class="wmodal__field">
              <span class="wmodal__label">{{ nameLabel }}</span>
              <input v-model="wishName" class="wmodal__input" type="text" />
            </label>

            <label class="wmodal__field">
              <span class="wmodal__label">{{ wishLabel }}</span>
              <textarea
                v-model="wishText"
                class="wmodal__input wmodal__input--area"
                rows="5"
              ></textarea>
            </label>

            <p v-if="isError" class="wmodal__error">{{ errorText }}</p>

            <div class="wmodal__actions">
              <button
                class="wmodal__btn wmodal__btn--ghost"
                type="button"
                @click="closeModal"
              >
                {{ closeText }}
              </button>
              <button
                class="wmodal__btn wmodal__btn--primary"
                type="submit"
                :disabled="isSubmitting || !wishName.trim() || !wishText.trim()"
              >
                {{ isSubmitting ? sendingText : buttonText }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.wishes {
  padding-bottom: clamp(64px, 18vw, 90px);
}
.wishes__title {
  letter-spacing: 0.2em;
}
.wishes__subtitle {
  margin-top: 16px;
  font-size: 19px;
  color: var(--ink);
}

.wishes__open {
  margin-top: 28px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 30px;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-ink);
  font-family: var(--font-body);
  font-size: 18px;
  letter-spacing: 0.06em;
  box-shadow: 0 12px 30px rgba(42, 50, 54, 0.25);
  transition: transform 0.2s;
}
.wishes__open:hover {
  transform: translateY(-2px);
}
.wishes__mail {
  width: 18px;
  height: 18px;
}

.wishes__status {
  margin-top: 18px;
  font-family: var(--font-body);
  font-style: italic;
  font-size: 18px;
  color: var(--ink);
}
</style>

<!-- Стили модалки без scoped: она телепортируется в <body> -->
<style>
.wmodal {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(42, 40, 36, 0.55);
  display: grid;
  place-items: center;
  padding: 18px;
}

.wmodal__card {
  width: min(430px, 100%);
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
  padding: 26px 24px 22px;
  text-align: left;
}

.wmodal__title {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 700;
  font-size: 21px;
  color: #1c1a17;
}
.wmodal__subtitle {
  margin-top: 6px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 15.5px;
  line-height: 1.5;
  color: #4a463f;
}

.wmodal__form {
  margin-top: 18px;
  display: grid;
  gap: 16px;
}

.wmodal__field {
  display: grid;
  gap: 7px;
}
.wmodal__label {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8a7f6b;
}
.wmodal__input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d8cdb6;
  border-radius: 8px;
  background: #faf5ea;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 17px;
  color: #1c1a17;
  transition: border-color 0.2s;
}
.wmodal__input:focus {
  border-color: #b3a284;
}
.wmodal__input--area {
  resize: vertical;
  min-height: 110px;
  line-height: 1.5;
}

.wmodal__error {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  color: #8a2119;
}

.wmodal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}
.wmodal__btn {
  padding: 11px 22px;
  border-radius: 9px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 16px;
  transition:
    opacity 0.2s,
    background 0.2s;
}
.wmodal__btn--ghost {
  background: #fff;
  border: 1px solid #ddd6c8;
  color: #2b2822;
}
.wmodal__btn--ghost:hover {
  background: #f6f2e9;
}
.wmodal__btn--primary {
  background: #b3a284;
  color: #fff;
}
.wmodal__btn--primary:hover:not(:disabled) {
  background: #a3906f;
}
.wmodal__btn--primary:disabled {
  opacity: 0.65;
}
</style>
