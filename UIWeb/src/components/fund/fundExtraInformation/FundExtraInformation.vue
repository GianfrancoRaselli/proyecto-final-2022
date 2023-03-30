<template>
  <div class="extra-information fund-extra-information mt-4">
    <div id="header" class="header" @mouseover="mouseOverHeader" @mouseleave="mouseLeaveHeader">
      <div class="arrow arrow-left" @click="goBack" v-if="activeGoBack">
        <fa-icon icon="arrow-left" class="icon" />
      </div>
      <div class="arrow arrow-right" @click="goForward" v-if="activeGoForward">
        <fa-icon icon="arrow-right" class="icon" />
      </div>
      <div id="header-container" class="header-container">
        <div class="item" @click="history = true">
          <span class="span" :class="{ 'span-active': history }">Historia</span>
          <div class="bar" :class="{ 'bar-active': history }"></div>
        </div>
        <div class="item" @click="risks = true">
          <span class="span" :class="{ 'span-active': risks }">Riesgos</span>
          <div class="bar" :class="{ 'bar-active': risks }"></div>
        </div>
        <div class="item" @click="rewards = true">
          <span class="span" :class="{ 'span-active': rewards }">Recompensas</span>
          <div class="bar" :class="{ 'bar-active': rewards }"></div>
        </div>
        <!-- <div class="item" @click="images = true">
          <span class="span" :class="{ 'span-active': images }">Imágenes</span>
          <div class="bar" :class="{ 'bar-active': images }"></div>
        </div> -->
        <!-- <div class="item" @click="updates = true">
          <span class="span" :class="{ 'span-active': updates }">Actualizaciones</span>
          <div class="bar" :class="{ 'bar-active': updates }"></div>
        </div> -->
      </div>
    </div>
    <div class="body">
      <AppSpinner v-if="loading" />
      <div v-else>
        <FundExtraInformationHistory :isAManager="isAManager" :fund="fund" v-show="history" />
        <FundExtraInformationRisks :isAManager="isAManager" :fund="fund" v-show="risks" />
        <FundExtraInformationRewards :isAManager="isAManager" :fund="fund" v-show="rewards" />
        <FundExtraInformationUpdates :isAManager="isAManager" :fund="fund" v-show="updates" />
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import axios from 'axios';

import FundExtraInformationHistory from '@/components/fund/fundExtraInformation/contents/FundExtraInformationHistory';
import FundExtraInformationRisks from '@/components/fund/fundExtraInformation/contents/FundExtraInformationRisks';
import FundExtraInformationRewards from '@/components/fund/fundExtraInformation/contents/FundExtraInformationRewards';
import FundExtraInformationUpdates from '@/components/fund/fundExtraInformation/contents/FundExtraInformationUpdates';

export default {
  name: 'FundExtraInformationComponent',
  components: {
    FundExtraInformationHistory,
    FundExtraInformationRisks,
    FundExtraInformationRewards,
    FundExtraInformationUpdates,
  },
  props: {
    isAManager: { type: Boolean, required: true },
  },
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
  created() {
    axios.get('fund/' + this.$route.params.fundAddress).then((res) => {
      this.fund = res.data;
      this.loading = false;
    });
  },
};
</script>

<style lang="scss" scoped>
.body {
  padding: 0.6rem 0;
}
</style>

<style lang="scss">
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;

  .title {
    font-size: 1.8rem;
  }
}

.ql-align-left {
  text-align: left;
}
.ql-align-right {
  text-align: right;
}
.ql-align-center {
  text-align: center;
}
.ql-align-justify {
  text-align: justify;
}

blockquote {
  background: #f9f9f9;
  border-left: 5px solid #ccc;
  margin: 20px 10px;
  padding: 4px 16px;
}
</style>
