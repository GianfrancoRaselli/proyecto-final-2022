<template>
  <div>
    <AppSpinner v-if="loading" />
    <div v-if="!loading">
      <AppAlert msg="No funds" v-if="fundsReverse.length === 0" />
      <div class="row" v-else>
        <div
          class="col-12 col-md-6 col-lg-4 fund-card"
          v-for="(fund, index) in fundsReverse"
          :key="index"
          @click="redirect(fund._address)"
        >
          <FundCard :fund="fund" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FundCard from '@/components/fund/FundCard';

export default {
  name: 'FundsListComponent',
  components: {
    FundCard,
  },
  props: {
    loading: { type: Boolean, default: false },
    funds: { type: Array, require: true },
  },
  data() {
    return {};
  },
  computed: {
    fundsReverse() {
      return this.funds.slice().reverse();
    },
  },
  watch: {},
  methods: {
    redirect(fundAddress) {
      this.$router.push({ name: 'Fund', params: { fundAddress } });
    },
  },
};
</script>

<style scoped>
.fund-card {
  padding: 10px;
}

.fund-card:hover {
  padding: 5px;
  box-shadow: 0 0 5px black;
  cursor: pointer;
}
</style>