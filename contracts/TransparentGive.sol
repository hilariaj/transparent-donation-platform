// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TransparentGive {
    address public owner;
    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    constructor() { owner = msg.sender; }

    struct Cause {
        string name;
        string category;
        address payable recipient;
        uint256 goal;
        uint256 raised;
        uint256 withdrawn;
        uint256 donors;
        bool active;
    }

    mapping(uint256 => Cause) public causes;
    mapping(uint256 => mapping(address => uint256)) public donated;
    uint256 public causeCount;

    event CauseCreated(uint256 indexed causeId, string name, string category, address indexed recipient, uint256 goal);
    event CauseStatusSet(uint256 indexed causeId, bool active);
    event Donated(uint256 indexed causeId, address indexed donor, uint256 amount, uint256 newRaised);
    event Withdrawn(uint256 indexed causeId, address indexed recipient, uint256 amount, uint256 totalWithdrawn);

    function createCause(
        string calldata name,
        string calldata category,
        address payable recipient,
        uint256 goal
    ) external onlyOwner returns (uint256 causeId) {
        require(recipient != address(0), "Invalid recipient");
        causeId = ++causeCount;
        causes[causeId] = Cause(name, category, recipient, goal, 0, 0, 0, true);
        emit CauseCreated(causeId, name, category, recipient, goal);
        emit CauseStatusSet(causeId, true);
    }

    function setActive(uint256 causeId, bool active) external onlyOwner {
        _requireCauseExists(causeId);
        causes[causeId].active = active;
        emit CauseStatusSet(causeId, active);
    }

    function donate(uint256 causeId) external payable {
        _requireCauseExists(causeId);
        Cause storage c = causes[causeId];
        require(c.active, "Cause inactive");
        require(msg.value > 0, "Zero value");
        if (donated[causeId][msg.sender] == 0) c.donors += 1;
        donated[causeId][msg.sender] += msg.value;
        c.raised += msg.value;
        emit Donated(causeId, msg.sender, msg.value, c.raised);
    }

    function withdraw(uint256 causeId, uint256 amount) external {
        _requireCauseExists(causeId);
        Cause storage c = causes[causeId];
        require(msg.sender == c.recipient, "Not recipient");
        uint256 available = c.raised - c.withdrawn;
        require(amount > 0 && amount <= available, "Invalid amount");
        c.withdrawn += amount;
        (bool ok, ) = c.recipient.call{value: amount}("");
        require(ok, "Transfer failed");
        emit Withdrawn(causeId, c.recipient, amount, c.withdrawn);
    }

    function availableToWithdraw(uint256 causeId) external view returns (uint256) {
        _requireCauseExists(causeId);
        Cause storage c = causes[causeId];
        return c.raised - c.withdrawn;
    }

    function getCause(uint256 causeId)
        external
        view
        returns (string memory,string memory,address,uint256,uint256,uint256,uint256,bool)
    {
        _requireCauseExists(causeId);
        Cause storage c = causes[causeId];
        return (c.name,c.category,c.recipient,c.goal,c.raised,c.withdrawn,c.donors,c.active);
    }

    function _requireCauseExists(uint256 causeId) internal view {
        require(causeId > 0 && causeId <= causeCount, "Cause does not exist");
    }

    receive() external payable { revert("Use donate(causeId)"); }
    fallback() external payable { revert("Invalid call"); }
}
