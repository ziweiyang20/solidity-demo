const { mockConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("depolying mock..............")
    const agt = await deploy("MockV3Aggregator", {
        contract: "MockV3Aggregator",
        from: deployer,
        log: true,
        args: [mockConfig.decimals, mockConfig.initialAnswer],
    })
    log("depolying mock success")
}

module.exports.tags = ["all", "mock"]
