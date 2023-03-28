import ganacheAddresses from '@/assets/addresses/ganache.json';
import goerliAddresses from '@/assets/addresses/goerli.json';

// customizable
const forceProduction = false;

const serverUrlLocalhost = 'http://localhost:4000/';
const serverUrlProduction = 'https://proyecto-final-2022-server.onrender.com/';

const ganacheNetwork = {
  id: '0x539',
  name: 'Ganache',
  coin: 'ETH',
  explorer: '',
};
const goerliNetwork = {
  id: '0x5',
  name: 'Goerli Testnet',
  coin: 'GoerliETH',
  explorer: 'https://goerli.etherscan.io',
};

const firstBlockLocalhost = 0;
const firstBlockGoerli = 8505516;

const infuraProviderLocalhost = 'http://localhost:7545';
const infuraProviderProduction = 'https://goerli.infura.io/v3/c2c820555fad43838ab62145a03e4a2a';

// computed
let isLocalhostTemp = window.location.href.includes('http://localhost:') || window.location.href.includes('https://localhost:');
if (forceProduction) isLocalhostTemp = false;
const isLocalhost = isLocalhostTemp;

const serverUrl = isLocalhost ? serverUrlLocalhost : serverUrlProduction;
const network = isLocalhost ? ganacheNetwork : goerliNetwork;
const firstBlock = isLocalhost ? firstBlockLocalhost : firstBlockGoerli;
const infuraProvider = isLocalhost ? infuraProviderLocalhost : infuraProviderProduction;
const fundFactoryAddress = isLocalhost ? ganacheAddresses.fundFactoryAddress : goerliAddresses.fundFactoryAddress;
const fundTokenAddress = isLocalhost ? ganacheAddresses.fundTokenAddress : goerliAddresses.fundTokenAddress;

export { isLocalhost, serverUrl, network, firstBlock, infuraProvider, fundFactoryAddress, fundTokenAddress };
