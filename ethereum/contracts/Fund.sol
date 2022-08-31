// SPDX-License-Identifier: ISC

// Solidity compiler version
pragma solidity 0.8.16;

// Imports

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Fund contract -> they are deployed by the factory
contract Fund is Context, ReentrancyGuard {
  // Libraries

  using Counters for Counters.Counter;

  // Structs

  struct Request {
    string description;
    address petitioner;
    address recipient;
    uint256 valueToTransfer;
    uint256 transferredValue;
    bool complete;
    mapping(address => bool) approvals;
    Counters.Counter approvalsCount;
  }

  // Fund data

  string public name;
  string public description;
  uint256 public createdAt = block.timestamp;

  // Managers data

  address[] public managers;
  mapping(address => bool) public isManager;
  bool public managersCanBeAddedOrRemoved;

  // Contributors data

  address[] public contributors;
  mapping(address => uint256) public contributions;
  uint256 public totalContributions;

  // Requests data

  bool public managersCanTransferMoneyWithoutARequest;

  Request[] public requests;
  bool public requestsCanBeCreated;
  bool public onlyManagersCanCreateARequest;
  bool public onlyContributorsCanApproveARequest;
  uint256 public minimumContributionPercentageRequired;
  uint256 public minimumApprovalsPercentageRequired;

  // Events

  event NewManager(address indexed manager);

  event RemoveManager(address indexed manager);

  event Contribute(address indexed contributor, uint256 value);

  event Transfer(address indexed sender, address indexed to, uint256 value);

  event NewRequest(string description, address indexed petitioner, address indexed recipient, uint256 valueToTransfer);

  event ApproveRequest(uint256 requestIndex, address indexed approver);

  event FinalizeRequest(uint256 requestIndex, uint256 transferredValue);

  // Modifiers

  modifier onlyManagers() {
    require(isManager[_msgSender()], "Only managers can access");
    _;
  }

  constructor(
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
  ) {
    name = _name;
    description = _description;
    _addManagers(_managers);
    managersCanBeAddedOrRemoved = _managersCanBeAddedOrRemoved;
    managersCanTransferMoneyWithoutARequest = _managersCanTransferMoneyWithoutARequest;
    requestsCanBeCreated = _requestsCanBeCreated;
    onlyManagersCanCreateARequest = _onlyManagersCanCreateARequest;
    onlyContributorsCanApproveARequest = _onlyContributorsCanApproveARequest;
    minimumContributionPercentageRequired = _minimumContributionPercentageRequired;
    minimumApprovalsPercentageRequired = _minimumApprovalsPercentageRequired;
  }

  // Public functions

  function addNewManagers(address[] memory _managers) public {
    require(managersCanBeAddedOrRemoved, "New managers can not be added");
    require(isManager[_msgSender()], "Only managers can access");
    require(_managers.length > 0, "You have to send one or more addresses");

    _addManagers(_managers);
  }

  function removeManager(uint256 _index) public {
    require(managersCanBeAddedOrRemoved, "Managers can not be removed");
    require(isManager[_msgSender()], "Only managers can access");
    uint256 _managersCount = managersCount();
    require(
      _managersCount > 1 || (requestsCanBeCreated && !onlyManagersCanCreateARequest),
      "There would be no way to withdraw the money from the contract"
    );

    address _manager = managers[_index];

    delete isManager[_manager];
    unchecked {
      for (uint256 i = _index; i < _managersCount - 1; i++) {
        managers[i] = managers[i + 1];
      }
    }
    managers.pop();

    emit RemoveManager(_manager);
  }

  function managersCount() public view returns (uint256) {
    return managers.length;
  }

  function getManagers() public view returns (address[] memory) {
    return managers;
  }

  function contribute() public payable {
    _contribute(_msgSender());
  }

  function contributeFor(address _for) public payable {
    _contribute(_for);
  }

  function contributorsCount() public view returns (uint256) {
    return contributors.length;
  }

  function getContributors() public view returns (address[] memory) {
    return contributors;
  }

  function balance() public view returns (uint256) {
    return address(this).balance;
  }

  function transfer(address _to, uint256 _value) public {
    require(managersCanTransferMoneyWithoutARequest, "Managers can not transfer money without a request");
    require(isManager[_msgSender()], "Only managers can access");

    payable(_to).transfer(_value);

    emit Transfer(_msgSender(), _to, _value);
  }

  function createRequest(
    string memory _description,
    address _recipient,
    uint256 _valueToTransfer
  ) public {
    require(requestsCanBeCreated, "Requests can not be created");

    bool _isManager = isManager[_msgSender()];
    require(
      !onlyManagersCanCreateARequest || (onlyManagersCanCreateARequest && _isManager),
      "Only managers can create a request"
    );

    Request storage newRequest = requests.push();

    newRequest.description = _description;
    newRequest.petitioner = _msgSender();
    newRequest.recipient = _recipient;
    newRequest.valueToTransfer = _valueToTransfer;

    emit NewRequest(_description, _msgSender(), _recipient, _valueToTransfer);
  }

  function requestsCount() public view returns (uint256) {
    return requests.length;
  }

  /*function getRequests() public view returns (Request[] memory) {
    return requests;
  }*/

  function approveRequest(uint256 _index) public {
    Request storage request = requests[_index];

    require(!request.complete, "The request has already been completed");
    require(
      (contributions[_msgSender()] / totalContributions) * 100 >= minimumContributionPercentageRequired ||
        (!onlyContributorsCanApproveARequest && isManager[_msgSender()]),
      "You can not approve a request"
    );
    require(!request.approvals[_msgSender()], "You have already approved this request");

    request.approvals[_msgSender()] = true;
    request.approvalsCount.increment();

    emit ApproveRequest(_index, _msgSender());
  }

  function finalizeRequest(uint256 _index) public nonReentrant {
    Request storage request = requests[_index];

    require(request.petitioner == _msgSender(), "You are not the petitioner of the request");
    require(!request.complete, "The request has already been completed");
    if (onlyContributorsCanApproveARequest) {
      require(
        (request.approvalsCount.current() / contributorsCount()) * 100 >= minimumApprovalsPercentageRequired,
        "The request has not been approved yet"
      );
    } else {
      require(
        (request.approvalsCount.current() / (managersCount() + contributorsCount())) * 100 >= minimumApprovalsPercentageRequired,
        "The request has not been approved yet"
      );
    }

    uint256 _valueToTransfer = request.valueToTransfer;
    if (_valueToTransfer > balance()) {
      _valueToTransfer = balance();
    }

    payable(request.recipient).transfer(_valueToTransfer);
    request.transferredValue = _valueToTransfer;
    request.complete = true;

    emit FinalizeRequest(_index, _valueToTransfer);
  }

  // Private functions

  function _addManagers(address[] memory _managers) private {
    for (uint256 i; i < _managers.length; ) {
      if (!isManager[_managers[i]]) {
        managers.push(_managers[i]);
        isManager[_managers[i]] = true;

        emit NewManager(_managers[i]);
      }

      unchecked {
        i++;
      }
    }
  }

  function _contribute(address _contributor) private {
    require(msg.value > 0, "The contribution must be greater than zero");

    if (contributions[_contributor] == 0) {
      contributors.push(_contributor);
    }
    contributions[_contributor] += msg.value;
    totalContributions += msg.value;

    emit Contribute(_contributor, msg.value);
  }
}
