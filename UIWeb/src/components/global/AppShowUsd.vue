<template>
  <p class="usd-amount">≈&nbsp;<AppShowAmount :amount="amountInUSD" singular="USD" /></p>
</template>

<script>
import { convertNumberToMaxDecimals, ethPriceInUSD } from '@/helpers/helpers';

export default {
  name: 'AppShowUsdComponent',
  props: {
    eth: { type: String, required: true },
  },
  data() {
    return {
      ethPriceInUSD: 0,
    };
  },
  computed: {
    amountInUSD() {
      return convertNumberToMaxDecimals(this.eth * this.ethPriceInUSD, 3);
    },
  },
  async created() {
    this.ethPriceInUSD = await ethPriceInUSD();
  },
};
</script>

<style scoped>
.usd-amount {
  font-size: 0.9rem;
  color: grey;
}
</style>
