// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;


contract BaseFundFactory {

  BaseFund[] public deployedBaseFunds;

  function getDeployedBaseFunds() public view returns (BaseFund[] memory) {
    return deployedBaseFunds;
  }

  /*function createBaseFund(uint _minimum) public {
    BaseFund newBaseFund = new BaseFund();
    deployedBaseFunds.push(newBaseFund);
  }*/

}


contract BaseFund {

  mapping(address => bool) public managers;
  bool public newManagersCanBeAdded;
  string public name;
  string public description;
  bool public managersCanSpendMoneyWithoutARequest;
  bool public onlyManagersCanCreateARequest;
  bool public onlyManagersCanVote;
  uint public minimumPercentageOfVotes;
  uint public minimumContributionToVote;


  struct Request {
    string description;
    address recipient;
    uint value;
    bool complete;
    mapping(address => bool) approvals;
    uint approvalsCount;
  }
  
  mapping(address => bool) public approvers;
  uint public approversCount;
  Request[] public requests;


  modifier onlyManagers() {
    require(managers[msg.sender], 'Only managers can access');
    _;
  }


  constructor(
    address[] memory _managers,
    bool _newManagersCanBeAdded,
    string memory _name,
    string memory _description,
    bool _managersCanSpendMoneyWithoutARequest,
    bool _onlyManagersCanCreateARequest,
    bool _onlyManagersCanVote,
    uint _minimumPercentageOfVotes,
    uint _minimumContributionToVote) {
      require(_minimumPercentageOfVotes < 101, 'Incorrect percentage');

      for (uint i; i < _managers.length;) {
        managers[_managers[i]] = true;

        unchecked {
          i++;
        }
      }
      newManagersCanBeAdded = _newManagersCanBeAdded;
      name = _name;
      description = _description;
      managersCanSpendMoneyWithoutARequest = _managersCanSpendMoneyWithoutARequest;
      onlyManagersCanCreateARequest = _onlyManagersCanCreateARequest;
      onlyManagersCanVote = _onlyManagersCanVote;
      minimumPercentageOfVotes = _minimumPercentageOfVotes;
      minimumContributionToVote = _minimumContributionToVote;
  }


  /*function contribute() public payable notManager {
    require(minimumContribution <= msg.value);

    if (!approvers[msg.sender]) {
      approvers[msg.sender] = true;
      approversCount++;
    }
  }*/

  function getRequestsCount() public view returns (uint) {
    return requests.length;
  }

  /*function createRequest(string memory _description, address _recipient, uint _value) public onlyManager {
    Request storage newRequest = requests.push();

    newRequest.description = _description;
    newRequest.recipient = _recipient;
    newRequest.value = _value;
    newRequest.complete = false;
    newRequest.approvalsCount = 0;
  }

  function approveRequest(uint _index) public notManager {
    Request storage request = requests[_index];

    require(approvers[msg.sender]);
    require(!request.complete);
    require(!request.approvals[msg.sender]);

    request.approvals[msg.sender] = true;
    request.approvalsCount++;
  }

  function finalizeRequest(uint _index) public onlyManager {
    Request storage request = requests[_index];

    require(!request.complete);
    require(request.approvalsCount > (approversCount / 2));

    payable(request.recipient).transfer(request.value);
    request.complete = true;
  }*/

}
