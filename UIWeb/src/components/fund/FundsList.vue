<template>
  <div class="content">
    <div class="loading" v-if="loading">
      <AppSpinner class="spinner" size="big" />
      <!--<AppProgress :progress="progress" />-->
    </div>
    <div v-else>
      <div class="filters-header" v-if="funds.length > 0">
        <div class="filters">
          <form class="fund-search-form">
            <div class="input-container">
              <input
                type="search"
                class="input"
                placeholder="Buscar por nombre/dirección"
                aria-label="Buscar"
                v-model="searching"
                @keydown.enter.prevent="search = searching"
              />
              <div class="icon-container" @click="search = searching">
                <FaIcon icon="magnifying-glass" class="icon" />
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
            <FaIcon icon="filter" class="icon mr-2" />Agregar filtro
          </button>

          <div class="modal fade" id="filtersModal" tabindex="-1" aria-labelledby="filtersModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title mr-2" id="filtersModalLabel">Filtros</h4>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="order-filter">
                    <div class="filter-title">Ordenar por</div>

                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="orderByRadios"
                        id="relevanceRadios"
                        value="relevancia"
                        v-model="filters.orderBy"
                      />
                      <label class="form-check-label" for="relevanceRadios">Relevancia</label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="orderByRadios"
                        id="lastCreatedRadios"
                        value="últimosCreados"
                        v-model="filters.orderBy"
                      />
                      <label class="form-check-label" for="lastCreatedRadios">Últimos creados</label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="orderByRadios"
                        id="firstCreatedRadios"
                        value="primerosCreados"
                        v-model="filters.orderBy"
                      />
                      <label class="form-check-label" for="firstCreatedRadios">Primeros creados</label>
                    </div>
                  </div>

                  <hr />
                  <div class="date-filter">
                    <div class="filter-title">Fecha de creación</div>
                    <input type="date" class="form-control" v-model="filters.date" />
                  </div>

                  <hr />
                  <div class="type-filters">
                    <div class="filter-title">Tipos de fondos</div>
                    <div class="form-group">
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="checkboxAllFunds"
                          v-model="filters.fundsTypes.allFunds"
                        />
                        <label class="form-check-label" for="checkboxAllFunds">Todos los fondos</label>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="checkboxPersonalized"
                          v-model="filters.fundsTypes.types.personalized"
                          :disabled="filters.fundsTypes.allFunds"
                        />
                        <label class="form-check-label" for="checkboxPersonalized">Fondos de amigos</label>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="checkboxFriends"
                          v-model="filters.fundsTypes.types.friends"
                          :disabled="filters.fundsTypes.allFunds"
                        />
                        <label class="form-check-label" for="checkboxFriends">Fondos de amigos</label>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="checkboxCampaign"
                          v-model="filters.fundsTypes.types.campaign"
                          :disabled="filters.fundsTypes.allFunds"
                        />
                        <label class="form-check-label" for="checkboxCampaign">Fondos de campañas</label>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="checkboxDonation"
                          v-model="filters.fundsTypes.types.donation"
                          :disabled="filters.fundsTypes.allFunds"
                        />
                        <label class="form-check-label" for="checkboxDonation">Fondos de donaciones</label>
                      </div>
                    </div>
                  </div>

                  <hr />
                  <div class="more-filters">
                    <div class="filter-title">Más filtros</div>
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" id="checkboxMyFunds" v-model="filters.myFunds" />
                      <label class="form-check-label" for="checkboxMyFunds">Mis fondos</label>
                    </div>
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" id="checkboxAdminFunds" v-model="filters.adminFunds" />
                      <label class="form-check-label" for="checkboxAdminFunds">Fondos administrados</label>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="checkboxContributedFunds"
                        v-model="filters.contributedFunds"
                      />
                      <label class="form-check-label" for="checkboxContributedFunds">Fondos contribuidos</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="applied-filters">
          <span class="order-by"
            ><span class="title">Ordenados por</span>:&nbsp;<span class="description" v-text="orderBy"></span
          ></span>
          <AppPill :msg="filters.date" @close="filters.date = null" v-if="filters.date" />
          <AppPill
            msg="Fondos personalizados"
            type="dark"
            @close="filters.fundsTypes.types.personalized = false"
            v-if="filters.fundsTypes.types.personalized"
          />
          <AppPill
            msg="Fondos de amigos"
            type="success"
            @close="filters.fundsTypes.types.friends = false"
            v-if="filters.fundsTypes.types.friends"
          />
          <AppPill
            msg="Fondos de campañas"
            type="warning"
            @close="filters.fundsTypes.types.campaign = false"
            v-if="filters.fundsTypes.types.campaign"
          />
          <AppPill
            msg="Fondos de donaciones"
            type="danger"
            @close="filters.fundsTypes.types.donation = false"
            v-if="filters.fundsTypes.types.donation"
          />
          <AppPill msg="Mis fondos" type="primary" @close="filters.myFunds = false" v-if="filters.myFunds" />
          <AppPill msg="Fondos administrados" type="secondary" @close="filters.adminFunds = false" v-if="filters.adminFunds" />
          <AppPill
            msg="Fondos contribuidos"
            type="info"
            @close="filters.contributedFunds = false"
            v-if="filters.contributedFunds"
          />
        </div>
      </div>

      <button class="btn btn-outline-link btn-block btn-show my-2" @click="updateFunds" v-if="newFunds > 0">
        Mostrar&nbsp;<AppShowAmount :amount="newFunds" singular="nuevo fondo" plural="nuevos fundos" />
      </button>

      <AppAlert msg="No hay fondos creados aún" v-if="funds.length === 0" />
      <div v-else>
        <AppAlert msg="No se encontraron fondos con esos parámetros" v-if="fundsToShow.length === 0" />
        <div class="fund-card-list" v-else>
          <FundCard
            class="fund-card"
            :fund="fund"
            :savedFunds="savedFunds"
            @updateSavedFunds="getSavedFunds"
            v-for="(fund, index) in fundsToShow"
            :key="index"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';
import { call, event, areTheSameDates, getFundType } from '@/helpers/helpers';
import axios from 'axios';

import FundCard from '@/components/fund/FundCard';

export default {
  name: 'FundsListComponent',
  components: {
    FundCard,
  },
  data() {
    return {
      loading: true,
      progress: 0,
      searching: '',
      search: '',
      filters: {
        orderBy: 'relevancia',
        date: null,
        fundsTypes: {
          allFunds: true,
          types: {
            personalized: true,
            friends: true,
            campaign: true,
            donation: true,
          },
        },
        myFunds: false,
        adminFunds: false,
        contributedFunds: false,
      },
      funds: [],
      fundsToAdd: [],
      newFundSubscription: null,
      savedFunds: [],
    };
  },
  computed: {
    ...mapGetters(['address']),

    orderBy() {
      // first word
      let orderBy = this.filters.orderBy.match(/[a-z\u00C0-\u017F]+/g)[0];

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
    address() {
      this.getSavedFunds();
    },

    'filters.fundsTypes.allFunds'(newValue) {
      if (newValue) {
        this.filters.fundsTypes.types.personalized = true;
        this.filters.fundsTypes.types.friends = true;
        this.filters.fundsTypes.types.campaign = true;
        this.filters.fundsTypes.types.donation = true;
      }
    },
    'filters.fundsTypes.types.personalized'(newValue) {
      if (!newValue) this.filters.fundsTypes.allFunds = false;
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
            return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary', [], {}, async (fund) => {
              const extraSummary = await call({ name: 'Fund', address: fundsAddress[index] }, 'getExtraSummary');
              fund = {
                ...fund,
                ...extraSummary,
              };
              const { data: fundExtraInformation } = await axios.get('fund/' + fund.address);
              if (fundExtraInformation) {
                const { description, image } = fundExtraInformation;
                fund.description = description;
                fund.image = image;
              }
              funds[index] = fund;

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
              return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary', [], {}, async (fund) => {
                const extraSummary = await call({ name: 'Fund', address: fundsAddress[index] }, 'getExtraSummary');
                fund = {
                  ...fund,
                  ...extraSummary,
                };
                const { data: fundExtraInformation } = await axios.get('fund/' + fund.address);
                if (fundExtraInformation) {
                  const { description, image } = fundExtraInformation;
                  fund.description = description;
                  fund.image = image;
                }
                funds[index] = fund;
              });
            }),
        );
      }

      this.fundsToAdd = funds;
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

      // my funds
      if (this.filters.myFunds) fundsToFilter = fundsToFilter.filter((fund) => compareAddresses(fund.creator, this.address));

      // admin funds
      if (this.filters.adminFunds)
        fundsToFilter = fundsToFilter.filter(
          (fund) => fund.managers.findIndex((manager) => compareAddresses(manager, this.address)) >= 0,
        );

      // contributed funds
      if (this.filters.contributedFunds)
        fundsToFilter = fundsToFilter.filter(
          (fund) => fund.contributors.findIndex((contributor) => compareAddresses(contributor, this.address)) >= 0,
        );

      // order
      if (this.filters.orderBy === 'relevancia')
        fundsToFilter = fundsToFilter.sort((a, b) => {
          if (BigNumber(a.totalContributions).isLessThan(BigNumber(b.totalContributions))) return 1;
          if (BigNumber(a.totalContributions).isGreaterThan(BigNumber(b.totalContributions))) return -1;
          return -1;
        });
      if (this.filters.orderBy === 'últimosCreados')
        fundsToFilter = fundsToFilter.sort((a, b) => {
          if (a.createdAt < b.createdAt) return 1;
          if (a.createdAt > b.createdAt) return -1;
          return -1;
        });
      if (this.filters.orderBy === 'primerosCreados')
        fundsToFilter = fundsToFilter.sort((a, b) => {
          if (a.createdAt > b.createdAt) return 1;
          if (a.createdAt < b.createdAt) return -1;
          return -1;
        });

      return fundsToFilter;
    },

    fundType(fund) {
      return getFundType(fund).id;
    },

    getSavedFunds() {
      if (this.address) {
        axios.get('entity/' + this.address).then((res) => {
          if (res.data) this.savedFunds = res.data.savedFunds;
        });
      }
    },
  },
  async created() {
    this.getSavedFunds();

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

<style lang="scss" scoped>
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
  min-height: 1.3rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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

@media (max-width: 460px) {
  .filters {
    flex-direction: column;
    justify-content: center;
    align-items: end;
    gap: 10px;
  }

  .fund-search-form {
    width: 100%;
  }
}

.input-container {
  position: relative;

  .input {
    height: 2.2rem;
    width: 100%;
    min-width: 20rem;
    padding: 1.1rem 3rem 1.1rem 0.5rem;
    border: 0.1px solid rgb(141, 141, 141);
    border-radius: 5px;
  }

  .icon-container {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    color: rgb(53, 53, 53);
    background-color: rgb(194, 194, 194);
    border-top: 0.1px solid rgb(141, 141, 141);
    border-right: 0.1px solid rgb(141, 141, 141);
    border-bottom: 0.1px solid rgb(141, 141, 141);
    border-radius: 0 5px 5px 0;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .icon-container:hover {
    cursor: pointer;
  }
}

*:focus {
  outline: none;
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

.fund-card-list {
  padding: 0.2rem 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-items: stretch;

  .fund-card {
    width: 50%;

    @media (max-width: 680px) {
      width: 100%;
      padding: 0.5rem 0;
    }
  }
}
</style>
