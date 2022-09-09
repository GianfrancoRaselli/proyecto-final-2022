export default {
  state() {
    return {
      chainId: '',
      validChain: {
        id: '0x5',
        name: 'Goerli Testnet',
        explorer: 'https://goerli.etherscan.io',
      },
      address: '',
      disconnected: false,
      provider: null,
      web3: null,
      fundFactory: null,
      infuraWeb3: null,
      infuraFundFactory: null,
    };
  },

  getters: {
    isConnected(state) {
      if (!state.disconnected && state.chainId && state.address) return true;
      return false;
    },

    isConnectedToTheValidChain(state) {
      if (state.chainId && state.chainId === state.validChain.id) return true;
      return false;
    },

    validChainName(state) {
      return state.validChain.name;
    },

    validChainExplorer(state) {
      return state.validChain.explorer;
    },
  },

  mutations: {
    setChainId(state, chainId) {
      state.chainId = chainId;
    },

    setAddress(state, address) {
      state.address = address;
    },

    setDisconnected(state, disconnected) {
      state.disconnected = disconnected;
    },

    setProvider(state, provider) {
      state.provider = provider;
    },

    setWeb3(state, web3) {
      state.web3 = web3;
    },

    setFundFactory(state, fundFactory) {
      state.fundFactory = fundFactory;
    },

    setInfuraWeb3(state, infuraWeb3) {
      state.infuraWeb3 = infuraWeb3;
    },

    setInfuraFundFactory(state, infuraFundFactory) {
      state.infuraFundFactory = infuraFundFactory;
    },
  },

  actions: {},
};
