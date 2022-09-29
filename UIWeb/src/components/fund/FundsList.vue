<template>
  <div>
    <div v-if="loading">
      <AppSpinner class="mb-2" />
      <AppProgress :progress="progress" />
    </div>
    <div v-else>
      <div class="searches mb-2" v-if="allFunds.length > 0">
        <div class="date">
          <DatePicker :value="date" lang="en" @selected="updateDate" class="datepicker mr-2"> </DatePicker>
          <fa-icon icon="xmark" class="icon xmark" size="2x" v-if="date" @click="date = null"></fa-icon>
        </div>
        <form class="form-inline">
          <input
            class="form-control form-control-lg mr-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            v-model="search"
          />
        </form>
      </div>
      <AppAlert msg="No funds" v-if="fundsToShow.length === 0" />
      <div class="row" v-else>
        <div
          class="col-12 col-md-6 col-lg-4 fund-card"
          v-for="(fund, index) in fundsToShow"
          :key="index"
          @click="redirect(fund._address)"
        >
          <FundCard :fund="fund" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vuejs3-datepicker';
import FundCard from '@/components/fund/FundCard';
import { mapState } from 'vuex';
import { call, event, fromUnixTimestampToDate, isTheSameDate } from '@/helpers/helpers';
import AppSpinner from '../global/AppSpinner.vue';

export default {
  name: 'FundsListComponent',
  components: {
    DatePicker,
    FundCard,
    AppSpinner,
  },
  props: {
    fundsType: { type: String, default: 'allFunds' },
  },
  data() {
    return {
      loading: true,
      progress: 0,
      search: '',
      date: null,
      allFunds: [],
      newFundSubscription: null,
    };
  },
  computed: {
    ...mapState({ address: (state) => state.connection.address }),

    fundsToShow() {
      let fundsToShow = this.allFunds.slice();

      if (this.fundsType === 'myFunds')
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
      this.allFunds = Array(totalFunds);

      let callsResolved = 0;
      await Promise.all(
        Array(totalFunds)
          .fill()
          .map((element, index) => {
            return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary').then((res) => {
              this.allFunds[index] = res;

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

      if (this.allFunds.findIndex((fund) => fund._address === _address) < 0) {
        this.allFunds.push({ _address, _name, _description, _creator, _createdAt });
      }
    });
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

.fund-card {
  padding: 10px;
}

.fund-card:hover {
  padding: 5px;
  box-shadow: 0 0 5px black;
  cursor: pointer;
}
</style>
