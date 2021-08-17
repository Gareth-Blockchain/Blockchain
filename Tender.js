const TenderApp = artifacts.require("Adoption");

let tenderApp;

before(async() => {
    tenderApp = await TenderApp.new()
})

contract('TenderApp tests', function(accounts) {

    it("Has an administrator address equal to the deployer address", async () => {
        var admin_address = await tenderApp.administrator.call();
        var deployer_address = accounts[0];
        assert.equal(admin_address, deployer_address, "Admin address is not the deployer address");
    });

    it("Allows a voter to register", async () => {
        var voter_address = accounts[0];
        await tenderApp.registerVoter(voter_address);
        var voterCount = await tenderApp.getNumberOfVoters.call();
        assert.equal(voterCount, 1, "Voter was not added");
    });

    it("Allows a proposal to be registered", async() => {
        await tenderApp.registerProposal("N2-Ramp", "Build a new on-ramp", 30000, 365);
        var proposal = await tenderApp.proposals.call(0);
        var proposalName = await proposal.name;
        var proposalDescr = await proposal.description;
        var proposalBudget = await proposal.budget;
        var proposalTimeLine = await proposal.timeLine;
        assert.equal("N2-Ramp", proposalName, "Proposal name is incorrect");
        assert.equal(proposalDescr, "Build a new on-ramp", "Proposal description is incorrect");
        assert.equal(proposalBudget, 30000, "Proposal budget is incorrect");
        assert.equal(proposalTimeLine, 365, "Proposal timeline is incorrect")
    });

    it("Allows a tender to be registered", async() => {
        await tenderApp.registerTender(0, "GL", 30000, 100);
        var tender = await tenderApp.tenders.call(0);
        var tenderCompany = await tender.company;
        var tenderFee = await tender.fee;
        var tenderTime = await tender.timeTaken;
        var tenderVoteCount = await tender.voteCount;
        assert.equal("GL", tenderCompany, "Tender company name is incorrect");
        assert.equal(tenderFee, 30000, "Tender fee is incorrect");
        assert.equal(tenderTime, 100, "Tender time line is incorrect");
        assert.equal(tenderVoteCount, 0, "Tender vote count is incorrect")
    });

    it("Allows a registered voter to vote", async() => {
        await tenderApp.vote(0);
        var tender = await tenderApp.tenders.call(0);
        var tenderVoteCount = await tender.voteCount;
        assert.equal(tenderVoteCount, 1, "Vote was not cast");
    });
})

