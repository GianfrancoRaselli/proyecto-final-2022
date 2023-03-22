<template>
  <div>
    <p class="page-title">Explora todos los fondos creados</p>
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

<style scoped></style>
