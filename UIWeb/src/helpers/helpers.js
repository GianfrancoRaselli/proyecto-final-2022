import store from '@/store';
import axios from 'axios';
import { addNotification } from '@/composables/useNotifications';
import { hasMetamask } from './connection';

import fundTokenABI from '../assets/abis/FundToken';
import { fundTokenAddress } from '../assets/lastAddresses';

const call = async (contract, method, params = [], options) => {
  const contractInstance = await getContractInstance(contract, 'infura');
  if (contractInstance) {
    try {
      return contractInstance.methods[method](...params).call({ from: store.state.connection.address, ...options });
    } catch (err) {
      showErrorNotification(err);
      throw err;
    }
  }
};

const transaction = async (contract, method, params = [], options) => {
  if (hasMetamask()) {
    if (store.getters.isConnected) {
      if (store.getters.isConnectedToTheValidChain) {
        const contractInstance = await getContractInstance(contract);
        if (contractInstance) {
          try {
            await contractInstance.methods[method](...params).call({ from: store.state.connection.address, ...options });
          } catch (err) {
            showErrorNotification(err);
            throw err;
          }
          return contractInstance.methods[method](...params).send({ from: store.state.connection.address, ...options });
        }
      } else {
        addNotification({
          message: 'You have to be connected to ' + store.getters.validChainName + ' to send a transaction',
          type: 'warning',
        });
      }
    } else {
      addNotification({
        message: 'You have to be connected to MetaMask to send a transaction',
        type: 'warning',
      });
    }
  } else {
    addNotification({
      message: 'You need to install MetaMask to send a transaction',
      type: 'warning',
    });
  }
  throw new Error('The transaction could not be sent');
};

const event = async (contract, event, options, func) => {
  const contractInstance = await getContractInstance(contract);
  if (contractInstance) return contractInstance.events[event]({ fromBlock: 'latest', ...options }, func);
};

async function getContractInstance(contract, provider = 'metamask') {
  if (provider === 'infura') {
    if (contract === 'FundFactory') return store.state.connection.infuraFundFactory;
    if (contract === 'FundToken') return new store.state.connection.infuraWeb3.eth.Contract(fundTokenABI, fundTokenAddress);
    const { default: contractABI } = await import('../assets/abis/' + contract.name);
    return new store.state.connection.infuraWeb3.eth.Contract(contractABI, contract.address);
  } else if (provider === 'metamask') {
    if (store.state.connection.provider) {
      if (contract === 'FundFactory') return store.state.connection.fundFactory;
      if (contract === 'FundToken') return new store.state.connection.web3.eth.Contract(fundTokenABI, fundTokenAddress);
      const { default: contractABI } = await import('../assets/abis/' + contract.name);
      return new store.state.connection.web3.eth.Contract(contractABI, contract.address);
    }
  }
}

function showErrorNotification(err) {
  const endIndex = err.message.search('{');
  let message = err.message;
  if (endIndex >= 0) message = err.message.substring(0, endIndex);
  message = message.charAt(0).toUpperCase() + message.slice(1);

  addNotification({
    message: message,
    type: 'error',
  });
}

const addTokenToMetaMask = (type = 'ERC20', options = { address: fundTokenAddress, symbol: 'FT', decimals: 0 }) => {
  return store.state.connection.provider.request({
    method: 'wallet_watchAsset',
    params: {
      type,
      options,
    },
  });
};

const ethPriceInUSD = async () => {
  return (await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')).data.USD;
};

export { call, transaction, event, addTokenToMetaMask, ethPriceInUSD };
