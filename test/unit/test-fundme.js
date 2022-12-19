const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", function () {
    let fundme, deployer, agt
    let ethValue = ethers.utils.parseUnits("1")

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture("all")
        fundme = await ethers.getContract("FundMe", deployer)
        agt = await ethers.getContract("MockV3Aggregator", deployer)
    })

    it("check agt", async function () {
        const fundmeAgt = await fundme.getAgt()
        assert.equal(fundmeAgt, agt.address)
    })

    it("expect fund fail", async function () {
        // await expect(fundme.fund()).to.be.revertedWith("you need more eth")
        await expect(fundme.fund()).to.be.reverted
    })

    it("fund", async function () {
        await fundme.fund({ value: ethValue })
        const deployerFund = await fundme.getFund(deployer)
        assert.equal(deployerFund.toString(), ethValue.toString())
    })

    describe("withdraw", function () {
        beforeEach(async function () {
            await fundme.fund({ value: ethValue })
        })

        it("withdraw", async function () {
            const beforeDeployerBalance = await fundme.provider.getBalance(
                deployer
            )
            const beforeFundMeBalance = await fundme.provider.getBalance(
                fundme.address
            )

            const withdraw = await fundme.withdraw()
            // const withdraw = await fundme.withdrawAll()
            const withdrawRes = await withdraw.wait(1)
            const { gasUsed, effectiveGasPrice } = withdrawRes
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const afterDeployerBalance = await fundme.provider.getBalance(
                deployer
            )

            const afterFundMeBalance = await fundme.provider.getBalance(
                fundme.address
            )

            // assert.equal(afterFundMeBalance, 0)
            // assert.equal(
            //     beforeDeployerBalance.add(beforeFundMeBalance).toString(),
            //     afterDeployerBalance.add(gasCost).toString()
            // )

            assert.equal(
                beforeFundMeBalance.sub(afterFundMeBalance).toString(),
                afterDeployerBalance
                    .sub(beforeDeployerBalance)
                    .add(gasCost)
                    .toString()
            )
        })

        it("fund and withdraw with users", async function () {
            const accounts = await ethers.getSigners()
            for (let index = 1; index < 10; index++) {
                const user = await fundme.connect(accounts[index])
                await user.fund({ value: ethValue })

                const userFund = await fundme.getFund(accounts[index].address)
                assert.equal(userFund.toString(), ethValue.toString())
            }

            // for (let index = 1; index < 10; index++) {
            //     const beforeUserBalance = await fundme.provider.getBalance(
            //         accounts[index].address
            //     )

            //     const user = await fundme.connect(accounts[index])
            //     const withdraw = await user.withdraw()
            //     const withdrawRes = await withdraw.wait(1)
            //     const { gasUsed, effectiveGasPrice } = withdrawRes
            //     const gasCost = gasUsed.mul(effectiveGasPrice)

            //     const afterUserBalance = await fundme.provider.getBalance(
            //         accounts[index].address
            //     )

            //     assert.equal(
            //         afterUserBalance
            //             .sub(beforeUserBalance)
            //             .add(gasCost)
            //             .toString(),
            //         ethValue.toString()
            //     )
            // }

            await fundme.withdrawAll()
            await expect(fundme.getFunder(0)).to.be.reverted
        })

        it("not owner withdrawAll", async function () {
            const accounts = await ethers.getSigners()
            const user = await fundme.connect(accounts[2])
            await expect(user.withdrawAll()).to.be.reverted
        })
    })
})
