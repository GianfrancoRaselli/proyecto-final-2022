// SPDX-License-Identifier: ISC

// Solidity compiler version
pragma solidity 0.8.16;

// Imports

// Import this file to use console.log
//import "hardhat/console.sol"; // console.log("Block timestamp is %o", block.timestamp);
import {FundToken} from "./FundToken.sol";
import {Fund} from "./Fund.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Contract factory -> contract to deploy
contract FundFactory is Ownable {
  // FundToken data

  FundToken public immutable fundToken;
  uint256 public fundTokenPrice; // price in weis

  uint256 public constant createFundPrice = 1; // price in fundTokens

  // All fund contracts created are stored here
  Fund[] public deployedFunds;

  // Events

  event NewFundTokenPrice(uint256 fundTokenPrice);

  event FundTokensBuyed(address indexed buyer, uint256 fundTokensBuyed);

  event NewFund(address fundAddress, string name, address indexed creator, uint256 createdAt);

  constructor(uint256 _fundTokenPrice) payable {
    fundToken = new FundToken();
    fundTokenPrice = _fundTokenPrice;
  }

  // Functions

  function changeFundTokenPrice(uint256 _newFundTokenPrice) public onlyOwner {
    fundTokenPrice = _newFundTokenPrice;

    emit NewFundTokenPrice(_newFundTokenPrice);
  }

  function buyFundTokens(uint256 _fundTokens) public payable {
    require(_fundTokens > 0, "At least 1 FundToken must be purchased");
    require(msg.value == _fundTokens * fundTokenPrice, "Underpayment");

    FundToken _fundToken = fundToken;
    _fundToken.mint(msg.sender, _fundTokens);

    emit FundTokensBuyed(msg.sender, _fundTokens);
  }

  function withdrawMoney() public onlyOwner {
    payable(owner()).transfer(address(this).balance);
  }

  // Function to create new fund and store it in the factory
  function createFund(
    string memory _name,
    address[] memory _managers,
    bool _managersCanBeAddedOrRemoved,
    bool _managersCanTransferMoneyWithoutARequest,
    bool _requestsCanBeCreated,
    bool _onlyManagersCanCreateARequest,
    bool _onlyContributorsCanApproveARequest,
    uint256 _minimumContributionPercentageRequired,
    uint256 _minimumApprovalsPercentageRequired
  ) public {
    require(bytes(_name).length != 0, "The name of the fund can not be empty");
    require(
      (_managersCanTransferMoneyWithoutARequest && _managers.length > 0) ||
        (_requestsCanBeCreated && (!_onlyManagersCanCreateARequest || _managers.length > 0)),
      "There would be no way to withdraw the money from the contract"
    );
    require(_minimumContributionPercentageRequired < 101, "Incorrect contribution percentage");
    require(_minimumApprovalsPercentageRequired < 101, "Incorrect approvals percentage");

    fundToken.burn(msg.sender, createFundPrice);

    Fund _newFund = new Fund(
      _name,
      msg.sender,
      _managers,
      _managersCanBeAddedOrRemoved,
      _managersCanTransferMoneyWithoutARequest,
      _requestsCanBeCreated,
      _onlyManagersCanCreateARequest,
      _onlyContributorsCanApproveARequest,
      _minimumContributionPercentageRequired,
      _minimumApprovalsPercentageRequired
    );
    deployedFunds.push(_newFund);

    emit NewFund(address(_newFund), _name, msg.sender, block.timestamp);
  }

  function getDeployedFundsCount() public view returns (uint256) {
    return deployedFunds.length;
  }

  function getDeployedFunds() public view returns (Fund[] memory) {
    return deployedFunds;
  }
}
