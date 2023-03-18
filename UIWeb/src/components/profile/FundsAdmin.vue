<template>
  <div class="container">
    <AppSpinner class="spinner" size="medium" v-if="loading" />
    <div class="funds" v-else>
      <Fund v-for="(fund, i) in fundsToShow" :key="i" :fund="fund" />
    </div>
  </div>
</template>

<script>
import { compareAddresses } from 'web3-simple-helpers/methods/general';

import Fund from '@/components/profile/fund/Fund';

export default {
  name: 'FundsAdminComponent',
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
        if (fund.managers.findIndex((manager) => compareAddresses(manager, this.$route.params.address)) >= 0) return true;
        return false;
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
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .spinner {
    margin-top: 2rem;
  }

  .funds {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
