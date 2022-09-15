<template>
  <div>
    <AppSpinner v-if="loading" />
    <div v-if="!loading">
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
import FundCard from '@/components/fund/FundCard';

export default {
  name: 'FundsListComponent',
  components: {
    FundCard,
  },
  props: {
    loading: { type: Boolean, default: false },
    funds: { type: Array, require: true },
  },
  data() {
    return {
      search: 'fondo de futbol',
    };
  },
  computed: {
    fundsToShow() {
      let fundsToShow = this.funds.slice();

      if (this.search !== '') {
        fundsToShow = fundsToShow.filter((fund) => {
          const search = this.search
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
          return (
            fund._creator.toLowerCase() === search ||
            fund._name
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .includes(search)
          );
        });
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
    redirect(fundAddress) {
      this.$router.push({ name: 'Fund', params: { fundAddress } });
    },
  },
};
</script>

<style scoped>
.fund-card {
  padding: 10px;
}

.fund-card:hover {
  padding: 5px;
  box-shadow: 0 0 5px black;
  cursor: pointer;
}
</style>
