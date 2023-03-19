<template>
  <div class="container">
    <AppSpinner class="spinner" size="medium" v-if="loading" />
    <div class="items" v-else>
      <div class="no-items" v-if="fundsToShow && fundsToShow.length === 0">
        <fa-icon icon="xmark" class="icon" size="5x" />
        <span>La entidad no ha creado ningún fondo aún.</span>
      </div>
      <div v-else>
        <Fund v-for="(fund, i) in fundsToShow" :key="i" :fund="fund" />
      </div>
    </div>
  </div>
</template>

<script>
import { compareAddresses } from 'web3-simple-helpers/methods/general';

import Fund from '@/components/profile/fund/Fund';

export default {
  name: 'FundsCreatedProfileComponent',
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
  }
}
</style>
