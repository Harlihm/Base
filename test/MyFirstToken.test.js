const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyFirstToken", function () {
  let myFirstToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const MyFirstToken = await ethers.getContractFactory("MyFirstToken");
    myFirstToken = await MyFirstToken.deploy(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await myFirstToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await myFirstToken.balanceOf(owner.address);
      expect(await myFirstToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await myFirstToken.transfer(addr1.address, 50);
      expect(await myFirstToken.balanceOf(addr1.address)).to.equal(50);

      await myFirstToken.connect(addr1).transfer(addr2.address, 50);
      expect(await myFirstToken.balanceOf(addr2.address)).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await myFirstToken.balanceOf(owner.address);
      await expect(
        myFirstToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(myFirstToken, "ERC20InsufficientBalance");

      expect(await myFirstToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});