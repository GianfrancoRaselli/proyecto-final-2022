<template>
  <div class="content">
    <div v-if="loading" class="loading">
      <AppSpinner class="spinner" size="big" />
      <!--<AppProgress :progress="progress" />-->
    </div>
    <div v-else>
      <div class="searches" v-if="funds.length > 0">
        <div class="date">
          <DatePicker :value="date" lang="en" @selected="updateDate" class="datepicker" />
          <fa-icon icon="xmark" class="icon xmark" size="2x" v-if="date" @click="date = null"></fa-icon>
        </div>
        <div>
          <input type="checkbox" class="form-check-input" id="onlyShowMyFunds" v-model="onlyShowMyFunds" />
          <label class="form-check-label" for="onlyShowMyFunds">Only show my funds</label>
        </div>
        <form class="form-inline">
          <input class="form-control" type="search" placeholder="Search" aria-label="Search" v-model="search" />
        </form>
      </div>
      <hr />
      <AppAlert msg="No funds" v-if="fundsToShow.length === 0" />
      <div class="row" v-else>
        <div
          class="col-12 col-md-6 col-lg-4 fund-card-container"
          v-for="(fund, index) in fundsToShow"
          :key="index"
          @click="redirect(fund._address)"
        >
          <FundCard class="fund-card" :fund="fund" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vuejs3-datepicker';
import FundCard from '@/components/fund/FundCard';
import { mapState } from 'vuex';
import { fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';
import { call, event, isTheSameDate } from '@/helpers/helpers';

export default {
  name: 'FundsListComponent',
  components: {
    DatePicker,
    FundCard,
  },
  data() {
    return {
      loading: true,
      progress: 0,
      search: '',
      date: null,
      onlyShowMyFunds: false,
      funds: [],
      newFundSubscription: null,
    };
  },
  computed: {
    ...mapState({ address: (state) => state.connection.address }),

    fundsToShow() {
      let fundsToShow = this.funds.slice();

      if (this.onlyShowMyFunds)
        fundsToShow = fundsToShow.filter((fund) => fund._creator.toLowerCase() === this.address.toLowerCase());

      if (this.date)
        fundsToShow = fundsToShow.filter((fund) => isTheSameDate(this.date, fromUnixTimestampToDate(fund._createdAt)));

      if (this.search.trim()) {
        const search = this.search
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        fundsToShow = fundsToShow.filter(
          (fund) =>
            fund._address.toLowerCase() === search ||
            fund._creator.toLowerCase() === search ||
            fund._name
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .includes(search),
        );
      }

      return fundsToShow.sort((a, b) => {
        if (a._createdAt < b._createdAt) return 1;
        if (a._createdAt > b._createdAt) return -1;
        return 0;
      });
    },
  },
  watch: {},
  methods: {
    updateDate(date) {
      this.date = date;
    },

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
            return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary', [], {}, (res) => {
              this.funds[index] = res;

              callsResolved++;
              this.progress = Math.round((callsResolved / totalFunds) * 100);
            });
          }),
      );

      this.progress = 100;
      this.loading = false;
    },

    redirect(fundAddress) {
      this.$router.push({ name: 'Fund', params: { fundAddress } });
    },
  },
  async created() {
    await this.searchFunds();
    this.newFundSubscription = await event('FundFactory', 'NewFund', undefined, (err, ev) => {
      const {
        fundAddress: _address,
        name: _name,
        description: _description,
        creator: _creator,
        createdAt: _createdAt,
      } = ev.returnValues;

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

<style scoped>
.loading {
  position: fixed;
  top: 25vh;
  left: 0;
  width: 100%;
}

.spinner {
  margin: auto;
}

.searches {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.date {
  position: relative;
}

.xmark {
  color: red;
  position: absolute;
  top: 10px;
  right: 25px;
}

.xmark:hover {
  cursor: pointer;
}

.fund-card-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
