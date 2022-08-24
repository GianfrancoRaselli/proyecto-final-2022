import store from '@/store';
import router from '@/router';
import Swal from 'sweetalert2';
//import detectEthereumProvider from '@metamask/detect-provider';

import Web3 from "web3";
const infuraPath = "https://rinkeby.infura.io/v3/c2c820555fad43838ab62145a03e4a2a";


const hasMetamask = () => {
  const ethereumProvider = window.ethereum;
  if (typeof ethereumProvider !== "undefined" && ethereumProvider.isMetaMask) {
    if (ethereumProvider.providers) {
      const provider = ethereumProvider.providers.find(p => p.isMetaMask && p._handleAccountsChanged && p._handleChainChanged);
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
  if (hasMetamask()) {
    //const ethereumProvider = await detectEthereumProvider();
    const ethereumProvider = window.ethereum;
    let provider;
    if (ethereumProvider.providers) provider = ethereumProvider.providers.find(p => p.isMetaMask && p._handleAccountsChanged && p._handleChainChanged);
    else provider = ethereumProvider;
    store.commit("setProvider", provider);
    setWeb3AndContracts(store.state.connection.provider);

    store.commit("setAddress", (await store.state.connection.provider.request({ method: "eth_requestAccounts" }))[0]);
    store.state.connection.provider.on('accountsChanged', handleAccountsChanged);

    store.commit("setChainId", await store.state.connection.provider.request({ method: "eth_chainId" }));
    store.state.connection.provider.on('chainChanged', handleChainChanged);
    checkValidChain();
  } else {
    setWeb3AndContracts(infuraPath);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "MetaMask Wallet",
      text: "You need to have metamask installed in the browser",
      showConfirmButton: true
    });
  }
};

const setWeb3AndContracts = (provider) => {
  store.commit("setWeb3", new Web3(provider));
};

const handleAccountsChanged = async accounts => {
  store.commit("setAddress", accounts[0]);

  if (!accounts[0]) {
    store.state.connection.provider.removeListener('accountsChanged', handleAccountsChanged);
    store.state.connection.provider.removeListener('chainChanged', handleChainChanged);
  }

  router.push("/");
};

const handleChainChanged = chainId => {
  store.commit("setChainId", chainId);
  checkValidChain();
};

const checkValidChain = async () => {
  if (!store.getters.isConnectedToTheValidChain) {
    await store.state.connection.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: store.state.connection.validChain.id
      }],
    });
  }
};

const disconnect = () => {
  store.state.connection.provider.removeListener('accountsChanged', handleAccountsChanged);
  store.state.connection.provider.removeListener('chainChanged', handleChainChanged);

  store.commit("setChainId", '');
  store.commit("setAddress", '');

  router.push("/");
};


export {
  hasMetamask,
  connectToMetamask,
  handleAccountsChanged,
  handleChainChanged,
  checkValidChain,
  disconnect,
}
