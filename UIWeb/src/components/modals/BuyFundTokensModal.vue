<template>
  <div class="modal fade" id="buyFundTokensModal" tabindex="-1" aria-labelledby="buyFundTokensModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="header-info">
            <h4 class="modal-title" id="buyFundTokensModalLabel">FundToken</h4>
            <span class="add-token" @click="addFundTokenToMetaMask" v-if="hasMetamask">Agregar FundToken a MetaMask</span>
          </div>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="mb-2" v-if="address">
            <small>
              <span class="h6 font-weight-bolder"> Mi balance:&nbsp;</span>
              <span><AppShowAmount :amount="fundTokensBalance" singular="FundToken" plural="FundTokens" /></span>
            </small>
          </div>

          <div class="my-2">
            <small>
              <span class="h6 font-weight-bolder">Precio FundToken:&nbsp;</span>
              <span>
                <AppShowEth :weis="fundTokenPriceInWeis" />
                &nbsp;≈&nbsp;
                <AppShowAmount :amount="fundTokenPriceInUSD" singular="USD" />
              </span>
            </small>
          </div>

          <hr />

          <form @submit.prevent="handleSubmit" class="mt-3">
            <div class="form-group">
              <label for="tokensInput">Cantidad de tokens a comprar</label>
              <input
                type="string"
                class="form-control"
                :class="{ 'is-invalid': v$.fundTokens.$errors.length }"
                id="tokensInput"
                aria-describedby="tokensHelp"
                autofocus
                v-model="fundTokens"
                :disabled="loading"
              />
              <AppInputErrors :errors="v$.fundTokens.$errors" />
            </div>

            <div class="mb-2" v-if="fundTokens > 0">
              <small id="tokensHelp" class="form-text">
                <span class="h6">Precio total: </span>
                <span>
                  <AppShowEth :weis="fundTokens * fundTokenPriceInWeis" />
                  &nbsp;≈&nbsp;
                  <AppShowAmount :amount="fundTokensPriceInUSD" singular="USD" />
                </span>
              </small>
            </div>

            <button type="submit" class="btn btn-primary" v-if="!loading">Comprar</button>
            <button class="btn btn-primary" type="button" disabled v-if="loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Comprando...
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
import { helpers, required, integer, minValue, maxValue } from '@vuelidate/validators';
import { getMessages } from '@/dictionary';
import { mapState, mapGetters } from 'vuex';
import { addNotification } from '@/composables/useNotifications';
import { hasMetamask } from '@/helpers/connection';
import {
  call,
  transaction,
  event,
  validateForm,
  addTokenToMetaMask,
  ethPriceInUSD,
  removeInitialAndFinalZeros,
  convertNumberToMaxDecimals,
} from '@/helpers/helpers';

export default {
  name: 'BuyFundTokensModalComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      loading: false,
      fundTokenPriceInWeis: '0',
      ethPriceInUSD: 0,
      fundTokens: '1',
      newFundTokenPriceSubscription: null,
      ethPriceInUSDSubscription: null,
    };
  },
  computed: {
    ...getMessages(['buyFundTokens']),

    ...mapState({
      fundTokensBalance: (state) => state.connection.fundTokensBalance,
    }),
    ...mapGetters(['isConnected', 'address']),

    hasMetamask,

    fundTokenPriceInETH() {
      return parseFloat(Web3.utils.fromWei(this.fundTokenPriceInWeis, 'ether'));
    },
    fundTokenPriceInUSD() {
      return convertNumberToMaxDecimals(this.fundTokenPriceInETH * this.ethPriceInUSD, 3);
    },
    fundTokensPriceInUSD() {
      return convertNumberToMaxDecimals(this.fundTokens * this.fundTokenPriceInETH * this.ethPriceInUSD, 3);
    },
  },
  watch: {
    fundTokens(newValue) {
      if (newValue) {
        this.fundTokens = newValue.replace(',', '.');
      }
    },
  },
  validations() {
    return {
      fundTokens: {
        required: helpers.withMessage('Debe ingresar un valor', required),
        integer: helpers.withMessage('Debe ingresar un número entero', integer),
        minValue: helpers.withMessage('El valor debe ser mayor a 0', minValue(1)),
        maxValue: helpers.withMessage('Puede comprar hasta 100 FundTokens', maxValue(100)),
      },
    };
  },
  methods: {
    addFundTokenToMetaMask() {
      addTokenToMetaMask();
    },

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
            removeInitialAndFinalZeros(this.fundTokens) +
              (removeInitialAndFinalZeros(this.fundTokens) === '1' ? ' FundToken comprado' : ' FundTokens comprados'),
          );
          addNotification({
            message:
              'Has comprado ' +
              removeInitialAndFinalZeros(this.fundTokens) +
              (removeInitialAndFinalZeros(this.fundTokens) === '1' ? ' FundToken' : ' FundTokens'),
            type: 'success',
          });
          this.fundTokens = '1';
          //$('#buyFundTokensModal').modal('hide');
        } finally {
          this.loading = false;
        }
      }
    },
  },
  async created() {
    call('FundFactory', 'fundTokenPrice', [], {}, async (res) => {
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

<style lang="scss" scoped>
.header-info {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.6rem;
}

.add-token {
  font-size: 0.9rem;
  cursor: pointer;
  color: #0645ad;
}

.add-token:hover {
  text-decoration: underline;
  color: #3366bb;
}
</style>
