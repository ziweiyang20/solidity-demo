const { run } = require("hardhat")

const verify = async function (ca, args) {
    console.log(`verifiying contract`)
    try {
        await run("verify:verify", {
            address: ca,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("contract already verified")
        } else {
            console.error(e)
        }
    }
}

module.exports = { verify }
