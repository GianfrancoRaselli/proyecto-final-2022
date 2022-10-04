import store from '@/store';
import axios from 'axios';
import { getErrorMessage } from 'web3-simple-helpers';
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
        if (
          !options ||
          !options.value ||
          options.value <= (await store.state.connection.web3.eth.getBalance(store.state.connection.address))
        ) {
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
            message: 'You do not have enough ' + store.getters.validChainCoin + ' to pay for the transaction',
            type: 'error',
          });
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

const validateForm = async (validations) => {
  if (await validations.$validate()) {
    return true;
  } else {
    addNotification({
      message: 'Fix fields with errors',
      type: 'error',
    });
    return false;
  }
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

function addToRecentTransactions(msg, tx) {
  const index = store.state.connection.recentTransactionsCount;
  let transaction = {
    message: msg,
    hash: '',
    loading: true,
    success: true,
    date: new Date(),
  };
  tx.then((data) => {
    store.commit('setRecentTransactionSuccess', { index, hash: data.transactionHash });
  }).catch(() => {
    store.commit('setRecentTransactionError', index);
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

const convertNumberToTwoDecimals = (number) => {
  if (number.toFixed(2).split('.')[1] === '00') return number.toFixed(0);
  return number.toFixed(2);
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
  validateForm,
  addTokenToMetaMask,
  ethPriceInUSD,
  convertNumberToTwoDecimals,
  fromUnixTimestampToDate,
  fromDateToUnixTimestamp,
  isTheSameDate,
};
