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

  uint256 public earnedMoney;

  FundToken public immutable fundToken;
  uint256 public fundTokenPrice; // price in weis

  uint256 public constant createFundPrice = 1; // price in fundTokens

  // All fund contracts created are stored here
  Fund[] public deployedFunds;

  // Events

  event NewFundTokenPrice(uint256 fundTokenPrice);

  event FundTokensBought(address indexed buyer, uint256 fundTokenPrice, uint256 fundTokensBought);

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
    require(_fundTokens > 0, "Se debe comprar al menos 1 FundToken");
    uint256 _fundTokenPrice = fundTokenPrice;
    require(msg.value == _fundTokens * _fundTokenPrice, "Pago insuficiente");

    fundToken.mint(msg.sender, _fundTokens);
    earnedMoney += msg.value;

    emit FundTokensBought(msg.sender, _fundTokenPrice, _fundTokens);
  }

  function balance() public view returns (uint256) {
    return address(this).balance;
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
    require(bytes(_name).length != 0, "El nombre del fondo no puede estar vac\xc3\xado");
    require(
      (_managersCanTransferMoneyWithoutARequest && _managers.length > 0) ||
        (_requestsCanBeCreated && (!_onlyManagersCanCreateARequest || _managers.length > 0)),
      "No habr\xc3\xada manera de retirar el dinero del contrato"
    );
    require(_minimumContributionPercentageRequired < 101, "Porcentaje de contribuci\xc3\xb3n incorrecto");
    require(_minimumApprovalsPercentageRequired < 101, "Porcentaje de aprobaciones incorrecto");

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
