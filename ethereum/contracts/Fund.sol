// SPDX-License-Identifier: ISC

// Solidity compiler version
pragma solidity 0.8.16;

// Imports

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Fund contract -> they are deployed by the factory
contract Fund is ReentrancyGuard {
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
  address public immutable creator;
  uint256 public immutable createdAt = block.timestamp;

  // Managers data

  address[] public managers;
  mapping(address => bool) public isManager;
  bool public immutable managersCanBeAddedOrRemoved;

  // Contributors data

  address[] public contributors;
  mapping(address => uint256) public contributions;
  uint256 public totalContributions;

  // Requests data

  bool public immutable managersCanTransferMoneyWithoutARequest;

  Request[] public requests;
  bool public immutable requestsCanBeCreated;
  bool public immutable onlyManagersCanCreateARequest;
  bool public immutable onlyContributorsCanApproveARequest;
  uint256 public immutable minimumContributionPercentageRequired;
  uint256 public immutable minimumApprovalsPercentageRequired;

  // Events

  event NewManager(address indexed manager);

  event RemoveManager(address indexed manager);

  event Contribute(address indexed contributor, uint256 value);

  event Transfer(address indexed sender, address indexed to, uint256 value);

  event NewRequest(
    uint256 indexed requestIndex,
    string description,
    address indexed petitioner,
    address indexed recipient,
    uint256 valueToTransfer
  );

  event ApproveRequest(uint256 indexed requestIndex, address indexed approver);

  event FinalizeRequest(uint256 indexed requestIndex, uint256 transferredValue);

  // Modifiers

  modifier onlyManagers() {
    require(isManager[msg.sender], "Solo los administradores pueden acceder");
    _;
  }

  constructor(
    string memory _name,
    address _creator,
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
    creator = _creator;
    for (uint256 i; i < _managers.length; ) {
      managers.push(_managers[i]);
      isManager[_managers[i]] = true;

      unchecked {
        i++;
      }
    }
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
    require(managersCanBeAddedOrRemoved, "No se pueden agregar nuevos administradores");
    require(isManager[msg.sender], "Solo los administradores pueden acceder");
    require(_managers.length > 0, "Tienes que enviar una o m\xc3\xa1s direcciones");

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

  function removeManager(uint256 _index) public {
    require(managersCanBeAddedOrRemoved, "Los administradores no pueden ser eliminados");
    require(isManager[msg.sender], "Solo los administradores pueden acceder");
    uint256 _managersCount = managersCount();
    require(
      _managersCount > 1 || (requestsCanBeCreated && !onlyManagersCanCreateARequest),
      "No habr\xc3\xada manera de retirar el dinero del contrato"
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
    _contribute(msg.sender);
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
    require(managersCanTransferMoneyWithoutARequest, "Los administradores no pueden transferir dinero sin una solicitud");
    require(isManager[msg.sender], "Solo los administradores pueden acceder");

    payable(_to).transfer(_value);

    emit Transfer(msg.sender, _to, _value);
  }

  function createRequest(string memory _description, address _recipient, uint256 _valueToTransfer) public {
    require(requestsCanBeCreated, "No se pueden crear solicitudes");

    bool _isManager = isManager[msg.sender];
    require(
      !onlyManagersCanCreateARequest || (onlyManagersCanCreateARequest && _isManager),
      "Solo los administradores pueden crear una solicitud"
    );

    Request storage newRequest = requests.push();

    newRequest.description = _description;
    newRequest.petitioner = msg.sender;
    newRequest.recipient = _recipient;
    newRequest.valueToTransfer = _valueToTransfer;

    unchecked {
      emit NewRequest(requests.length - 1, _description, msg.sender, _recipient, _valueToTransfer);
    }
  }

  function requestsCount() public view returns (uint256) {
    return requests.length;
  }

  /*function getRequests() public view returns (Request[] memory) {
    return requests;
  }*/

  function approveRequest(uint256 _index) public {
    Request storage request = requests[_index];

    require(!request.complete, "La solicitud ya ha sido completada");
    require(!request.approvals[msg.sender], "Ya has aprobado esta solicitud");
    uint256 _minimumContributionPercentageRequired = minimumContributionPercentageRequired;
    uint256 _totalContributions = totalContributions;
    require(
      (!onlyContributorsCanApproveARequest && isManager[msg.sender]) ||
        _minimumContributionPercentageRequired == 0 ||
        (_totalContributions > 0 &&
          (contributions[msg.sender] * 100) / _totalContributions >= _minimumContributionPercentageRequired),
      "No alcanzas el porcentaje m\xc3\xadnimo de contribuci\xc3\xb3n y/o no eres administrador"
    );

    request.approvals[msg.sender] = true;
    request.approvalsCount.increment();

    emit ApproveRequest(_index, msg.sender);
  }

  function getRequestApproval(uint256 _index, address _approver) public view returns (bool) {
    return requests[_index].approvals[_approver];
  }

  function finalizeRequest(uint256 _index) public nonReentrant {
    Request storage request = requests[_index];

    require(request.petitioner == msg.sender, "No eres el solicitante de la solicitud");
    require(!request.complete, "La solicitud ya ha sido completada");
    uint256 _totalCount;
    if (onlyContributorsCanApproveARequest) {
      _totalCount = contributorsCount();
    } else {
      _totalCount = contributorsCount();

      for (uint256 i; i < managers.length; ) {
        if (!(contributions[managers[i]] > 0)) {
          _totalCount++;
        }

        unchecked {
          i++;
        }
      }
    }
    require(
      _totalCount == 0 || (request.approvalsCount.current() * 100) / _totalCount >= minimumApprovalsPercentageRequired,
      "La solicitud a\xc3\xban no ha sido aprobada"
    );

    uint256 _valueToTransfer = request.valueToTransfer;
    if (_valueToTransfer > balance()) {
      _valueToTransfer = balance();
    }

    payable(request.recipient).transfer(_valueToTransfer);
    request.transferredValue = _valueToTransfer;
    request.complete = true;

    emit FinalizeRequest(_index, _valueToTransfer);
  }

  function getSummary()
    public
    view
    returns (address _address, uint256 _balance, string memory _name, address _creator, uint256 _createdAt)
  {
    _address = address(this);
    _balance = balance();
    _name = name;
    _creator = creator;
    _createdAt = createdAt;
  }

  function getExtraSummary()
    public
    view
    returns (
      address[] memory _managers,
      bool _managersCanBeAddedOrRemoved,
      address[] memory _contributors,
      uint256 _totalContributions,
      bool _managersCanTransferMoneyWithoutARequest,
      bool _requestsCanBeCreated,
      bool _onlyManagersCanCreateARequest,
      bool _onlyContributorsCanApproveARequest,
      uint256 _minimumContributionPercentageRequired,
      uint256 _minimumApprovalsPercentageRequired
    )
  {
    _managers = managers;
    _managersCanBeAddedOrRemoved = managersCanBeAddedOrRemoved;
    _contributors = contributors;
    _totalContributions = totalContributions;
    _managersCanTransferMoneyWithoutARequest = managersCanTransferMoneyWithoutARequest;
    _requestsCanBeCreated = requestsCanBeCreated;
    _onlyManagersCanCreateARequest = onlyManagersCanCreateARequest;
    _onlyContributorsCanApproveARequest = onlyContributorsCanApproveARequest;
    _minimumContributionPercentageRequired = minimumContributionPercentageRequired;
    _minimumApprovalsPercentageRequired = minimumApprovalsPercentageRequired;
  }

  // Private functions

  function _contribute(address _contributor) private {
    require(msg.value > 0, "La contribuci\xc3\xb3n debe ser mayor a cero");

    if (contributions[_contributor] == 0) {
      contributors.push(_contributor);
    }
    contributions[_contributor] += msg.value;
    totalContributions += msg.value;

    emit Contribute(_contributor, msg.value);
  }
}
