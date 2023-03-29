import store from '@/store';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import { call, event } from '@/helpers/helpers';
import { compareAddresses } from 'web3-simple-helpers/methods/general';
//import detectEthereumProvider from '@metamask/detect-provider';

import fundFactoryABI from '@/assets/abis/FundFactory';
import { fundFactoryAddress } from '@/siteConfig';

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

      searchIsTheDeployer();

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
    const fireSwal = () => {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'MetaMask Wallet',
        text: 'Necesitas tener MetaMask instalado en el navegador para poder interactuar con la aplicación',
        showConfirmButton: true,
        confirmButtonText: 'Confirmar',
      });
    };

    if (window.location.href.split('/').pop() === 'inicio') setTimeout(() => fireSwal(), 1500);
    else fireSwal();
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

const searchIsTheDeployer = () => {
  call('FundFactory', 'owner', [], {}, async (res) => {
    store.commit('setIsTheDeployer', compareAddresses(res, store.getters.address));
  });
};

const searchFundTokensBalance = () => {
  call('FundToken', 'balanceOf', [store.getters.address], {}, async (res) => {
    store.commit('setFundTokensBalance', res);

    const getEvent = (filterBy) => {
      return event(
        'FundToken',
        'Transfer',
        {
          filter: JSON.parse('{"' + filterBy + '":"' + store.getters.address + '"}'),
        },
        async () => {
          store.commit('setFundTokensBalance', await call('FundToken', 'balanceOf', [store.getters.address]));
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
  store.commit('setSignature', undefined);
  store.commit('setIsTheDeployer', false);

  if (store.getters.address) {
    searchIsTheDeployer();
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

const signMessage = async () => {
  try {
    const signature = await store.state.connection.web3.eth.personal.sign(
      'Firme este mensaje para validar que tiene acceso a esta billetera para iniciar sesión.\n\nEsto no le costará ningún Ether.',
      store.getters.address,
    );
    console.log('Signature: ' + signature);
    store.commit('setSignature', signature);
  } catch (e) {
    store.commit('setSignature', null);
  }
};

export { hasMetamask, connectToMetamask, checkValidChain, signMessage };
