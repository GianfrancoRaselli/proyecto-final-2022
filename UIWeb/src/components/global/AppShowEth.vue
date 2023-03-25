<template>
  <span data-toggle="tooltip" data-placement="right" title="" :data-original-title="'≈ ' + amountInUSD + ' USD'">
    <AppShowAmount :amount="weis" singular="Wei" plural="Weis" v-if="showWeis" />
    <AppShowAmount :amount="amountInEth" singular="ETH" v-else />
  </span>
</template>

<script>
import $ from 'jquery';
import Web3 from 'web3';
import { convertNumberToMaxDecimals, ethPriceInUSD } from '@/helpers/helpers';

export default {
  name: 'AppShowEthComponent',
  props: {
    weis: { type: Number, required: true },
  },
  data() {
    return {
      maxEthDecimals: 6,
      ethPriceInUSD: 0,
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

    amountInUSD() {
      return convertNumberToMaxDecimals(this.amountInEth * this.ethPriceInUSD, 2);
    },
  },
  async created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });

    this.ethPriceInUSD = await ethPriceInUSD();
  },
};
</script>

<style scoped></style>
