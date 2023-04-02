<template>
  <div class="home-container">
    <div class="main-content">
      <p class="title">Sistema de administración de fondos comunes</p>
      <div class="sub-content">
        <img class="fund-img" src="@/assets/imgs/logos/1/Fund-logos_transparent.png" />
        <div class="info">
          <div class="info-header">
            <p class="subtitle">Transformando la forma de financiación</p>
            <p class="description">
              Brindamos seguridad y autogestión a todos los que buscan una forma totalmente descentralizada de administrar fondos
              de dinero utilizando la teconología Smart Contract de la Ethereum Blockchain.
            </p>
          </div>
          <router-link class="button" :to="{ name: 'Funds', params: { animation: 'slide' } }">
            <button class="btn btn-primary btn-discover">
              <span>Descubrir fondos</span><FaIcon icon="arrow-right" class="img-icon ml-3"></FaIcon>
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <div class="latest-funds-content">
      <p class="title">Últimos fondos creados</p>
      <AppSpinner class="spinner" size="medium" v-if="loadingFunds" />
      <div v-else>
        <p class="no-funds" v-if="fundsToShow.length === 0">Aún no se ha creado ningún fondo.</p>
        <div class="funds" v-else>
          <FundCard
            class="fund"
            :fund="fund"
            :savedFunds="savedFunds"
            @updateSavedFunds="getSavedFunds"
            v-for="(fund, index) in fundsToShow"
            :key="index"
          />
        </div>
      </div>
    </div>

    <div class="entities-content">
      <p class="title">Entidades creadas</p>
      <AppSpinner class="spinner" size="medium" v-if="loadingEntities" />
      <div v-else>
        <p class="no-entities" v-if="entities.length === 0">Aún no se ha creado ninguna entidad.</p>
        <div v-else>
          <form class="entity-search-form">
            <div class="input-container">
              <input
                type="search"
                class="input"
                placeholder="Buscar por nombre/dirección"
                aria-label="Buscar"
                v-model="entitySearching"
                @keydown.enter.prevent="entitySearch = entitySearching"
              />
              <div class="icon-container" @click="entitySearch = entitySearching">
                <FaIcon icon="magnifying-glass" class="icon" />
              </div>
            </div>
          </form>
          <p class="no-entities" v-if="entitiesToShow.length === 0">No existen entidades coincidentes con la búsqueda.</p>
          <div class="entities" v-else>
            <EntityCard class="entity" :entity="entity" v-for="(entity, index) in entitiesToShow" :key="index" />
          </div>
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
          <FaIcon icon="users" class="icon purple" size="5x" />
          <span class="number" v-text="community.users" />
          <span class="title"><span class="main purple">Usuarios</span> registrados</span>
        </div>
        <div class="card">
          <FaIcon icon="list" class="icon light" size="5x" />
          <span class="number" v-text="community.funds" />
          <span class="title"><span class="main light">Fondos</span> creados</span>
        </div>
        <div class="card">
          <FaIcon icon="money-bill" class="icon red" size="5x" />
          <span class="number" v-text="community.ethers" />
          <span class="title"><span class="main red">ETH</span> depositados</span>
        </div>
      </div>
    </div>

    <div class="metamask-fundtoken-content metamask-content">
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

    <div class="metamask-fundtoken-content fundtoken-content">
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
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import { hasMetamask } from '@/helpers/connection';
import { call, addTokenToMetaMask, convertNumberToMaxDecimals } from '@/helpers/helpers';
import { compareAddresses } from 'web3-simple-helpers/methods/general';
import Web3 from 'web3';
import axios from 'axios';

import FundCard from '@/components/fund/FundCard';
import EntityCard from '@/components/entity/EntityCard';

export default {
  name: 'HomeView',
  components: {
    FundCard,
    EntityCard,
  },
  data() {
    return {
      loadingFunds: true,
      progressFunds: 0,
      funds: [],
      savedFunds: [],
      loadingEntities: true,
      entitySearching: '',
      entitySearch: '',
      entities: [],
      community: {
        users: 0,
        funds: 0,
        ethers: 0,
      },
    };
  },
  computed: {
    ...mapGetters(['address']),

    hasMetamask,

    fundsToShow() {
      return this.filterFunds(this.funds.slice());
    },

    entitiesToShow() {
      let entitiesToShow = this.entities;
      if (this.entitySearch.trim()) {
        const entitySearch = this.entitySearch
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        entitiesToShow = entitiesToShow.filter(
          (entity) =>
            compareAddresses(entity.address, entitySearch) ||
            entity.fullname
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .includes(entitySearch),
        );
      }
      return entitiesToShow;
    },
  },
  watch: {
    address() {
      this.getSavedFunds();
    },
  },
  methods: {
    addFundTokenToMetaMask() {
      addTokenToMetaMask();
    },

    async searchFunds() {
      this.loadingFunds = true;
      this.progressFunds = 0;

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
              const extraSummary = await call({ name: 'Fund', address: fundsAddress[index] }, 'getExtraSummary');
              fund = {
                ...fund,
                ...extraSummary,
              };
              const { data: fundExtraInformation } = await axios.get('fund/' + fund.address);
              if (fundExtraInformation) {
                const { description, image } = fundExtraInformation;
                fund.description = description;
                fund.image = image;
              }
              funds[index] = fund;

              weis = BigNumber.sum(weis, fund.totalContributions);

              callsResolved++;
              this.progressFunds = Math.round((callsResolved / this.community.funds) * 100);
            });
          }),
      );

      this.funds = funds;
      this.community.ethers = convertNumberToMaxDecimals(
        Number(Web3.utils.fromWei(weis.toLocaleString('fullwide', { useGrouping: false }), 'ether')),
        3,
      );
      this.loadingFunds = false;
    },

    filterFunds(fundsToFilter) {
      return fundsToFilter
        .sort((a, b) => {
          if (a.createdAt < b.createdAt) return 1;
          if (a.createdAt > b.createdAt) return -1;
          return -1;
        })
        .slice(0, 10);
    },

    getSavedFunds() {
      if (this.address) {
        axios.get('entity/' + this.address).then((res) => {
          if (res.data) this.savedFunds = res.data.savedFunds;
        });
      }
    },

    async searchEntities() {
      this.loadingEntities = true;
      axios.get('entity').then((res) => {
        this.entities = res.data ? res.data : [];
        this.loadingEntities = false;
      });
    },

    async searchUsers() {
      axios.get('entity/amount').then((res) => {
        this.community.users = res.data ? res.data : 0;
      });
    },
  },
  async created() {
    this.getSavedFunds();
    this.searchFunds();
    this.searchEntities();
    this.searchUsers();
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  min-width: 100%;
  padding: 0;
}

.main-content {
  min-height: 100vh;
  padding: 2rem 0.5rem;
  padding-top: calc(2rem + var(--navbar-height));
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
    font-size: 3.3rem;
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
      font-size: 1.1rem;
      text-align: center;
      max-width: 650px;
      animation: fadeInLeftBig 1.8s;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;

      .info-header {
        .subtitle {
          font-size: 2.26em;
          font-weight: bold;
          font-family: 'Dancing Script', cursive;
        }
      }
    }
  }
}

.latest-funds-content {
  padding: 3rem 1rem;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #dee4ed 100%);

  .title {
    font-size: 2.2rem;
    font-weight: bold;
    font-family: 'Dancing Script', cursive;
    text-align: center;
    margin-bottom: 2rem;
  }

  .no-funds {
    text-align: center;
    font-size: 1.1rem;
  }

  .funds {
    padding-bottom: 1.1rem;
    overflow: auto;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: stretch;

    .fund {
      width: 28rem;
      max-width: 85%;
      flex-shrink: 0;
    }
  }

  .funds::-webkit-scrollbar {
    height: 15px;
    border-radius: 10px;
    background-color: rgb(175, 175, 175);

    @media only screen and (hover: none) and (pointer: coarse) {
      display: none;
    }
  }

  .funds::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(80, 80, 80);
  }

  .funds::-webkit-scrollbar-thumb:hover {
    background-color: rgb(65, 65, 65);
  }
}

.entities-content {
  padding: 3rem 1rem;
  background-image: linear-gradient(-225deg, #fffeff 0%, #f3ffff 100%);

  .title {
    font-size: 2.2rem;
    font-weight: bold;
    font-family: 'Dancing Script', cursive;
    text-align: center;
    margin-bottom: 2rem;
  }

  .no-entities {
    text-align: center;
    font-size: 1.1rem;
  }

  .entity-search-form {
    width: 22rem;
    margin: auto;
    margin-top: -0.7rem;
    margin-bottom: 1.8rem;

    @media (max-width: 460px) {
      width: 100%;
    }

    .input-container {
      position: relative;

      .input {
        height: 2.2rem;
        width: 100%;
        min-width: 20rem;
        padding: 1.1rem 3rem 1.1rem 0.5rem;
        border: 0.1px solid rgb(141, 141, 141);
        border-radius: 5px;
      }

      .icon-container {
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        color: rgb(53, 53, 53);
        background-color: rgb(194, 194, 194);
        border-top: 0.1px solid rgb(141, 141, 141);
        border-right: 0.1px solid rgb(141, 141, 141);
        border-bottom: 0.1px solid rgb(141, 141, 141);
        border-radius: 0 5px 5px 0;
        padding: 0 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .icon-container:hover {
        cursor: pointer;
      }
    }
  }

  .entities {
    padding-bottom: 1.1rem;
    overflow: auto;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: stretch;

    .entity {
      width: 20rem;
      max-width: 85%;
      flex-shrink: 0;
    }
  }

  .entities::-webkit-scrollbar {
    height: 15px;
    border-radius: 10px;
    background-color: rgb(175, 175, 175);

    @media only screen and (hover: none) and (pointer: coarse) {
      display: none;
    }
  }

  .entities::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(80, 80, 80);
  }

  .entities::-webkit-scrollbar-thumb:hover {
    background-color: rgb(65, 65, 65);
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
  background: radial-gradient(circle at 10% 20%, rgb(248, 213, 214) 0%, rgb(243, 242, 229) 90%);
  flex-direction: row;
}

.fundtoken-content {
  background-image: radial-gradient(73% 147%, #ece2df 59%, #eadfdf 100%),
    radial-gradient(91% 146%, rgba(255, 255, 255, 0.5) 47%, rgba(0, 0, 0, 0.5) 100%);
  background-blend-mode: screen;
  flex-direction: row-reverse;
}

.metamask-fundtoken-content {
  padding: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8rem;

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 3rem;
  }

  img {
    height: 22rem;
    max-width: 100%;

    @media (max-width: 550px) {
      height: auto;
    }
  }

  .text {
    @media (max-width: 1080px) {
      text-align: center;
    }

    .title {
      font-size: 2rem;
      font-weight: bold;
    }

    .description {
      font-size: 1.2rem;
    }

    .secondary-description {
      font-size: 0.95rem;
      color: rgba(0, 0, 0, 0.856);
    }

    .btn {
      margin-top: 0.8rem;
    }
  }
}
</style>
