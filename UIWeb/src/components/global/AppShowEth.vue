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
    weis: { type: Number, required: true },
  },
  data() {
    return {
      maxEthDecimals: 6,
    };
  },
  computed: {
    weisInFullString() {
      return this.weis.toLocaleString('fullwide', { useGrouping: false });
    },

    showWeis() {
      return this.weisInFullString.length <= 19 - this.maxEthDecimals;
    },

    amountInEth() {
      return convertNumberToMaxDecimals(Number(Web3.utils.fromWei(this.weisInFullString, 'ether')), this.maxEthDecimals);
    },
  },
};
</script>

<style scoped></style>
