// customizable
const forceProduction = false;

const dbNameLocalhost = "development";
const dbNameProduction = "production";

const infuraProviderLocalhost = "http://127.0.0.1:7545";
const infuraProviderProduction = "https://goerli.infura.io/v3/c2c820555fad43838ab62145a03e4a2a";

// computed
let isLocalhostTemp = process.env.IS_LOCALHOST === "true";
if (forceProduction) isLocalhostTemp = false;
const isLocalhost = isLocalhostTemp;

const dbName = isLocalhost ? dbNameLocalhost : dbNameProduction;
const infuraProvider = isLocalhost ? infuraProviderLocalhost : infuraProviderProduction;

module.exports = { isLocalhost, dbName, infuraProvider };
