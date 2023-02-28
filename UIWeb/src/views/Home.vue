<template>
  <div class="content">
    <div class="main-content">
      <p class="title">Sistema de administración de fondos comunes</p>
      <div class="sub-content">
        <img class="fund-img" src="@/assets/imgs/logos/1/Fund-logos_transparent.png" />
        <div class="info">
          <div class="header">
            <p class="subtitle">Transformando la forma de financiación</p>
            <p class="description">
              Brindamos seguridad y autocontrol a todos los que buscan una forma totalmente descentralizada de administrar fondos
              de dinero compartidos utilizando los contratos inteligentes de la cadena de bloques de Ethereum.
            </p>
          </div>
          <router-link class="button" :to="{ name: 'Funds', params: { animation: 'slide' } }">
            <button class="btn btn-primary btn-discover">
              <span>Descubrir fondos</span><fa-icon icon="arrow-right" class="img-icon ml-3"></fa-icon>
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <div class="latest-funds-content">
      <p class="title">Últimos fondos creados</p>
      <AppSpinner class="spinner" size="medium" v-if="loading" />
      <div class="funds" v-else>
        <div class="fund" v-for="(fund, index) in fundsToShow" :key="index" @click="redirect(fund.address)">
          <FundCard :fund="fund" />
        </div>
      </div>
    </div>

    <div class="community-content">
      <img src="@/assets/imgs/community.png" />
      <div class="text">
        <p class="title">¿Te gustaría unirte a nuestra comunidad?</p>
        <p class="description">
          Ya hay muchas personas que confían en nuestros servicios, ¡y cada día seguimos creciendo aún más!
        </p>
      </div>
      <div class="cards">
        <div class="card">
          <fa-icon icon="users" class="icon purple" size="5x" />
          <span class="number" v-text="community.users" />
          <span class="title"><span class="main purple">Usuarios</span> registrados</span>
        </div>
        <div class="card">
          <fa-icon icon="list" class="icon light" size="5x" />
          <span class="number" v-text="community.funds" />
          <span class="title"><span class="main light">Fondos</span> creados</span>
        </div>
        <div class="card">
          <fa-icon icon="money-bill" class="icon red" size="5x" />
          <span class="number" v-text="community.ethers" />
          <span class="title"><span class="main red">ETH</span> depositados</span>
        </div>
      </div>
    </div>

    <div class="metamask-content">
      <img src="@/assets/imgs/metamask.png" />
      <div class="text">
        <p class="title">¡Instala MetaMask!</p>
        <p class="description">
          Por el momento, para poder comenzar a interactuar con la aplicación debes contar con la billetera de MetaMask instalada
          en el navegador.
        </p>
        <p class="secondary-description">¡Estamos trabajando para incorporar nuevas formas de utilizar la aplicación!</p>
        <a href="https://metamask.io/download/" target="_blank"><button class="btn btn-primary">Instalar MetaMask</button></a>
      </div>
    </div>

    <div class="fundtoken-content">
      <img src="@/assets/imgs/fundtoken.png" />
      <div class="text">
        <p class="title">FundToken</p>
        <p class="description">
          Mediante estos tokens, que pueden ser adquiridos en nuestro sitio web, las entidades podrán crear un nuevo fondo
          abonando por realizar dicha operación un (1) FundToken.
        </p>
        <button class="btn btn-secondary" @click="addFundTokenToMetaMask" v-if="hasMetamask">Agregar FundToken a MetaMask</button>
      </div>
    </div>
  </div>
</template>

<script>
import FundCard from '@/components/fund/FundCard';

import { hasMetamask } from '@/helpers/connection';
import { call, addTokenToMetaMask, convertNumberToMaxDecimals } from '@/helpers/helpers';
import Web3 from 'web3';
import axios from 'axios';

export default {
  name: 'HomeView',
  components: {
    FundCard,
  },
  data() {
    return {
      loading: true,
      progress: 0,
      funds: [],
      community: {
        users: 0,
        funds: 0,
        ethers: 0,
      },
    };
  },
  computed: {
    hasMetamask,

    fundsToShow() {
      return this.filterFunds(this.funds.slice());
    },
  },
  methods: {
    addFundTokenToMetaMask() {
      addTokenToMetaMask();
    },

    async searchFunds() {
      this.loading = true;
      this.progress = 0;

      const fundsAddress = await call('FundFactory', 'getDeployedFunds');
      this.community.funds = fundsAddress.length;
      const funds = Array(this.community.funds);

      let callsResolved = 0;
      let weis = 0;
      await Promise.all(
        Array(this.community.funds)
          .fill()
          .map((element, index) => {
            return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary', [], {}, async (fund) => {
              const { data: fundExtraInformation } = await axios.get('fund/' + fund.address);
              if (fundExtraInformation) {
                const { description, image } = fundExtraInformation;
                fund.description = description;
                fund.image = image;
              }
              funds[index] = fund;

              weis += fund.totalContributions;

              callsResolved++;
              this.progress = Math.round((callsResolved / this.community.funds) * 100);
            });
          }),
      );

      this.funds = funds;
      this.community.ethers = convertNumberToMaxDecimals(
        Number(Web3.utils.fromWei(weis.toLocaleString('fullwide', { useGrouping: false }), 'ether')),
        0,
      );
      this.loading = false;
    },

    filterFunds(fundsToFilter) {
      return fundsToFilter
        .sort((a, b) => {
          if (a.createdAt < b.createdAt) return 1;
          if (a.createdAt > b.createdAt) return -1;
          return 0;
        })
        .slice(0, 10);
    },

    redirect(fundAddress) {
      this.$router.push({ name: 'Fund', params: { fundAddress } });
    },

    async searchUsers() {
      axios.get('entity/amount').then((res) => {
        this.community.users = res.data;
      });
    },
  },
  async created() {
    this.searchFunds();
    this.searchUsers();
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

.content {
  min-width: 100%;
  padding: 0;
}

.main-content {
  min-height: calc(100vh - var(--navbar-height));
  padding: 2rem 0.4rem;
  background: #38849550;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom left, #38849520, #38849550);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom left, #38849520, #38849550);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  .title {
    font-size: 3.1rem;
    font-weight: bold;
    font-family: 'Dancing Script', cursive;
    text-align: center;
    animation: fadeInDownBig 0.6s;
  }

  .sub-content {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    .fund-img {
      height: auto;
      max-height: 20rem;
      width: auto;
      max-width: 100%;
      animation: fadeInRightBig 1.2s;
    }

    .info {
      font-size: 1.02rem;
      text-align: center;
      max-width: 650px;
      animation: fadeInLeftBig 1.8s;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 10px;

      .header {
        .subtitle {
          font-size: 2.2em;
          font-weight: bold;
          font-family: 'Dancing Script', cursive;
        }
      }
    }
  }
}

.latest-funds-content {
  padding: 3rem 1rem;
  /* fallback for old browsers */
  background: rgba(215, 218, 219, 0.477);
  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(to top, rgba(233, 235, 238, 0.121), rgba(215, 218, 219, 0.477));
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(to top, rgb(251, 251, 251), rgb(249, 249, 249));

  .title {
    font-size: 2.5rem;
    font-weight: bold;
    font-family: 'Dancing Script', cursive;
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .funds {
    padding-bottom: 1.1rem;
    overflow: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    gap: 1rem;

    .fund {
      width: 25rem;
      max-width: 85%;
      flex-shrink: 0;
      padding: 0.4rem 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .funds::-webkit-scrollbar {
    height: 12px;
    border-radius: 10px;
    background-color: rgb(175, 175, 175);

    @media only screen and (hover: none) and (pointer: coarse) {
      display: none;
    }
  }

  .funds::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(74, 74, 74);
  }
}

.community-content {
  text-align: center;
  padding: 4rem 0.5rem 3rem 0.5rem;
  padding-top: 4rem;
  background: #eae7e781;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top left, #2c3e5045, #eae7e781);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top left, #2c3e5045, #eae7e781);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    height: 13rem;
    max-width: 100%;
    margin-bottom: 2rem;
  }

  .text {
    max-width: 680px;
    margin-bottom: 1.5rem;

    .title {
      font-size: 1.6rem;
      font-weight: bold;
    }

    .description {
      font-size: 1.06rem;
    }
  }

  .cards {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    gap: 1rem;

    @media (max-width: 700px) {
      flex-direction: column;
    }

    .card {
      height: 20rem;
      width: 18rem;
      padding: 1rem 0;
      border-radius: 1rem;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;

      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      @media (max-width: 1000px) {
        font-size: 0.8rem;
        height: 16rem;
        width: 14rem;
      }

      @media (max-width: 700px) {
        font-size: 1rem;
        height: 20rem;
        width: 20rem;
      }

      .number {
        font-size: 2.8em;
        font-weight: bold;
      }

      .title {
        font-size: 1.3em;

        .main {
          font-size: 1.2em;
        }
      }
    }
  }
}

.metamask-content {
  padding: 6rem;
  background: radial-gradient(circle at 10% 20%, rgb(248, 213, 214) 0%, rgb(243, 242, 229) 90%);

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;

  @media (max-width: 1200px) {
    padding: 6rem 2rem;
    gap: 0.2rem;
  }

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 4rem;

    .text {
      text-align: center;
      max-width: 700px;
    }
  }

  img {
    height: 300px;
    max-width: 100%;

    @media (max-width: 550px) {
      height: auto;
    }
  }

  .text {
    .title {
      font-size: 2rem;
      font-weight: bold;
    }

    .description {
      font-size: 1.2rem;
    }

    .secondary-description {
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.856);
    }

    .btn {
      margin-top: 0.8rem;
    }
  }
}

.fundtoken-content {
  padding: 6rem;
  /* fallback for old browsers */
  background: #b9d5bc;
  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(to left, rgba(185, 213, 188, 0.5), rgba(222, 237, 222, 0.5));
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(to left, rgba(185, 213, 188, 0.5), rgba(222, 237, 222, 0.5));

  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;

  @media (max-width: 1200px) {
    padding: 6rem 2rem;
    gap: 0.2rem;
  }

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 2.2rem;

    .text {
      text-align: center;
      max-width: 700px;
    }
  }

  img {
    height: 300px;
    max-width: 100%;

    @media (max-width: 550px) {
      height: auto;
    }
  }

  .text {
    .title {
      font-family: 'Dancing Script', cursive;
      font-size: 3.4rem;
      font-weight: bold;
    }

    .description {
      font-size: 1.2rem;
    }

    .secondary-description {
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.856);
    }

    .btn {
      margin-top: 0.8rem;
    }
  }
}
</style>
