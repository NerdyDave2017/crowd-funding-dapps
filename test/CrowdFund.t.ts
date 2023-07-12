import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

// Test cases
/**
 * Contribute
 * 1. Should fail if the campaign duration has ended
 * 2. Should fail if the campaign goal has been reached
 * 3. Should fail if amount sent is 0
 * 4. Should pass if the campaign is still active and the goal has not been reached
 */

/**
 * Withdraw
 * 1. Should fail if the campaign duration has not ended
 * 2. Should fail if the caller is not the beneficiary
 * 3. Should pass if the campaign duration has ended
 */

/**
 * Get time left
 * 1. Should return the time left in seconds
 */

/**
 * Get all contributors
 * 1. Should the number of contributors
 */
describe("CrowdFundTest", function () {
  async function deployCrowdFundFixture() {
    const [owner, account2, account3, account4] = await ethers.getSigners();

    const CrowdFund = await ethers.getContractFactory("CrowdFund");
    const crowdFund = await CrowdFund.deploy(
      owner.address, // owner / creator / beneficiary
      10, // campaign duration in days
      100, // campaign goal in WEI, 1 ETH = 10^18 WEI
      "Orphanage", // campaign name
      "https://orphanage.com", // campaign image url
      "to the orphanage" // campaign description
    );

    return { crowdFund, owner, account2, account3, account4 };
  }

  describe("Contribute", function () {
    it("Should fail if the campaign duration has ended", async function () {
      const { crowdFund, account2 } = await loadFixture(deployCrowdFundFixture);
      const currentTime = await time.latest();
      const campaignDuration = 10 * 24 * 60 * 60; // 10 days in seconds
      const campaignEndTime = currentTime + campaignDuration;
      await time.increaseTo(campaignEndTime);

      await expect(
        crowdFund.connect(account2).contribute({ value: 100 })
      ).to.be.revertedWith("Campaign is over, cannot contribute");
    });

    it("Should fail if the campaign goal has been reached", async function () {
      const { crowdFund, owner, account2, account3, account4 } =
        await loadFixture(deployCrowdFundFixture);
      await crowdFund.connect(account2).contribute({ value: 50 });
      await crowdFund.connect(account3).contribute({ value: 50 });

      await expect(
        crowdFund.connect(account4).contribute({ value: 100 })
      ).to.be.revertedWith("Campaign target has been reached");
    });

    it("Should fail if amount sent is 0", async function () {
      const { crowdFund, account2 } = await loadFixture(deployCrowdFundFixture);
      await expect(
        crowdFund.connect(account2).contribute({ value: 0 })
      ).to.be.revertedWith("Contribution must be greater than 0 wei");
    });

    it("Should pass if the campaign is still active and the goal has not been reached", async function () {
      const { crowdFund, account2 } = await loadFixture(deployCrowdFundFixture);

      await expect(
        crowdFund.connect(account2).contribute({ value: 100 })
      ).to.emit(crowdFund, "Contribution");

      expect(await crowdFund.contributions(account2.address)).to.equal(100);
    });
  });

  describe("Withdraw", function () {
    it("Should fail if the campaign duration has not ended", async function () {
      const { crowdFund, owner, account2, account3, account4 } =
        await loadFixture(deployCrowdFundFixture);
      await crowdFund.connect(account2).contribute({ value: 50 });
      await crowdFund.connect(account3).contribute({ value: 50 });

      await expect(crowdFund.connect(owner).endCampaign()).to.be.revertedWith(
        "Campaign is still ongoing, cannot withdraw"
      );
    });

    it("Should fail if the caller is not the beneficiary", async function () {
      const { crowdFund, owner, account2, account3, account4 } =
        await loadFixture(deployCrowdFundFixture);

      await crowdFund.connect(account2).contribute({ value: 50 });
      await crowdFund.connect(account3).contribute({ value: 50 });

      const currentTime = await time.latest();
      const campaignDuration = 10 * 24 * 60 * 60; // 10 days in seconds
      const campaignEndTime = currentTime + campaignDuration;
      await time.increaseTo(campaignEndTime);

      await expect(
        crowdFund.connect(account2).endCampaign()
      ).to.be.revertedWith("You are not the owner of this campaign");
    });

    it("Should pass if the campaign duration has ended", async function () {
      const { crowdFund, owner, account2, account3, account4 } =
        await loadFixture(deployCrowdFundFixture);

      await crowdFund.connect(account2).contribute({ value: 50 });
      await crowdFund.connect(account3).contribute({ value: 50 });

      const currentTime = await time.latest();
      const campaignDuration = 10 * 24 * 60 * 60; // 10 days in seconds
      const campaignEndTime = currentTime + campaignDuration;
      await time.increaseTo(campaignEndTime);

      await expect(crowdFund.connect(owner).endCampaign()).to.emit(
        crowdFund,
        "CampaignEnded"
      );
    });
  });

  describe("Get time left", function () {
    it("Should return the time left in seconds", async function () {
      const { crowdFund, owner, account2, account3, account4 } =
        await loadFixture(deployCrowdFundFixture);

      const currentTime = await time.latest();
      const campaignDuration = 10 * 24 * 60 * 60; // 10 days in seconds
      //   const campaignEndTime = currentTime + campaignDuration;
      //   await time.increaseTo(campaignEndTime);

      expect(await crowdFund.getTimeLeft()).to.equal(campaignDuration);
    });
  });

  describe("Get total number of contributors", function () {
    it("Should return total number of contributors", async function () {
      const { crowdFund, owner, account2, account3, account4 } =
        await loadFixture(deployCrowdFundFixture);

      await crowdFund.connect(account2).contribute({ value: 50 });
      await crowdFund.connect(account3).contribute({ value: 50 });

      expect(await crowdFund.getTotalContributors()).to.eql(
        ethers.BigNumber.from(2)
      );
    });
  });
});
