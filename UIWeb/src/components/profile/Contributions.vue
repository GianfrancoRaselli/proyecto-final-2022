<template>
  <div class="container">
    <AppSpinner class="spinner" size="medium" v-if="loading" />
    <div class="items" v-else>
      <div class="no-items" v-if="contributionsOrdered && contributionsOrdered.length === 0">
        <fa-icon icon="xmark" class="icon" size="5x" />
        <span>La entidad no ha realizado ninguna contribución aún.</span>
      </div>
      <div v-else>
        <div class="item" v-for="(contribution, index) in contributionsOrdered" :key="index">
          <div class="header">
            <AppDate class="date" :date="fromUnixTimestampToDate(contribution.timestamp)" />
          </div>
          <span>
            <AppShowAddress
              class="address"
              :address="contribution.contributor"
              :goToProfile="true"
            />
            <span>&nbsp;contribuyó&nbsp;</span>
            <AppShowEth :weis="contribution.value" />
            <span>&nbsp;al fondo:&nbsp;</span>
            <span class="hover" v-text="contribution.fundName" @click="goToFund(contribution.fundAddress)"></span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { event, goToFund } from '@/helpers/helpers';
import { fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ProfileContributionsComponent',
  components: {},
  props: {
    funds: { type: Array, required: true },
  },
  data() {
    return {
      loading: true,
      contributions: [],
    };
  },
  computed: {
    contributionsOrdered() {
      return this.contributions.slice().sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });
    },
  },
  watch: {
    funds() {
      this.getContributions();
    },
  },
  methods: {
    fromUnixTimestampToDate,
    goToFund,

    async getContributions() {
      try {
        if (this.funds.length > 0) {
          await Promise.all(
            Array(this.funds.length)
              .fill()
              .map((element, index) => {
                return event(
                  { name: 'Fund', address: this.funds[index].address },
                  'Contribute',
                  { filter: { contributor: this.$route.params.address } },
                  async (events) => {
                    events.forEach(async (event) => {
                      const block = await this.$store.state.connection.infuraWeb3.eth.getBlock(event.blockNumber);
                      this.contributions.push({
                        fundAddress: this.funds[index].address,
                        fundName: this.funds[index].name,
                        contributor: event.returnValues.contributor,
                        value: event.returnValues.value,
                        timestamp: block.timestamp,
                      });
                    });
                  },
                  true,
                );
              }),
          );
        }
      } finally {
        this.loading = false;
      }
    },
  },
  created() {},
  mounted() {},
  unmounted() {},
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .spinner {
    margin-top: 2rem;
  }

  .items {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .no-items {
      font-size: 1.2rem;
      text-align: center;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      gap: 0.8rem;
    }

    .item {
      padding: 0.65rem 0.55rem;
      border: 1px solid rgb(238, 238, 238);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: start;
      gap: 0.3rem;

      .header {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 0.4rem;

        .badge {
          margin-left: auto;
        }
      }

      .address {
        font-weight: bold;
      }
    }
  }
}
</style>
