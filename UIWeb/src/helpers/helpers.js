import BigNumber from 'bignumber.js';
import router from '@/router';
import store from '@/store';
import { convertEthPrice } from 'web3-simple-helpers/methods/general';
import connect from 'web3-simple-helpers/methods/connect';
import { addNotification } from '@/composables/useNotifications';
import { hasMetamask } from './connection';
import { firstBlock } from '@/siteConfig';

import fundTokenABI from '@/assets/abis/FundToken';
import { fundTokenAddress } from '@/siteConfig';

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
            BigNumber(await store.state.connection.web3.eth.getBalance(store.getters.address)),
          )
        ) {
          const tx = connect.transaction(
            await getContract(contract, 'metamask'),
            method,
            params,
            store.getters.address,
            options,
            (err) => {
              if (showContractError) addNotification({ message: err.message, type: 'error' });
            },
          );
          addToRecentTransactions(messageInfo, tx);
          return tx;
        } else {
          addNotification({
            message: 'No posee suficientes ' + store.getters.validChainCoin + ' para costear la transacción',
            type: 'error',
          });
        }
      } else {
        addNotification({
          message: 'Conectese a ' + store.getters.validChainName + ' para enviar una transacción',
          type: 'warning',
        });
      }
    } else {
      addNotification({
        message: 'Conectese a MetaMask para enviar una transacción',
        type: 'warning',
      });
    }
  } else {
    addNotification({
      message: 'Instale MetaMask para enviar una transacción',
      type: 'warning',
    });
  }
  throw new Error('La transacción no pudo ser enviada');
};

const event = async (contract, event, options, func, pastEvents) => {
  if (pastEvents) return connect.pastEvents(await getContract(contract), event, { fromBlock: firstBlock, ...options }, func);
  if (store.getters.isConnected) return connect.latestEvents(await getContract(contract, 'metamask'), event, options, func);
  return null;
};

const addTokenToMetaMask = (
  type = 'ERC20',
  options = {
    address: fundTokenAddress,
    symbol: 'FT',
    decimals: 0,
    image: 'https://proyecto-final-blockchain.netlify.app/img/fundtoken.13ec71f1.png',
  },
) => {
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

const removeInitialAndFinalZeros = (number) => {
  const numberArray = number.split('.');
  const initialNumberWithoutZeros = removeInitialZeros(numberArray[0]);
  let finalNumberWithoutZeros = '';
  if (numberArray[1]) finalNumberWithoutZeros = removeFinalZeros(numberArray[1]);
  let numberToReturn = initialNumberWithoutZeros;
  if (finalNumberWithoutZeros) numberToReturn = numberToReturn + '.' + finalNumberWithoutZeros;
  return numberToReturn;
};

const removeInitialZeros = (number) => {
  let zerosToRemove = 0;
  for (let i = 0; i < number.length - 1; i++) {
    if (number.charAt(i) === '0') {
      zerosToRemove++;
    } else {
      break;
    }
  }
  return number.substring(zerosToRemove);
};

const removeFinalZeros = (number) => {
  let zerosToRemove = 0;
  for (let i = number.length - 1; i >= 0; i--) {
    if (number.charAt(i) === '0') {
      zerosToRemove++;
    } else {
      break;
    }
  }
  return number.split('').reverse().join('').substring(zerosToRemove).split('').reverse().join('');
};

const convertNumberToMaxDecimals = (number, maxNumOfDecimals) => {
  if (maxNumOfDecimals === 0) return number.toFixed(0);
  let finalNumOfDecimals = 0;
  const decimals = number.toFixed(maxNumOfDecimals).split('.')[1];
  if (!decimals) return number.toFixed(maxNumOfDecimals);
  for (let i = maxNumOfDecimals - 1; i >= 0; i--) {
    if (decimals.charAt(i) !== '0') {
      finalNumOfDecimals = i + 1;
      break;
    }
  }
  return number.toFixed(finalNumOfDecimals);
};

const separateInteger = (integer) => {
  let numberToReturn = '';
  let inverseNumberArray = integer.toString().split('').reverse();
  let aux = 0;
  let i = 0;
  for (let number of inverseNumberArray) {
    aux++;
    i++;
    numberToReturn += number;
    if (aux === 3 && i < inverseNumberArray.length) {
      numberToReturn += '.';
      aux = 0;
    }
  }
  return numberToReturn.split('').reverse().join('');
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
      message: 'Corrige los campos con errores',
      type: 'error',
    });
    return false;
  }
};

const goToProfile = (address) => {
  const routeData = router.resolve({
    name: 'Profile',
    params: { address },
  });
  window.open(routeData.href, '_blank');
};

const goToFund = (address) => {
  const routeData = router.resolve({
    name: 'Fund',
    params: { fundAddress: address },
  });
  window.open(routeData.href, '_blank');
};

const getFundType = (fund) => {
  if (
    fund.managersCanBeAddedOrRemoved &&
    fund.managersCanTransferMoneyWithoutARequest &&
    !fund.requestsCanBeCreated &&
    !fund.onlyManagersCanCreateARequest &&
    !fund.onlyContributorsCanApproveARequest &&
    fund.minimumContributionPercentageRequired === '0' &&
    fund.minimumApprovalsPercentageRequired === '0'
  )
    return {
      id: 'friends',
      type: 'Amigos',
      class: 'success',
    };
  if (
    !fund.managersCanBeAddedOrRemoved &&
    !fund.managersCanTransferMoneyWithoutARequest &&
    fund.requestsCanBeCreated &&
    fund.onlyManagersCanCreateARequest &&
    fund.onlyContributorsCanApproveARequest
  )
    return {
      id: 'campaign',
      type: 'Campaña',
      class: 'warning',
    };
  if (
    fund.managersCanBeAddedOrRemoved &&
    fund.managersCanTransferMoneyWithoutARequest &&
    fund.requestsCanBeCreated &&
    fund.onlyManagersCanCreateARequest &&
    fund.onlyContributorsCanApproveARequest
  )
    return {
      id: 'donation',
      type: 'Donación',
      class: 'danger',
    };
  return {
    id: 'personalized',
    type: 'Personalizado',
    class: 'dark',
  };
};

const copyAddress = (address) => {
  navigator.clipboard.writeText(address);
  addNotification({
    message: 'Dirección copiada al portapapeles',
    type: 'success',
  });
};

export {
  call,
  transaction,
  event,
  validateForm,
  addTokenToMetaMask,
  ethPriceInUSD,
  removeInitialAndFinalZeros,
  removeInitialZeros,
  removeFinalZeros,
  convertNumberToMaxDecimals,
  separateInteger,
  areTheSameDates,
  goToProfile,
  goToFund,
  getFundType,
  copyAddress,
};
