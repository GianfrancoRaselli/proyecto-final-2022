<template>
  <div class="modal fade" id="buyFundTokensModal" tabindex="-1" aria-labelledby="buyFundTokensModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title mr-2" id="buyFundTokensModalLabel">FundToken</h4>
          <span class="add-token" @click="addFundTokenToMetaMask" v-if="hasMetamask">Add FundToken to MetaMask</span>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="mb-2" v-if="address">
            <small>
              <span class="h6 font-weight-bolder">My balance: </span><span v-text="fundTokensBalance"></span
              ><span v-if="fundTokensBalance > 1"> FundTokens</span><span v-else> FundToken</span></small
            >
          </div>

          <div class="my-2">
            <small>
              <span class="h6 font-weight-bolder">FundToken price: </span><span v-text="fundTokenPriceInEth"></span
              ><span> ETH</span><span> ≈ </span><span v-text="fundTokenPriceInUSD"></span><span> USD</span></small
            >
          </div>

          <form @submit.prevent="handleSubmit" class="mt-3">
            <div class="form-group">
              <label for="tokensInput">Enter the amount of tokens to buy</label>
              <input
                type="number"
                class="form-control"
                :class="{ 'form-control-error': v$.fundTokens.$errors.length }"
                id="tokensInput"
                aria-describedby="tokensHelp"
                autofocus
                v-model="fundTokens"
                :disabled="loading"
              />
              <small id="tokensHelp" class="form-text text-muted">Enter a non-negative integer.</small>
              <AppInputErrors :errors="v$.fundTokens.$errors" />
            </div>

            <div class="mb-2" v-if="fundTokens > 0">
              <small id="tokensHelp" class="form-text"
                ><span class="h6">Total price: </span><span v-text="fundTokens * fundTokenPriceInEth"></span><span> ETH</span
                ><span> ≈ </span><span v-text="fundTokensPriceInUSD"></span><span> USD</span></small
              >
            </div>

            <button type="submit" class="btn btn-primary" v-if="!loading">Buy</button>
            <button class="btn btn-primary" type="button" disabled v-if="loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Loading...
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import $ from 'jquery';
import Web3 from 'web3';
import { useVuelidate } from '@vuelidate/core';
import { required, integer, minValue } from '@vuelidate/validators';
import { getMessages } from '@/dictionary';
import { mapState, mapGetters } from 'vuex';
import { addNotification } from '@/composables/useNotifications';
import { hasMetamask } from '@/helpers/connection';
import { call, transaction, event, validateForm, addTokenToMetaMask, ethPriceInUSD } from '@/helpers/helpers';

export default {
  name: 'BuyFundTokensModalComponent',
  setup() {
    return { v$: useVuelidate() };
  },
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

    ...mapState({
      address: (state) => state.connection.address,
      fundTokensBalance: (state) => state.connection.fundTokensBalance,
    }),
    ...mapGetters(['isConnected']),

    hasMetamask,

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
  validations() {
    return {
      fundTokens: {
        required,
        integer,
        minValue: minValue(1),
      },
    };
  },
  methods: {
    async handleSubmit() {
      if (await validateForm(this.v$)) {
        try {
          this.loading = true;
          await transaction(
            'FundFactory',
            'buyFundTokens',
            [this.fundTokens],
            {
              value: this.fundTokens * this.fundTokenPriceInWeis,
            },
            true,
            'Buy ' + this.fundTokens + (this.fundTokens === 1 ? ' FundToken' : ' FundTokens'),
          );
          addNotification({
            message: 'You have bought ' + this.fundTokens + (this.fundTokens === 1 ? ' FundToken' : ' FundTokens'),
            type: 'success',
          });
          this.fundTokens = 1;
          //$('#buyFundTokensModal').modal('hide');
        } finally {
          this.loading = false;
        }
      }
    },

    addFundTokenToMetaMask() {
      addTokenToMetaMask();
    },
  },
  async created() {
    call('FundFactory', 'fundTokenPrice').then(async (res) => {
      this.fundTokenPriceInWeis = res;
      this.newFundTokenPriceSubscription = await event('FundFactory', 'NewFundTokenPrice', undefined, (err, event) => {
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

<style scoped>
.modal-header {
  display: flex;
  align-items: baseline;
}

.add-token {
  font-size: small;
  cursor: pointer;
  color: #0645ad;
}

.add-token:hover {
  text-decoration: underline;
  color: #3366bb;
}
</style>
