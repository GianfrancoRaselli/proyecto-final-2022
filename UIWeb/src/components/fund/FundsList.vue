<template>
  <div>
    <AppSpinner v-if="loading" />
    <div v-if="!loading">
      <div class="searches mb-2" v-if="funds.length > 0">
        <div class="date">
          <DatePicker :value="date" lang="en" @selected="updateData" class="datepicker mr-2"> </DatePicker>
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
import { fromUnixTimestampToDate, isTheSameDate } from '@/helpers/helpers';

export default {
  name: 'FundsListComponent',
  components: {
    DatePicker,
    FundCard,
  },
  props: {
    loading: { type: Boolean, default: false },
    funds: { type: Array, require: true },
  },
  data() {
    return {
      search: '',
      date: null,
    };
  },
  computed: {
    fundsToShow() {
      let fundsToShow = this.funds.slice();

      if (this.date) {
        fundsToShow = fundsToShow.filter((fund) => isTheSameDate(this.date, fromUnixTimestampToDate(fund._createdAt)));
      }

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
        if (a._createdAt < b._createdAt) {
          return 1;
        }
        if (a._createdAt > b._createdAt) {
          return -1;
        }
        return 0;
      });
    },
  },
  watch: {},
  methods: {
    updateData(date) {
      this.date = date;
    },

    redirect(fundAddress) {
      this.$router.push({ name: 'Fund', params: { fundAddress } });
    },
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
