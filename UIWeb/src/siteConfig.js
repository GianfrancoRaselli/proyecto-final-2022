import ganacheAddresses from '@/assets/addresses/ganache.json';
import sepoliaAddresses from '@/assets/addresses/sepolia.json';

// customizable
const forceProduction = false;

const serverUrlLocalhost = 'http://localhost:4000/';
const serverUrlProduction = 'https://proyecto-final-server-d91289e5e2f5.herokuapp.com/';

const ganacheNetwork = {
  id: '0x539',
  name: 'Ganache Testnet',
  coin: 'ETH',
  explorer: '',
};
const sepoliaNetwork = {
  id: '0xaa36a7',
  name: 'Sepolia Testnet',
  coin: 'SepoliaETH',
  explorer: 'https://sepolia.etherscan.io',
};

const firstBlockLocalhost = 0;
const firstBlockSepolia = 8505516;

const infuraProviderLocalhost = 'http://localhost:7545';
const infuraProviderProduction = 'https://sepolia.infura.io/v3/c2c820555fad43838ab62145a03e4a2a';

// computed
let isLocalhostTemp = window.location.href.includes('http://localhost:') || window.location.href.includes('https://localhost:');
if (forceProduction) isLocalhostTemp = false;
const isLocalhost = isLocalhostTemp;

const serverUrl = isLocalhost ? serverUrlLocalhost : serverUrlProduction;
const network = isLocalhost ? ganacheNetwork : sepoliaNetwork;
const firstBlock = isLocalhost ? firstBlockLocalhost : firstBlockSepolia;
const infuraProvider = isLocalhost ? infuraProviderLocalhost : infuraProviderProduction;
const fundFactoryAddress = isLocalhost ? ganacheAddresses.fundFactoryAddress : sepoliaAddresses.fundFactoryAddress;
const fundTokenAddress = isLocalhost ? ganacheAddresses.fundTokenAddress : sepoliaAddresses.fundTokenAddress;

export { isLocalhost, serverUrl, network, firstBlock, infuraProvider, fundFactoryAddress, fundTokenAddress };
