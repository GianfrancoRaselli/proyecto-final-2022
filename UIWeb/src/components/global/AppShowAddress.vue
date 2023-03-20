<template>
  <span
    v-text="addressToShow"
    data-toggle="tooltip"
    :data-placement="placement"
    title=""
    :data-original-title="show && !complete ? address : ''"
  ></span>
</template>

<script>
import $ from 'jquery';
import { getSplitAddress } from 'web3-simple-helpers/methods/general';

export default {
  name: 'AppShowAddressComponent',
  props: {
    address: { type: String, required: true },
    complete: { type: Boolean, default: false },
    show: { type: Boolean, default: true },
    placement: { type: String, default: 'right' },
  },
  data() {
    return {};
  },
  computed: {
    addressToShow() {
      if (this.complete) return this.address;
      return getSplitAddress(this.address);
    },
  },
  created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  },
};
</script>

<style scoped></style>
