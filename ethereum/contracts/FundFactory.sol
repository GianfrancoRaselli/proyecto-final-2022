// SPDX-License-Identifier: ISC

// Solidity compiler version
pragma solidity 0.8.16;

// Imports

// Import this file to use console.log
//import "hardhat/console.sol"; // console.log("Block timestamp is %o", block.timestamp);
import {Fund} from "./Fund.sol";

// Contract factory -> contract to deploy
contract FundFactory {
  // All fund contracts created are stored here
  Fund[] public deployedFunds;

  event NewFund(address indexed fundAddress, string name, string description, address indexed creator, uint256 createdAt);

  // Function to create new fund and store it in the factory
  function createFund(
    string memory _name,
    string memory _description,
    address[] memory _managers,
    bool _managersCanBeAddedOrRemoved,
    bool _managersCanTransferMoneyWithoutARequest,
    bool _requestsCanBeCreated,
    bool _onlyManagersCanCreateARequest,
    bool _onlyContributorsCanApproveARequest,
    uint256 _minimumContributionPercentageRequired,
    uint256 _minimumApprovalsPercentageRequired
  ) public {
    require(
      (_managersCanTransferMoneyWithoutARequest && _managers.length > 0) ||
        (_requestsCanBeCreated && (!_onlyManagersCanCreateARequest || _managers.length > 0)),
      "There would be no way to withdraw the money from the contract"
    );
    require(_minimumContributionPercentageRequired < 101, "Incorrect contribution percentage");
    require(_minimumApprovalsPercentageRequired < 101, "Incorrect approvals percentage");

    Fund _newFund = new Fund(
      _name,
      _description,
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

    emit NewFund(address(_newFund), _name, _description, msg.sender, block.timestamp);
  }

  function getDeployedFundsCount() public view returns (uint256) {
    return deployedFunds.length;
  }

  function getDeployedFunds() public view returns (Fund[] memory) {
    return deployedFunds;
  }
}
