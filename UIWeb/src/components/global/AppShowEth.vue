<template>
  <AppShowAmount :amount="weis" singular="Wei" plural="Weis" v-if="showWeis" />
  <AppShowAmount :amount="amountInEth" singular="ETH" v-else />
</template>

<script>
import Web3 from 'web3';
import { convertNumberToMaxDecimals } from '@/helpers/helpers';

export default {
  name: 'AppShowEthComponent',
  props: {
    weis: { type: String, required: true },
  },
  data() {
    return {
      maxEthDecimals: 6,
    };
  },
  computed: {
    showWeis() {
      return this.weis.lenght <= 19 - this.maxEthDecimals;
    },
    amountInEth() {
      return convertNumberToMaxDecimals(Number(Web3.utils.fromWei(this.weis, 'ether')), this.maxEthDecimals);
    },
  },
};
</script>

<style scoped></style>
