import { expect } from "chai";
import { ethers } from "hardhat";
import { GovProj } from "contracts/GovProj.sol";


describe("GovProj", function () {

  let contract: GovProj; 

  beforeEach(async () => {
    const GovProj = await ethers.getContractFactory("GovProj");
    contract = await GovProj.deploy();
  });

  describe("registerVoter", () => {
    it("should register voter and get number of voters must equal 1", async () => {
      await contract.deployed();

      await contract.registerVoter(0xeeC42985268F85f06243Fc717198534c6cC0B19C);

      const numVoters = await contract.getNumberOfVoters();
      
      expect(numVoters.toNumber()).to.equal(1);
    });
  });

  describe("registerProposal", () => {
    it("should register proposal and get number of proposals must equal 1", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      const numProposals = await contract.getNumberOfProposals();
      
      expect(numProposals.toNumber()).to.equal(1);
    });
  });

  describe("registerTender", () => {
    it("should add a tender", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      await contract.registerTender(0, "tender4Name", 950, 950, false);

      const numSuccessTenders = await contract.getNumberOfTenders();
      
      expect(numSuccessTenders.toNumber()).to.equal(1);
    });
  });

  describe("vote", () => {
    it("should add a vote to the successfull tender", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      await contract.registerTender(0, "tenderName",950, 950, false)

      await contract.vote(0,0)

      const numVotes = await contract.getTenderVoteCount(0, true);
      
      expect(numVotes.toNumber()).to.equal(1);
    });
  });

  describe("tallyVotes", () => {
    it("should return 1 as it will be the id of the tender with the most votes", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      await contract.registerTender(0, "tenderName",950, 950, false)
      await contract.registerTender(0, "tender2Name",900, 900, false)
      await contract.registerTender(0, "tender3Name",850, 850, false)

      await contract.vote(0,0)
      await contract.vote(1,0)
      await contract.vote(2,0)
      await contract.vote(1,0)
      await contract.vote(1,0)

      await contract.tallyVotes(0);

      const winningId = await contract.getWinningTenderId(0);
      
      expect(winningId.toNumber()).to.equal(1);
    });
  });

  describe("getWinningTenderCompany", () => {
    it("should return tender2Name", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      await contract.registerTender(0, "tenderName",950, 950, false)
      await contract.registerTender(0, "tender2Name",900, 900, false)
      await contract.registerTender(0, "tender3Name",850, 850, false)

      await contract.vote(0,0)
      await contract.vote(1,0)
      await contract.vote(2,0)
      await contract.vote(1,0)
      await contract.vote(1,0)

      await contract.tallyVotes(0);

      const winningName = await contract.getWinningTenderCompany(0);
      
      expect(winningName).to.equal("tender2Name");
    });
  });

  describe("getWinningTenderVoteCounts", () => {
    it("should return 3", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      await contract.registerTender(0, "tenderName",950, 950, false)
      await contract.registerTender(0, "tender2Name",900, 900, false)
      await contract.registerTender(0, "tender3Name",850, 850, false)

      await contract.vote(0,0)
      await contract.vote(1,0)
      await contract.vote(2,0)
      await contract.vote(1,0)
      await contract.vote(1,0)

      await contract.tallyVotes(0);

      const winningVoteCount = await contract.getWinningTenderVoteCounts(0);
      
      expect(winningVoteCount.toNumber()).to.equal(3);
    });
  });

  describe("getWinningTenderFee", () => {
    it("should return 900", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      await contract.registerTender(0, "tenderName",950, 950, false)
      await contract.registerTender(0, "tender2Name",900, 900, false)
      await contract.registerTender(0, "tender3Name",850, 850, false)

      await contract.vote(0,0)
      await contract.vote(1,0)
      await contract.vote(2,0)
      await contract.vote(1,0)
      await contract.vote(1,0)

      await contract.tallyVotes(0);

      const winningFee = await contract.getWinningTenderFee(0);
      
      expect(winningFee.toNumber()).to.equal(900);
    });
  });

  describe("getWinningTenderTime", () => {
    it("should return 900", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      await contract.registerTender(0, "tenderName",950, 950, false)
      await contract.registerTender(0, "tender2Name",900, 900, false)
      await contract.registerTender(0, "tender3Name",850, 850, false)

      await contract.vote(0,0)
      await contract.vote(1,0)
      await contract.vote(2,0)
      await contract.vote(1,0)
      await contract.vote(1,0)

      await contract.tallyVotes(0);

      const winningTime = await contract.getWinningTenderTime(0);
      
      expect(winningTime.toNumber()).to.equal(900);
    });
  });

  describe("getNumberOfVoters", () => {
    it("should return 0", async () => {
      await contract.deployed();

      const numVoters = await contract.getNumberOfVoters();

      expect(numVoters.toNumber()).to.equal(0);
    });
  });

  describe("getNumberOfProposals", () => {
    it("should return 0", async () => {
      await contract.deployed();

      const numProposals = await contract.getNumberOfProposals();

      expect(numProposals.toNumber()).to.equal(0);
    });
  });

  describe("getNumberOfDeclinedTenders", () => {
    it("should return 0", async () => {
      await contract.deployed();

      const numDeclaredTenders = await contract.getNumberOfDeclinedTenders();

      expect(numDeclaredTenders.toNumber()).to.equal(0);
    });
  });

  describe("getNumberOfSuccessfullTenders", () => {
    it("should return 0", async () => {
      await contract.deployed();

      const numSuccessfullTenders = await contract.getNumberOfSuccessfullTenders();

      expect(numSuccessfullTenders.toNumber()).to.equal(0);
    });
  });
  
  describe("isVoterReg", () => {
    it("should return true", async () => {
      await contract.deployed();

      await contract.registerVoter(0xeeC42985268F85f06243Fc717198534c6cC0B19C);

      const isReg = await contract.isVoterReg(0xeeC42985268F85f06243Fc717198534c6cC0B19C);
      
      expect(isReg).to.equal(true);
    });
  });




  describe("getProposalName", () => {
    it("should return test1", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      const name = await contract.getProposalName(0);
      
      expect(name).to.equal("test1");
    });
  });

  describe("getProposalDescription", () => {
    it("should return test1 Descr", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      const descr = await contract.getProposalDescription(0);
      
      expect(descr).to.equal("test1 Descr");
    });
  });

  describe("getProposalBudget", () => {
    it("should return 1000", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      const budget = await contract.getProposalBudget(0);
      
      expect(budget.toNumber()).to.equal(1000);
    });
  });

  describe("getProposalTime", () => {
    it("should return 1000", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      const time = await contract.getProposalTime(0);
      
      expect(time.toNumber()).to.equal(1000);
    });
  });

  describe("getTenderCompany", () => {
    it("should return tenderName", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      await contract.registerTender(0, "tenderName",950, 950, false)

      const company = await contract.getTenderCompany(0, true);
      
      expect(company).to.equal("tenderName");
    });
  });

  describe("getTenderFee", () => {
    it("should return 950", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      await contract.registerTender(0, "tenderName",950, 950, false)

      const fee = await contract.getTenderFee(0, true);
      
      expect(fee.toNumber()).to.equal(950);
    });
  });

  describe("getTenderTime", () => {
    it("should return 950", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      await contract.registerTender(0, "tenderName",950, 950, false)

      const time = await contract.getTenderTime(0, true);
      
      expect(time.toNumber()).to.equal(950);
    });
  });

  describe("getTenderVoteCount", () => {
    it("should return 1", async () => {
      await contract.deployed();

      await contract.registerProposal("test1", "test1 Descr", 1000, 1000);

      await contract.registerTender(0, "tenderName",950, 950, false)

      await contract.vote(0,0)

      const count = await contract.getTenderVoteCount(0, true);
      
      expect(count.toNumber()).to.equal(1);
    });
  });



  





});
