import store from '@/store';
import { addNotification } from '@/composables/useNotifications';
import axios from 'axios';

const call = (contract, method, options) => {
  try {
    return getContract(contract).methods[method]().call(options);
  } catch (err) {
    showErrorNotification(err);

    throw err;
  }
};

const transaction = async (contract, method, params, options) => {
  try {
    await getContract(contract)
      .methods[method](...params)
      .call({ from: store.state.connection.address, ...options });
  } catch (err) {
    showErrorNotification(err);

    throw err;
  }

  return getContract(contract)
    .methods[method](...params)
    .send({ from: store.state.connection.address, ...options });
};

const event = (contract, event, options, func) => {
  return getContract(contract).events[event]({ fromBlock: 'latest', ...options }, func);
};

function getContract(contract) {
  if (contract === 'fundFactory') return store.state.connection.fundFactory;
  else {
    //
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

const ethPriceInUSD = async () => {
  return (await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')).data.USD;
};

export { call, transaction, event, ethPriceInUSD };
