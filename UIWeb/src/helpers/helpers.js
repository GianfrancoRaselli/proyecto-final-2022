import store from '@/store';
import { convertEthPrice } from 'web3-simple-helpers/methods/general';
import connect from 'web3-simple-helpers/methods/connect';
import { addNotification } from '@/composables/useNotifications';
import { hasMetamask } from './connection';

import fundTokenABI from '../assets/abis/FundToken';
import { fundTokenAddress } from '../assets/lastAddresses';

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

function handleContractError(err, showError) {
  if (showError) addNotification({ message: err.message, type: 'error' });
  throw err;
}

const call = async (contract, method, params = [], options, fn) => {
  const contractInstance = await getContractInstance(contract, 'infura');
  if (contractInstance) {
    if (!fn) {
      try {
        return await connect.call(contractInstance, method, params, options);
      } catch (err) {
        handleContractError(err, true);
      }
    } else {
      return connect.call(contractInstance, method, params, options, fn, (err) => {
        handleContractError(err, true);
      });
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
            const tx = connect.transaction(contractInstance, method, params, store.state.connection.address, options, (err) => {
              if (showContractError) addNotification({ message: err.message, type: 'error' });
            });
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
  if (contractInstance) return connect.latestEvents(contractInstance, event, options, func);
};

const addTokenToMetaMask = (type = 'ERC20', options = { address: fundTokenAddress, symbol: 'FT', decimals: 0 }) => {
  return store.state.connection.provider.request({
    method: 'wallet_watchAsset',
    params: {
      type,
      options,
    },
  });
};

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

const ethPriceInUSD = async () => {
  return convertEthPrice('USD');
};

const convertNumberToTwoDecimals = (number) => {
  if (number.toFixed(2).split('.')[1] === '00') return number.toFixed(0);
  return number.toFixed(2);
};

const isTheSameDate = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
  );
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

export { call, transaction, event, validateForm, addTokenToMetaMask, ethPriceInUSD, convertNumberToTwoDecimals, isTheSameDate };
