<template>
  <div>
    <FundsList fundsType="myFunds" />
  </div>
</template>

<script>
import FundsList from '@/components/fund/FundsList';

export default {
  name: 'MyFundsView',
  components: {
    FundsList,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  created() {},
  unmounted() {},
};
</script>

<style scoped></style>
