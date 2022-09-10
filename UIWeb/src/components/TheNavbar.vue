<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <router-link class="navbar-brand mr-3" :to="{ name: 'Home' }" exact>Fund</router-link>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item mr-1">
          <router-link class="nav-link" :to="{ name: 'CreateFund' }" exact v-text="createFundMsg" />
        </li>
        <li class="nav-item mr-1">
          <router-link class="nav-link" :to="{ name: 'Funds' }" exact v-text="fundsMsg" />
        </li>
        <li class="nav-item mr-1">
          <router-link class="nav-link" :to="{ name: 'MyFunds' }" exact v-text="myFundsMsg" />
        </li>
        <li class="nav-item mr-1">
          <span class="pointer nav-link" data-toggle="modal" data-target="#buyFundTokensModal" v-text="buyFundTokensMsg" />
        </li>
      </ul>
    </div>

    <div class="navbar--menu ml-auto">
      <div v-if="hasMetamask">
        <button class="btn btn-light btn-wallet" data-toggle="modal" data-target="#walletModal" v-if="isConnected">
          <fa-icon icon="wallet" class="icon mr-2 wallet-icon" size="2x" v-if="isConnectedToTheValidChain"></fa-icon
          ><fa-icon icon="triangle-exclamation" class="icon mr-2 wallet-icon wallet-warning-icon" size="2x" v-else></fa-icon
          >{{ splitAddress }}
        </button>

        <AppButton classes="btn-sm btn-success" :text="connectMetaMaskMsg" v-if="!isConnected" @click="connectToMetamask" />
      </div>
      <div v-else v-text="installMetaMaskMsg"></div>

      <div class="dropdown ml-3">
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
            <span :class="{ bold: selectedLanguage === language }" v-text="language" />
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
      address: (state) => state.connection.address,
    }),
    ...mapGetters(['isConnected', 'isConnectedToTheValidChain']),

    hasMetamask,

    splitAddress() {
      let splitAccount = '';

      for (let i = 0; i < 4; i++) {
        splitAccount += this.address.charAt(i);
      }
      splitAccount += '...';
      for (let i = this.address.length - 4; i < this.address.length; i++) {
        splitAccount += this.address.charAt(i);
      }

      return splitAccount;
    },
  },
  methods: {
    changeLanguage(language) {
      this.$store.commit('setSelectedLanguage', language);
    },

    async connectToMetamask() {
      await connectToMetamask();
      this.$store.commit('setDisconnected', false);
    },
  },
};
</script>

<style scoped>
nav {
  color: white;
}

.navbar--menu {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-wallet {
  font-weight: bold;
  position: relative;
  padding: 3px 5px 3px 40px;
  border-radius: 10px;
}

.wallet-icon {
  position: absolute;
  top: -8.5px;
  left: -15px;
  background-color: rgba(255, 255, 255, 0.981);
  border: 1px solid black;
  padding: 7px;
  border-radius: 50px;
}

.wallet-warning-icon {
  color: rgb(243, 166, 0);
  border-color: rgb(243, 166, 0);
}

.dropdown-item--language {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding-left: 6px;
  padding-right: 6px;
}

.bold {
  font-weight: bold;
}

.pointer {
  cursor: pointer;
}

@media (max-width: 530px) {
  .hide {
    display: none;
  }
}
</style>
