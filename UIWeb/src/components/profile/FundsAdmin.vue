<template>
  <div class="container">
    <AppSpinner class="spinner" size="medium" v-if="loading" />
    <div class="items" v-else>
      <div class="no-items" v-if="fundsToShow && fundsToShow.length === 0">
        <fa-icon icon="xmark" class="icon" size="5x" />
        <span>La entidad no es administradora de ningún fondo.</span>
      </div>
      <div v-else>
        <div class="item" v-for="(fund, index) in fundsToShow" :key="index">
          <span>
            <span v-text="index + 1"></span>
            <span>.&nbsp;</span>
            <span class="hover" v-text="fund.name" @click="goToFund(fund.address)"></span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { goToFund } from '@/helpers/helpers';
import { compareAddresses } from 'web3-simple-helpers/methods/general';

export default {
  name: 'FundsAdminProfileComponent',
  components: {},
  props: {
    loading: { type: Boolean, required: true },
    funds: { type: Array, required: true },
  },
  data() {
    return {};
  },
  computed: {
    fundsToShow() {
      let fundsToFilter = this.funds.slice();

      // filter
      fundsToFilter = fundsToFilter.filter((fund) => {
        if (fund.managers.findIndex((manager) => compareAddresses(manager, this.$route.params.address)) >= 0) return true;
        return false;
      });

      return fundsToFilter;
    },
  },
  methods: {
    goToFund,
  },
  created() {},
  mounted() {},
  unmounted() {},
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .spinner {
    margin-top: 2rem;
  }

  .items {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .no-items {
      font-size: 1.2rem;
      text-align: center;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      gap: 0.8rem;
    }

    .item {
      padding: 0.65rem 0.55rem;
      border: 1px solid rgb(238, 238, 238);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: start;
      gap: 0.3rem;

      .address {
        font-weight: bold;
      }
    }
  }
}
</style>
