<template>
  <div class="container">
    <AppSpinner class="spinner" size="medium" v-if="loading" />
    <div class="items" v-else>
      <div class="no-items" v-if="fundsToShow.length === 0">
        <fa-icon icon="xmark" class="icon" size="5x" />
        <span>La entidad no es administradora de ningún fondo.</span>
      </div>
      <div v-else>
        <p class="amount">
          <span class="number" v-text="fundsToShow.length"></span>
          <span v-text="fundsToShow.length === 1 ? ' fondo encontrado.' : ' fondos encontrados.'"></span>
        </p>
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
  name: 'ProfileFundsAdminComponent',
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
</style>
