<template>
  <div class="card text-center">
    <div class="card-header" v-text="fund._name" />
    <div class="card-body">
      <p class="card-text" v-text="fund._description" />
      <p class="card-text"><span class="text-bold">Creator</span>: {{ splitAddress }}</p>
    </div>
    <div class="card-footer text-muted"><AppDate :date="createdAt" /></div>
  </div>
</template>

<script>
import { getSplitAddress, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

export default {
  name: 'FundCardComponent',
  props: {
    fund: { type: Object, require: true },
  },
  data() {
    return {};
  },
  computed: {
    splitAddress() {
      return getSplitAddress(this.fund._creator);
    },

    createdAt() {
      return fromUnixTimestampToDate(this.fund._createdAt);
    },
  },
  watch: {},
  methods: {},
};
</script>

<style scoped>
.card {
  height: 98%;
}

.card:hover {
  height: 100%;
  cursor: pointer;
  box-shadow: 0 0 4px rgb(65, 64, 64);
}
</style>
