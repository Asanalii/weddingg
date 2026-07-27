// ============================================================
//  Конфиг приглашения — шаблон Naz «Heritage»
//  Все тексты/дата/адрес меняются только здесь.
// ============================================================

// Фоны секций (акварель с орнаментами из Naz)
const bgInvite = new URL("@/assets/images/naz/heritage-2.webp", import.meta.url)
  .href;
const bgAddress = new URL(
  "@/assets/images/naz/heritage-1.webp",
  import.meta.url,
).href;
const bgProgram = new URL(
  "@/assets/images/naz/heritage-3.webp",
  import.meta.url,
).href;
const bgPlain = new URL("@/assets/images/naz/heritage-1.webp", import.meta.url)
  .href;

// Общие (не зависящие от языка) данные
const shared = {
  eventDateTime: "2026-08-27T18:00:00+05:00", // 01.10.2026, 18:00, UTC+5
  hero: {
    // Локальные файлы из /public (учитываем base "/wedding/" из vite.config.js)
    videoUrl: `${import.meta.env.BASE_URL}heritage-hero.mp4`,
    posterUrl: "", // видео локальное и лёгкое — постер не обязателен
  },
  backgrounds: {
    invite: bgInvite,
    address: bgAddress,
    program: bgProgram,
    plain: bgPlain,
    //
  },
  musicUrl:
    "https://dl.dropboxusercontent.com/s/agxcxm6pef0zkth/Ed%20Sheeran%20-%20Perfect%20%28Piano%29%20%28minus%205%29.mp3?st=6zhvreap&dl=0",
  location: {
    mapLink:
      "https://2gis.kz/shymkent/geo/70000001076544637/69.536423,42.347318",
  },
};

// Список языков для переключателя
export const languages = [
  { code: "kk", label: "ҚАЗ", path: "/kk" },
  { code: "ru", label: "РУС", path: "/ru" },
  // { code: "en", label: "ENG", path: "/en" },
];

export const configs = {
  // ===================== KAZAKH =====================
  kk: {
    ...shared,
    lang: "kk",
    coupleNames: "Назерке",
    hero: {
      ...shared.hero,
      kicker: "Қыз ұзату",
    },
    details: {
      title: "Құрметті қонақтар!",
      text: "Сіздерді аяулы қызымыз Назеркенің ұзату тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!",
      dateText: "27 тамыз 2026",
      timeText: "Сағат 18:00",
      locationTitle: "Мекен-жай",
      locationSubtitle: "Той орны",
    },
    location: {
      ...shared.location,
      city: "Шымкент қаласы",
      address: "Темірлан тас жолы, 111Б",
      placeName: '"Hanshayim"',
      mapText: "Картадан қарау",
    },
    program: {
      kicker: "Бағдарлама",
      title: "Той бағдарламасы",
      items: [
        { time: "17:00", text: "Қонақтарды қарсы алу", icon: "guests" },
        { time: "18:00", text: "Беташар рәсімі", icon: "bride" },
        { time: "19:00", text: "Құдаларды қарсы алу", icon: "arch" },
        { time: "20:00", text: "Той салтанаты", icon: "celebration" },
        { time: "22:00", text: "Тойдың торты", icon: "cake" },
      ],
    },
    countdown: {
      label: "Тойға дейін:",
      units: {
        days: "күн",
        hours: "сағат",
        minutes: "минут",
        seconds: "секунд",
      },
      note: "Тойға келуіңізді растауыңызды сұраймыз!",
    },
    hosts: {
      label: "Той иелері:",
      names: "Бақыт - Гуля",
      welcome: "Сіздерді тойымызда күтеміз!",
    },
    rsvp: {
      title: "Анкета",
      nameLabel: "Аты-жөніңіз",
      partnerHint: "",
      attendanceLabel: "Келесіз бе?",
      optionYes: "Иә, әрине",
      optionWithPartner: "Жұбайыммен келемін",
      optionNo: "Келе алмаймын",
      aloneCheckbox: "Жалғыз келмеймін",
      withMeLabel: "Менімен бірге:",
      companionPlaceholder: "Серіктесіңіздің аты",
      addGuest: "+ қонақ қосу",
      button: "Жіберу",
      sending: "Жіберілуде…",
      sent: "Рақмет! Жауабыңыз қабылданды ✓",
      error: "Қате шықты. Қайталап көріңіз.",
    },
    wishes: {
      title: "Тілектер",
      subtitle: "Жас жұбайларға тілек қалдырыңыз.",
      openButton: "Тілек қалдыру",
      modalTitle: "Тілек қалдыру",
      modalSubtitle: "Жас жұбайларға жылы сөздер жазыңыз.",
      nameLabel: "Атыңыз",
      wishLabel: "Тілегіңіз",
      close: "Жабу",
      button: "Жіберу",
      sending: "Жіберілуде…",
      sent: "Рақмет! Тілегіңіз қабылданды ✓",
      error: "Қате шықты. Қайталап көріңіз.",
    },
    weekdays: ["дс", "сс", "ср", "бс", "жм", "сн", "жс"],
  },

  // ===================== RUSSIAN =====================
  ru: {
    ...shared,
    lang: "ru",
    coupleNames: "Алпамыс & Арайлым",
    hero: {
      ...shared.hero,
      kicker: "Приглашаем вас на наш той",
    },
    details: {
      title: "Дорогие гости!",
      text: "Приглашаем вас стать почётными гостями торжественного дастархана в честь нашей свадьбы. По традициям предков приглашаем разделить с нами этот день, когда мы соединяемся под одним шаныраком.",
      dateText: "1 Октября 2026",
      timeText: "Время 18:00",
      locationTitle: "Адрес",
      locationSubtitle: "Место торжества",
    },
    location: {
      ...shared.location,
      city: "г. Кульсары",
      address: "Сырыма Датова, 57",
      placeName: '"Grand Hall"',
      mapText: "Смотреть на карте",
    },
    program: {
      kicker: "Программа",
      title: "Программа торжества",
      items: [
        { time: "17:00", text: "Встреча гостей", icon: "guests" },
        { time: "18:00", text: "Обряд беташар", icon: "bride" },
        { time: "19:00", text: "Встреча сватов", icon: "arch" },
        { time: "20:00", text: "Торжество", icon: "celebration" },
        { time: "22:00", text: "Свадебный торт", icon: "cake" },
      ],
    },
    countdown: {
      label: "До торжества:",
      units: {
        days: "дней",
        hours: "часов",
        minutes: "минут",
        seconds: "секунд",
      },
      note: "Просим подтвердить ваше присутствие!",
    },
    hosts: {
      label: "Хозяева торжества:",
      names: "Амандос - Айым",
      welcome: "Ждём вас на нашем празднике!",
    },
    rsvp: {
      title: "Анкета",
      nameLabel: "Ваше имя и фамилия",
      partnerHint: "",
      attendanceLabel: "Придёте ли вы?",
      optionYes: "Да, конечно",
      optionWithPartner: "Приду со второй половинкой",
      optionNo: "Не смогу прийти",
      aloneCheckbox: "Приду не один(а)",
      withMeLabel: "Со мной будут:",
      companionPlaceholder: "Имя спутника",
      addGuest: "+ добавить гостя",
      button: "Отправить",
      sending: "Отправка…",
      sent: "Спасибо! Ваш ответ принят ✓",
      error: "Что-то пошло не так. Попробуйте ещё раз.",
    },
    wishes: {
      title: "Пожелания",
      subtitle: "Оставьте пожелание молодожёнам.",
      openButton: "Оставить пожелание",
      modalTitle: "Оставить пожелание",
      modalSubtitle: "Напишите молодожёнам тёплые слова.",
      nameLabel: "Ваше имя",
      wishLabel: "Ваше пожелание",
      close: "Закрыть",
      button: "Отправить",
      sending: "Отправка…",
      sent: "Спасибо! Ваше пожелание принято ✓",
      error: "Что-то пошло не так. Попробуйте ещё раз.",
    },
    weekdays: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
  },

  // ===================== ENGLISH =====================
  en: {
    ...shared,
    lang: "en",
    coupleNames: "Alpamys & Arailym",
    hero: {
      ...shared.hero,
      kicker: "You are invited to our wedding",
    },
    details: {
      title: "Dear guests!",
      text: "We invite you to be the honoured guests of the festive dastarkhan held in honour of our wedding. Following the traditions of our ancestors, join us on the day we unite under one shanyrak.",
      dateText: "October 1, 2026",
      timeText: "At 18:00",
      locationTitle: "Address",
      locationSubtitle: "Venue",
    },
    location: {
      ...shared.location,
      city: "Kulsary",
      address: "57 Syrym Datov St.",
      placeName: '"Grand Hall"',
      mapText: "View on map",
    },
    program: {
      kicker: "Programme",
      title: "Wedding Programme",
      items: [
        { time: "17:00", text: "Welcoming the guests", icon: "guests" },
        { time: "18:00", text: "Betashar ceremony", icon: "bride" },
        { time: "19:00", text: "Welcoming the in-laws", icon: "arch" },
        { time: "20:00", text: "Wedding celebration", icon: "celebration" },
        { time: "22:00", text: "Wedding cake", icon: "cake" },
      ],
    },
    countdown: {
      label: "Until the wedding:",
      units: {
        days: "days",
        hours: "hours",
        minutes: "minutes",
        seconds: "seconds",
      },
      note: "Please confirm your attendance!",
    },
    hosts: {
      label: "Hosts of the celebration:",
      names: "Amandos - Aiym",
      welcome: "We look forward to seeing you!",
    },
    rsvp: {
      title: "RSVP",
      nameLabel: "Your full name",
      partnerHint: "",
      attendanceLabel: "Will you attend?",
      optionYes: "Yes, of course",
      optionWithPartner: "I'll come with my partner",
      optionNo: "I can't make it",
      aloneCheckbox: "I'm not coming alone",
      withMeLabel: "Coming with me:",
      companionPlaceholder: "Companion's name",
      addGuest: "+ add a guest",
      button: "Submit",
      sending: "Sending…",
      sent: "Thank you! Your reply has been received ✓",
      error: "Something went wrong. Please try again.",
    },
    wishes: {
      title: "Wishes",
      subtitle: "Leave a wish for the newlyweds.",
      openButton: "Leave a wish",
      modalTitle: "Leave a wish",
      modalSubtitle: "Write some warm words for the newlyweds.",
      nameLabel: "Your name",
      wishLabel: "Your wish",
      close: "Close",
      button: "Submit",
      sending: "Sending…",
      sent: "Thank you! Your wish has been received ✓",
      error: "Something went wrong. Please try again.",
    },
    weekdays: ["mo", "tu", "we", "th", "fr", "sa", "su"],
  },
};

// Определяем язык по URL-пути (/ru, /en, /kk). По умолчанию — kk.
export function detectLang() {
  const path = window.location.pathname;
  if (/\/ru(\/|$)/.test(path)) return "ru";
  if (/\/en(\/|$)/.test(path)) return "en";
  if (/\/kk(\/|$)/.test(path)) return "kk";
  return "kk";
}

export function getConfig(lang) {
  return configs[lang] || configs.kk;
}
