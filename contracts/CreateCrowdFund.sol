// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./CrowdFund.sol";

contract CreateCrowdFund {
    CrowdFund[] public campaigns; // Array of all created campaigns

    // EVENTS //
    event CampaignCreated(address owner, CrowdFund campaign); // Fix this in the videos

    function createCampaign(
        address _owner,
        uint256 _duration,
        uint256 _target,
        string memory _name,
        string memory _imageUrl,
        string memory _description
    ) external {
        CrowdFund campaign = new CrowdFund(
            _owner,
            _duration,
            _target,
            _name,
            _imageUrl,
            _description
        );

        campaigns.push(campaign);

        emit CampaignCreated(_owner, campaign);
    }

    function getCampaigns() external view returns (CrowdFund[] memory) {
        return campaigns;
    }
}
