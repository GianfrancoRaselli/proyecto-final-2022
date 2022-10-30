import BigNumber from 'bignumber.js';
import store from '@/store';
import { convertEthPrice } from 'web3-simple-helpers/methods/general';
import connect from 'web3-simple-helpers/methods/connect';
import { addNotification } from '@/composables/useNotifications';
import { hasMetamask } from './connection';

import fundTokenABI from '../assets/abis/FundToken';
import { fundTokenAddress } from '../assets/lastAddresses';

async function getContract(contract, provider = 'infura') {
  if (provider === 'metamask' && store.state.connection.provider) {
    if (contract === 'FundFactory') return store.state.connection.fundFactory;
    if (contract === 'FundToken') return new store.state.connection.web3.eth.Contract(fundTokenABI, fundTokenAddress);
  }

  if (contract === 'FundFactory') return store.state.connection.infuraFundFactory;
  if (contract === 'FundToken') return new store.state.connection.infuraWeb3.eth.Contract(fundTokenABI, fundTokenAddress);

  return {
    provider:
      provider === 'metamask' && store.state.connection.provider
        ? store.state.connection.provider
        : store.state.connection.infuraProvider,
    abi: (await import('../assets/abis/' + contract.name)).default,
    address: contract.address,
  };
}

const call = async (contract, method, params = [], options, fn) => {
  const handleError = (err, showError) => {
    if (showError) addNotification({ message: err.message, type: 'error' });
    throw err;
  };

  if (!fn) {
    try {
      return await connect.call(await getContract(contract), method, params, options);
    } catch (err) {
      handleError(err, true);
    }
  } else {
    return connect.call(await getContract(contract), method, params, options, fn, (err) => {
      handleError(err, true);
    });
  }
};

const transaction = async (contract, method, params = [], options, showContractError = true, messageInfo) => {
  const addToRecentTransactions = (msg, tx) => {
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
  };

  if (hasMetamask()) {
    if (store.getters.isConnected) {
      if (store.getters.isConnectedToTheValidChain) {
        if (
          !options ||
          !options.value ||
          BigNumber(options.value).isLessThanOrEqualTo(
            BigNumber(await store.state.connection.web3.eth.getBalance(store.state.connection.address)),
          )
        ) {
          const tx = connect.transaction(
            await getContract(contract, 'metamask'),
            method,
            params,
            store.state.connection.address,
            options,
            (err) => {
              if (showContractError) addNotification({ message: err.message, type: 'error' });
            },
          );
          addToRecentTransactions(messageInfo, tx);
          return tx;
        } else {
          addNotification({
            message: 'You do not have enough ' + store.getters.validChainCoin + ' to pay for the transaction',
            type: 'error',
          });
        }
      } else {
        addNotification({
          message: 'Connect to ' + store.getters.validChainName + ' to send a transaction',
          type: 'warning',
        });
      }
    } else {
      addNotification({
        message: 'Connect to MetaMask to send a transaction',
        type: 'warning',
      });
    }
  } else {
    addNotification({
      message: 'Install MetaMask to send a transaction',
      type: 'warning',
    });
  }
  throw new Error('The transaction could not be sent');
};

const event = async (contract, event, options, func) => {
  return connect.latestEvents(await getContract(contract, 'metamask'), event, options, func);
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

const ethPriceInUSD = async () => {
  return convertEthPrice('USD');
};

const convertNumberToMaxDecimals = (number, maxNumOfDecimals) => {
  if (maxNumOfDecimals === 0) return number.toFixed(0);
  let finalNumOfDecimals = 0;
  const decimals = number.toFixed(maxNumOfDecimals).split('.')[1];
  for (let i = maxNumOfDecimals - 1; i >= 0; i--) {
    if (decimals.charAt(i) !== '0') {
      finalNumOfDecimals = i + 1;
      break;
    }
  }
  return number.toFixed(finalNumOfDecimals);
};

const areTheSameDates = (...args) => {
  args.forEach((date, index) => {
    if (typeof date === 'object') {
      args[index] = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    } else if (typeof date === 'string') {
      args[index] = {
        year: date.split('-')[0],
        month: date.split('-')[1],
        day: date.split('-')[2],
      };
    }
  });

  return args[0].year == args[1].year && args[0].month == args[1].month && args[0].day == args[1].day;
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

export { call, transaction, event, validateForm, addTokenToMetaMask, ethPriceInUSD, convertNumberToMaxDecimals, areTheSameDates };
