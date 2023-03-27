<template>
  <div class="extra-information fund-extra-information">
    <div id="header" class="header" @mouseover="mouseOverHeader" @mouseleave="mouseLeaveHeader">
      <div class="arrow arrow-left" @click="goBack" v-if="activeGoBack">
        <fa-icon icon="arrow-left" class="icon" />
      </div>
      <div class="arrow arrow-right" @click="goForward" v-if="activeGoForward">
        <fa-icon icon="arrow-right" class="icon" />
      </div>
      <div id="header-container" class="header-container">
        <div class="item" @click="history = true">
          <span class="span" :class="{ 'span-active': fundsCreated }">Historia</span>
          <div class="bar" :class="{ 'bar-active': fundsCreated }"></div>
        </div>
        <div class="item" @click="risks = true">
          <span class="span" :class="{ 'span-active': fundsAdmin }">Riesgos</span>
          <div class="bar" :class="{ 'bar-active': fundsAdmin }"></div>
        </div>
        <div class="item" @click="rewards = true">
          <span class="span" :class="{ 'span-active': contributions }">Recompensas</span>
          <div class="bar" :class="{ 'bar-active': contributions }"></div>
        </div>
        <div class="item" @click="images = true">
          <span class="span" :class="{ 'span-active': transfersMade }">Imágenes</span>
          <div class="bar" :class="{ 'bar-active': transfersMade }"></div>
        </div>
        <div class="item" @click="updates = true">
          <span class="span" :class="{ 'span-active': transferReceived }">Actualizaciones</span>
          <div class="bar" :class="{ 'bar-active': transferReceived }"></div>
        </div>
      </div>
    </div>
    <div class="body"></div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'FundExtraInformationComponent',
  props: {},
  data() {
    return {
      loading: true,
      fund: null,
      activeGoBack: false,
      activeGoForward: false,
      history: true,
      risks: false,
      rewards: false,
      images: false,
      updates: false,
    };
  },
  computed: {},
  watch: {
    history(newValue) {
      if (newValue) {
        this.risks = false;
        this.rewards = false;
        this.images = false;
        this.updates = false;
      }
    },
    risks(newValue) {
      if (newValue) {
        this.history = false;
        this.rewards = false;
        this.images = false;
        this.updates = false;
      }
    },
    rewards(newValue) {
      if (newValue) {
        this.history = false;
        this.risks = false;
        this.images = false;
        this.updates = false;
      }
    },
    images(newValue) {
      if (newValue) {
        this.history = false;
        this.risks = false;
        this.rewards = false;
        this.updates = false;
      }
    },
    updates(newValue) {
      if (newValue) {
        this.history = false;
        this.risks = false;
        this.rewards = false;
        this.images = false;
      }
    },
  },
  methods: {
    mouseOverHeader() {
      const scrollLeft = document.getElementById('header-container').scrollLeft;
      const offsetWidth = document.getElementById('header-container').offsetWidth;
      const scrollWidth = document.getElementById('header-container').scrollWidth;
      if (scrollLeft > 5) this.activeGoBack = true;
      else this.activeGoBack = false;
      if (scrollWidth - (scrollLeft + offsetWidth) > 5) this.activeGoForward = true;
      else this.activeGoForward = false;
    },

    mouseLeaveHeader() {
      this.activeGoBack = false;
      this.activeGoForward = false;
    },

    goBack() {
      $('.header-container').animate({ scrollLeft: document.getElementById('header-container').scrollLeft - 300 }, 200, () =>
        this.mouseOverHeader(),
      );
    },

    goForward() {
      $('.header-container').animate({ scrollLeft: document.getElementById('header-container').scrollLeft + 300 }, 200, () =>
        this.mouseOverHeader(),
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
