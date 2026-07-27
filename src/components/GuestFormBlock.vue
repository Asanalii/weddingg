<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  title: { type: String, default: "Анкета" },
  nameLabel: { type: String, default: "Аты-жөніңіз" },
  partnerHint: { type: String, default: "" },
  attendanceLabel: { type: String, default: "Келесіз бе?" },
  optionYes: { type: String, default: "Иә, әрине" },
  optionWithPartner: { type: String, default: "Жұбайыммен келемін" },
  optionNo: { type: String, default: "Келе алмаймын" },
  buttonText: { type: String, default: "Жіберу" },
  sendingText: { type: String, default: "Жіберілуде…" },
  sentText: { type: String, default: "Рақмет! Жауабыңыз қабылданды ✓" },
  errorText: { type: String, default: "Қате шықты. Қайталап көріңіз." },
  lang: { type: String, default: "kk" },
  bg: { type: String, required: true },
});

const guestFullName = ref("");
const attendance = ref("");
const isSubmitting = ref(false);
const isSent = ref(false);
const isError = ref(false);

const canSubmit = computed(
  () => guestFullName.value.trim() && attendance.value,
);

// URL Google Apps Script из .env (VITE_SHEETS_URL)
const SHEETS_URL = import.meta.env.VITE_SHEETS_URL;

// Telegram из .env (бот только отправляет — сервер не нужен)
const TG_TOKEN = import.meta.env.VITE_TG_TOKEN;
const TG_CHAT_ID = import.meta.env.VITE_TG_CHAT_ID;

// Человекочитаемый вариант выбора для таблицы
const attendanceText = () => {
  if (attendance.value === "yes") return props.optionYes;
  if (attendance.value === "with_partner") return props.optionWithPartner;
  return props.optionNo;
};

// Отправка уведомления в Telegram. Ошибки тут не критичны:
// главное — запись в таблицу, поэтому глушим их отдельно.
const sendTelegram = async (data) => {
  if (!TG_TOKEN || !TG_CHAT_ID) return;

  const langFlag = { kk: "🇰🇿", ru: "🇷🇺", en: "🇬🇧" }[data.lang] || "";
  const lines = [
    "🎉 <b>Жаңа жауап / Новый ответ</b>",
    "",
    `👤 <b>Қонақ:</b> ${data.name}`,
    `✅ <b>Жауабы:</b> ${data.attendance}`,
    `${langFlag} <b>Тіл:</b> ${data.lang}`,
  ];

  const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
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

const submitForm = async () => {
  if (!canSubmit.value) return;

  isSubmitting.value = true;
  isSent.value = false;
  isError.value = false;

  const payload = {
    name: guestFullName.value.trim(),
    partner: "",
    attendance: attendanceText(),
    lang: props.lang,
  };

  try {
    if (!SHEETS_URL) throw new Error("SHEETS_URL is not set");

    // no-cors: Apps Script не отдаёт CORS-заголовки, поэтому ответ
    // прочитать нельзя, но запрос доходит и строка записывается.
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
    guestFullName.value = "";
    attendance.value = "";
  } catch (err) {
    console.error("RSVP submit failed:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="hsec" :style="{ backgroundImage: `url('${bg}')` }">
    <h2 class="hsec__title t-script rsvp__title">{{ title }}</h2>

    <form class="rsvp__form" @submit.prevent="submitForm">
      <label class="rfield">
        <span class="rfield__label t-body">{{ nameLabel }}</span>
        <input
          v-model="guestFullName"
          class="rfield__input"
          type="text"
          :placeholder="nameLabel"
          autocomplete="name"
        />
      </label>

      <div class="rsvp__question t-body">{{ attendanceLabel }}</div>

      <div class="radios">
        <label class="radio" :class="{ 'radio--on': attendance === 'yes' }">
          <input type="radio" value="yes" v-model="attendance" />
          <span class="radio__dot"></span>
          <span class="radio__text t-body">{{ optionYes }}</span>
        </label>
        <label
          class="radio"
          :class="{ 'radio--on': attendance === 'with_partner' }"
        >
          <input type="radio" value="with_partner" v-model="attendance" />
          <span class="radio__dot"></span>
          <span class="radio__text t-body">{{ optionWithPartner }}</span>
        </label>
        <label class="radio" :class="{ 'radio--on': attendance === 'no' }">
          <input type="radio" value="no" v-model="attendance" />
          <span class="radio__dot"></span>
          <span class="radio__text t-body">{{ optionNo }}</span>
        </label>
      </div>

      <button class="rsvp__submit" type="submit" :disabled="!canSubmit || isSubmitting">
        {{ isSubmitting ? sendingText : buttonText }}
      </button>

      <p v-if="isSent" class="rsvp__status">{{ sentText }}</p>
      <p v-if="isError" class="rsvp__status rsvp__status--error">
        {{ errorText }}
      </p>
    </form>
  </section>
</template>

<style scoped>
.rsvp__title { letter-spacing: 0.14em; }

.rsvp__form {
  margin: 30px auto 0;
  max-width: 330px;
  text-align: left;
  display: grid;
  gap: 18px;
}

.rfield { display: grid; gap: 10px; }
.rfield__label { font-size: 18px; color: var(--ink); }
.rfield__input {
  padding: 14px 22px;
  border: 1px solid rgba(42, 50, 54, 0.55);
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 18px;
  transition: border-color 0.2s;
}
.rfield__input::placeholder { color: var(--ink-mute); }
.rfield__input:focus { border-color: var(--ink); }

.rsvp__question {
  margin-top: 6px;
  font-size: 18px;
  color: var(--ink);
}

.radios { display: grid; gap: 14px; }
.radio {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}
.radio input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.radio__dot {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 1px solid var(--ink-mute);
  flex: 0 0 auto;
  position: relative;
  transition: border-color 0.2s;
}
.radio--on .radio__dot { border-color: var(--ink); }
.radio--on .radio__dot::after {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: 999px;
  background: var(--ink);
}
.radio__text { font-size: 18px; color: var(--ink); }

.rsvp__submit {
  margin: 14px auto 0;
  min-width: 170px;
  padding: 13px 34px;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-ink);
  font-family: var(--font-body);
  letter-spacing: 0.32em;
  padding-left: calc(34px + 0.32em);
  font-size: 15px;
  transition: opacity 0.25s, transform 0.15s;
}
.rsvp__submit:hover:not(:disabled) { transform: translateY(-1px); }
.rsvp__submit:disabled { background: #aca7a1; opacity: 0.9; }

.rsvp__status {
  text-align: center;
  font-family: var(--font-body);
  font-style: italic;
  font-size: 17px;
  color: var(--ink);
}
.rsvp__status--error { color: #8a2119; }
</style>
