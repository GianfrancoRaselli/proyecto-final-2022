<template>
  <div>
    <p class="page-title">FundFactory</p>
    <div class="fund-factory-container">
      <div class="item-container">
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
            <span class="amount"><AppShowEth :weis="fundTokenPriceInWeis" /></span>
            <span class="unit">Precio FundToken</span>
          </span>
          <span class="description">Precio de venta de un FundToken.</span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { call } from '@/helpers/helpers';
import BigNumber from 'bignumber.js';

export default {
  name: 'FundFactoryView',
  components: {},
  data() {
    return {
      deployer: '',
      deployedFundsAmount: 0,
      fundTokenPriceInWeis: 0,
      earnedMoney: 0,
      actualBalance: 0,
    };
  },
  computed: {
    ...mapGetters(['address']),

    withdrawnMoney() {
      return BigNumber(this.earnedMoney).minus(BigNumber(this.actualBalance));
    },
  },
  methods: {},
  async created() {
    call('FundFactory', 'owner', [], {}, async (res) => {
      this.deployer = res;
    });

    call('FundFactory', 'getDeployedFundsCount', [], {}, async (res) => {
      this.deployedFundsAmount = res;
    });

    call('FundFactory', 'fundTokenPrice', [], {}, async (res) => {
      this.fundTokenPriceInWeis = res;
    });

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
.fund-factory-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;

  .item-container {
    min-height: 100%;
    width: 33%;
    padding: 0.5rem;

    @media (max-width: 660px) {
      width: 50%;
    }

    @media (max-width: 450px) {
      width: 100%;
    }

    .item {
      height: 100%;
      width: 100%;
      padding: 1rem;
      border: 1px solid rgb(145, 145, 145);
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      gap: 0.8rem;

      .value {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;

        .amount {
          font-size: 1.6rem;
          font-weight: bold;
        }

        .unit {
          font-size: 0.95rem;
          color: grey;
        }
      }
    }
  }
}
</style>
