const { network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../scripts/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    log(chainId)

    let dataFeedAddr
    let verifyFlag = false
    if (chainId === 31337) {
        const agt = await deployments.get("MockV3Aggregator")
        dataFeedAddr = agt.address
    } else {
        dataFeedAddr = networkConfig[chainId]["ethDataFeedAddr"]
    }

    const fundme = await deploy("FundMe", {
        from: deployer,
        args: [dataFeedAddr],
        log: true,
    })

    if (verifyFlag) {
        verify(fundme.address, [])
    }
}

module.exports.tags = ["all", "fundme"]
