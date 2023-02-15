import store from '@/store';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import { call, event } from '@/helpers/helpers';
//import detectEthereumProvider from '@metamask/detect-provider';

import fundFactoryABI from '../assets/abis/FundFactory';
import { fundFactoryAddress } from '../assets/lastAddresses';

const hasMetamask = () => {
  const ethereumProvider = window.ethereum;
  if (typeof ethereumProvider !== 'undefined' && ethereumProvider.isMetaMask) {
    if (ethereumProvider.providers) {
      const provider = ethereumProvider.providers.find((p) => p.isMetaMask && p._handleAccountsChanged && p._handleChainChanged);
      if (provider) {
        return true;
      } else {
        return false;
      }
    } else {
      if (ethereumProvider._handleAccountsChanged && ethereumProvider._handleChainChanged) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};

const connectToMetamask = async () => {
  setWeb3AndContracts();
  if (hasMetamask()) {
    if (!store.state.connection.disconnected) {
      //const ethereumProvider = await detectEthereumProvider();
      const ethereumProvider = window.ethereum;
      let provider;
      if (ethereumProvider.providers)
        provider = ethereumProvider.providers.find((p) => p.isMetaMask && p._handleAccountsChanged && p._handleChainChanged);
      else provider = ethereumProvider;
      store.commit('setProvider', provider);
      setWeb3AndContracts(store.state.connection.provider);

      store.commit(
        'setAddress',
        (
          await store.state.connection.provider.request({
            method: 'eth_requestAccounts',
          })
        )[0],
      );
      store.state.connection.provider.removeListener('accountsChanged', handleAccountsChanged);
      store.state.connection.provider.on('accountsChanged', handleAccountsChanged);

      store.commit('unsubscribeFromTransfersSubscription');
      searchFundTokensBalance();

      store.commit(
        'setChainId',
        await store.state.connection.provider.request({
          method: 'eth_chainId',
        }),
      );
      store.state.connection.provider.removeListener('chainChanged', handleChainChanged);
      store.state.connection.provider.on('chainChanged', handleChainChanged);
      checkValidChain();

      if (!store.state.connection.signature) signMessage();
    }
  } else {
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: 'MetaMask Wallet',
      text: 'Necesitas tener metamask instalado en el navegador para utilizar la aplicación',
      showConfirmButton: true,
    });
  }
};

const setWeb3AndContracts = (provider) => {
  if (!provider) {
    store.commit('setInfuraWeb3', new Web3(store.state.connection.infuraProvider));
    store.commit('setInfuraFundFactory', new store.state.connection.infuraWeb3.eth.Contract(fundFactoryABI, fundFactoryAddress));
  } else {
    store.commit('setWeb3', new Web3(provider));
    store.commit('setFundFactory', new store.state.connection.web3.eth.Contract(fundFactoryABI, fundFactoryAddress));
  }
};

const searchFundTokensBalance = () => {
  call('FundToken', 'balanceOf', [store.state.connection.address], {}, async (res) => {
    store.commit('setFundTokensBalance', res);

    const getEvent = (filterBy) => {
      return event(
        'FundToken',
        'Transfer',
        {
          filter: JSON.parse('{"' + filterBy + '":"' + store.state.connection.address + '"}'),
        },
        async () => {
          store.commit('setFundTokensBalance', await call('FundToken', 'balanceOf', [store.state.connection.address]));
        },
      );
    };

    store.commit('setTransferFromSubscription', await getEvent('from'));
    store.commit('setTransferToSubscription', await getEvent('to'));
  });
};

const handleAccountsChanged = (accounts) => {
  if (!accounts[0]) {
    store.state.connection.provider.removeListener('accountsChanged', handleAccountsChanged);
    store.state.connection.provider.removeListener('chainChanged', handleChainChanged);
  }

  store.commit('unsubscribeFromTransfersSubscription');
  store.commit('clearRecentTransactions');
  store.commit('setAddress', accounts[0]);
  store.commit('setSignature', null);

  if (store.state.connection.address) {
    searchFundTokensBalance();
    if (!store.state.connection.disconnected) signMessage();
  }
};

const handleChainChanged = (chainId) => {
  store.commit('setChainId', chainId);
};

const checkValidChain = () => {
  if (!store.getters.isConnectedToTheValidChain) {
    store.state.connection.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: store.state.connection.validChain.id,
        },
      ],
    });
  }
};

const signMessage = () => {
  store.state.connection.web3.eth.personal.sign(
    'Firme este mensaje para probar que tiene acceso a esta billetera para iniciar sesión.\n\nEsto no le costará ningún Ether.',
    store.state.connection.address,
    (err, signature) => {
      if (err) store.commit('setSignature', null);
      else store.commit('setSignature', signature);
    },
  );
};

export { hasMetamask, connectToMetamask, checkValidChain };
