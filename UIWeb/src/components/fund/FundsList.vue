<template>
  <div class="content">
    <div class="loading" v-if="loading">
      <AppSpinner class="spinner" size="big" />
      <!--<AppProgress :progress="progress" />-->
    </div>
    <div v-else>
      <div class="filters-header" v-if="funds.length > 0">
        <div class="filters">
          <form class="form-search">
            <div class="input-container">
              <input
                type="search"
                class="form-control input"
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
                  <div class="order-filter">
                    <div class="filter-title">Order by</div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="orderByRadios"
                        id="lastCreatedRadios"
                        value="lastCreated"
                        v-model="filters.orderBy"
                      />
                      <label class="form-check-label" for="lastCreatedRadios">Last created</label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="orderByRadios"
                        id="firstCreatedRadios"
                        value="firstCreated"
                        v-model="filters.orderBy"
                      />
                      <label class="form-check-label" for="firstCreatedRadios">First created</label>
                    </div>
                  </div>

                  <hr />
                  <div class="date-filter">
                    <div class="filter-title">Creation date</div>
                    <input type="date" class="form-control" v-model="filters.date" />
                  </div>

                  <hr />
                  <div class="type-filters">
                    <div class="filter-title">Funds types</div>
                    <div class="form-group">
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="checkboxAllFunds"
                          v-model="filters.fundsTypes.allFunds"
                        />
                        <label class="form-check-label" for="checkboxAllFunds">All funds</label>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="checkboxfriends"
                          v-model="filters.fundsTypes.types.friends"
                          :disabled="filters.fundsTypes.allFunds"
                        />
                        <label class="form-check-label" for="checkboxfriends">Friends funds</label>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="checkboxcampaign"
                          v-model="filters.fundsTypes.types.campaign"
                          :disabled="filters.fundsTypes.allFunds"
                        />
                        <label class="form-check-label" for="checkboxcampaign">Campaign funds</label>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="checkboxdonation"
                          v-model="filters.fundsTypes.types.donation"
                          :disabled="filters.fundsTypes.allFunds"
                        />
                        <label class="form-check-label" for="checkboxdonation">Donation funds</label>
                      </div>
                    </div>
                  </div>

                  <hr />
                  <div class="more-filters">
                    <div class="filter-title">More filters</div>
                    <div class="form-group form-check">
                      <input type="checkbox" class="form-check-input" id="checkboxMyFunds" v-model="filters.onlyShowMyFunds" />
                      <label class="form-check-label" for="checkboxMyFunds">Only show my funds</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="applied-filters">
          <span class="order-by"
            ><span class="title">Order by</span>:&nbsp;<span class="description" v-text="orderBy"></span
          ></span>
          <AppPill :msg="filters.date" @close="filters.date = null" v-if="filters.date" />
          <AppPill
            msg="Friends funds"
            type="success"
            @close="filters.fundsTypes.types.friends = false"
            v-if="filters.fundsTypes.types.friends"
          />
          <AppPill
            msg="Campaign funds"
            type="warning"
            @close="filters.fundsTypes.types.campaign = false"
            v-if="filters.fundsTypes.types.campaign"
          />
          <AppPill
            msg="Donation funds"
            type="secondary"
            @close="filters.fundsTypes.types.donation = false"
            v-if="filters.fundsTypes.types.donation"
          />
          <AppPill msg="My funds" type="primary" @close="filters.onlyShowMyFunds = false" v-if="filters.onlyShowMyFunds" />
        </div>
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
      filters: {
        orderBy: 'lastCreated',
        date: null,
        fundsTypes: {
          allFunds: true,
          types: {
            friends: true,
            campaign: true,
            donation: true,
          },
        },
        onlyShowMyFunds: false,
      },
      funds: [],
      fundsToAdd: [],
      newFundSubscription: null,
    };
  },
  computed: {
    ...mapState({ address: (state) => state.connection.address }),

    orderBy() {
      // first word
      let orderBy = this.filters.orderBy.match(/[a-z]+/g)[0];

      // next words
      const words = this.filters.orderBy.match(/[A-Z][a-z]+/g);
      if (words && words.length > 0) orderBy = orderBy + ' ' + words.join(' ').toLowerCase();

      return orderBy.charAt(0).toUpperCase() + orderBy.slice(1);
    },

    fundsToShow() {
      return this.filterFunds(this.funds.slice());
    },

    fundsToAddToShow() {
      return this.filterFunds(this.fundsToAdd.slice());
    },

    newFunds() {
      if (this.fundsToAddToShow.length - this.fundsToShow.length < 0) return 0;
      return this.fundsToAddToShow.length - this.fundsToShow.length;
    },
  },
  watch: {
    'filters.fundsTypes.allFunds'(newValue) {
      if (newValue) {
        this.filters.fundsTypes.types.friends = true;
        this.filters.fundsTypes.types.campaign = true;
        this.filters.fundsTypes.types.donation = true;
      }
    },
    'filters.fundsTypes.types.friends'(newValue) {
      if (!newValue) this.filters.fundsTypes.allFunds = false;
    },
    'filters.fundsTypes.types.campaign'(newValue) {
      if (!newValue) this.filters.fundsTypes.allFunds = false;
    },
    'filters.fundsTypes.types.donation'(newValue) {
      if (!newValue) this.filters.fundsTypes.allFunds = false;
    },
  },
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

    filterFunds(fundsToFilter) {
      // search
      if (this.search.trim()) {
        const search = this.search
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        fundsToFilter = fundsToFilter.filter(
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

      // creation date
      if (this.filters.date)
        fundsToFilter = fundsToFilter.filter((fund) =>
          areTheSameDates(this.filters.date, fromUnixTimestampToDate(fund.createdAt)),
        );

      // funds types
      if (!this.filters.fundsTypes.allFunds) {
        fundsToFilter = fundsToFilter.filter((fund) => {
          const type = this.fundType(fund);
          if (this.filters.fundsTypes.types[type]) return true;
          return false;
        });
      }

      // only my funds
      if (this.filters.onlyShowMyFunds)
        fundsToFilter = fundsToFilter.filter((fund) => compareAddresses(fund.creator, this.address));

      // order
      if (this.filters.orderBy === 'lastCreated')
        fundsToFilter = fundsToFilter.sort((a, b) => {
          if (a.createdAt < b.createdAt) return 1;
          if (a.createdAt > b.createdAt) return -1;
          return 0;
        });
      else if (this.filters.orderBy === 'firstCreated')
        fundsToFilter = fundsToFilter.sort((a, b) => {
          if (a.createdAt > b.createdAt) return 1;
          if (a.createdAt < b.createdAt) return -1;
          return 0;
        });

      return fundsToFilter;
    },

    fundType(fund) {
      if (
        fund.managersCanBeAddedOrRemoved &&
        fund.managersCanTransferMoneyWithoutARequest &&
        fund.requestsCanBeCreated &&
        !fund.onlyManagersCanCreateARequest &&
        !fund.onlyContributorsCanApproveARequest
      )
        return 'friends';
      if (
        !fund.managersCanBeAddedOrRemoved &&
        !fund.managersCanTransferMoneyWithoutARequest &&
        fund.requestsCanBeCreated &&
        fund.onlyManagersCanCreateARequest &&
        fund.onlyContributorsCanApproveARequest
      )
        return 'campaign';
      if (
        fund.managersCanBeAddedOrRemoved &&
        fund.managersCanTransferMoneyWithoutARequest &&
        fund.requestsCanBeCreated &&
        fund.onlyManagersCanCreateARequest &&
        fund.onlyContributorsCanApproveARequest
      )
        return 'donation';
      return undefined;
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

.filters-header {
  padding-bottom: 16px;
  border-bottom: 0.2px solid rgba(136, 136, 136, 0.432);
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  gap: 16px;
}

.filters {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.applied-filters {
  height: 1.3rem;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 8px;
}

.applied-filters .order-by {
  padding-right: 10px;
}

.applied-filters .order-by .title {
  font-weight: bold;
}

.applied-filters .order-by .description {
  font-size: 0.9rem;
}

@media (max-width: 450px) {
  .filters {
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

.input-container .input {
  padding-left: 32px;
}

@media (min-width: 768px) {
  .input-container .input {
    padding-left: 38px;
  }
}

.input-container .icon-container {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  color: rgb(79, 79, 79);
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
