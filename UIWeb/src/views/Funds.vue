<template>
  <div>
    <FundsList :loading="loading" :progress="progress" :funds="funds" />
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
      progress: 0,
      funds: [],
      newFundSubscription: null,
    };
  },
  methods: {
    async searchFunds() {
      this.loading = true;
      this.progress = 0;

      const fundsAddress = await call('FundFactory', 'getDeployedFunds');
      const totalFunds = fundsAddress.length;
      this.funds = Array(totalFunds);

      let callsResolved = 0;
      await Promise.all(
        Array(totalFunds)
          .fill()
          .map((element, index) => {
            return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary').then((res) => {
              this.funds[index] = res;

              callsResolved++;
              this.progress = Math.round((callsResolved / totalFunds) * 100);
            });
          }),
      );

      this.progress = 100;
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

      if (this.funds.findIndex((fund) => fund._address === _address) < 0) {
        this.funds.push({ _address, _name, _description, _creator, _createdAt });
      }
    });
  },
  unmounted() {
    if (this.newFundSubscription) this.newFundSubscription.unsubscribe();
  },
};
</script>

<style scoped></style>
