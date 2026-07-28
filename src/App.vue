<script setup>
import { computed } from "vue";
import {
  getConfig,
  detectLang,
  languages,
} from "@/config/invitation.config.js";
import HeroSection from "./components/HeroSection.vue";
import InvitationDetails from "./components/InvitationDetails.vue";
import ProgramBlock from "./components/ProgramBlock.vue";
import CountdownBlock from "./components/CountdownBlock.vue";
import GuestFormBlock from "./components/GuestFormBlock.vue";
import WishesBlock from "./components/WishesBlock.vue";
import LangSwitcher from "./components/LangSwitcher.vue";

const lang = detectLang();
const config = computed(() => getConfig(lang));
//
</script>

<template>
  <div class="page">
    <!-- <LangSwitcher :languages="languages" :current="lang" /> -->

    <!-- Узкая колонка-открытка, как в Naz heritage -->
    <div class="sheet">
      <HeroSection
        :video-url="config.hero.videoUrl"
        :poster-url="config.hero.posterUrl"
        :event-iso="config.eventDateTime"
        :kicker="config.hero.kicker"
        :hosts-label="config.hosts.label"
        :hosts-names="config.hosts.names"
        :couple-names="config.coupleNames"
        :music-url="config.musicUrl"
      />

      <InvitationDetails
        :event-iso="config.eventDateTime"
        :title="config.details.title"
        :invitation-text="config.details.text"
        :date-text="config.details.dateText"
        :time-text="config.details.timeText"
        :location-title="config.details.locationTitle"
        :location-subtitle="config.details.locationSubtitle"
        :location-city="config.location.city"
        :location-address="config.location.address"
        :location-name="config.location.placeName"
        :map-text="config.location.mapText"
        :two-gis-link="config.location.mapLink"
        :weekdays="config.weekdays"
        :bg-invite="config.backgrounds.invite"
        :bg-address="config.backgrounds.address"
      />

      <!-- <ProgramBlock
        :kicker="config.program.kicker"
        :title="config.program.title"
        :items="config.program.items"
        :bg="config.backgrounds.program"
      /> -->

      <!-- Тойға дейін + Той иелері — один блок -->
      <CountdownBlock
        :event-iso="config.eventDateTime"
        :label="config.countdown.label"
        :units="config.countdown.units"
        :note="config.countdown.note"
        :hosts-label="config.hosts.label"
        :hosts-names="config.hosts.names"
        :hosts-welcome="config.hosts.welcome"
        :bg="config.backgrounds.plain"
      />

      <GuestFormBlock
        :title="config.rsvp.title"
        :name-label="config.rsvp.nameLabel"
        :partner-hint="config.rsvp.partnerHint"
        :attendance-label="config.rsvp.attendanceLabel"
        :option-yes="config.rsvp.optionYes"
        :option-with-partner="config.rsvp.optionWithPartner"
        :option-no="config.rsvp.optionNo"
        :alone-checkbox="config.rsvp.aloneCheckbox"
        :with-me-label="config.rsvp.withMeLabel"
        :companion-placeholder="config.rsvp.companionPlaceholder"
        :add-guest-text="config.rsvp.addGuest"
        :button-text="config.rsvp.button"
        :sending-text="config.rsvp.sending"
        :sent-text="config.rsvp.sent"
        :error-text="config.rsvp.error"
        :lang="config.lang"
        :bg="config.backgrounds.plain"
      />

      <WishesBlock
        :title="config.wishes.title"
        :subtitle="config.wishes.subtitle"
        :open-button="config.wishes.openButton"
        :modal-title="config.wishes.modalTitle"
        :modal-subtitle="config.wishes.modalSubtitle"
        :name-label="config.wishes.nameLabel"
        :wish-label="config.wishes.wishLabel"
        :close-text="config.wishes.close"
        :button-text="config.wishes.button"
        :sending-text="config.wishes.sending"
        :sent-text="config.wishes.sent"
        :error-text="config.wishes.error"
        :lang="config.lang"
        :bg="config.backgrounds.plain"
      />
    </div>
  </div>
</template>

<style>
.page {
  min-height: 100vh;
  background: var(--page-bg);
}

/* Открытка по центру, на мобиле — во всю ширину */
.sheet {
  max-width: var(--sheet-max);
  margin: 0 auto;
  min-height: 100vh;
  background: var(--sheet-bg);
  box-shadow: 0 0 60px rgba(42, 50, 54, 0.12);
}
</style>
