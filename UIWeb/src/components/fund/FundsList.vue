<template>
  <div class="content">
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
    <div class="loading" v-if="loading">
      <AppSpinner class="spinner" />
      <!--<AppProgress :progress="progress" />-->
    </div>
    <div v-else>
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
      <div class="refresh mt-3">
        <AppButton classes="btn-outline-primary btn-sm" text="Refresh" icon="rotate" @click="updateFunds" />
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vuejs3-datepicker';
import FundCard from '@/components/fund/FundCard';
import { mapState } from 'vuex';
import { fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';
import { call, isTheSameDate } from '@/helpers/helpers';
import AppButton from '../global/AppButton.vue';

export default {
  name: 'FundsListComponent',
  components: {
    DatePicker,
    FundCard,
    AppButton,
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

    async updateFunds() {
      await this.searchFunds();
    },
  },
  async created() {
    await this.searchFunds();
  },
  unmounted() {
    if (this.newFundSubscription) this.newFundSubscription.unsubscribe();
  },
};
</script>

<style scoped>
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

.fund-card-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.refresh {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
