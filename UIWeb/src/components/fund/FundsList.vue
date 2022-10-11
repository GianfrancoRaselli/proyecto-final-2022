<template>
  <div class="content">
    <div class="loading" v-if="loading">
      <AppSpinner class="spinner" size="big" />
      <!--<AppProgress :progress="progress" />-->
    </div>
    <div v-else>
      <div v-if="funds.length > 0">
        <div class="searches">
          <div class="date m-2">
            <DatePicker :value="date" lang="en" @selected="updateDate" class="datepicker" />
            <fa-icon icon="xmark" class="icon xmark" size="2x" v-if="date" @click="date = null"></fa-icon>
          </div>
          <div class="show-my-funds m-2 ml-4">
            <input type="checkbox" class="form-check-input" id="onlyShowMyFunds" v-model="onlyShowMyFunds" />
            <label class="form-check-label" for="onlyShowMyFunds">Only show my funds</label>
          </div>
          <form class="form-inline form-search m-2">
            <input class="form-control" type="search" placeholder="Search" aria-label="Search" v-model="search" />
          </form>
        </div>
        <hr />
      </div>
      <button class="btn btn-outline-link btn-block btn-show my-2" @click="updateFunds" v-if="newFunds > 0">
        Show&nbsp;<AppShowAmount :amount="newFunds" singular="fund" plural="funds" />
      </button>
      <AppAlert msg="No funds created yet" v-if="funds.length === 0" />
      <div v-else>
        <AppAlert msg="No funds were found with those parameters" v-if="fundsToShow.length === 0" />
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
      fundsToAdd: [],
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

    fundsToAddToShow() {
      let fundsToAddToShow = this.fundsToAdd.slice();

      if (this.onlyShowMyFunds)
        fundsToAddToShow = fundsToAddToShow.filter((fund) => fund._creator.toLowerCase() === this.address.toLowerCase());

      if (this.date)
        fundsToAddToShow = fundsToAddToShow.filter((fund) => isTheSameDate(this.date, fromUnixTimestampToDate(fund._createdAt)));

      if (this.search.trim()) {
        const search = this.search
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        fundsToAddToShow = fundsToAddToShow.filter(
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

      return fundsToAddToShow;
    },

    newFunds() {
      if (this.fundsToAddToShow.length - this.fundsToShow.length < 0) return 0;
      return this.fundsToAddToShow.length - this.fundsToShow.length;
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
      const funds = Array(totalFunds);

      let callsResolved = 0;
      await Promise.all(
        Array(totalFunds)
          .fill()
          .map((element, index) => {
            return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary', [], {}, (res) => {
              funds[index] = res;

              callsResolved++;
              this.progress = Math.round((callsResolved / totalFunds) * 100);
            });
          }),
      );

      this.funds = funds;
      this.progress = 100;
      this.loading = false;
    },

    async searchFundsToAdd() {
      const fundsAddress = await call('FundFactory', 'getDeployedFunds');
      const totalFunds = fundsAddress.length;
      const funds = Array(totalFunds);

      await Promise.all(
        Array(totalFunds)
          .fill()
          .map((element, index) => {
            return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary', [], {}, (res) => {
              funds[index] = res;
            });
          }),
      );

      this.fundsToAdd = funds;
    },

    redirect(fundAddress) {
      this.$router.push({ name: 'Fund', params: { fundAddress } });
    },

    updateFunds() {
      this.funds = this.fundsToAdd;
      this.fundsToAdd = [];
    },
  },
  async created() {
    await this.searchFunds();
    this.newFundSubscription = await event('FundFactory', 'NewFund', undefined, async () => {
      await this.searchFundsToAdd();
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

.loading .spinner {
  margin: auto;
}

.searches {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
}

.show-my-funds {
  user-select: none;
}

.form-search {
  float: right;
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

.btn-show {
  background-color: aliceblue;
  border: 1px solid rgb(206, 206, 225);
}

.fund-card-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
