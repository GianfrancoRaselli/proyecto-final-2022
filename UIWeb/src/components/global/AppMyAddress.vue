<template>
  <span class="my-address-container" v-if="compareAddresses(addressToCompare, address)">
    <span class="badge badge-pill badge-primary">Mi dirección</span>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';
import { compareAddresses } from 'web3-simple-helpers/methods/general';

export default {
  name: 'AppMyAddressComponent',
  props: {
    addressToCompare: { type: String, required: true },
  },
  computed: {
    ...mapGetters(['address']),
  },
  methods: {
    compareAddresses,
  },
};
</script>

<style scoped>
.my-address-container {
  padding-left: 0.25rem;
}
</style>
