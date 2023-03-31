<template>
  <div class="profile-extra-information-container">
    <AppSpinner class="spinner" size="medium" v-if="loading" />
    <div class="items" v-else>
      <div class="no-items" v-if="fundsToShow.length === 0">
        <FaIcon icon="xmark" class="icon" size="5x" />
        <span>La entidad no ha creado ningún fondo aún.</span>
      </div>
      <div v-else>
        <p class="amount">
          <span class="number" v-text="fundsToShow.length"></span>
          <span v-text="fundsToShow.length === 1 ? ' fondo encontrado.' : ' fondos encontrados.'"></span>
        </p>
        <Fund v-for="(fund, i) in fundsToShow" :key="i" :fund="fund" />
      </div>
    </div>
  </div>
</template>

<script>
import { compareAddresses } from 'web3-simple-helpers/methods/general';

import Fund from '@/components/profile/fund/Fund';

export default {
  name: 'ProfileFundsCreatedComponent',
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
        return -1;
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

<style lang="scss" scoped></style>
