// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract CrowdFund {
    // left intentionally blank
    address public owner; // campaign owner or creator
    uint256 public start; // campaign start time
    uint256 public duration; // campaign duration in seconds
    uint256 public target; // campaign target in wei
    uint256 public total; // total amount raised in wei
    string public name; // campaign name
    string public imageUrl; // campaign image url
    string public description; // campaign description

    mapping(address => uint256) public contributions;
    address[] public contributors;

    event Contribution(address contributor, uint256 amount);

    constructor(
        address _owner,
        uint256 _duration,
        uint256 _target,
        string memory _name,
        string memory _imageUrl,
        string memory _description
    ) {
        owner = _owner;
        start = block.timestamp;
        duration = _duration;
        target = _target;
        name = _name;
        imageUrl = _imageUrl;
        description = _description;
    }

    receive() external payable {
        contribute();
    }

    function contribute() public payable {
        address payable sender = payable(msg.sender);
        uint256 amount = msg.value;
        require(msg.value > 0, "Contribution must be greater than 0 wei");
        require(
            block.timestamp < start + duration,
            "Campaign is over, cannot contribute"
        );

        // Deduct amount needed to reach target from the amount sent
        // Refund the sender if the target is exceeded
        if (total + amount > target) {
            uint256 refund = (total + amount) - target;

            (bool sent, bytes memory data) = sender.call{value: refund}("");

            amount -= refund; // Reevaluate the value of amount after the refund
        }

        contributions[sender] += amount; // update sender's contribution
        total += amount; // update total amount contributed

        // Add sender to contributors array if they haven't contributed before
        if (contributions[sender] == 0) {
            contributors.push(sender);
        }

        emit Contribution(sender, amount);
    }

    function endCampaign() public {
        require(
            block.timestamp >= start + duration,
            "Campaign is still ongoing, cannot withdraw"
        );
        require(
            total >= target,
            "Campaign did not reach target, cannot withdraw"
        );
        require(msg.sender == owner, "You are not the owner of this campaign");

        (bool sent, bytes memory data) = owner.call{value: total}("");
    }

    function getTimeLeft() public view returns (uint256) {
        if (block.timestamp >= start + duration) {
            return 0;
        } else {
            return (start + duration) - block.timestamp;
        }
    }

    function getTotalContributors() public view returns (uint256) {
        return contributors.length;
    }
}
