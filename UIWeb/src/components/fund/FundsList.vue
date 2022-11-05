<template>
  <div class="content">
    <div class="loading" v-if="loading">
      <AppSpinner class="spinner" size="big" />
      <!--<AppProgress :progress="progress" />-->
    </div>
    <div v-else>
      <div v-if="funds.length > 0">
        <div class="searches pb-1">
          <form class="form-search">
            <div class="input-container">
              <input
                type="search"
                class="form-control"
                placeholder="Search by Name/Address"
                aria-label="Search"
                v-model="search"
              />
              <div class="icon-container">
                <fa-icon icon="magnifying-glass" class="icon" />
              </div>
            </div>
          </form>

          <button
            class="btn btn-outline-secondary"
            type="button"
            id="addFilterButton"
            data-toggle="modal"
            data-target="#filtersModal"
          >
            <fa-icon icon="filter" class="icon mr-2" />Add Filter
          </button>

          <div class="modal fade" id="filtersModal" tabindex="-1" aria-labelledby="filtersModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title mr-2" id="filtersModalLabel">Filters</h4>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="date-filter">
                    <div class="filter-title">Creation date</div>
                    <input type="date" class="form-control" v-model="date" />
                  </div>
                  <hr />
                  <div class="more-filters">
                    <div class="filter-title">More filters</div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="checkboxMyFunds" v-model="onlyShowMyFunds" />
                      <label class="form-check-label" for="checkboxMyFunds">Only show my funds</label>
                    </div>
                  </div>
                </div>
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

@media (max-width: 450px) {
  .searches {
    flex-direction: column;
    justify-content: center;
    align-items: end;
    gap: 10px;
  }

  .form-search {
    width: 100%;
  }
}

.form-search input {
  min-width: 230px;
}

@media (min-width: 768px) {
  .form-search input {
    min-width: 280px;
  }
}

.input-container {
  width: 100%;
  position: relative;
}

.input-container .form-control {
  padding-right: 35px;
}

.input-container .icon-container {
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  color: rgb(79, 79, 79);
  background-color: rgba(213, 213, 213, 0.585);
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.filter-title {
  font-weight: bold;
  margin-bottom: 0.4rem;
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
