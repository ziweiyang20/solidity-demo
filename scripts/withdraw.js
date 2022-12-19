const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()

    const fundme = await ethers.getContract("FundMe", deployer)
    await fundme.withdraw()

    // const balance = await ethers.provider.getBalance(deployer)
    // console.log(balance.toString())
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
