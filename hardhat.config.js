require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    solidity: {
        compilers: [{ version: "0.6.6" }, { version: "0.8.8" }],
    },
    networks: {
        goerli: {
            url: process.env.GOERLI_RPC_URL,
            accounts: [process.env.GOERLI_PRIVATE_KEY],
            chainId: 5,
        },
        ganache: {
            url: process.env.GANACHE_RPC_URL,
            accounts: [process.env.GANACHE_PRIVATE_KEY],
            chainId: 1337,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    mocha: {
        timeout: 600000,
    },
}
