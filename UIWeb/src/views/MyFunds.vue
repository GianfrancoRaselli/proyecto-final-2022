<template>
  <div>
    <FundsList :loading="loading" :progress="progress" :funds="myFunds" />
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
      progress: 0,
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
      this.progress = 50;

      const fundsAddress = await call('FundFactory', 'getDeployedFunds');
      const totalFunds = fundsAddress.length;
      const funds = Array(totalFunds);

      let callsResolved = 0;
      await Promise.all(
        Array(totalFunds)
          .fill()
          .map((element, index) => {
            return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary').then((res) => {
              funds[index] = res;

              callsResolved++;
              this.progress = Math.round((callsResolved / totalFunds) * 100);
            });
          }),
      );

      this.myFunds = funds.filter((fund) => fund._creator.toLowerCase() === this.address.toLowerCase());

      this.progress = 100;
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

      if (this.myFunds.findIndex((fund) => fund._address === _address) < 0) {
        this.myFunds.push({ _address, _name, _description, _creator, _createdAt });
      }
    });
  },
  unmounted() {
    if (this.newFundSubscription) this.newFundSubscription.unsubscribe();
  },
};
</script>

<style scoped></style>
