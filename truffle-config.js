require('dotenv').config();
const SEED = process.env.SEED

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_build_directory:"./src/assets/build",
  networks: {
    avax: {
      provider: () => new HDWalletProvider(SEED,"https://api.avax-test.network/ext/bc/C/rpc" ),
      network_id:43113

    }
  },

  mocha: {
  },

  compilers: {
    solc: {
      version: "0.8.18"    
    }
  },
};
