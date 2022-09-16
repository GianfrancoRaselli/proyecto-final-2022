import store from '@/store';
import axios from 'axios';
import { addNotification } from '@/composables/useNotifications';
import { hasMetamask } from './connection';

import fundTokenABI from '../assets/abis/FundToken';
import { fundTokenAddress } from '../assets/lastAddresses';

const call = async (contract, method, params = [], options, showContractError = true) => {
  const contractInstance = await getContractInstance(contract, 'infura');
  if (contractInstance) {
    try {
      return contractInstance.methods[method](...params).call(options);
    } catch (err) {
      const errMessage = getErrorMessage(err);
      if (showContractError) addNotification({ message: errMessage, type: 'error' });
      throw new Error(errMessage);
    }
  }
};

const transaction = async (contract, method, params = [], options, showContractError = true, messageInfo) => {
  if (hasMetamask()) {
    if (store.getters.isConnected) {
      if (store.getters.isConnectedToTheValidChain) {
        const contractInstance = await getContractInstance(contract);
        if (contractInstance) {
          try {
            await contractInstance.methods[method](...params).call({ from: store.state.connection.address, ...options });
          } catch (err) {
            const errMessage = getErrorMessage(err);
            if (showContractError) addNotification({ message: errMessage, type: 'error' });
            throw new Error(errMessage);
          }
          const tx = contractInstance.methods[method](...params).send({ from: store.state.connection.address, ...options });
          addToRecentTransactions(messageInfo, tx);
          return tx;
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
  if (contractInstance) return contractInstance.events[event]({ ...options }, () => {
    func
  });
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

function getErrorMessage(err) {
  const endIndex = err.message.search('{');
  let message = err.message;
  if (endIndex >= 0) message = err.message.substring(0, endIndex);
  return message.charAt(0).toUpperCase() + message.slice(1);
}

function addToRecentTransactions(msg, tx) {
  const index = store.state.connection.recentTransactionsCount;
  let transaction = {
    message: msg,
    hash: '',
    loading: true,
    success: true,
  };
  tx.then((data) => {
    store.commit('setSuccess', { index, hash: data.transactionHash });
  }).catch(() => {
    store.commit('setError', index);
  });

  store.commit('addNewRecentTransaction', transaction);
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

const getSplitAddress = (address) => {
  let splitAddress = '';

  for (let i = 0; i < 4; i++) {
    splitAddress += address.charAt(i);
  }
  splitAddress += '...';
  for (let i = address.length - 4; i < address.length; i++) {
    splitAddress += address.charAt(i);
  }

  return splitAddress;
};

const fromUnixTimestampToDate = (unixTimestamp) => {
  return new Date(unixTimestamp * 1000);
};

const fromDateToUnixTimestamp = (date) => {
  return date.getTime() / 1000;
};

const isTheSameDate = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
  );
};

export {
  call,
  transaction,
  event,
  addTokenToMetaMask,
  ethPriceInUSD,
  getSplitAddress,
  fromUnixTimestampToDate,
  fromDateToUnixTimestamp,
  isTheSameDate,
};
