<template>
  <div class="card text-center h-100">
    <div class="card-header" v-text="fund._name" />
    <div class="card-body">
      <p class="card-text" v-text="fund._description" />
      <p class="card-text"><span class="text-bold">Creator</span>: {{ splitAddress }}</p>
    </div>
    <div class="card-footer text-muted"><AppDate :date="createdAt" /></div>
  </div>
</template>

<script>
import { getSplitAddress, fromUnixTimestampToDate } from '@/helpers/helpers';

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

<style scoped></style>
