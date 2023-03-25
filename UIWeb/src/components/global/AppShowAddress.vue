<template>
  <span class="address-container">
    <span
      :class="{ hover: goToProfile || goToFund }"
      v-text="forceShowAddress || name === '' ? addressToShow : name"
      data-toggle="tooltip"
      :data-placement="placement"
      title=""
      :data-original-title="showTooltip && !showAddressComplete ? address : ''"
      @click="goTo"
    ></span>
    <fa-icon
      icon="copy"
      class="icon"
      data-toggle="tooltip"
      data-placement="right"
      title=""
      data-original-title="Copiar dirección"
      @click="copyAddress(address)"
      v-if="allowCopyAddress"
    />
  </span>
</template>

<script>
import $ from 'jquery';
import { goToProfile, goToFund } from '@/helpers/helpers';
import { getSplitAddress } from 'web3-simple-helpers/methods/general';
import { call, copyAddress } from '@/helpers/helpers';
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
    allowCopyAddress: { type: Boolean, default: true },
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
  watch: {
    address() {
      this.getName();
    },
  },
  methods: {
    copyAddress,

    goTo() {
      if (this.goToProfile) goToProfile(this.address);
      if (this.goToFund) goToFund(this.addres);
    },

    async getName() {
      this.name = '';
      if (!this.forceShowAddress) {
        if (this.type === 'entity') {
          axios.get('entity/' + this.address).then((res) => {
            if (res.data) this.name = res.data.fullname;
          });
        } else if (this.type === 'fund') {
          call({ name: 'Fund', address: this.address }, 'getSummary', [], {}, (fund) => {
            this.name = fund.name;
          });
        }
      }
    },
  },
  created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });

    this.getName();
  },
};
</script>

<style lang="scss" scoped>
.address-container {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 0.5rem;

  .icon {
    cursor: pointer;
    font-size: 0.8rem;
    margin-right: 0.4rem;
  }
}
</style>
