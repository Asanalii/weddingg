<script setup>
import { ref } from "vue";

const props = defineProps({
  title: { type: String, default: "Тілектер" },
  subtitle: { type: String, default: "Жас жұбайларға тілек қалдырыңыз." },
  openButton: { type: String, default: "Тілек қалдыру" },
  nameLabel: { type: String, default: "Аты-жөніңіз" },
  wishLabel: { type: String, default: "Сіздің тілегіңіз" },
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
  <section
    class="hsec wishes"
    :style="{ backgroundImage: `url('${bg}')` }"
  >
    <h2 class="hsec__title t-script wishes__title">{{ title }}</h2>
    <p class="wishes__subtitle t-body">{{ subtitle }}</p>

    <!-- Тёмная кнопка-пилюля, как в Naz -->
    <button
      v-if="!isOpen"
      class="wishes__open"
      type="button"
      @click="isOpen = true"
    >
      <svg class="wishes__mail" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2"
          fill="none" stroke="currentColor" stroke-width="1.6" />
        <path d="M3.5 6.5 12 13l8.5-6.5"
          fill="none" stroke="currentColor" stroke-width="1.6" />
      </svg>
      <span>{{ openButton }}</span>
    </button>

    <form v-else class="wishes__form" @submit.prevent="submitWish">
      <input
        v-model="wishName"
        class="wfield__input"
        type="text"
        :placeholder="nameLabel"
        autocomplete="name"
      />
      <textarea
        v-model="wishText"
        class="wfield__input wfield__input--area"
        rows="4"
        :placeholder="wishLabel"
      ></textarea>
      <button class="wishes__submit" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? sendingText : buttonText }}
      </button>
    </form>

    <p v-if="isSent" class="wishes__status">{{ sentText }}</p>
    <p v-if="isError" class="wishes__status wishes__status--error">
      {{ errorText }}
    </p>
  </section>
</template>

<style scoped>
.wishes { padding-bottom: clamp(64px, 18vw, 90px); }
.wishes__title { letter-spacing: 0.2em; }
.wishes__subtitle {
  margin-top: 16px;
  font-size: 18px;
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
  font-size: 17px;
  letter-spacing: 0.06em;
  box-shadow: 0 12px 30px rgba(42, 50, 54, 0.25);
  transition: transform 0.2s;
}
.wishes__open:hover { transform: translateY(-2px); }
.wishes__mail { width: 18px; height: 18px; }

.wishes__form {
  margin: 28px auto 0;
  max-width: 330px;
  display: grid;
  gap: 14px;
  text-align: left;
}
.wfield__input {
  padding: 14px 22px;
  border: 1px solid rgba(42, 50, 54, 0.55);
  border-radius: 26px;
  background: transparent;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 18px;
  transition: border-color 0.2s;
}
.wfield__input::placeholder { color: var(--ink-mute); }
.wfield__input:focus { border-color: var(--ink); }
.wfield__input--area { resize: vertical; min-height: 110px; line-height: 1.6; }

.wishes__submit {
  margin: 6px auto 0;
  min-width: 160px;
  padding: 13px 34px;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-ink);
  font-family: var(--font-body);
  letter-spacing: 0.32em;
  padding-left: calc(34px + 0.32em);
  font-size: 15px;
  transition: transform 0.15s;
}
.wishes__submit:hover:not(:disabled) { transform: translateY(-1px); }
.wishes__submit:disabled { background: #aca7a1; }

.wishes__status {
  margin-top: 18px;
  font-family: var(--font-body);
  font-style: italic;
  font-size: 17px;
  color: var(--ink);
}
.wishes__status--error { color: #8a2119; }
</style>
