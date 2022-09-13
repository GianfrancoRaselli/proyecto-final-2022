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
import { call, event } from '@/helpers/helpers';

export default {
  name: 'FundsListComponent',
  components: {
    FundCard,
  },
  data() {
    return {
      loading: false,
      funds: [],
      newFundSubscription: null,
    };
  },
  computed: {
    fundsReverse() {
      return this.funds.slice().reverse();
    },
  },
  watch: {},
  methods: {
    async searchFunds() {
      this.loading = true;

      const fundsAddress = await call('FundFactory', 'getDeployedFunds');
      this.funds = await Promise.all(
        Array(fundsAddress.length)
          .fill()
          .map((element, index) => {
            return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary');
          }),
      );

      this.loading = false;
    },

    redirect(fundAddress) {
      console.log(fundAddress);
      this.$router.push({ name: 'Fund', params: { fundAddress } });
    },
  },
  async created() {
    await this.searchFunds();
    this.newFundSubscription = await event('FundFactory', 'NewFund', undefined, (err, event) => {
      const {
        fundAddress: _address,
        name: _name,
        description: _description,
        creator: _creator,
        createdAt: _createdAt,
      } = event.returnValues;

      this.funds.push({ _address, _name, _description, _creator, _createdAt });
    });
  },
  unmounted() {
    if (this.newFundSubscription) this.newFundSubscription.unsubscribe();
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