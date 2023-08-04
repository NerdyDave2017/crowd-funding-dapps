// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract CrowdFund {
    // STATE VARIABLES //
    address public owner; // campaign owner or creator or beneficiary
    uint256 public campaignStart; // campaign start time
    uint256 public duration; // campaign duration in seconds
    uint256 public target; // campaign target in wei
    uint256 public total; // total amount raised in wei
    string public name; // campaign name
    string public imageUrl; // campaign image url
    string public description; //campaign description

    // DATA STRUCTURE //
    mapping(address => uint256) public contributions;
    address[] public contributors;

    // EVENTS //
    event Contribution(address contributor, uint256 amount);
    event CampaignEnded(address owner, uint256 total); // Fix this in the videos

    constructor(
        address _owner,
        uint256 _duration,
        uint256 _target,
        string memory _name,
        string memory _imageUrl,
        string memory _description
    ) {
        require(_owner != address(0), "Owner address cannot be a zero address"); // Fix this in the videos
        require(_duration >= 1, "Campaign duration must be at least 1 day"); // Fix this in the videos, durations input is in days
        require(_target > 0, "Campaign goal must be greater than 0");

        owner = _owner;
        campaignStart = block.timestamp;
        duration = _duration * 1 days; // fix this in the videos, durations input is in days
        target = _target * 1 ether; // fix this in the videos, target input is in ether
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
        require(total < target, "Campaign target has been reached"); // Fix this in the videos
        require(amount > 0, "Contribution must be greater than 0 wei");
        require(
            block.timestamp < campaignStart + duration,
            "Campaign is over, cannot contribute"
        );

        // Deduct amount needed to reach target from the amount sent
        // Refund the sender if the target is exceeded
        if (total + amount > target) {
            uint256 refund = (total + amount) - target;

            (bool sent, bytes memory data) = sender.call{value: refund}("");

            amount -= refund; // Reevaluate the value of amound after refund
        }

        // Add sender to contributors array if they havent contributed before
        if (contributions[sender] == 0) {
            contributors.push(sender);
        }

        contributions[sender] += amount; // Update sender's contribution
        total += amount; // Update total amount contributed

        emit Contribution(sender, amount);
    }

    function endCampaign() external {
        require(msg.sender == owner, "You are not the owner of this campaign");
        require(
            block.timestamp >= campaignStart + duration,
            "Campaign is still ongoing, cannot withdraw"
        );
        // require(
        //     total >= target,
        //     "Campaign did not reach target, cannot withdraw"
        // );

        (bool sent, bytes memory data) = owner.call{value: total}("");

        emit CampaignEnded(owner, total); // Fix this in the videos
    }

    function getTimeLeft() external view returns (uint256) {
        // Check if current time is greater then duration
        if (block.timestamp >= campaignStart + duration) {
            return 0;
        } else {
            return (campaignStart + duration) - block.timestamp;
        }
    }

    function getTotalContributors() external view returns (uint256) {
        return contributors.length;
    }
}
