import store from '@/store';
import { addNotification } from '@/composables/useNotifications';
import axios from 'axios';

const call = async (contract, method, options) => {
  const contractInstance = await getContractInstance(contract);
  try {
    return contractInstance.methods[method]().call(options);
  } catch (err) {
    showErrorNotification(err);
    throw err;
  }
};

const transaction = async (contract, method, params, options) => {
  const contractInstance = await getContractInstance(contract);
  try {
    await contractInstance.methods[method](...params).call({ from: store.state.connection.address, ...options });
  } catch (err) {
    showErrorNotification(err);
    throw err;
  }
  return contractInstance.methods[method](...params).send({ from: store.state.connection.address, ...options });
};

const event = async (contract, event, options, func) => {
  const contractInstance = await getContractInstance(contract);
  return contractInstance.events[event]({ fromBlock: 'latest', ...options }, func);
};

async function getContractInstance(contract) {
  if (contract === 'FundFactory') return store.state.connection.fundFactory;
  const contractJSON = await import('../assets/abis/' + contract.name);
  return new store.state.connection.web3.eth.Contract(contractJSON.abi, contract.address);
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
