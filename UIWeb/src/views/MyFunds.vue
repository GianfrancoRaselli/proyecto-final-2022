<template>
  <div>
    <FundsList :loading="loading" :funds="myFunds" />
  </div>
</template>

<script>
import FundsList from '@/components/fund/FundsList';
import { mapState } from 'vuex';
import { call, event } from '@/helpers/helpers';

export default {
  name: 'MyFundsView',
  components: {
    FundsList,
  },
  data() {
    return {
      loading: false,
      myFunds: [],
      newFundSubscription: null,
    };
  },
  computed: {
    ...mapState({ address: (state) => state.connection.address }),
  },
  methods: {
    async searchFunds() {
      this.loading = true;

      const fundsAddress = await call('FundFactory', 'getDeployedFunds');
      const funds = await Promise.all(
        Array(fundsAddress.length)
          .fill()
          .map((element, index) => {
            return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary');
          }),
      );
      this.myFunds = funds.filter((fund) => fund._creator.toLowerCase() === this.address.toLowerCase());

      this.loading = false;
    },
  },
  async created() {
    await this.searchFunds();
    this.newFundSubscription = await event('FundFactory', 'NewFund', { filter: { creator: this.address } }, (err, event) => {
      const {
        fundAddress: _address,
        name: _name,
        description: _description,
        creator: _creator,
        createdAt: _createdAt,
      } = event.returnValues;

      this.myFunds.push({ _address, _name, _description, _creator, _createdAt });
    });
  },
  unmounted() {
    if (this.newFundSubscription) this.newFundSubscription.unsubscribe();
  },
};
</script>

<style scoped></style>
