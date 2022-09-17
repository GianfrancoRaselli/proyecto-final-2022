export default {
  state() {
    return {
      chainId: '',
      validChain: {
        id: '0x5',
        name: 'Goerli Testnet',
        coin: 'GoerliETH',
        explorer: 'https://goerli.etherscan.io',
      },
      address: '',
      disconnected: false,
      provider: null,
      web3: null,
      fundFactory: null,
      infuraWeb3: null,
      infuraFundFactory: null,
      fundTokensBalance: 0,
      transferFromSubscription: null,
      transferToSubscription: null,
      recentTransactionsCount: 0,
      recentTransactions: [],
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

    validChainCoin(state) {
      return state.validChain.coin;
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

    setFundTokensBalance(state, fundTokensBalance) {
      state.fundTokensBalance = fundTokensBalance;
    },

    setTransferFromSubscription(state, transferFromSubscription) {
      state.transferFromSubscription = transferFromSubscription;
    },

    setTransferToSubscription(state, transferToSubscription) {
      state.transferToSubscription = transferToSubscription;
    },

    unsubscribeFromTransfersSubscription(state) {
      if (state.transferFromSubscription) state.transferFromSubscription.unsubscribe();
      if (state.transferToSubscription) state.transferToSubscription.unsubscribe();
    },

    addNewRecentTransaction(state, newRecentTransaction) {
      state.recentTransactions.push(newRecentTransaction);
      state.recentTransactionsCount++;
    },

    setRecentTransactionSuccess(state, data) {
      const transaction = state.recentTransactions[data.index];
      if (transaction) {
        transaction.hash = data.hash;
        transaction.loading = false;
        transaction.success = true;
      }
    },

    setRecentTransactionError(state, index) {
      const transaction = state.recentTransactions[index];
      if (transaction) {
        transaction.loading = false;
        transaction.success = false;
      }
    },

    clearRecentTransactions(state) {
      state.recentTransactions = [];
      state.recentTransactionsCount = 0;
    },
  },

  actions: {},
};
