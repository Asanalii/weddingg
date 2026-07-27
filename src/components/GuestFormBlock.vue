<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  title: { type: String, default: "Анкета" },
  nameLabel: { type: String, default: "Аты-жөніңіз" },
  partnerHint: { type: String, default: "" },
  attendanceLabel: { type: String, default: "Келесіз бе?" },
  optionYes: { type: String, default: "Иә, әрине" },
  optionWithPartner: { type: String, default: "Жұбайыммен келемін" },
  optionNo: { type: String, default: "Келе алмаймын" },
  aloneCheckbox: { type: String, default: "Жалғыз келмеймін" },
  withMeLabel: { type: String, default: "Менімен бірге:" },
  companionPlaceholder: { type: String, default: "Серіктесіңіздің аты" },
  addGuestText: { type: String, default: "+ қонақ қосу" },
  buttonText: { type: String, default: "Жіберу" },
  sendingText: { type: String, default: "Жіберілуде…" },
  sentText: { type: String, default: "Рақмет! Жауабыңыз қабылданды ✓" },
  errorText: { type: String, default: "Қате шықты. Қайталап көріңіз." },
  lang: { type: String, default: "kk" },
  bg: { type: String, required: true },
});

const guestFullName = ref("");
const attendance = ref("");
const notAlone = ref(false);
const companions = ref([""]);
const isSubmitting = ref(false);
const isSent = ref(false);
const isError = ref(false);

// Чекбокс «Жалғыз келмеймін» имеет смысл только если гость придёт
const canBringGuests = computed(
  () => attendance.value === "yes" || attendance.value === "with_partner",
);

// Если выбрали «Келе алмаймын» — прячем и сбрасываем спутников
watch(attendance, () => {
  if (!canBringGuests.value) {
    notAlone.value = false;
    companions.value = [""];
  }
});

const addCompanion = () => companions.value.push("");
const removeCompanion = (index) => {
  companions.value.splice(index, 1);
  if (companions.value.length === 0) companions.value = [""];
};

const companionNames = computed(() =>
  companions.value.map((n) => n.trim()).filter(Boolean),
);

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
    data.partner ? `👥 <b>Бірге келеді:</b> ${data.partner}` : "",
    `✅ <b>Жауабы:</b> ${data.attendance}`,
    `${langFlag} <b>Тіл:</b> ${data.lang}`,
  ].filter(Boolean);

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
    // Все спутники одной строкой — колонка «Имя партнёра» в таблице
    partner: notAlone.value ? companionNames.value.join(", ") : "",
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
    notAlone.value = false;
    companions.value = [""];
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
    <h2 class="hsec__title t-script rsvp__title" v-reveal="{ from: 'left' }">{{ title }}</h2>

    <form class="rsvp__form" v-reveal="{ delay: 150 }" @submit.prevent="submitForm">
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

      <!-- «Жалғыз келмеймін» — только когда гость придёт -->
      <template v-if="canBringGuests">
        <label class="check">
          <input type="checkbox" v-model="notAlone" />
          <span class="check__box" aria-hidden="true">
            <svg viewBox="0 0 12 10">
              <path
                d="M1 5.2 4.4 8.6 11 1.4"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="check__text t-body">{{ aloneCheckbox }}</span>
        </label>

        <div v-if="notAlone" class="companions">
          <div class="companions__label">{{ withMeLabel }}</div>

          <div
            v-for="(c, i) in companions"
            :key="i"
            class="companions__row"
          >
            <input
              v-model="companions[i]"
              class="rfield__input companions__input"
              type="text"
              :placeholder="companionPlaceholder"
            />
            <button
              class="companions__remove"
              type="button"
              :aria-label="'remove ' + (i + 1)"
              @click="removeCompanion(i)"
            >
              –
            </button>
          </div>

          <button class="companions__add" type="button" @click="addCompanion">
            {{ addGuestText }}
          </button>
        </div>
      </template>

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
  min-width: 0;
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

/* Чекбокс «Жалғыз келмеймін» */
.check {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-top: 2px;
}
.check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.check__box {
  width: 17px;
  height: 17px;
  border-radius: 4px;
  border: 1px solid var(--ink-mute);
  display: grid;
  place-items: center;
  color: transparent;
  background: transparent;
  transition: background 0.2s, border-color 0.2s;
  flex: 0 0 auto;
}
.check__box svg { width: 11px; height: 9px; }
.check input:checked + .check__box {
  background: var(--ink);
  border-color: var(--ink);
  color: #fff;
}
.check__text { font-style: italic; font-size: 16px; color: var(--ink); }

/* Спутники */
.companions { display: grid; gap: 12px; }
.companions__label {
  font-family: var(--font-body);
  font-size: 13px;
  letter-spacing: 0.22em;
  text-transform: lowercase;
  font-variant: small-caps;
  color: var(--ink-mute);
}
.companions__row {
  display: grid;
  grid-template-columns: 1fr 36px;
  gap: 10px;
  align-items: center;
}
.companions__remove {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--rule);
  background: rgba(255, 255, 255, 0.4);
  color: var(--ink-soft);
  font-size: 18px;
  line-height: 1;
  display: grid;
  place-items: center;
  transition: background 0.2s, border-color 0.2s;
}
.companions__remove:hover { background: #fff; border-color: var(--ink-mute); }
.companions__add {
  justify-self: start;
  padding: 10px 18px;
  border: 1px dashed var(--ink-mute);
  border-radius: 6px;
  background: transparent;
  font-family: var(--font-body);
  font-size: 14px;
  letter-spacing: 0.1em;
  color: var(--ink-soft);
  transition: background 0.2s, color 0.2s;
}
.companions__add:hover { background: rgba(255, 255, 255, 0.5); color: var(--ink); }

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
