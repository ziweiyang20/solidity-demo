// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library FundMeUtil {
    function getPrice() public view returns (uint256) {
        (, int256 price, , , ) = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        ).latestRoundData();
        return uint256(price * 1e10);
    }

    function getUsdWithEth(uint256 amount) public view returns (uint256) {
        uint256 ethPrice = getPrice();
        return uint256(amount * ethPrice) / 1e18;
    }

    function getDecimals() public view returns (uint8) {
        return
            AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e)
                .decimals();
    }

    function getVersion() public view returns (uint256) {
        return
            AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e)
                .version();
    }
}
