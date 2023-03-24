<template>
  <span
    :class="{ hover: goToProfile || goToFund }"
    v-text="forceShowAddress || name === '' ? addressToShow : name"
    data-toggle="tooltip"
    :data-placement="placement"
    title=""
    :data-original-title="showTooltip && !showAddressComplete ? address : ''"
    @click="goTo"
  ></span>
</template>

<script>
import $ from 'jquery';
import { goToProfile, goToFund } from '@/helpers/helpers';
import { getSplitAddress } from 'web3-simple-helpers/methods/general';
import { call } from '@/helpers/helpers';
import axios from 'axios';

export default {
  name: 'AppShowAddressComponent',
  props: {
    address: { type: String, required: true },
    forceShowAddress: { type: Boolean, default: false },
    showAddressComplete: { type: Boolean, default: false },
    showTooltip: { type: Boolean, default: true },
    placement: { type: String, default: 'right' },
    goToProfile: { type: Boolean, default: false },
    goToFund: { type: Boolean, default: false },
    type: { type: String, default: 'entity' },
  },
  data() {
    return {
      name: '',
    };
  },
  computed: {
    addressToShow() {
      if (this.showAddressComplete) return this.address;
      return getSplitAddress(this.address);
    },
  },
  methods: {
    goTo() {
      if (this.goToProfile) goToProfile(this.address);
      if (this.goToFund) goToFund(this.addres);
    },

    async getName() {
      if (this.type === 'entity') {
        axios.get('entity/' + this.address).then((res) => {
          if (res.data) this.name = res.data.fullname;
        });
      } else if (this.type === 'fund') {
        call({ name: 'Fund', address: this.address }, 'getSummary', [], {}, (fund) => {
          this.name = fund.name;
        });
      }
    },
  },
  created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });

    if (!this.forceShowAddress) this.getName();
  },
};
</script>

<style scoped></style>
