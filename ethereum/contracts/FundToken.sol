// SPDX-License-Identifier: ISC

// Solidity compiler version
pragma solidity 0.8.16;

// Imports

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Token contract
contract FundToken is Ownable, ERC20 {
  constructor() ERC20("Fund Token", "FT") {}

  function decimals() public pure override returns (uint8) {
    return 0;
  }

  function mint(address _account, uint256 _amount) public onlyOwner {
    _mint(_account, _amount);
  }

  function burn(address _account, uint256 _amount) public onlyOwner {
    _burn(_account, _amount);
  }
}
