// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

// import "./FundUtil.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

contract FundMe {
    // using FundUtil for uint256;

    uint256 private constant MIN_USD = 1 * 1e18;
    address[] private funders;
    mapping(address => uint256) private funds;

    address private immutable owner;
    AggregatorV3Interface private agt;

    constructor(address dataFeedAddr) {
        owner = msg.sender;
        agt = AggregatorV3Interface(dataFeedAddr);
    }

    function fund() public payable {
        // require(msg.value.getUsdWithEth() > MIN_USD, "It's not enough");
        require(getUsdWithEth(msg.value) > MIN_USD, "It's not enough");
        funders.push(msg.sender);
        funds[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint256 ethVaule = funds[msg.sender];
        funds[msg.sender] = 0;
        (bool result, ) = payable(msg.sender).call{value: ethVaule}("");
        require(result, "Withdraw failed!");
    }

    function withdrawAll() public onlyOwner {
        address[] memory temp_funders = funders;
        for (uint256 index = 0; index < temp_funders.length; index++) {
            funds[funders[index]] = 0;
        }

        funders = new address[](0);

        (bool result, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(result, "Withdraw failed!");
    }

    function getPrice() public view returns (uint256) {
        (, int256 price, , , ) = agt.latestRoundData();
        return uint256(price * 1e10);
    }

    function getUsdWithEth(uint256 amount) public view returns (uint256) {
        uint256 ethPrice = getPrice();
        // console.log(ethPrice);
        return uint256(amount * ethPrice) / 1e18;
    }

    function getDecimals() public view returns (uint8) {
        return agt.decimals();
    }

    function getVersion() public view returns (uint256) {
        return agt.version();
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "It's only for owner!");
        _;
    }

    function getFunder(uint256 index) public view returns (address) {
        return funders[index];
    }

    function getFund(address userAddr) public view returns (uint256) {
        return funds[userAddr];
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getAgt() public view returns (AggregatorV3Interface) {
        return agt;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
