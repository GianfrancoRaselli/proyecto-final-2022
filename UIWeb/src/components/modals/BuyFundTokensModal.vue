<template>
  <div class="modal fade" id="buyFundTokensModal" tabindex="-1" aria-labelledby="buyFundTokensModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="buyFundTokensModalLabel" v-text="buyFundTokensMsg" />
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="text-center" v-if="loading">
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          <form @submit.prevent="handleSumbit" v-if="!loading">
            <div class="form-group">
              <small>
                <span class="h6 font-weight-bolder">FundToken price: </span><span v-text="fundTokenPriceInEth"></span
                ><span> ETH</span><span> ≈ </span><span v-text="fundTokenPriceInUSD"></span><span> USD</span></small
              >
            </div>
            <div class="form-group">
              <label for="tokensInput">Enter the amount of tokens to buy</label>
              <input
                type="number"
                class="form-control"
                id="tokensInput"
                aria-describedby="tokensHelp"
                min="1"
                required
                autofocus
                v-model="fundTokens"
              />
              <small id="tokensHelp" class="form-text text-muted">Enter a non-negative integer.</small>
              <small id="tokensHelp" class="form-text"
                ><span class="h6">Total price: </span><span v-text="fundTokens * fundTokenPriceInEth"></span><span> ETH</span
                ><span> ≈ </span><span v-text="fundTokensPriceInUSD"></span><span> USD</span></small
              >
            </div>
            <button type="submit" class="btn btn-primary">Buy</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import Web3 from 'web3';
import { getMessages } from '@/dictionary';
import { addNotification } from '@/composables/useNotifications';
import { call, transaction, event, ethPriceInUSD } from '@/helpers/helpers';

export default {
  name: 'BuyFundTokensModalComponent',
  data() {
    return {
      loading: false,
      fundTokenPriceInWeis: 0,
      ethPriceInUSD: 0,
      fundTokens: 1,
      newFundTokenPriceSubscription: null,
      ethPriceInUSDSubscription: null,
    };
  },
  computed: {
    ...getMessages(['buyFundTokens']),

    fundTokenPriceInEth() {
      return parseFloat(Web3.utils.fromWei(this.fundTokenPriceInWeis.toString(), 'ether'));
    },

    fundTokenPriceInUSD() {
      if ((this.fundTokenPriceInEth * this.ethPriceInUSD).toFixed(2).split('.')[1] === '00') {
        return (this.fundTokenPriceInEth * this.ethPriceInUSD).toFixed(0);
      } else {
        return (this.fundTokenPriceInEth * this.ethPriceInUSD).toFixed(2);
      }
    },

    fundTokensPriceInUSD() {
      if ((this.fundTokens * this.fundTokenPriceInEth * this.ethPriceInUSD).toFixed(2).split('.')[1] === '00') {
        return (this.fundTokens * this.fundTokenPriceInEth * this.ethPriceInUSD).toFixed(0);
      } else {
        return (this.fundTokens * this.fundTokenPriceInEth * this.ethPriceInUSD).toFixed(2);
      }
    },
  },
  methods: {
    async handleSumbit() {
      if (Number.isInteger(this.fundTokens)) {
        try {
          this.loading = true;
          await transaction('fundFactory', 'buyFundTokens', [this.fundTokens], {
            value: this.fundTokens * this.fundTokenPriceInWeis,
          });
          addNotification({
            message: 'You have bought ' + this.fundTokens + (this.fundTokens === 1 ? ' FundToken' : ' FundTokens'),
            type: 'success',
          });
          $('#buyFundTokensModal').modal('hide');
        } finally {
          this.loading = false;
        }
      } else {
        addNotification({
          message: 'Enter a non-negative integer',
          type: 'error',
        });
      }
    },
  },
  async created() {
    call('fundFactory', 'fundTokenPrice').then((res) => {
      this.fundTokenPriceInWeis = res;
      this.newFundTokenPriceSubscription = event('fundFactory', 'NewFundTokenPrice', undefined, (err, event) => {
        this.fundTokenPriceInWeis = event.returnValues.fundTokenPrice;
      });
    });
    this.ethPriceInUSD = await ethPriceInUSD();
    this.ethPriceInUSDSubscription = setInterval(async () => {
      this.ethPriceInUSD = await ethPriceInUSD();
    }, 30000);
  },
  unmounted() {
    if (this.newFundTokenPriceSubscription) this.newFundTokenPriceSubscription.unsubscribe();
    if (this.ethPriceInUSDSubscription) clearInterval(this.ethPriceInUSDSubscription);
  },
};
</script>

<style scoped></style>
