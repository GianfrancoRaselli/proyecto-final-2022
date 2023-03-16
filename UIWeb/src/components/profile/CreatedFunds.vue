<template>
  <div class="created-funds-container">
    <p class="title">Fondos creados</p>
    <div class="content">
      <AppSpinner class="spinner" size="medium" v-if="loading" />
      <div class="funds" v-else>
        <Fund v-for="(fund, i) in fundsToShow" :key="i" :fund="fund" />
      </div>
    </div>
  </div>
</template>

<script>
import { compareAddresses } from 'web3-simple-helpers/methods/general';

import Fund from '@/components/profile/fund/Fund';

export default {
  name: 'CreatedFundsComponent',
  components: {
    Fund,
  },
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
        return compareAddresses(fund.creator, this.$route.params.address);
      });

      // order
      fundsToFilter = fundsToFilter.sort((a, b) => {
        if (a.createdAt < b.createdAt) return 1;
        if (a.createdAt > b.createdAt) return -1;
        return 0;
      });

      return fundsToFilter;
    },
  },
  methods: {},
  created() {},
  mounted() {},
  unmounted() {},
};
</script>

<style lang="scss" scoped>
.created-funds-container {
  padding: 1.5rem;

  .title {
    font-size: 2.34rem;
    font-weight: bold;
    font-family: 'Dancing Script', cursive;
    text-align: center;
  }

  .content {
    padding: 0 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .funds {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
}
</style>
