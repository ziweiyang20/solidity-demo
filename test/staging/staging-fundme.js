const { deployments, getNamedAccounts, ethers } = require("hardhat")

describe("staging-FundMe", function () {
    let fundme, deployer
    let ethValue = ethers.utils.parseUnits("0.01")

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture("all")
        fundme = await ethers.getContract("FundMe", deployer)
    })

    it("staging-fund", async function () {
        const block = await fundme.fund({ value: ethValue })
        await fundme.withdraw()
    })
})
