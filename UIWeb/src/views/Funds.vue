<template>
  <div>
    <FundsList :loading="loading" :funds="funds" />
  </div>
</template>

<script>
import FundsList from '@/components/fund/FundsList';
import { call, event } from '@/helpers/helpers';

export default {
  name: 'FundsView',
  components: {
    FundsList,
  },
  data() {
    return {
      loading: false,
      funds: [],
      newFundSubscription: null,
    };
  },
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

<style scoped></style>
