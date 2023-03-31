<template>
  <div>
    <p class="page-title">FundFactory</p>
    <div class="items-container">
      <div class="item-container item-container-owner">
        <div class="item">
          <span class="value">
            <span class="amount"><AppShowAddress type="entity" :address="deployer" :goToProfile="true" /></span>
            <span class="unit">Propietario del FundFactory</span>
          </span>
          <span class="description"
            >La entidad dueña del FundFactory puede retirar el dinero ganado y modificar el precio de los FundTokens.</span
          >
        </div>
      </div>
      <div class="item-container">
        <div class="item">
          <span class="value">
            <span class="amount" v-text="deployedFundsAmount"></span>
            <span class="unit">Fondos desplegados</span>
          </span>
          <span class="description">Cantidad de fondos desplegados y almacenados en el FundFactory.</span>
        </div>
      </div>
      <div class="item-container">
        <div class="item">
          <span class="value">
            <span class="amount"><AppShowEth :weis="earnedMoney" /></span>
            <span class="unit">Dinero recaudado</span>
          </span>
          <span class="description">Total del dinero recaudado con la venta de FundTokens.</span>
        </div>
      </div>
      <div class="item-container">
        <div class="item">
          <span class="value">
            <span class="amount"><AppShowEth :weis="withdrawnMoney" /></span>
            <span class="unit">Dinero retirado</span>
          </span>
          <span class="description">Dinero ganado y ya retirado del FundFactory.</span>
        </div>
      </div>
      <div class="item-container">
        <div class="item">
          <span class="value">
            <span class="amount"><AppShowEth :weis="actualBalance" /></span>
            <span class="unit">Dinero disponible</span>
          </span>
          <span class="description">Dinero actual disponible en el FundFactory aún sin retirar.</span>
          <button
            type="button"
            class="btn btn-success btn-block mt-1"
            @click="withdrawMoney"
            :disabled="!BigNumber(actualBalance).isGreaterThan(0)"
            v-if="!withdrawMoneyLoading"
          >
            Retirar dinero a mi cuenta
          </button>
          <button class="btn btn-success btn-block mt-1" type="button" disabled v-else>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Retirando dinero...
          </button>
        </div>
      </div>
      <div class="item-container item-container-fund-token-price">
        <div class="item">
          <span class="value">
            <span class="amount-container" v-if="!editingFundTokenPrice">
              <span class="amount">
                <AppShowEth :weis="fundTokenPriceInWeis" />
              </span>
              <FaIcon icon="pencil" class="icon" @click="editingFundTokenPrice = true" />
            </span>
            <div v-else>
              <div class="new-fund-token-price-form-row">
                <div class="new-fund-token-price-form-group">
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': v$.newFundTokenPrice.$errors.length }"
                    id="newFundTokenPriceInput"
                    aria-describedby="newFundTokenPriceHelp"
                    v-model="newFundTokenPrice"
                    :disabled="newFundTokenPriceLoading"
                  />
                  <AppInputErrors :errors="v$.newFundTokenPrice.$errors" />
                </div>
                <select
                  id="newFundTokenPriceUnitInput"
                  class="form-control"
                  v-model="newFundTokenPriceUnit"
                  :disabled="newFundTokenPriceLoading"
                >
                  <option v-for="(unit, i) in units" :key="i" v-text="unit" :value="unit"></option>
                </select>
                <FaIcon
                  icon="check"
                  class="icon command"
                  @click="handleNewFundTokenPriceSubmit"
                  v-if="v$.newFundTokenPrice.$errors.length === 0 && !newFundTokenPriceLoading"
                />
                <AppSpinner class="command" size="small" v-if="newFundTokenPriceLoading" />
              </div>
              <AppShowUsd
                :eth="
                  newFundTokenPriceUnit === 'Ether'
                    ? newFundTokenPrice.trim()
                    : Web3.utils.fromWei(newFundTokenPrice.trim(), 'ether')
                "
              />
            </div>
            <span class="unit">Precio FundToken</span>
          </span>
          <span class="description">Precio de venta de un FundToken.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3';
import { mapGetters } from 'vuex';
import { call, transaction, validateForm } from '@/helpers/helpers';
import { addNotification } from '@/composables/useNotifications';
import BigNumber from 'bignumber.js';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, numeric } from '@vuelidate/validators';

export default {
  name: 'FundFactoryView',
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      Web3,
      deployer: '',
      deployedFundsAmount: '0',
      fundTokenPriceInWeis: '0',
      earnedMoney: '0',
      actualBalance: '0',
      //
      editingFundTokenPrice: false,
      newFundTokenPriceLoading: false,
      newFundTokenPrice: '0',
      newFundTokenPriceUnit: 'Wei',
      units: ['Wei', 'Ether'],
      //
      withdrawMoneyLoading: false,
    };
  },
  computed: {
    ...mapGetters(['address']),

    withdrawnMoney() {
      return BigNumber(this.earnedMoney).minus(BigNumber(this.actualBalance));
    },
  },
  watch: {
    newFundTokenPrice(newValue) {
      if (newValue) {
        this.newFundTokenPrice = newValue.replace(',', '.');
      }
    },
  },
  validations() {
    return {
      newFundTokenPrice: {
        required: helpers.withMessage('Debe ingresar un valor', required),
        numeric: helpers.withMessage('Debe ingresar un valor numérico', numeric),
        minValue: helpers.withMessage('El valor debe ser mayor o igual a 0', (value) => {
          if (value >= 0) return true;
          return false;
        }),
        maxValue: helpers.withMessage('El valor debe ser menor o igual a 1000 ETH', (value) => {
          if (this.newFundTokenPriceUnit === 'Wei' && BigNumber(value).isLessThanOrEqualTo(1000000000000000000000)) return true;
          if (
            this.newFundTokenPriceUnit === 'Ether' &&
            BigNumber(Web3.utils.toWei(value, 'ether')).isLessThanOrEqualTo(1000000000000000000000)
          )
            return true;
          return false;
        }),
        weiValue: helpers.withMessage('El valor en Wei debe ser un número entero', (value) => {
          if (this.newFundTokenPriceUnit === 'Wei' && !BigNumber(value).isInteger()) return false;
          return true;
        }),
        maxDecimals: helpers.withMessage('La cantidad máxima de decimales permitidos es 18', (value) => {
          if (this.newFundTokenPriceUnit === 'Ether') {
            const decimals = value.trim().split('.')[1];
            if (decimals && decimals.length > 18) return false;
          }
          return true;
        }),
      },
    };
  },
  methods: {
    BigNumber,

    getFundTokenPrice() {
      return call('FundFactory', 'fundTokenPrice', [], {}, async (res) => {
        this.fundTokenPriceInWeis = res;
        this.newFundTokenPrice = res.toString();
        this.newFundTokenPriceUnit = 'Wei';
      });
    },

    async handleNewFundTokenPriceSubmit() {
      if (await validateForm(this.v$)) {
        const newFundTokenPriceInWeis =
          this.newFundTokenPriceUnit === 'Wei'
            ? this.newFundTokenPrice.trim()
            : Web3.utils.toWei(this.newFundTokenPrice.trim(), 'ether');
        if (newFundTokenPriceInWeis !== this.fundTokenPriceInWeis) {
          try {
            this.newFundTokenPriceLoading = true;
            await transaction(
              'FundFactory',
              'changeFundTokenPrice',
              [newFundTokenPriceInWeis],
              {},
              true,
              'Precio del FundToken modificado',
            );
            addNotification({
              message: 'Precio del FundToken modificado',
              type: 'success',
            });
            await this.getFundTokenPrice();
            this.editingFundTokenPrice = false;
          } finally {
            this.newFundTokenPriceLoading = false;
          }
        } else {
          this.editingFundTokenPrice = false;
        }
      }
    },

    async withdrawMoney() {
      try {
        this.withdrawMoneyLoading = true;
        await transaction('FundFactory', 'withdrawMoney', [], {}, true, 'Dinero retirado');
        addNotification({
          message: 'Dinero retirado',
          type: 'success',
        });
        this.actualBalance = '0';
      } finally {
        this.withdrawMoneyLoading = false;
      }
    },
  },
  async created() {
    call('FundFactory', 'owner', [], {}, async (res) => {
      this.deployer = res;
    });

    call('FundFactory', 'getDeployedFundsCount', [], {}, async (res) => {
      this.deployedFundsAmount = res;
    });

    this.getFundTokenPrice();

    call('FundFactory', 'earnedMoney', [], {}, async (res) => {
      this.earnedMoney = res;
    });

    call('FundFactory', 'balance', [], {}, async (res) => {
      this.actualBalance = res;
    });
  },
};
</script>

<style lang="scss" scoped>
.items-container {
  .item-container {
    width: 33%;

    @media (max-width: 980px) {
      width: 50%;
    }

    @media (max-width: 560px) {
      width: 100%;
      padding: 0.5em 0;
    }

    .item {
      .value {
        .icon {
          cursor: pointer;
        }

        .amount-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1.6em;
        }

        .new-fund-token-price-form-row {
          display: flex;
          flex-direction: row;
          justify-content: start;
          align-items: stretch;
          gap: 0.6em;

          .new-fund-token-price-form-group {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: start;
            gap: 0.2em;

            input {
              min-width: 18em;

              @media (max-width: 440px) {
                min-width: 0;
              }
            }
          }

          #newFundTokenPriceUnitInput {
            width: 6em;
            margin-right: 0.6em;
          }

          .command {
            align-self: center;
          }
        }
      }
    }
  }

  .item-container-owner {
    width: 66%;

    @media (max-width: 980px) {
      width: 100%;
    }
  }

  .item-container-fund-token-price {
    width: 99%;

    @media (max-width: 980px) {
      width: 100%;
    }
  }
}
</style>
