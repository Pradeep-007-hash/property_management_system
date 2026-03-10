import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],

  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },

  networks: {
    // Local simulated Ethereum mainnet
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },

    // Local simulated Optimism
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },

    // Sepolia Testnet
    sepolia: {
      type: "http",
      chainType: "l1",
      url: "https://sepolia.infura.io/v3/cb4e5d62e5e34edda4ff0f1b6b8c3b0f",
      accounts: [
        "8282ee7e001ad396eeaf3d6af82d434b4c685a9e05c3458fdbc364054b96aaba"
      ],
      gas: 5000000,
      gasPrice: 3000000000
    },
  },
});
