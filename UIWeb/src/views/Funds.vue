<template>
  <div class="funds-container">
    <p class="page-title">Explora todos los fondos</p>
    <FundsList />
  </div>
</template>

<script>
import FundsList from '@/components/fund/FundsList';

export default {
  name: 'FundsView',
  components: {
    FundsList,
  },
  data() {
    return {};
  },
  methods: {},
  created() {},
  unmounted() {},
};
</script>

<style scoped>
.funds-container {
  max-width: 1300px;
}
</style>
