import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

// Test cases
/**
 * Create Campaign
 * 1. Should fail if the campaign duration is less than 1 day
 * 2. Should fail if owner address is a zero address
 * 3. Should fail if campaign goal is 0
 * 4. Should Create a campaign if all parameters are valid
 */

/**
 * Get all Campaigns
 * 1. Should return an array of campaign addresses
 */

describe("CreateCrowdFundTest", function () {
  async function deployCreateCrowdFundFixture() {
    const [owner, account2, account3, account4] = await ethers.getSigners();

    const CreateCrowdFund = await ethers.getContractFactory("CreateCrowdFund");
    const createCrowdFund = await CreateCrowdFund.deploy();

    return { createCrowdFund, owner, account2, account3, account4 };
  }

  describe("Create Campaign", function () {
    it("Should fail if the campaign duration is less than 1 day", async function () {
      const { createCrowdFund, owner } = await loadFixture(
        deployCreateCrowdFundFixture
      );
      await expect(
        createCrowdFund.createCampaign(
          owner.address,
          0,
          100,
          "Orphanage",
          "https://orphanage.com",
          "to the orphanage"
        )
      ).to.be.revertedWith("Campaign duration must be at least 1 day");
    });

    it("Should fail if owner address is a zero address", async function () {
      const { createCrowdFund, owner } = await loadFixture(
        deployCreateCrowdFundFixture
      );
      await expect(
        createCrowdFund.createCampaign(
          ethers.constants.AddressZero,
          10,
          100,
          "Orphanage",
          "https://orphanage.com",
          "to the orphanage"
        )
      ).to.be.revertedWith("Owner address cannot be a zero address");
    });

    it("Should fail if campaign goal is 0", async function () {
      const { createCrowdFund, owner } = await loadFixture(
        deployCreateCrowdFundFixture
      );
      await expect(
        createCrowdFund.createCampaign(
          owner.address,
          10,
          0,
          "Orphanage",
          "https://orphanage.com",
          "to the orphanage"
        )
      ).to.be.revertedWith("Campaign goal must be greater than 0");
    });

    it("Should Create a campaign if all parameters are valid", async function () {
      const { createCrowdFund, owner } = await loadFixture(
        deployCreateCrowdFundFixture
      );
      await expect(
        createCrowdFund.createCampaign(
          owner.address,
          10,
          100,
          "Orphanage",
          "https://orphanage.com",
          "to the orphanage"
        )
      ).to.emit(createCrowdFund, "CampaignCreated");
    });
  });

  describe("Get all Campaigns", function () {
    it("Should return an array of campaign addresses", async function () {
      const { createCrowdFund, owner } = await loadFixture(
        deployCreateCrowdFundFixture
      );
      await createCrowdFund.createCampaign(
        owner.address,
        10,
        100,
        "Orphanage",
        "https://orphanage.com",
        "to the orphanage"
      );
      const campaignAddresses = await createCrowdFund.getCampaigns();
      expect(campaignAddresses.length).to.equal(1);
    });
  });
});
