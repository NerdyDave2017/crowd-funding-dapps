// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "./CrowdFund.sol";

contract CreateCrowdFund {
    CrowdFund[] public campaigns; // array of deployed campaigns

    function createCampaign(
        uint256 _duration,
        uint256 _target,
        string memory _name,
        string memory _imageUrl,
        string memory _description
    ) external {
        CrowdFund campaign = new CrowdFund(
            msg.sender,
            _duration,
            _target,
            _name,
            _imageUrl,
            _description
        );

        campaigns.push(campaign);
    }

    function getCampaigns() public view returns (CrowdFund[] memory) {
        return campaigns;
    }
}
