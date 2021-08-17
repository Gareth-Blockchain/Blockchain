pragma solidity ^0.5.16;

contract Adoption{
	
	struct Voter {
		bool isRegistered;
		bool hasVoted;
		uint votedTenderId;
	}

	struct Proposal {
		string name;
		string description;
		uint budget;
		uint timeLine;
	}

	struct Tender {
		uint proposalID;
		string company;
		uint fee;
		uint timeTaken;
		uint voteCount;
	}

	uint public numVoters = 0;

	address public administrator;

	mapping(address => Voter) public voters;

	Proposal[] public proposals;
	Tender[] public tenders;

	uint private winningTenderId;

	modifier onlyAdministrator() {
		require(msg.sender == administrator,
		"the caller of this function must be the administrator");
		_;
	}

	modifier onlyRegisteredVoter() {
		require(voters[msg.sender].isRegistered,
		"the caller of this function must be a registered voter");
		_;
	}

	event VoterRegisteredEvent (
		address voterAddress
	);
	
	event ProposalRegisteredEvent(
		uint proposalId
	);

	event TenderRegisteredEvent(
		uint tenderID
	);

	event VotesTalliedEvent ();
	
	event VotedEvent (
		address voter,
		uint proposalId
	);

	constructor() public {
		administrator = msg.sender;
	}

	function registerVoter(address _voterAddress) public onlyAdministrator{
		require(!voters[_voterAddress].isRegistered, "the voter is already registered");
		voters[_voterAddress].isRegistered = true;
		voters[_voterAddress].hasVoted = false;
		voters[_voterAddress].votedTenderId = 0;

		numVoters++;

		emit VoterRegisteredEvent(_voterAddress);
	}

	function registerProposal(string memory proposalName, string memory proposalDescription, uint proposalBudget, uint proposalTimeLine) public onlyAdministrator{
		proposals.push(Proposal({
			name: proposalName,
			description: proposalDescription,
			budget: proposalBudget,
			timeLine: proposalTimeLine
		}));

		emit ProposalRegisteredEvent(proposals.length - 1);
	}

	function registerTender(uint proposalID, string memory companyName, uint tenderFee, uint tenderTime) public {
		
		uint cost = proposals[proposalID].budget;
		uint time = proposals[proposalID].timeLine;

		require((tenderFee <= cost) && (tenderTime < time), "Your budget or timeline is too high");

		tenders.push(Tender({
			proposalID: proposalID,
			company: companyName,
			fee: tenderFee,
			timeTaken: tenderTime,
			voteCount: 0
		}));

		emit TenderRegisteredEvent(tenders.length - 1);
	}

	function getProposalsNumber() public view returns (uint) {
		return proposals.length;
	}

	function getProposalDescription(uint index) public view returns (string memory) {
		return proposals[index].description;
	}

	function vote(uint tenderId) onlyRegisteredVoter public {
		require(!voters[msg.sender].hasVoted, "the caller has already voted");

		voters[msg.sender].hasVoted = true;
		voters[msg.sender].votedTenderId = tenderId;
		tenders[tenderId].voteCount += 1;

		emit VotedEvent(msg.sender, tenderId);
	}

	function tallyVotes(uint proposalID) onlyAdministrator public {

		uint winningVoteCount = 0;
		uint winningTenderIndex = 0;

		for (uint i = 0; i < tenders.length; i++) {
			if(tenders[i].proposalID == proposalID){
				if (tenders[i].voteCount > winningVoteCount) {
					winningVoteCount = tenders[i].voteCount;
					winningTenderIndex = i;
				}
			}
		}

		winningTenderId = winningTenderIndex;

		emit VotesTalliedEvent();
	}

	function getWinningTenderId() public view returns (uint) {
		return winningTenderId;
	}

	function getNumberOfVoters() public view returns (uint) {
		return numVoters;
	}

	function getWinningTenderCompany() public view returns (string memory) {
		return tenders[winningTenderId].company;
	}

	function getWinningProposaVoteCounts() public view returns (uint) {
		return tenders[winningTenderId].voteCount;
	}

	function isRegisteredVoter(address _voterAddress) public view returns (bool) {
		return voters[_voterAddress].isRegistered;
	}

	function isAdministrator(address _address) public view returns (bool) {
		return _address == administrator;
	}
}