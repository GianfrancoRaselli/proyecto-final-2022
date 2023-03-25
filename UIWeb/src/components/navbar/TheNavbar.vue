<template>
  <div class="content">
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <router-link :to="{ name: 'Home' }" exact
        ><img class="brand-logo" src="@/assets/imgs/logos/1/Fund-logos_white.png"
      /></router-link>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto align-items">
          <li class="nav-item">
            <router-link class="nav-link nav-link-large" :to="{ name: 'CreateFund' }" exact text="Crear fondo" />
            <router-link class="nav-link nav-link-small" :to="{ name: 'CreateFund' }" exact text="Crear" />
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Funds' }" exact v-text="fundsMsg" />
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'AboutUs' }" exact text="Nosotros" />
          </li>
          <li class="nav-item">
            <router-link class="nav-link nav-link-large" :to="{ name: 'FrequentQuestions' }" exact text="Preguntas frecuentes" />
            <router-link class="nav-link nav-link-small" :to="{ name: 'FrequentQuestions' }" exact text="Preguntas" />
          </li>
          <li class="nav-item nav-item-fund-token">
            <AppButton
              classes="btn-md btn-light nav-link-large"
              data-toggle="modal"
              data-target="#buyFundTokensModal"
              text="Comprar FundTokens"
            />
            <AppButton
              classes="btn-md btn-light nav-link-small"
              data-toggle="modal"
              data-target="#buyFundTokensModal"
              icon="money-bill"
              text="FundToken"
            />
          </li>
        </ul>
      </div>

      <div class="navbar--menu ml-auto align-items">
        <div v-if="hasMetamask">
          <button class="btn btn-light btn-wallet" data-toggle="modal" data-target="#walletModal" v-if="isConnected">
            <fa-icon icon="wallet" class="icon mr-2 wallet-icon" size="2x" v-if="isConnectedToTheValidChain"></fa-icon>
            <fa-icon icon="triangle-exclamation" class="icon mr-2 wallet-icon wallet-warning-icon" size="2x" v-else></fa-icon>
            <AppShowAddress class="address" type="entity" :address="address" :showTooltip="false" :allowCopyAddress="false" />
          </button>

          <AppButton classes="btn-sm btn-success" :text="connectMetaMaskMsg" v-if="!isConnected" @click="connectToMetamask" />
        </div>
        <div v-else v-text="installMetaMaskMsg"></div>

        <div class="dropdown ml-3" style="display: none">
          <fa-icon
            icon="globe"
            class="dropdown-toggle icon mr-1"
            size="1x"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          ></fa-icon>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
            <div
              class="dropdown-item dropdown-item--language"
              v-for="(language, index) in languages"
              :key="index"
              @click="changeLanguage(language)"
            >
              <span :class="{ 'text-bold': selectedLanguage === language }" v-text="language" />
              <fa-icon
                icon="check"
                class="dropdown-toggle icon mr-1"
                size="1x"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                v-if="selectedLanguage === language"
              ></fa-icon>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { getMessages } from '@/dictionary';
import { mapState, mapGetters } from 'vuex';
import { hasMetamask, connectToMetamask } from '@/helpers/connection';

export default {
  name: 'TheNavbarComponent',
  data() {
    return {
      languages: ['English', 'Español'],
    };
  },
  computed: {
    ...getMessages(['createFund', 'funds', 'myFunds', 'buyFundTokens', 'connectMetaMask', 'installMetaMask']),

    ...mapState({
      selectedLanguage: (state) => state.config.selectedLanguage,
    }),
    ...mapGetters(['isConnected', 'isConnectedToTheValidChain', 'address']),

    hasMetamask,
  },
  methods: {
    changeLanguage(language) {
      this.$store.commit('setSelectedLanguage', language);
    },

    async connectToMetamask() {
      this.$store.commit('setDisconnected', false);
      await connectToMetamask();
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  font-size: 1.04rem;
  color: white;
  height: 100%;
  padding: 0 6px;
  margin: 0 5px;
  border-radius: 5px;
}

.brand-logo {
  height: calc(var(--navbar-height) - 2px);
  width: auto;
  margin-right: 1rem;
}

.navbar-nav {
  gap: 0.4rem;
}

.nav-item {
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.nav-item-fund-token {
  margin-left: 0.6rem;
}

.nav-link-small {
  display: none !important;
}

@media (max-width: 940px) {
  .nav-link-large {
    display: none !important;
  }

  .nav-link-small {
    display: block !important;
  }
}

.align-items {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-wallet {
  font-weight: bold;
  max-width: 15rem;
  position: relative;
  padding: 0.3rem 0.5rem 0.3rem 2.5rem;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media (max-width: 1000px) {
    max-width: 10rem;
  }

  @media (max-width: 940px) {
    max-width: 15rem;
  }

  @media (max-width: 820px) {
    max-width: 10rem;
  }

  @media (max-width: 765px) {
    max-width: 15rem;
  }

  .wallet-icon {
    position: absolute;
    top: 50%;
    left: -1rem;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.981);
    border: 1px solid black;
    padding: 0.5rem;
    border-radius: 100%;
  }

  .wallet-warning-icon {
    color: rgb(243, 166, 0);
    border-color: rgb(243, 166, 0);
  }

  .address {
    display: inline-block;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.dropdown-item--language {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding-left: 6px;
  padding-right: 6px;
}
</style>
