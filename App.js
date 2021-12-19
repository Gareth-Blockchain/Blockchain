import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import GovProj from './artifacts/contracts/GovProj.sol/GovProj.json'

const contractAddress = ""

function App() {


  //Voter variables
  const [voterAddress, setVoterAddress] = useState()

  //Proposal variables
  const [pName, setProposalName] = useState()
  const [pDescr, setProposalDescription] = useState()
  const [pBudget, setProposalBudget] = useState()
  const [pTime, setProposalTime] = useState()

  //Tender variables
  const [tID, setTenderID] = useState()
  const [tCompany, setTenderCompany] = useState()
  const [tFee, setTenderFee] = useState()
  const [tTime, setTenderTime] = useState()
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => {
    setIsChecked(!isChecked)
  }

  const [pID, proposalID] = useState()
  const [pIDFV, proposalIDForVote] = useState()
  const [tIDFV, tenderIDForVote] = useState()


  //---------------------------------------------------------------------------------------------------------------------

  /** GETTING THE USER ACCOUNT */
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  //---------------------------------------------------------------------------------------------------------------------

  /** METHODS FOR FETCHING NUMBER OF A MAPPING */
  async function fetchNumVoters() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, GovProj.abi, provider)
      try {
        const numVoters = await contract.getNumberOfVoters()
        document.getElementById("numVoters").innerText = numVoters
        console.log('data: ', numVoters)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function fetchNumProposals() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, GovProj.abi, provider)
      try {
        const numProposals = await contract.getNumberOfProposals()
        document.getElementById("numProposals").innerText = numProposals
        console.log('data: ', numProposals)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function fetchNumDeclinedTenders() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, GovProj.abi, provider)
      try {
        const numTenders = await contract.getNumberOfDeclinedTenders()
        document.getElementById("numTenders").innerText = numTenders
        console.log('data: ', numTenders)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function fetchNumSuccessfullTenders() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, GovProj.abi, provider)
      try {
        const numTenders = await contract.getNumberOfSuccessfullTenders()
        document.getElementById("numTenders").innerText = numTenders
        console.log('data: ', numTenders)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  //-----------------------------------------------------------------------------------------------------------------

  /** REGISTRATION METHODS */ 
  async function registerVoter() {
    if (!voterAddress) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, GovProj.abi, signer)
      const transaction = await contract.registerVoter(voterAddress)
      await transaction.wait()
      console.log('This voter registration has excecuted')

    }
  }

  async function registerProposal() {
    if (!pName || !pDescr || !pBudget || !pTime) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, GovProj.abi, signer)
      const transaction = await contract.registerProposal(pName, pDescr, pBudget, pTime)
      await transaction.wait()
      console.log('This proposal registration has excecuted')

    }
  }

  async function registerTender() {
    if (!tID || !tCompany || !tFee || !tTime) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, GovProj.abi, signer)
      
      const transaction = await contract.registerTender(tID, tCompany, tFee, tTime, isChecked)
      await transaction.wait()
      console.log('This tender registration has excecuted')

    }
  }

  //-----------------------------------------------------------------------------------------------------------------------

  /** METHOD FOR TALLYING VOTES */
  async function tallyVotes() {
    if(!pID) return

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, GovProj.abi, provider)
      try {
        await contract.tallyVotes(pID)
        console.log('name? ', talliedVotes)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  //-----------------------------------------------------------------------------------------------------------------------
  
  /** METHOD FOR VOTING */
  async function vote() {
    if(!pIDFV || !tIDFV) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, GovProj.abi, signer)
      
      const transaction = await contract.vote(tIDFV, pIDFV)
      await transaction.wait()
      console.log('This vote has excecuted')

    }
  }

  //-----------------------------------------------------------------------------------------------------------------------

  return (
    <div className="App">
      <header className="App-header">
        <div id="fetch">
            <h2>Fetching numbers</h2>
            <button onClick={fetchNumVoters}>Fetch Number of Voters</button>
            <p id="numVoters"></p><br></br>
            <button onClick={fetchNumProposals}>Fetch Number of Proposals</button>
            <p id="numProposals"></p><br></br>
            <button onClick={fetchNumDeclinedTenders}>Fetch Number of Tenders</button>
            <p id="numDTenders"></p><br></br>
            <button onClick={fetchNumSuccessfullTenders}>Fetch Number of Tenders</button>
            <p id="numSTenders"></p><br></br>
        </div>
        <div id="registerVoter">
            <h2>Registering a voter</h2>
            <input onChange={e => setVoterAddress(e.target.value)} placeholder="Set Voter Address" />
            <button onClick={registerVoter}>Register Voter</button><br></br>
        </div>
        <div id="registerProposal">
            <h2>Registering a proposal</h2>
            <input onChange={e => setProposalName(e.target.value)} placeholder="Set Proposal Name" />
            <input onChange={e => setProposalDescription(e.target.value)} placeholder="Set Proposal Descr" />
            <input onChange={e => setProposalBudget(e.target.value)} placeholder="Set Proposal Budget" />
            <input onChange={e => setProposalTime(e.target.value)} placeholder="Set Proposal Timeline" />
            <button onClick={registerProposal}>Register Proposal</button><br></br>
        </div>
        <div id="registerTender">
            <h2>Registering a tender</h2>
            <input onChange={e => setTenderID(e.target.value)} placeholder="Set Tender ID" />
            <input onChange={e => setTenderCompany(e.target.value)} placeholder="Set Tender Company" />
            <input onChange={e => setTenderFee(e.target.value)} placeholder="Set Tender Fee" />
            <input onChange={e => setTenderTime(e.target.value)} placeholder="Set Tender Timeline" />
            <input type="checkbox" value="Do you have any relations to the voting commity?" checked={isChecked} onChange={handleOnChange} placeholder="True or false" />
            <button onClick={registerTender}>Register Tender</button><br></br>
        </div>
        <div id="voting">
            <h2>Voting</h2>
            <input onChange={e => proposalIDForVote(e.target.value)} placeholder="Proposal ID" />
            <input onChange={e => tenderIDForVote(e.target.value)} placeholder="Tender ID" />
            <button onClick={vote}>Vote</button><br></br>
        </div>
        <div id="tallying">
            <h2>Tallying the votes</h2>
            <input onChange={e => proposalID(e.target.value)} placeholder="Proposal ID" />
            <button onClick={tallyVotes}>Tally Votes</button><br></br>
        </div>
      </header>
    </div>
  );
}

export default App;
