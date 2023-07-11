// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./CrowdFund.sol";

contract CreateCrowdFund {
    CrowdFund[] public campaigns; // Array of all created campaigns

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
    }

    function getCampaigns() external view returns (CrowdFund[] memory) {
        return campaigns;
    }
}
