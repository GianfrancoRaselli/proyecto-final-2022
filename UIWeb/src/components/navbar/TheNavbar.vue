<template>
  <div class="content">
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <div class="brand-logo-container">
        <router-link :to="{ name: 'Home' }" exact>
          <img class="brand-logo" src="@/assets/imgs/logos/1/Fund-logos_white.png" />
        </router-link>
      </div>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto align-items">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Funds' }" exact v-text="fundsMsg" />
          </li>
          <li class="nav-item">
            <router-link class="nav-link nav-link-large" :to="{ name: 'CreateFund' }" exact text="Crear fondo" />
            <router-link class="nav-link nav-link-small" :to="{ name: 'CreateFund' }" exact text="Crear" />
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
            <FaIcon icon="wallet" class="icon mr-2 wallet-icon" size="2x" v-if="isConnectedToTheValidChain"></FaIcon>
            <FaIcon icon="triangle-exclamation" class="icon mr-2 wallet-icon wallet-warning-icon" size="2x" v-else></FaIcon>
            <AppShowAddress
              class="address"
              type="entity"
              :address="address"
              :showTooltip="false"
              :allowCopyAddress="false"
              :listenNameChange="true"
            />
          </button>

          <AppButton classes="btn-sm btn-success" :text="connectMetaMaskMsg" v-if="!isConnected" @click="connectToMetamask" />
        </div>
        <div v-else v-text="installMetaMaskMsg"></div>

        <div class="dropdown ml-3" style="display: none">
          <FaIcon
            icon="globe"
            class="dropdown-toggle icon mr-1"
            size="1x"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          ></FaIcon>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
            <div
              class="dropdown-item dropdown-item--language"
              v-for="(language, index) in languages"
              :key="index"
              @click="changeLanguage(language)"
            >
              <span :class="{ 'text-bold': selectedLanguage === language }" v-text="language" />
              <FaIcon
                icon="check"
                class="dropdown-toggle icon mr-1"
                size="1x"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                v-if="selectedLanguage === language"
              ></FaIcon>
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
  color: white;
  height: 100%;
  padding: 0 6px;
  margin: 0 5px;
  border-radius: 5px;
}

.brand-logo-container {
  padding-right: 1rem;

  .brand-logo {
    height: calc(var(--navbar-height) - 2px);
    width: auto;
  }
}

.align-items {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.navbar-nav {
  gap: 0.5rem;
}

.nav-item {
  font-size: 0.95rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.nav-item-fund-token {
  padding-left: 0.6rem;
}

.nav-link-active {
  font-size: 1.05rem;
  color: white !important;
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

.btn-wallet {
  font-weight: bold;
  max-width: 15rem;
  position: relative;
  padding: 0.3rem 0.5rem 0.3rem 2.5rem;
  border-radius: 5px;
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
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
