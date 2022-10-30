<template>
  <div class="content">
    <div class="loading" v-if="loading">
      <AppSpinner class="spinner" size="big" />
      <!--<AppProgress :progress="progress" />-->
    </div>
    <div v-else>
      <div v-if="funds.length > 0">
        <div class="searches">
          <form class="form-search">
            <input type="search" class="form-control" placeholder="Search by Name/Address" aria-label="Search" v-model="search" />
          </form>

          <div class="dropdown filters">
            <button
              class="btn btn-outline-secondary"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <fa-icon icon="plus" class="icon mr-2" />Add Filter
            </button>

            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton" @click="$event.stopPropagation()">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="checkboxMyFunds" v-model="onlyShowMyFunds" />
                <label class="form-check-label" for="checkboxMyFunds">Only show my funds</label>
              </div>

              <div class="date">
                <input type="date" class="form-control" v-model="date" />
              </div>
            </div>
          </div>
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
            @click="redirect(fund.address)"
          >
            <FundCard class="fund-card" :fund="fund" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FundCard from '@/components/fund/FundCard';
import { mapState } from 'vuex';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';
import { call, event, areTheSameDates } from '@/helpers/helpers';

export default {
  name: 'FundsListComponent',
  components: {
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

      if (this.onlyShowMyFunds) fundsToShow = fundsToShow.filter((fund) => compareAddresses(fund.creator, this.address));

      if (this.date)
        fundsToShow = fundsToShow.filter((fund) => areTheSameDates(this.date, fromUnixTimestampToDate(fund.createdAt)));

      if (this.search.trim()) {
        const search = this.search
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        fundsToShow = fundsToShow.filter(
          (fund) =>
            compareAddresses(fund.address, search) ||
            compareAddresses(fund.creator, search) ||
            fund.name
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .includes(search),
        );
      }

      return fundsToShow.sort((a, b) => {
        if (a.createdAt < b.createdAt) return 1;
        if (a.createdAt > b.createdAt) return -1;
        return 0;
      });
    },

    fundsToAddToShow() {
      let fundsToAddToShow = this.fundsToAdd.slice();

      if (this.onlyShowMyFunds)
        fundsToAddToShow = fundsToAddToShow.filter((fund) => compareAddresses(fund.creator, this.address));

      if (this.date)
        fundsToAddToShow = fundsToAddToShow.filter((fund) => areTheSameDates(this.date, fromUnixTimestampToDate(fund.createdAt)));

      if (this.search.trim()) {
        const search = this.search
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        fundsToAddToShow = fundsToAddToShow.filter(
          (fund) =>
            compareAddresses(fund.address, search) ||
            compareAddresses(fund.creator, search) ||
            fund.name
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
      let funds = [];

      if (totalFunds > 0) {
        funds = Array(totalFunds);

        await Promise.all(
          Array(totalFunds)
            .fill()
            .map((element, index) => {
              return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary', [], {}, (res) => {
                funds[index] = res;
              });
            }),
        );
      }

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
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.form-search input {
  width: 240px;
}

.filters .dropdown-menu {
  width: max-content;
  padding: 10px;
}

.filters .dropdown-menu.show {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: start;
  gap: 10px;
}

.form-check {
  user-select: none;
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
