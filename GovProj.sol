//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


/** Gas optimiazation techniques */


//In the for loop, create local variable for manipulating instead of minipulating state varible every loop
//Naming a return variable name instead of using return statement or creating local variable
//Using bytes32 where possible instead of string, uint256 instead of uint8 etc.

//Contract
contract GovProj{

	//State of a proposal
	enum StateOfProposal{
		OPEN,
		CLOSED
	}

	//Storing the voter details
	struct Voter {
		bool isRegistered;
		bool hasVoted;
		uint votedTenderId;
	}

	//Storing the proposal details
	struct Proposal {
		uint id;
		bytes32 name;
		string description;
		uint budget;
		uint timeLine;
		uint winningTender;
		StateOfProposal state;
	}

	//Storing the tender details
	struct Tender {
		uint id;
		uint proposalID;
		bytes32 company;
		uint fee;
		uint timeTaken;
		uint voteCount;
		bool declaration;
		bool accepted;
		string reason;
	}

	/** Variables to keep count for the mappins */
	uint public numVoters = 0;
	uint public numProposals = 0;
	uint public numTenders = 0;

	//Admin address
	address public administrator;

	/** Mappings to store the data */
	mapping(address => Voter) public voters;
	mapping(uint => Proposal) public proposals;
	mapping(uint => Tender) public tenders;

	/** Modifiers */
	modifier onlyAdministrator() {
		require(msg.sender == administrator,
		"must be admin");
		_;
	}

	modifier onlyRegisteredVoter() {
		require(voters[msg.sender].isRegistered,
		"must be voter");
		_;
	}

	/** Events */
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

	/** Constructor */
	constructor() {
		administrator = msg.sender;
	}

	/** Function to register a voter */
	function registerVoter(address _voterAddress) public {

		//Making sure the voter hasn't registered already
		require(!voters[_voterAddress].isRegistered, "the voter is already registered");

		//Setting the voter attributes
		voters[_voterAddress] = Voter(true, false, 0);

		//Incrementing the number of voters
		numVoters++;

		emit VoterRegisteredEvent(_voterAddress);
	}

	/** Function to register a proposal */
	function registerProposal(bytes32 _proposalName, string memory _proposalDescription, uint _proposalBudget, uint _proposalTimeLine) public onlyAdministrator{
	
		//Setting proposal attributes
		proposals[numProposals] = Proposal(numProposals, _proposalName, _proposalDescription, _proposalBudget, _proposalTimeLine, 0, StateOfProposal.OPEN);

		//Incrementing the number of proposals
		numProposals++;

		emit ProposalRegisteredEvent(numProposals);
	}

	/** Checks to see if a tenderwill be accepted or not and calls the neccassary function */
	function registerTender(uint _proposalID, bytes32 _companyName, uint _tenderFee, uint _tenderTime, bool _declaration) public {
		
		//Make sure the proposal is open otherwise no tender should be submitted
		require(proposals[_proposalID].state == StateOfProposal.OPEN, "Voting for proposal has closed");


		//Fetching the budget and timeline of the proposal they are tendering for
		uint cost = proposals[_proposalID].budget;
		uint time = proposals[_proposalID].timeLine;

		/** Making sure the rules are met to become a successfull tender 
		
		rule 1: Tender fee is smaller than the budgeted amount for the proposal
		rule 2: Tenders time they will take must be smaller than the available time of the proposal
		rule 3: Declaration must be false, in other words, tendering company must not be related to voting commity
		
		*/
		if(_tenderFee > cost){

			addTender(_proposalID, _companyName, _tenderFee, _tenderTime, _declaration, false ,"The cost is too high");

		} else if(_tenderTime > time){
			
			addTender(_proposalID, _companyName, _tenderFee, _tenderTime, _declaration, false ,"Time is too long");
		
		} else if(_declaration == true){

			addTender(_proposalID, _companyName, _tenderFee, _tenderTime, _declaration, false ,"Conflict of interest");

		}else{

			addTender(_proposalID, _companyName, _tenderFee, _tenderTime, _declaration, true, "Successful");

		}

	}

	/** Function to add a declined tender */
	function addTender(uint _proposalID, bytes32 _companyName, uint _tenderFee, uint _tenderTime, bool _declaration, bool success, string memory _reason) internal {
			
			//Setting declined tenders attributes
			tenders[numTenders] = Tender(numTenders, _proposalID, _companyName, _tenderFee, _tenderTime, 0, _declaration, success, _reason);

			//Incrementing the amount of declined tenders
			numTenders++;
	}

	/** Function to allow the voters to vote for a tender 
	
	modifier: only registered voters may vote
	
	*/
	function vote(uint _tenderId, uint _proposalID) public onlyRegisteredVoter {

		//Check to see the voter hasn't voted yet
		require(!voters[msg.sender].hasVoted, "the user has already voted");

		//Make sure the tender they are voting for has been accepted
		require(tenders[_tenderId].accepted == true, "Tender must be accepted tender");

		//Check to make sure the proposal is still open
		require(proposals[_proposalID].state == StateOfProposal.OPEN, "Voting for proposal has closed");

		//Check to see they are voting for a legitimate tender
		require(_tenderId <= numTenders, "tender does not exist");

		//Change the voters attributes accordingly
		voters[msg.sender].hasVoted = true;
		voters[msg.sender].votedTenderId = _tenderId;

		//Increment the tenders votes by 1
		tenders[_tenderId].voteCount += 1;

		emit VotedEvent(msg.sender, _tenderId);
	}

	/** Function to tally votes and get the winning tender for a specific proposal
	
	modifier: Only the admin can call this function
	
	 */
	function tallyVotes(uint _proposalID) public onlyAdministrator {

		//Make sure the proposal you wanting to tally exists
		require(_proposalID <= numProposals, "Proposal doesn't exist");

		//Make sure proposal is open that they wanting to tally
		require(proposals[_proposalID].state == StateOfProposal.OPEN, "The proposal is closed");

		//Close the proposal
		proposals[_proposalID].state = StateOfProposal.CLOSED;

		//Local variable to keep track of most votes
		uint winningVoteCount = 0;
		
		//Use local variable to reduce gas costs, rather change local variable than the state variable every loop
		uint winningTenderIndex = 0;

		//Loop to go through tenders for the specific proposal and find the one with the largest amount of votes
		for (uint i = 0; i < numTenders; i++) {
			if(tenders[i].proposalID == _proposalID){
				if ((tenders[i].voteCount > winningVoteCount) && (tenders[i].accepted == true)) {
					winningVoteCount = tenders[i].voteCount;
					winningTenderIndex = i;
				}
			}
		}

		//Setting the proposals winning tender to the tender with the most votes
		proposals[_proposalID].winningTender = tenders[winningTenderIndex].id;

		emit VotesTalliedEvent();
	}

	/** Getters for the winning tender for a specific proposal */
	function getWinningTenderId(uint _proposalID) public view returns (uint tenderID) {
		tenderID = proposals[_proposalID].winningTender;
	}

	function getWinningTenderCompany(uint _proposalID) public view returns (bytes32 tenderCompany) {
		uint tenderID = getWinningTenderId(_proposalID);
		tenderCompany = tenders[tenderID].company;
	}

	function getWinningTenderVoteCounts(uint _proposalID) public view returns (uint tenderVoteCount) {
		uint tenderID = getWinningTenderId(_proposalID);
		tenderVoteCount = tenders[tenderID].voteCount;	}

	function getWinningTenderFee(uint _proposalID) public view returns (uint tenderFee) {
		uint tenderID = getWinningTenderId(_proposalID);
		tenderFee = tenders[tenderID].fee;	}

	function getWinningTenderTime(uint _proposalID) public view returns (uint tenderTime) {
		uint tenderID = getWinningTenderId(_proposalID);
		tenderTime = tenders[tenderID].timeTaken;	}


	/** Getting voter, tender and proposal numbers */
	function getNumberOfVoters() public view returns (uint numVot) {
		numVot = numVoters;
	}

	function getNumberOfProposals() public view returns (uint numProp) {
		numProp = numProposals;
	}

	function getNumberOfTenders() public view returns (uint numTend) {
		numTend = numTenders;
	}

	//Check if the user is the admin
	function isAdministrator(address _address) public view returns (bool isAdmin) {
		isAdmin = (_address == administrator);
	}

	
	/** Getters for voter information */
	function isVoterReg(address _voterAddress) public view returns (bool isReg) {
		isReg = voters[_voterAddress].isRegistered;
	}

	function hasVoterVoted(address _voterAddress) public view returns (bool hasVot) {
		hasVot = voters[_voterAddress].hasVoted;
	}


	/** Getters for proposal information */
	function getProposalName(uint _proposalID) public view returns (bytes32 proposalName) {
		proposalName = proposals[_proposalID].name;
	}

	function getProposalDescription(uint _proposalID) public view returns (string memory propDescr) {
		propDescr = proposals[_proposalID].description;
	}

	function getProposalBudget(uint _proposalID) public view returns (uint propBudg) {
		propBudg = proposals[_proposalID].budget;
	}

	function getProposalTime(uint _proposalID) public view returns (uint propTime) {
		propTime = proposals[_proposalID].timeLine;
	}


	/** Getters for tender information */
	function getTenderCompany(uint _tenderID) public view returns (bytes32 tendComp) {
		tendComp = tenders[_tenderID].company;
	}

	function getTenderFee(uint _tenderID) public view returns (uint tendFee) {
			tendFee = tenders[_tenderID].fee;	
	}

	function getTenderTime(uint _tenderID) public view returns (uint tendTime) {
			tendTime = tenders[_tenderID].timeTaken;
	}

	function getTenderVoteCount(uint _tenderID) public view returns (uint tendVoteCount) {
			tendVoteCount = tenders[_tenderID].voteCount;
	}

}
