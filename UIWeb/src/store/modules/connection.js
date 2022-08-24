export default {
  state () {
    return {
      chainId: '',
      address: '',
      disconnected: false,
      provider: null,
      web3: null,
      validChain: {
        id: '0x4',
        name: 'Rinkeby Testnet'
      }
    }
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
  },

  actions: {

  },
};
