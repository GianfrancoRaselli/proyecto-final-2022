<template>
  <span
    :class="{ hover: goToProfile || goToFund }"
    v-text="addressToShow"
    data-toggle="tooltip"
    :data-placement="placement"
    title=""
    :data-original-title="show && !complete ? address : ''"
    @click="goTo"
  ></span>
</template>

<script>
import $ from 'jquery';
import { goToProfile, goToFund } from '@/helpers/helpers';
import { getSplitAddress } from 'web3-simple-helpers/methods/general';

export default {
  name: 'AppShowAddressComponent',
  props: {
    address: { type: String, required: true },
    complete: { type: Boolean, default: false },
    show: { type: Boolean, default: true },
    placement: { type: String, default: 'right' },
    goToProfile: { type: Boolean, default: false },
    goToFund: { type: Boolean, default: false },
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
  methods: {
    goTo() {
      if (this.goToProfile) goToProfile(this.address);
      if (this.goToFund) goToFund(this.addres);
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
